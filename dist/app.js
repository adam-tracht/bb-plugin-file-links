var W=globalThis.__bbPluginRuntime;if(W==null||W.react==null)throw new Error('Cannot load "react": this bundle must be loaded by the BB app, which provides the shared plugin runtime (globalThis.__bbPluginRuntime).');var V=W.react,Fe="default"in V?V.default:V,{Activity:He,Children:Ne,Component:De,Fragment:Be,Profiler:Oe,PureComponent:ze,StrictMode:Ve,Suspense:qe,act:Ke,cache:je,cacheSignal:Ge,captureOwnerStack:Ue,cloneElement:We,createContext:Ze,createElement:Ye,createRef:Xe,forwardRef:Je,isValidElement:Qe,lazy:et,memo:tt,startTransition:nt,unstable_useCacheRefresh:rt,use:it,useActionState:ot,useCallback:at,useContext:lt,useDebugValue:st,useDeferredValue:dt,useEffect:ae,useEffectEvent:ut,useId:ct,useImperativeHandle:mt,useInsertionEffect:pt,useLayoutEffect:bt,useMemo:ft,useOptimistic:ht,useReducer:gt,useRef:vt,useState:xt,useSyncExternalStore:kt,useTransition:wt,version:Tt}=V;var Z=globalThis.__bbPluginRuntime;if(Z==null||Z.sonner==null)throw new Error('Cannot load "sonner": this bundle must be loaded by the BB app, which provides the shared plugin runtime (globalThis.__bbPluginRuntime).');var q=Z.sonner,yt="default"in q?q.default:q,{Toaster:Ct,toast:T,useSonner:Lt}=q;var Y=globalThis.__bbPluginRuntime;if(Y==null||Y.pluginSdkApp==null)throw new Error('Cannot load "@get-bb/plugin-sdk/app": this bundle must be loaded by the BB app, which provides the shared plugin runtime (globalThis.__bbPluginRuntime).');var K=Y.pluginSdkApp,It="default"in K?K.default:K,{Markdown:_t,ThreadChat:Rt,ThreadTitle:St,UrlLink:Pt,definePluginApp:le,experimental_BranchPicker:Mt,experimental_Diff:$t,experimental_FileLink:Ft,experimental_Icon:Ht,experimental_NewThreadComposer:Nt,experimental_PermissionModePicker:Dt,experimental_ProviderIcon:Bt,experimental_ProviderModelPicker:Ot,experimental_SourceCode:zt,experimental_THREAD_ACTION_GROUPS:Vt,experimental_ThreadActionsContextMenu:qt,experimental_ThreadActionsMenu:Kt,experimental_ThreadStatusGlyph:jt,experimental_VoiceInputTextarea:Gt,experimental_copyToClipboard:se,experimental_saveFile:Ut,experimental_useAppPanel:Wt,experimental_useArchiveEnvironmentThreads:Zt,experimental_useBranches:Yt,experimental_useCheckoutState:Xt,experimental_useCodeTheme:Jt,experimental_useFixedTabTarget:Qt,experimental_usePluginId:en,experimental_useProviders:tn,experimental_useQuestionFormHost:nn,experimental_useSidebarThreadActions:rn,experimental_useSidebarThreadPullRequest:on,experimental_useSidebarThreadSplit:an,experimental_useSidebarThreads:ln,experimental_useThreadActionRegistrations:sn,experimental_useThreadActions:dn,useBbContext:un,useBbNavigate:de,useComposer:cn,useComposerView:mn,useComposers:pn,useEnvironmentProviders:bn,useRealtime:fn,useRealtimeConnectionState:hn,useRpc:gn,useSdk:vn,useSettings:xn,useSidebarSplitLayout:kn,useSidebarThreadDraft:wn,useSidebarThreadDraftIds:Tn,useSidebarThreadRowStatus:En,useSidebarThreadRowStatuses:yn,useSidebarThreadShortcut:Cn}=K;var Q="bb-file-links:navigate",xe="bb-file-links-styles",C="data-bb-file-links-link",X="data-bb-file-links-thumb",ce="data-bb-file-links-owned",L="data-bb-file-links-missing",J="data-bb-file-links-target",ue="[data-timeline-row-id]",ke=/^(Read file|Reading file|Viewed image:|Viewing image:|Read|Reading)\s+(.+)$/,we=/^Loaded skill\s+(.+)$/,Te=/^(?:Searched|Listed)\s+(.+)$/,Ee=/[*?[\]{}]/,ye=/^thr_[A-Za-z0-9_]+:[a-z-]+:([A-Za-z0-9_-]{1,120})(?::|$)/,Ce=new Set(["Read file","Read","Viewed image:"]),Le=/\.(?:png|jpe?g|gif|webp|svg|bmp)$/i,Ae=`
  [${C}] {
    cursor: pointer;
    text-decoration-line: underline;
    text-decoration-style: dotted;
    text-decoration-color: color-mix(in srgb, currentColor 45%, transparent);
    text-underline-offset: 2px;
  }
  [${C}]:hover,
  [${C}]:focus-visible {
    text-decoration-style: solid;
    text-decoration-color: currentColor;
    outline: none;
  }
  [${C}][${L}],
  [${C}][${L}]:hover {
    cursor: default;
    text-decoration-line: line-through;
    text-decoration-style: solid;
    text-decoration-color: color-mix(in srgb, currentColor 35%, transparent);
    opacity: 0.6;
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
`;function _(o){let n=o.replace(/\/+$/,"");return n.slice(n.lastIndexOf("/")+1)}function Ie(o){return ye.exec(o.getAttribute("data-timeline-row-id")??"")?.[1]??null}function _e(o){let n=o.getAttribute("data-timeline-row-id")?.split(":")[0]??"";if(/^thr_[A-Za-z0-9_]+$/.test(n))return n;let s=window.location.pathname.match(/\/threads\/(thr_[A-Za-z0-9_]+)/);return s?s[1]:null}function Re(o,n){return!n||n.startsWith("/")?!1:o===n||o.endsWith(`/${n}`)}function Se(o){let n=[],s=p=>{let b=p.trim();b&&!Ee.test(b)&&!n.includes(b)&&n.push(b)};if(/^(?:files\s+)?in\s/.test(o)&&!/^(?:for|matching)\s/.test(o))return s(o.replace(/^(?:files\s+)?in\s+/,"")),n;if(!/^(?:for|matching)\s/.test(o))return n;let g=o.lastIndexOf(" in ");for(;g>0&&n.length<3;)s(o.slice(g+4)),g=o.lastIndexOf(" in ",g-1);return n}function Pe(o){let n=o.title.trim(),s=o.lastElementChild;if(!(s instanceof HTMLElement))return null;let g=s.textContent?.trim()??"",p=we.exec(n);if(p)return g===p[1]?{kind:"skill",path:p[1],name:s}:null;let b=Te.exec(n);if(b&&o.children.length===2){if(g!==b[1])return null;let w=Se(b[1]);return w.length?{kind:"path",content:s,targets:w}:null}let R=ke.exec(n);if(!R)return null;let[,S,A]=R;return Re(A,g)?{kind:"file",prefix:S,path:A,name:s}:null}function k(o,n){let s=document.createElement(o);return s.setAttribute(ce,"true"),n&&(s.className=n),s}function Me(o,n){let s=new WeakMap,g=new Map,p={signal:n},b=document.createElement("style");b.id=xe,b.textContent=Ae,document.head.appendChild(b);function R(e){let t=new URLSearchParams({threadId:e.threadId,path:e.path});return e.itemId&&t.set("itemId",e.itemId),`/api/v1/plugins/${encodeURIComponent(o)}/http/image?${t}`}async function S(e,t){try{let a=await(await fetch(`/api/v1/plugins/${encodeURIComponent(o)}/rpc/${e}`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(t),signal:n})).json();return a.ok?a.result??null:null}catch{return null}}function A(e){return{threadId:e.threadId,path:e.path,...e.itemId?{itemId:e.itemId}:{},...e.kind==="file"?{}:{kind:e.kind}}}function w(e){let t=`${e.threadId}
${e.itemId??""}
${e.kind}
${e.path}`,r=g.get(t);return r||(r=S("resolve",A(e)),g.set(t,r),r.then(a=>{a||g.delete(t)})),r}function ee(e,t,r){let a={action:e,threadId:t,target:r,accepted:!1};return window.dispatchEvent(new CustomEvent(Q,{detail:a})),a.accepted}async function M(e){let t=await w(e);if(!n.aborted){if(!t){T.error(`Could not locate ${_(e.path)}`);return}if(!t.exists){T.error("File not found",{description:t.absolutePath});return}if(t.isDirectory){await j(e);return}if(!ee("preview",e.threadId,t.target)){if(e.isImage){B(e);return}T.error("BB could not open a preview here")}}}async function te(e){let t=await w(e);if(!n.aborted){if(t&&!t.exists){T.error("File not found",{description:t.absolutePath});return}if(t?.isDirectory){await j(e);return}(!t||!ee("external",e.threadId,t.target))&&T.error(`Could not open ${_(e.path)}`)}}async function ne(e){let t=await w(e);if(n.aborted)return;let r=t?.absolutePath??e.path;await se({text:r})?T.success("Copied path",{description:r}):T.error("Could not copy the path")}async function me(e){let t=await S("reveal",A(e));!n.aborted&&!t?.revealed&&T.error("Could not reveal it in Finder")}async function j(e){let t=await S("reveal",{...A(e),open:!0});!n.aborted&&!t?.revealed&&T.error("Folders open only when the thread runs on this Mac")}let $=null,F=null;function E(){F?.abort(),F=null,$?.remove(),$=null}async function pe(e,t,r){E();let a=k("div","bb-file-links-menu");a.setAttribute("role","menu");let h=k("div","bb-file-links-menu-path");h.textContent=e.path,a.appendChild(h);let f=i=>i?.exists===!0&&!i.isDirectory,v=[{label:"Open folder",run:()=>{j(e)},when:i=>i?.isDirectory===!0&&i.canReveal},{label:"Open preview",run:()=>{M(e)},when:f},{label:"Open in default app",run:()=>{te(e)},when:f},{label:"Copy full path",run:()=>{ne(e)}},{label:"Reveal in Finder",run:()=>{me(e)},when:i=>i?.canReveal===!0}];e.isImage&&v.splice(2,0,{label:"View image",run:()=>B(e),when:f});let l=[],x=new Map;for(let i of v){let u=k("button","bb-file-links-menu-item");u.type="button",u.setAttribute("role","menuitem"),u.textContent=i.label,u.addEventListener("click",y=>{y.stopPropagation(),E(),i.run()}),i.when&&(u.hidden=!0,x.set(u,i.when)),l.push(u),a.appendChild(u)}document.body.appendChild(a),$=a;let d=a.getBoundingClientRect();a.style.left=`${Math.max(4,Math.min(t,window.innerWidth-d.width-4))}px`,a.style.top=`${Math.max(4,Math.min(r,window.innerHeight-d.height-4))}px`,l.find(i=>!i.hidden)?.focus(),F=new AbortController;let c=AbortSignal.any([n,F.signal]);document.addEventListener("pointerdown",i=>{a.contains(i.target)||E()},{capture:!0,signal:c}),document.addEventListener("keydown",i=>{if(i.key==="Escape"){i.preventDefault(),i.stopPropagation(),E();return}if(i.key!=="ArrowDown"&&i.key!=="ArrowUp")return;i.preventDefault();let u=l.filter(ve=>!ve.hidden),y=u.indexOf(document.activeElement),z=i.key==="ArrowDown"?1:-1;u[(y+z+u.length)%u.length]?.focus()},{capture:!0,signal:c}),window.addEventListener("blur",E,{signal:c}),window.addEventListener("resize",E,{signal:c}),document.addEventListener("scroll",E,{capture:!0,signal:c});let m=await w(e);if($===a){h.textContent=m?.absolutePath??e.path,m&&!m.exists&&(h.textContent+=" (not found)");for(let[i,u]of x)i.hidden=!u(m);l.find(i=>!i.hidden)?.focus()}}let H=null,N=null,D=null;function I(){N?.abort(),N=null,H?.remove(),H=null,D?.isConnected&&D.focus(),D=null}function B(e){I(),E(),D=document.activeElement instanceof HTMLElement?document.activeElement:null;let t=k("div");t.id="bb-file-links-lightbox",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label",`Image preview: ${_(e.path)}`);let r=k("button","bb-file-links-close");r.type="button",r.setAttribute("aria-label","Close image preview"),r.textContent="\xD7";let a=k("div","bb-file-links-dialog"),h=k("img","bb-file-links-expanded");h.src=R(e),h.alt=_(e.path);let f=k("div","bb-file-links-caption"),v=k("span");v.textContent=e.path;let l=k("button","bb-file-links-button");l.type="button",l.textContent="Open preview";let x=k("button","bb-file-links-button");x.type="button",x.textContent="Copy path",f.append(v,l,x),a.append(h,f),t.append(r,a),document.body.appendChild(t),H=t,r.focus(),w(e).then(c=>{H===t&&c&&(v.textContent=c.absolutePath)}),N=new AbortController;let d=AbortSignal.any([n,N.signal]);r.addEventListener("click",I,{signal:d}),l.addEventListener("click",()=>{I(),M({...e,isImage:!1})},{signal:d}),x.addEventListener("click",()=>{ne(e)},{signal:d}),t.addEventListener("click",c=>{(c.target===t||c.target===a)&&I()},{signal:d}),document.addEventListener("keydown",c=>{if(c.key==="Escape")c.preventDefault(),c.stopPropagation(),I();else if(c.key==="Tab"){let m=[r,l,x],i=m.indexOf(document.activeElement);c.preventDefault();let u=c.shiftKey?-1:1;m[(i+u+m.length)%m.length].focus()}},{capture:!0,signal:d})}function be(e,t){return e.kind===t.kind&&e.path===t.path&&e.threadId===t.threadId&&e.itemId===t.itemId}function O(e,t){e.setAttribute(C,"true"),e.setAttribute("role","link"),e.setAttribute("tabindex","0"),t?(e.removeAttribute(L),e.removeAttribute("aria-disabled")):(e.setAttribute(L,"true"),e.setAttribute("aria-disabled","true"))}function fe(e,t){w(t).then(r=>{n.aborted||s.get(e)!==t||!r||r.exists||O(e,!1)})}function re(e){let t=e.parentNode;t&&(t.replaceChild(document.createTextNode(e.textContent??""),e),t.normalize())}let G=new WeakMap;function he(e,t,r,a){let h=`${r}
${a??""}
${t.join(`
`)}`,f=e.querySelector(`:scope > [${J}]`);if(G.get(e)===h&&(f||e.dataset.bbFileLinksPending))return;f&&re(f),G.set(e,h),e.dataset.bbFileLinksPending="1";let v=t.map(l=>({kind:"path",threadId:r,itemId:a,path:l,isImage:!1}));(async()=>{let l=v[0],x=!1,d=!1;for(let y of v){let z=await w(y);if(d||=z!==null,z?.exists){l=y,x=!0;break}}if(!d||(delete e.dataset.bbFileLinksPending,n.aborted||G.get(e)!==h||!e.isConnected))return;let c=e.firstChild;if(e.childNodes.length!==1||!(c instanceof Text))return;let m=c.data;if(!m.endsWith(l.path))return;let i=c.splitText(m.length-l.path.length),u=document.createElement("span");u.setAttribute(J,"true"),e.replaceChild(u,i),u.appendChild(i),s.set(u,l),O(u,x)})()}function ge(e){let t=_e(e),r=null;if(t)for(let x of e.querySelectorAll("span[title]")){if(x.closest(ue)!==e)continue;let d=Pe(x);if(!d)continue;let c=Ie(e);if(d.kind==="path"){he(d.content,d.targets,t,c);break}let m={kind:d.kind,threadId:t,itemId:c,path:d.path,isImage:d.kind==="file"&&Le.test(d.path)},i=s.get(d.name);if(!i||!be(i,m))if(s.set(d.name,m),d.kind==="skill"){let u=d.name;w(m).then(y=>{n.aborted||s.get(u)!==m||!y||O(u,y.exists)})}else O(d.name,!0),fe(d.name,m);m.isImage&&d.kind==="file"&&Ce.has(d.prefix)&&(r=m);break}let a=e.querySelector(`:scope > [${X}]`);if(!r){a?.remove();return}let h=`${r.threadId}
${r.path}`;if(a?.getAttribute(X)===h)return;a?.remove();let f=r,v=k("div","bb-file-links-thumb-wrap");v.setAttribute(X,h);let l=k("img","bb-file-links-thumb");l.loading="lazy",l.decoding="async",l.alt=_(f.path),l.title=f.path,l.tabIndex=0,l.setAttribute("role","button"),l.setAttribute("aria-label",`View image: ${_(f.path)}`),l.addEventListener("error",()=>v.remove(),{once:!0}),l.src=R(f),s.set(l,f),v.appendChild(l),e.appendChild(v)}function ie(){for(let e of document.querySelectorAll(ue))ge(e)}let P=0,oe=new MutationObserver(()=>{P||(P=requestAnimationFrame(()=>{P=0,n.aborted||ie()}))});oe.observe(document.body,{childList:!0,subtree:!0,characterData:!0,attributes:!0,attributeFilter:["title","data-timeline-row-id"]}),ie();function U(e){let t=e.target?.closest?.(`[${C}], img.bb-file-links-thumb`);if(!t||!t.isConnected)return null;let r=s.get(t);return r?{element:t,info:r}:null}return document.addEventListener("click",e=>{let t=U(e);!t||e.button!==0||t.element.hasAttribute(L)||(e.preventDefault(),e.stopPropagation(),t.element.tagName==="IMG"?B(t.info):e.metaKey||e.ctrlKey?te(t.info):M(t.info))},{capture:!0,...p}),document.addEventListener("keydown",e=>{if(e.key!=="Enter"&&e.key!==" ")return;let t=U(e);!t||t.element.hasAttribute(L)||(e.preventDefault(),e.stopPropagation(),t.element.tagName==="IMG"?B(t.info):M(t.info))},{capture:!0,...p}),document.addEventListener("contextmenu",e=>{let t=U(e);t&&(e.preventDefault(),e.stopPropagation(),pe(t.info,e.clientX,e.clientY))},{capture:!0,...p}),()=>{oe.disconnect(),P&&cancelAnimationFrame(P),E(),I();for(let e of document.querySelectorAll(`[${C}]`))e.removeAttribute(C),e.removeAttribute(L),e.removeAttribute("aria-disabled"),e.removeAttribute("role"),e.removeAttribute("tabindex");for(let e of document.querySelectorAll(`[${ce}]`))e.remove();for(let e of document.querySelectorAll(`[${J}]`))re(e);for(let e of document.querySelectorAll("[data-bb-file-links-pending]"))delete e.dataset.bbFileLinksPending;b.remove()}}function $e({threadId:o}){let n=de();return ae(()=>{function s(g){let p=g.detail;if(!p||typeof p!="object"||p.accepted||p.threadId!==o)return;let b={target:p.target,location:null};p.accepted=p.action==="external"?n.experimental_openFileExternally(b):n.experimental_openFilePreview(b)}return window.addEventListener(Q,s),()=>window.removeEventListener(Q,s)},[n,o]),null}var Rn=le(o=>{o.slots.experimental_threadHeaderAction({id:"navigation-bridge",title:"File links",component:$e}),o.contentScripts.register({id:"file-links",mount({pluginId:n,signal:s}){return Me(n,s)}})});export{Rn as default};
