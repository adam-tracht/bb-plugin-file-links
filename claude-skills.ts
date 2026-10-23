// Finds the folder a Claude Code `Skill` call loaded.
//
// BB records the call as `{ tool: "Skill", arguments: { skill: "<name>" } }`
// with no path. Claude Code's own transcript
// (~/.claude/projects/<project>/<session>.jsonl) has the tool_use, and a
// follow-up message tagged with that tool_use id that starts
// "Base directory for this skill: <dir>". BB's item ids do not carry the
// tool_use id, so calls are matched by order: the Nth BB call for a skill
// name is the Nth transcript call for that name in the same session.
import { readdir, readFile, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const SESSION_ID = /^[A-Za-z0-9-]{8,80}$/;
const BASE_DIR = "Base directory for this skill: ";

interface SessionSkills {
  mtimeMs: number;
  size: number;
  /** Skill name to the folder each call loaded, in call order (null if none). */
  dirs: Map<string, Array<string | null>>;
}

const transcripts = new Map<string, string | null>();
const parsed = new Map<string, SessionSkills>();

function configDir(): string {
  return process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), ".claude");
}

async function transcriptPath(session: string): Promise<string | null> {
  const known = transcripts.get(session);
  if (known) return known;
  const projects = path.join(configDir(), "projects");
  const dirs = await readdir(projects).catch(() => [] as string[]);
  for (const dir of dirs) {
    const candidate = path.join(projects, dir, `${session}.jsonl`);
    if ((await stat(candidate).catch(() => null))?.isFile()) {
      transcripts.set(session, candidate);
      return candidate;
    }
  }
  return null;
}

function parse(text: string): Map<string, Array<string | null>> {
  const calls: Array<{ id: string; name: string }> = [];
  const baseDirs = new Map<string, string>();
  for (const line of text.split("\n")) {
    // Most lines are unrelated; skip them before paying for JSON.parse.
    const isCall = line.includes('"name":"Skill"');
    const isBase = line.includes(BASE_DIR);
    if (!isCall && !isBase) continue;
    let entry: {
      sourceToolUseID?: unknown;
      message?: { content?: unknown };
    };
    try {
      entry = JSON.parse(line);
    } catch {
      continue;
    }
    const content = Array.isArray(entry.message?.content) ? entry.message.content : [];
    for (const part of content as Array<Record<string, unknown>>) {
      if (part.type === "tool_use" && part.name === "Skill" && typeof part.id === "string") {
        const name = (part.input as { skill?: unknown } | undefined)?.skill;
        if (typeof name === "string") calls.push({ id: part.id, name });
      } else if (part.type === "text" && typeof part.text === "string" && typeof entry.sourceToolUseID === "string") {
        if (!part.text.startsWith(BASE_DIR)) continue;
        const dir = part.text.slice(BASE_DIR.length).split("\n", 1)[0].trim();
        if (path.isAbsolute(dir)) baseDirs.set(entry.sourceToolUseID, path.normalize(dir));
      }
    }
  }
  const dirs = new Map<string, Array<string | null>>();
  for (const call of calls) {
    const list = dirs.get(call.name) ?? [];
    list.push(baseDirs.get(call.id) ?? null);
    dirs.set(call.name, list);
  }
  return dirs;
}

/** Folder of the `ordinal`th (0-based) load of `name` in a session, if recorded. */
export async function claudeSkillDir(session: string, name: string, ordinal: number): Promise<string | null> {
  if (!SESSION_ID.test(session)) return null;
  const file = await transcriptPath(session);
  if (!file) return null;
  const info = await stat(file).catch(() => null);
  if (!info) return null;
  let skills = parsed.get(session);
  if (!skills || skills.mtimeMs !== info.mtimeMs || skills.size !== info.size) {
    skills = { mtimeMs: info.mtimeMs, size: info.size, dirs: parse(await readFile(file, "utf8")) };
    parsed.set(session, skills);
    if (parsed.size > 50) parsed.delete(parsed.keys().next().value!);
  }
  return skills.dirs.get(name)?.[ordinal] ?? null;
}
