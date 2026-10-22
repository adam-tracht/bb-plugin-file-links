// Works out the directory a shell command was effectively running in when it
// touched a file: the recorded cwd plus any leading `cd <dir>` steps.
//
// Example: cwd /ws, command `/bin/zsh -lc 'cd ~/repo && sed -n 1,20p a.md'`
// gives ~/repo (expanded), so a read row for "a.md" means ~/repo/a.md.
//
// Only the leading run of `cd` segments joined by `&&` or `;` counts. Anything
// the parser cannot know for sure (variables, `cd -`, subshells) stops the
// walk and returns null, so callers fall back to the recorded cwd.
import path from "node:path";

type Token = { kind: "word"; value: string } | { kind: "op"; value: string };

const SHELLS = new Set(["sh", "bash", "zsh", "dash", "ksh"]);
const MAX_UNWRAP = 3;

/** Split a command into words and control operators, honoring quotes. */
export function tokenize(command: string): Token[] | null {
  const tokens: Token[] = [];
  let word = "";
  let inWord = false;
  let i = 0;
  const push = () => {
    if (inWord) tokens.push({ kind: "word", value: word });
    word = "";
    inWord = false;
  };
  while (i < command.length) {
    const ch = command[i];
    if (ch === "'") {
      const end = command.indexOf("'", i + 1);
      if (end === -1) return null;
      word += command.slice(i + 1, end);
      inWord = true;
      i = end + 1;
    } else if (ch === '"') {
      i += 1;
      while (i < command.length && command[i] !== '"') {
        if (command[i] === "\\" && i + 1 < command.length && '"\\$`\n'.includes(command[i + 1])) {
          word += command[i + 1];
          i += 2;
        } else {
          // Leave `$` in place; expandWord rejects variables it cannot know.
          word += command[i];
          i += 1;
        }
      }
      if (i >= command.length) return null;
      inWord = true;
      i += 1;
    } else if (ch === "\\") {
      if (i + 1 < command.length && command[i + 1] !== "\n") word += command[i + 1];
      inWord = inWord || command[i + 1] !== "\n";
      i += 2;
    } else if (ch === " " || ch === "\t") {
      push();
      i += 1;
    } else if (ch === "\n" || ch === ";") {
      push();
      tokens.push({ kind: "op", value: ";" });
      i += 1;
    } else if (ch === "&" || ch === "|") {
      push();
      const doubled = command[i + 1] === ch;
      tokens.push({ kind: "op", value: doubled ? ch + ch : ch });
      i += doubled ? 2 : 1;
    } else if (ch === "(" || ch === ")" || ch === "<" || ch === ">") {
      push();
      tokens.push({ kind: "op", value: ch });
      i += 1;
    } else {
      word += ch;
      inWord = true;
      i += 1;
    }
  }
  push();
  return tokens;
}

function splitSegments(tokens: Token[]): Array<{ words: string[]; next: string | null }> {
  const segments: Array<{ words: string[]; next: string | null }> = [];
  let words: string[] = [];
  for (const token of tokens) {
    if (token.kind === "word") {
      words.push(token.value);
    } else {
      segments.push({ words, next: token.value });
      words = [];
    }
  }
  segments.push({ words, next: null });
  return segments;
}

/** The script passed to `<shell> -c '...'`, when the command is that wrapper. */
function shellScript(words: string[]): string | null {
  if (words.length < 3 || !SHELLS.has(path.posix.basename(words[0]))) return null;
  for (let i = 1; i < words.length - 1; i++) {
    const flag = words[i];
    if (!flag.startsWith("-")) return null;
    if (/^-[a-z]*c[a-z]*$/i.test(flag)) return words[i + 1];
  }
  return null;
}

function expandWord(word: string, home: string | null): string | null {
  let value = word;
  if (value === "~" || value.startsWith("~/")) {
    if (!home) return null;
    value = home + value.slice(1);
  } else if (value === "$HOME" || value.startsWith("$HOME/")) {
    if (!home) return null;
    value = home + value.slice(5);
  } else if (value === "${HOME}" || value.startsWith("${HOME}/")) {
    if (!home) return null;
    value = home + value.slice(7);
  }
  // Any other expansion depends on state we cannot see.
  if (/[$`*?[]/.test(value) || value.startsWith("~")) return null;
  return value;
}

/**
 * Directory after the command's leading `cd` steps, or null when there are
 * none or they cannot be followed.
 */
export function effectiveCommandDir(command: string, cwd: string, home: string | null): string | null {
  let script = command;
  for (let depth = 0; depth <= MAX_UNWRAP; depth++) {
    const tokens = tokenize(script);
    if (!tokens) return null;
    const segments = splitSegments(tokens);
    const inner = segments.length === 1 ? shellScript(segments[0].words) : null;
    if (inner !== null) {
      script = inner;
      continue;
    }
    let dir = cwd;
    let changed = false;
    for (const segment of segments) {
      const [name, ...args] = segment.words;
      if (name !== "cd" && name !== "pushd") break;
      // A piped or backgrounded `cd` runs in a subshell and changes nothing.
      if (segment.next === "|" || segment.next === "&") break;
      const operands = args.filter((arg) => arg !== "-P" && arg !== "-L" && arg !== "--");
      if (operands.length > 1) return changed ? dir : null;
      const target = operands.length === 0 ? (home ? "~" : null) : operands[0];
      if (target === null || target === "-") return changed ? dir : null;
      const expanded = expandWord(target, home);
      if (expanded === null) return changed ? dir : null;
      dir = path.posix.resolve(dir, expanded);
      changed = true;
      // Only `&&` and `;` carry the new directory into the next segment.
      if (segment.next !== "&&" && segment.next !== ";") break;
    }
    return changed ? dir : null;
  }
  return null;
}
