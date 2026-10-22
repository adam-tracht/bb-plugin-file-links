var N=globalThis.__bbPluginRuntime;if(N==null||N.react==null)throw new Error('Cannot load "react": this bundle must be loaded by the BB app, which provides the shared plugin runtime (globalThis.__bbPluginRuntime).');var H=N.react,ge="default"in H?H.default:H,{Activity:ve,Children:xe,Component:we,Fragment:ke,Profiler:Ee,PureComponent:Te,StrictMode:ye,Suspense:Ce,act:Le,cache:Ae,cacheSignal:_e,captureOwnerStack:Ie,cloneElement:Se,createContext:Re,createElement:Pe,createRef:Me,forwardRef:Fe,isValidElement:He,lazy:$e,memo:De,startTransition:Be,unstable_useCacheRefresh:Ne,use:Oe,useActionState:ze,useCallback:Ve,useContext:Ue,useDebugValue:je,useDeferredValue:qe,useEffect:Z,useEffectEvent:Ge,useId:Ke,useImperativeHandle:We,useInsertionEffect:Ye,useLayoutEffect:Xe,useMemo:Ze,useOptimistic:Je,useReducer:Qe,useRef:et,useState:tt,useSyncExternalStore:nt,useTransition:rt,version:it}=H;var O=globalThis.__bbPluginRuntime;if(O==null||O.sonner==null)throw new Error('Cannot load "sonner": this bundle must be loaded by the BB app, which provides the shared plugin runtime (globalThis.__bbPluginRuntime).');var $=O.sonner,at="default"in $?$.default:$,{Toaster:lt,toast:k,useSonner:st}=$;var z=globalThis.__bbPluginRuntime;if(z==null||z.pluginSdkApp==null)throw new Error('Cannot load "@get-bb/plugin-sdk/app": this bundle must be loaded by the BB app, which provides the shared plugin runtime (globalThis.__bbPluginRuntime).');var D=z.pluginSdkApp,dt="default"in D?D.default:D,{Markdown:ct,ThreadChat:mt,ThreadTitle:pt,UrlLink:bt,definePluginApp:J,experimental_BranchPicker:ft,experimental_Diff:ht,experimental_FileLink:gt,experimental_Icon:vt,experimental_NewThreadComposer:xt,experimental_PermissionModePicker:wt,experimental_ProviderIcon:kt,experimental_ProviderModelPicker:Et,experimental_SourceCode:Tt,experimental_THREAD_ACTION_GROUPS:yt,experimental_ThreadActionsContextMenu:Ct,experimental_ThreadActionsMenu:Lt,experimental_ThreadStatusGlyph:At,experimental_VoiceInputTextarea:_t,experimental_copyToClipboard:Q,experimental_saveFile:It,experimental_useAppPanel:St,experimental_useArchiveEnvironmentThreads:Rt,experimental_useBranches:Pt,experimental_useCheckoutState:Mt,experimental_useCodeTheme:Ft,experimental_useFixedTabTarget:Ht,experimental_usePluginId:$t,experimental_useProviders:Dt,experimental_useQuestionFormHost:Bt,experimental_useSidebarThreadActions:Nt,experimental_useSidebarThreadPullRequest:Ot,experimental_useSidebarThreadSplit:zt,experimental_useSidebarThreads:Vt,experimental_useThreadActionRegistrations:Ut,experimental_useThreadActions:jt,useBbContext:qt,useBbNavigate:ee,useComposer:Gt,useComposerView:Kt,useComposers:Wt,useEnvironmentProviders:Yt,useRealtime:Xt,useRealtimeConnectionState:Zt,useRpc:Jt,useSdk:Qt,useSettings:en,useSidebarSplitLayout:tn,useSidebarThreadDraft:nn,useSidebarThreadDraftIds:rn,useSidebarThreadRowStatus:on,useSidebarThreadRowStatuses:an,useSidebarThreadShortcut:ln}=D;var U="bb-file-links:navigate",se="bb-file-links-styles",T="data-bb-file-links-link",V="data-bb-file-links-thumb",ne="data-bb-file-links-owned",te="[data-timeline-row-id]",ue=/^(Read file|Reading file|Viewed image:|Viewing image:|Read|Reading)\s+(.+)$/,de=new Set(["Read file","Read","Viewed image:"]),ce=/\.(?:png|jpe?g|gif|webp|svg|bmp)$/i,me=`
  [${T}] {
    cursor: pointer;
    text-decoration-line: underline;
    text-decoration-style: dotted;
    text-decoration-color: color-mix(in srgb, currentColor 45%, transparent);
    text-underline-offset: 2px;
  }
  [${T}]:hover,
  [${T}]:focus-visible {
    text-decoration-style: solid;
    text-decoration-color: currentColor;
    outline: none;
  }
  .bb-file-links-thumb-wrap {
    display: block;
    padding: 0.25rem 0 0.375rem 1.25rem;
  }
  .bb-file-links-thumb {
    display: block;
    height: 6rem;
    width: auto;
    max-width: min(100%, 14rem);
    object-fit: contain;
    padding: 0;
    cursor: zoom-in;
    background: var(--muted, Canvas);
    border: 1px solid var(--border, transparent);
    border-radius: var(--radius-lg, 0.75rem);
    box-shadow: 0 0.125rem 0.5rem color-mix(in srgb, var(--foreground, CanvasText) 12%, transparent);
    transition: transform 140ms ease, box-shadow 140ms ease;
  }
  .bb-file-links-thumb:hover,
  .bb-file-links-thumb:focus-visible {
    transform: translateY(-1px);
    box-shadow: 0 0.375rem 1rem color-mix(in srgb, var(--foreground, CanvasText) 18%, transparent);
    outline: 2px solid var(--ring, currentColor);
    outline-offset: 2px;
  }
  .bb-file-links-menu {
    position: fixed;
    z-index: 2147483000;
    min-width: 12rem;
    padding: 0.25rem;
    color: var(--popover-foreground, var(--foreground, CanvasText));
    background: var(--popover, var(--card, Canvas));
    border: 1px solid var(--border, transparent);
    border-radius: var(--radius-md, 0.5rem);
    box-shadow: 0 0.5rem 1.5rem color-mix(in srgb, var(--foreground, CanvasText) 18%, transparent);
    font-size: 0.8125rem;
    color-scheme: light dark;
  }
  .bb-file-links-menu-item {
    display: block;
    width: 100%;
    padding: 0.375rem 0.5rem;
    color: inherit;
    background: transparent;
    border: 0;
    border-radius: calc(var(--radius-md, 0.5rem) - 2px);
    font: inherit;
    text-align: left;
    cursor: pointer;
  }
  .bb-file-links-menu-item:hover,
  .bb-file-links-menu-item:focus-visible {
    background: var(--accent, var(--muted, Canvas));
    color: var(--accent-foreground, inherit);
    outline: none;
  }
  .bb-file-links-menu-path {
    padding: 0.25rem 0.5rem 0.375rem;
    color: var(--muted-foreground, currentColor);
    font-size: 0.75rem;
    overflow-wrap: anywhere;
    border-bottom: 1px solid var(--border, transparent);
    margin-bottom: 0.25rem;
  }
  #bb-file-links-lightbox {
    position: fixed;
    inset: 0;
    z-index: 2147483000;
    display: grid;
    place-items: center;
    padding: clamp(1rem, 4vw, 3rem);
    color: var(--foreground, CanvasText);
    background: color-mix(in srgb, var(--background, Canvas) 92%, transparent);
    backdrop-filter: blur(0.375rem);
    color-scheme: light dark;
  }
  .bb-file-links-dialog {
    position: relative;
    display: grid;
    justify-items: center;
    gap: 0.75rem;
    max-width: min(96vw, 80rem);
    max-height: 100%;
  }
  .bb-file-links-expanded {
    display: block;
    max-width: min(92vw, 76rem);
    max-height: calc(100vh - 8rem);
    width: auto;
    height: auto;
    object-fit: contain;
    background: var(--muted, Canvas);
    border-radius: var(--radius-lg, 0.75rem);
    box-shadow: 0 1rem 3rem color-mix(in srgb, var(--foreground, CanvasText) 30%, transparent);
  }
  .bb-file-links-caption {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    max-width: min(92vw, 76rem);
    color: var(--muted-foreground, currentColor);
    font-size: 0.8125rem;
    text-align: center;
    overflow-wrap: anywhere;
  }
  .bb-file-links-button {
    padding: 0.25rem 0.625rem;
    color: var(--foreground, CanvasText);
    background: var(--card, Canvas);
    border: 1px solid var(--border, transparent);
    border-radius: 999px;
    font: inherit;
    cursor: pointer;
  }
  .bb-file-links-button:hover,
  .bb-file-links-button:focus-visible {
    background: var(--accent, var(--card, Canvas));
    outline: 2px solid var(--ring, currentColor);
    outline-offset: 2px;
  }
  .bb-file-links-close {
    position: fixed;
    top: 0.75rem;
    right: 0.75rem;
    display: grid;
    place-items: center;
    width: 2.75rem;
    height: 2.75rem;
    padding: 0;
    color: var(--foreground, CanvasText);
    background: var(--card, Canvas);
    border: 1px solid var(--border, transparent);
    border-radius: 999px;
    box-shadow: 0 0.25rem 1rem color-mix(in srgb, var(--foreground, CanvasText) 20%, transparent);
    font: inherit;
    font-size: 1.5rem;
    line-height: 1;
    cursor: pointer;
  }
  .bb-file-links-close:hover,
  .bb-file-links-close:focus-visible {
    background: var(--accent, var(--card, Canvas));
    outline: 2px solid var(--ring, currentColor);
    outline-offset: 2px;
  }
  @media (prefers-reduced-motion: reduce) {
    .bb-file-links-thumb { transition: none; }
  }
`;function E(d){let r=d.replace(/\/+$/,"");return r.slice(r.lastIndexOf("/")+1)}function pe(d){let r=d.getAttribute("data-timeline-row-id")?.split(":")[0]??"";if(/^thr_[A-Za-z0-9_]+$/.test(r))return r;let u=window.location.pathname.match(/\/threads\/(thr_[A-Za-z0-9_]+)/);return u?u[1]:null}function be(d){let r=ue.exec(d.title.trim());if(!r)return null;let[,u,x]=r,m=d.lastElementChild;return!(m instanceof HTMLElement)||m.textContent?.trim()!==E(x)?null:{prefix:u,path:x,name:m}}function p(d,r){let u=document.createElement(d);return u.setAttribute(ne,"true"),r&&(u.className=r),u}function fe(d,r){let u=new WeakMap,x=new Map,m={signal:r},w=document.createElement("style");w.id=se,w.textContent=me,document.head.appendChild(w);function j(e){let t=new URLSearchParams({threadId:e.threadId,path:e.path});return`/api/v1/plugins/${encodeURIComponent(d)}/http/image?${t}`}async function q(e,t){try{let i=await(await fetch(`/api/v1/plugins/${encodeURIComponent(d)}/rpc/${e}`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(t),signal:r})).json();return i.ok?i.result??null:null}catch{return null}}function C(e){let t=`${e.threadId}
${e.path}`,n=x.get(t);return n||(n=q("resolve",{threadId:e.threadId,path:e.path}),x.set(t,n),n.then(i=>{i||x.delete(t)})),n}function G(e,t,n){let i={action:e,threadId:t,target:n,accepted:!1};return window.dispatchEvent(new CustomEvent(U,{detail:i})),i.accepted}async function _(e){let t=await C(e);if(!r.aborted){if(!t){k.error(`Could not locate ${E(e.path)}`);return}if(!G("preview",e.threadId,t.target)){if(e.isImage){F(e);return}k.error("BB could not open a preview here")}}}async function K(e){let t=await C(e);r.aborted||(!t||!G("external",e.threadId,t.target))&&k.error(`Could not open ${E(e.path)}`)}async function W(e){let t=await C(e);if(r.aborted)return;let n=t?.absolutePath??e.path;await Q({text:n})?k.success("Copied path",{description:n}):k.error("Could not copy the path")}async function re(e){let t=await q("reveal",{threadId:e.threadId,path:e.path});!r.aborted&&!t?.revealed&&k.error("Could not reveal the file in Finder")}let I=null,S=null;function v(){S?.abort(),S=null,I?.remove(),I=null}async function ie(e,t,n){v();let i=p("div","bb-file-links-menu");i.setAttribute("role","menu");let g=p("div","bb-file-links-menu-path");g.textContent=e.path,i.appendChild(g);let f=[{label:"Open preview",run:()=>{_(e)}},{label:"Open in default app",run:()=>{K(e)}},{label:"Copy full path",run:()=>{W(e)}},{label:"Reveal in Finder",run:()=>{re(e)},when:o=>o?.canReveal===!0}];e.isImage&&f.splice(1,0,{label:"View image",run:()=>F(e)});let b=[],l=new Map;for(let o of f){let c=p("button","bb-file-links-menu-item");c.type="button",c.setAttribute("role","menuitem"),c.textContent=o.label,c.addEventListener("click",A=>{A.stopPropagation(),v(),o.run()}),o.when&&(c.hidden=!0,l.set(c,o.when)),b.push(c),i.appendChild(c)}document.body.appendChild(i),I=i;let h=i.getBoundingClientRect();i.style.left=`${Math.max(4,Math.min(t,window.innerWidth-h.width-4))}px`,i.style.top=`${Math.max(4,Math.min(n,window.innerHeight-h.height-4))}px`,b[0]?.focus(),S=new AbortController;let a=AbortSignal.any([r,S.signal]);document.addEventListener("pointerdown",o=>{i.contains(o.target)||v()},{capture:!0,signal:a}),document.addEventListener("keydown",o=>{if(o.key==="Escape"){o.preventDefault(),o.stopPropagation(),v();return}if(o.key!=="ArrowDown"&&o.key!=="ArrowUp")return;o.preventDefault();let c=b.filter(le=>!le.hidden),A=c.indexOf(document.activeElement),ae=o.key==="ArrowDown"?1:-1;c[(A+ae+c.length)%c.length]?.focus()},{capture:!0,signal:a}),window.addEventListener("blur",v,{signal:a}),window.addEventListener("resize",v,{signal:a}),document.addEventListener("scroll",v,{capture:!0,signal:a});let s=await C(e);if(I===i){g.textContent=s?.absolutePath??e.path;for(let[o,c]of l)o.hidden=!c(s)}}let R=null,P=null,M=null;function y(){P?.abort(),P=null,R?.remove(),R=null,M?.isConnected&&M.focus(),M=null}function F(e){y(),v(),M=document.activeElement instanceof HTMLElement?document.activeElement:null;let t=p("div");t.id="bb-file-links-lightbox",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label",`Image preview: ${E(e.path)}`);let n=p("button","bb-file-links-close");n.type="button",n.setAttribute("aria-label","Close image preview"),n.textContent="\xD7";let i=p("div","bb-file-links-dialog"),g=p("img","bb-file-links-expanded");g.src=j(e),g.alt=E(e.path);let f=p("div","bb-file-links-caption"),b=p("span");b.textContent=e.path;let l=p("button","bb-file-links-button");l.type="button",l.textContent="Open preview";let h=p("button","bb-file-links-button");h.type="button",h.textContent="Copy path",f.append(b,l,h),i.append(g,f),t.append(n,i),document.body.appendChild(t),R=t,n.focus(),C(e).then(s=>{R===t&&s&&(b.textContent=s.absolutePath)}),P=new AbortController;let a=AbortSignal.any([r,P.signal]);n.addEventListener("click",y,{signal:a}),l.addEventListener("click",()=>{y(),_({...e,isImage:!1})},{signal:a}),h.addEventListener("click",()=>{W(e)},{signal:a}),t.addEventListener("click",s=>{(s.target===t||s.target===i)&&y()},{signal:a}),document.addEventListener("keydown",s=>{if(s.key==="Escape")s.preventDefault(),s.stopPropagation(),y();else if(s.key==="Tab"){let o=[n,l,h],c=o.indexOf(document.activeElement);s.preventDefault();let A=s.shiftKey?-1:1;o[(c+A+o.length)%o.length].focus()}},{capture:!0,signal:a})}function oe(e){let t=pe(e),n=null;if(t)for(let h of e.querySelectorAll("span[title]")){if(h.closest(te)!==e)continue;let a=be(h);if(!a)continue;let s={threadId:t,path:a.path,isImage:ce.test(a.path)},o=u.get(a.name);(!o||o.path!==s.path||o.threadId!==t)&&(u.set(a.name,s),a.name.setAttribute(T,"true"),a.name.setAttribute("role","link"),a.name.setAttribute("tabindex","0")),s.isImage&&de.has(a.prefix)&&(n=s);break}let i=e.querySelector(`:scope > [${V}]`);if(!n){i?.remove();return}let g=`${n.threadId}
${n.path}`;if(i?.getAttribute(V)===g)return;i?.remove();let f=n,b=p("div","bb-file-links-thumb-wrap");b.setAttribute(V,g);let l=p("img","bb-file-links-thumb");l.loading="lazy",l.decoding="async",l.alt=E(f.path),l.title=f.path,l.tabIndex=0,l.setAttribute("role","button"),l.setAttribute("aria-label",`View image: ${E(f.path)}`),l.addEventListener("error",()=>b.remove(),{once:!0}),l.src=j(f),u.set(l,f),b.appendChild(l),e.appendChild(b)}function Y(){for(let e of document.querySelectorAll(te))oe(e)}let L=0,X=new MutationObserver(()=>{L||(L=requestAnimationFrame(()=>{L=0,r.aborted||Y()}))});X.observe(document.body,{childList:!0,subtree:!0,characterData:!0,attributes:!0,attributeFilter:["title","data-timeline-row-id"]}),Y();function B(e){let t=e.target?.closest?.(`[${T}], img.bb-file-links-thumb`);if(!t||!t.isConnected)return null;let n=u.get(t);return n?{element:t,info:n}:null}return document.addEventListener("click",e=>{let t=B(e);!t||e.button!==0||(e.preventDefault(),e.stopPropagation(),t.element.tagName==="IMG"?F(t.info):e.metaKey||e.ctrlKey?K(t.info):_(t.info))},{capture:!0,...m}),document.addEventListener("keydown",e=>{if(e.key!=="Enter"&&e.key!==" ")return;let t=B(e);t&&(e.preventDefault(),e.stopPropagation(),t.element.tagName==="IMG"?F(t.info):_(t.info))},{capture:!0,...m}),document.addEventListener("contextmenu",e=>{let t=B(e);t&&(e.preventDefault(),e.stopPropagation(),ie(t.info,e.clientX,e.clientY))},{capture:!0,...m}),()=>{X.disconnect(),L&&cancelAnimationFrame(L),v(),y();for(let e of document.querySelectorAll(`[${T}]`))e.removeAttribute(T),e.removeAttribute("role"),e.removeAttribute("tabindex");for(let e of document.querySelectorAll(`[${ne}]`))e.remove();w.remove()}}function he({threadId:d}){let r=ee();return Z(()=>{function u(x){let m=x.detail;if(!m||typeof m!="object"||m.accepted||m.threadId!==d)return;let w={target:m.target,location:null};m.accepted=m.action==="external"?r.experimental_openFileExternally(w):r.experimental_openFilePreview(w)}return window.addEventListener(U,u),()=>window.removeEventListener(U,u)},[r,d]),null}var mn=J(d=>{d.slots.experimental_threadHeaderAction({id:"navigation-bridge",title:"File links",component:he}),d.contentScripts.register({id:"file-links",mount({pluginId:r,signal:u}){return fe(r,u)}})});export{mn as default};
