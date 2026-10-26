var Y=globalThis.__bbPluginRuntime;if(Y==null||Y.react==null)throw new Error('Cannot load "react": this bundle must be loaded by the BB app, which provides the shared plugin runtime (globalThis.__bbPluginRuntime).');var U=Y.react,qe="default"in U?U.default:U,{Activity:Ue,Children:Ve,Component:We,Fragment:Ge,Profiler:Ke,PureComponent:je,StrictMode:Ze,Suspense:Ye,act:Xe,cache:Je,cacheSignal:Qe,captureOwnerStack:et,cloneElement:tt,createContext:nt,createElement:rt,createRef:it,forwardRef:ot,isValidElement:at,lazy:lt,memo:st,startTransition:dt,unstable_useCacheRefresh:ut,use:ct,useActionState:mt,useCallback:pt,useContext:bt,useDebugValue:ft,useDeferredValue:ht,useEffect:ue,useEffectEvent:gt,useId:vt,useImperativeHandle:xt,useInsertionEffect:kt,useLayoutEffect:wt,useMemo:Tt,useOptimistic:Et,useReducer:yt,useRef:Lt,useState:Ct,useSyncExternalStore:At,useTransition:It,version:_t}=U;var X=globalThis.__bbPluginRuntime;if(X==null||X.sonner==null)throw new Error('Cannot load "sonner": this bundle must be loaded by the BB app, which provides the shared plugin runtime (globalThis.__bbPluginRuntime).');var V=X.sonner,Rt="default"in V?V.default:V,{Toaster:St,toast:T,useSonner:Pt}=V;var J=globalThis.__bbPluginRuntime;if(J==null||J.pluginSdkApp==null)throw new Error('Cannot load "@get-bb/plugin-sdk/app": this bundle must be loaded by the BB app, which provides the shared plugin runtime (globalThis.__bbPluginRuntime).');var W=J.pluginSdkApp,$t="default"in W?W.default:W,{Markdown:Ft,ThreadChat:Nt,ThreadTitle:Dt,UrlLink:Bt,definePluginApp:ce,experimental_BranchPicker:Ot,experimental_Diff:zt,experimental_FileLink:qt,experimental_Icon:Ut,experimental_NewThreadComposer:Vt,experimental_PermissionModePicker:Wt,experimental_ProviderIcon:Gt,experimental_ProviderModelPicker:Kt,experimental_SourceCode:jt,experimental_THREAD_ACTION_GROUPS:Zt,experimental_ThreadActionsContextMenu:Yt,experimental_ThreadActionsMenu:Xt,experimental_ThreadStatusGlyph:Jt,experimental_VoiceInputTextarea:Qt,experimental_copyToClipboard:me,experimental_saveFile:en,experimental_useAppPanel:tn,experimental_useArchiveEnvironmentThreads:nn,experimental_useBranches:rn,experimental_useCheckoutState:on,experimental_useCodeTheme:an,experimental_useFixedTabTarget:ln,experimental_usePluginId:sn,experimental_useProviders:dn,experimental_useQuestionFormHost:un,experimental_useSidebarThreadActions:cn,experimental_useSidebarThreadPullRequest:mn,experimental_useSidebarThreadSplit:pn,experimental_useSidebarThreads:bn,experimental_useThreadActionRegistrations:fn,experimental_useThreadActions:hn,useBbContext:gn,useBbNavigate:pe,useComposer:vn,useComposerView:xn,useComposers:kn,useEnvironmentProviders:wn,useRealtime:Tn,useRealtimeConnectionState:En,useRpc:yn,useSdk:Ln,useSettings:Cn,useSidebarSplitLayout:An,useSidebarThreadDraft:In,useSidebarThreadDraftIds:_n,useSidebarThreadRowStatus:Mn,useSidebarThreadRowStatuses:Rn,useSidebarThreadShortcut:Sn}=W;var te="bb-file-links:navigate",Ae="bb-file-links-styles",L="data-bb-file-links-link",Q="data-bb-file-links-thumb",he="data-bb-file-links-owned",I="data-bb-file-links-missing",ee="data-bb-file-links-target",be="data-bb-file-links-message-thumb",G="[data-timeline-row-id]",Ie=/^(Read file|Reading file|Viewed image:|Viewing image:|Read|Reading)\s+(.+)$/,_e=/^Loaded skill\s+(.+)$/,Me=/^(?:Searched|Listed)\s+(.+)$/,Re=/[*?[\]{}]/,Se=/^thr_[A-Za-z0-9_]+:[a-z-]+:([A-Za-z0-9_-]{1,120})(?::|$)/,Pe=new Set(["Read file","Read","Viewed image:"]),ge=/\.(?:png|jpe?g|gif|webp|svg|bmp)$/i,He=`
  [${L}] {
    cursor: pointer;
    text-decoration-line: underline;
    text-decoration-style: dotted;
    text-decoration-color: color-mix(in srgb, currentColor 45%, transparent);
    text-underline-offset: 2px;
  }
  [${L}]:hover,
  [${L}]:focus-visible {
    text-decoration-style: solid;
    text-decoration-color: currentColor;
    outline: none;
  }
  [${L}][${I}],
  [${L}][${I}]:hover {
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
  .bb-file-links-message-thumb-wrap {
    display: block;
    padding: 0.375rem 0;
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
`;function A(i){let n=i.replace(/\/+$/,"");return n.slice(n.lastIndexOf("/")+1)}function $e(i){return Se.exec(i.getAttribute("data-timeline-row-id")??"")?.[1]??null}function fe(i){let n=i.getAttribute("data-timeline-row-id")?.split(":")[0]??"";if(/^thr_[A-Za-z0-9_]+$/.test(n))return n;let u=window.location.pathname.match(/\/threads\/(thr_[A-Za-z0-9_]+)/);return u?u[1]:null}function Fe(i,n){return!n||n.startsWith("/")?!1:i===n||i.endsWith(`/${n}`)}function Ne(i){let n=[],u=h=>{let v=h.trim();v&&!Re.test(v)&&!n.includes(v)&&n.push(v)};if(/^(?:files\s+)?in\s/.test(i)&&!/^(?:for|matching)\s/.test(i))return u(i.replace(/^(?:files\s+)?in\s+/,"")),n;if(!/^(?:for|matching)\s/.test(i))return n;let k=i.lastIndexOf(" in ");for(;k>0&&n.length<3;)u(i.slice(k+4)),k=i.lastIndexOf(" in ",k-1);return n}function De(i){let n=i.title.trim(),u=i.lastElementChild;if(!(u instanceof HTMLElement))return null;let k=u.textContent?.trim()??"",h=_e.exec(n);if(h)return k===h[1]?{kind:"skill",path:h[1],name:u}:null;let v=Me.exec(n);if(v&&i.children.length===2){if(k!==v[1])return null;let w=Ne(v[1]);return w.length?{kind:"path",content:u,targets:w}:null}let _=Ie.exec(n);if(!_)return null;let[,S,M]=_;return Fe(M,k)?{kind:"file",prefix:S,path:M,name:u}:null}function Be(i){let n;if(/^file:/i.test(i))try{n=decodeURIComponent(new URL(i).pathname)}catch{return null}else{if(/^[a-z][a-z0-9+.-]*:/i.test(i)||i.startsWith("//")||i.startsWith("#"))return null;{let u=i.replace(/[?#].*$/,"");try{n=decodeURIComponent(u)}catch{n=u}}}return n&&ge.test(n)?n:null}function x(i,n){let u=document.createElement(i);return u.setAttribute(he,"true"),n&&(u.className=n),u}function Oe(i,n){let u=new WeakMap,k=new Map,h={signal:n},v=document.createElement("style");v.id=Ae,v.textContent=He,document.head.appendChild(v);function _(e){let t=new URLSearchParams({threadId:e.threadId,path:e.path});return e.itemId&&t.set("itemId",e.itemId),`/api/v1/plugins/${encodeURIComponent(i)}/http/image?${t}`}async function S(e,t){try{let o=await(await fetch(`/api/v1/plugins/${encodeURIComponent(i)}/rpc/${e}`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(t),signal:n})).json();return o.ok?o.result??null:null}catch{return null}}function M(e){return{threadId:e.threadId,path:e.path,...e.itemId?{itemId:e.itemId}:{},...e.kind==="file"?{}:{kind:e.kind}}}function w(e){let t=`${e.threadId}
${e.itemId??""}
${e.kind}
${e.path}`,r=k.get(t);return r||(r=S("resolve",M(e)),k.set(t,r),r.then(o=>{o||k.delete(t)})),r}function ne(e,t,r){let o={action:e,threadId:t,target:r,accepted:!1};return window.dispatchEvent(new CustomEvent(te,{detail:o})),o.accepted}async function H(e){let t=await w(e);if(!n.aborted){if(!t){T.error(`Could not locate ${A(e.path)}`);return}if(!t.exists){T.error("File not found",{description:t.absolutePath});return}if(t.isDirectory){await K(e);return}if(!ne("preview",e.threadId,t.target)){if(e.isImage){O(e);return}T.error("BB could not open a preview here")}}}async function re(e){let t=await w(e);if(!n.aborted){if(t&&!t.exists){T.error("File not found",{description:t.absolutePath});return}if(t?.isDirectory){await K(e);return}(!t||!ne("external",e.threadId,t.target))&&T.error(`Could not open ${A(e.path)}`)}}async function ie(e){let t=await w(e);if(n.aborted)return;let r=t?.absolutePath??e.path;await me({text:r})?T.success("Copied path",{description:r}):T.error("Could not copy the path")}async function ve(e){let t=await S("reveal",M(e));!n.aborted&&!t?.revealed&&T.error("Could not reveal it in Finder")}async function K(e){let t=await S("reveal",{...M(e),open:!0});!n.aborted&&!t?.revealed&&T.error("Folders open only when the thread runs on this Mac")}let $=null,F=null;function E(){F?.abort(),F=null,$?.remove(),$=null}async function xe(e,t,r){E();let o=x("div","bb-file-links-menu");o.setAttribute("role","menu");let b=x("div","bb-file-links-menu-path");b.textContent=e.path,o.appendChild(b);let m=l=>l?.exists===!0&&!l.isDirectory,f=[{label:"Open folder",run:()=>{K(e)},when:l=>l?.isDirectory===!0&&l.canReveal},{label:"Open preview",run:()=>{H(e)},when:m},{label:"Open in default app",run:()=>{re(e)},when:m},{label:"Copy full path",run:()=>{ie(e)}},{label:"Reveal in Finder",run:()=>{ve(e)},when:l=>l?.canReveal===!0}];e.isImage&&f.splice(2,0,{label:"View image",run:()=>O(e),when:m});let d=[],g=new Map;for(let l of f){let c=x("button","bb-file-links-menu-item");c.type="button",c.setAttribute("role","menuitem"),c.textContent=l.label,c.addEventListener("click",y=>{y.stopPropagation(),E(),l.run()}),l.when&&(c.hidden=!0,g.set(c,l.when)),d.push(c),o.appendChild(c)}document.body.appendChild(o),$=o;let s=o.getBoundingClientRect();o.style.left=`${Math.max(4,Math.min(t,window.innerWidth-s.width-4))}px`,o.style.top=`${Math.max(4,Math.min(r,window.innerHeight-s.height-4))}px`,d.find(l=>!l.hidden)?.focus(),F=new AbortController;let a=AbortSignal.any([n,F.signal]);document.addEventListener("pointerdown",l=>{o.contains(l.target)||E()},{capture:!0,signal:a}),document.addEventListener("keydown",l=>{if(l.key==="Escape"){l.preventDefault(),l.stopPropagation(),E();return}if(l.key!=="ArrowDown"&&l.key!=="ArrowUp")return;l.preventDefault();let c=d.filter(Ce=>!Ce.hidden),y=c.indexOf(document.activeElement),q=l.key==="ArrowDown"?1:-1;c[(y+q+c.length)%c.length]?.focus()},{capture:!0,signal:a}),window.addEventListener("blur",E,{signal:a}),window.addEventListener("resize",E,{signal:a}),document.addEventListener("scroll",E,{capture:!0,signal:a});let p=await w(e);if($===o){b.textContent=p?.absolutePath??e.path,p&&!p.exists&&(b.textContent+=" (not found)");for(let[l,c]of g)l.hidden=!c(p);d.find(l=>!l.hidden)?.focus()}}let N=null,D=null,B=null;function R(){D?.abort(),D=null,N?.remove(),N=null,B?.isConnected&&B.focus(),B=null}function O(e){R(),E(),B=document.activeElement instanceof HTMLElement?document.activeElement:null;let t=x("div");t.id="bb-file-links-lightbox",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label",`Image preview: ${A(e.path)}`);let r=x("button","bb-file-links-close");r.type="button",r.setAttribute("aria-label","Close image preview"),r.textContent="\xD7";let o=x("div","bb-file-links-dialog"),b=x("img","bb-file-links-expanded");b.src=_(e),b.alt=A(e.path);let m=x("div","bb-file-links-caption"),f=x("span");f.textContent=e.path;let d=x("button","bb-file-links-button");d.type="button",d.textContent="Open preview";let g=x("button","bb-file-links-button");g.type="button",g.textContent="Copy path",m.append(f,d,g),o.append(b,m),t.append(r,o),document.body.appendChild(t),N=t,r.focus(),w(e).then(a=>{N===t&&a&&(f.textContent=a.absolutePath)}),D=new AbortController;let s=AbortSignal.any([n,D.signal]);r.addEventListener("click",R,{signal:s}),d.addEventListener("click",()=>{R(),H({...e,isImage:!1})},{signal:s}),g.addEventListener("click",()=>{ie(e)},{signal:s}),t.addEventListener("click",a=>{(a.target===t||a.target===o)&&R()},{signal:s}),document.addEventListener("keydown",a=>{if(a.key==="Escape")a.preventDefault(),a.stopPropagation(),R();else if(a.key==="Tab"){let p=[r,d,g],l=p.indexOf(document.activeElement);a.preventDefault();let c=a.shiftKey?-1:1;p[(l+c+p.length)%p.length].focus()}},{capture:!0,signal:s})}function ke(e,t){return e.kind===t.kind&&e.path===t.path&&e.threadId===t.threadId&&e.itemId===t.itemId}function z(e,t){e.setAttribute(L,"true"),e.setAttribute("role","link"),e.setAttribute("tabindex","0"),t?(e.removeAttribute(I),e.removeAttribute("aria-disabled")):(e.setAttribute(I,"true"),e.setAttribute("aria-disabled","true"))}function we(e,t){w(t).then(r=>{n.aborted||u.get(e)!==t||!r||r.exists||z(e,!1)})}function oe(e){let t=e.parentNode;t&&(t.replaceChild(document.createTextNode(e.textContent??""),e),t.normalize())}let j=new WeakMap;function Te(e,t,r,o){let b=`${r}
${o??""}
${t.join(`
`)}`,m=e.querySelector(`:scope > [${ee}]`);if(j.get(e)===b&&(m||e.dataset.bbFileLinksPending))return;m&&oe(m),j.set(e,b),e.dataset.bbFileLinksPending="1";let f=t.map(d=>({kind:"path",threadId:r,itemId:o,path:d,isImage:!1}));(async()=>{let d=f[0],g=!1,s=!1;for(let y of f){let q=await w(y);if(s||=q!==null,q?.exists){d=y,g=!0;break}}if(!s||(delete e.dataset.bbFileLinksPending,n.aborted||j.get(e)!==b||!e.isConnected))return;let a=e.firstChild;if(e.childNodes.length!==1||!(a instanceof Text))return;let p=a.data;if(!p.endsWith(d.path))return;let l=a.splitText(p.length-d.path.length),c=document.createElement("span");c.setAttribute(ee,"true"),e.replaceChild(c,l),c.appendChild(l),u.set(c,d),z(c,g)})()}function Ee(e){let t=fe(e),r=null;if(t)for(let g of e.querySelectorAll("span[title]")){if(g.closest(G)!==e)continue;let s=De(g);if(!s)continue;let a=$e(e);if(s.kind==="path"){Te(s.content,s.targets,t,a);break}let p={kind:s.kind,threadId:t,itemId:a,path:s.path,isImage:s.kind==="file"&&ge.test(s.path)},l=u.get(s.name);if(!l||!ke(l,p))if(u.set(s.name,p),s.kind==="skill"){let c=s.name;w(p).then(y=>{n.aborted||u.get(c)!==p||!y||z(c,y.exists)})}else z(s.name,!0),we(s.name,p);p.isImage&&s.kind==="file"&&Pe.has(s.prefix)&&(r=p);break}let o=e.querySelector(`:scope > [${Q}]`);if(!r){o?.remove();return}let b=`${r.threadId}
${r.path}`;if(o?.getAttribute(Q)===b)return;o?.remove();let m=r,f=x("div","bb-file-links-thumb-wrap");f.setAttribute(Q,b);let d=x("img","bb-file-links-thumb");d.loading="lazy",d.decoding="async",d.alt=A(m.path),d.title=m.path,d.tabIndex=0,d.setAttribute("role","button"),d.setAttribute("aria-label",`View image: ${A(m.path)}`),d.addEventListener("error",()=>f.remove(),{once:!0}),d.src=_(m),u.set(d,m),f.appendChild(d),e.appendChild(f)}let C=new WeakMap,ae=new WeakMap;function le(e){return e.closest("p, li, td, th, h1, h2, h3, h4, h5, h6, [data-markdown-preview]")}function ye(e,t){let r=C.get(e),o=e.querySelector("img")?null:Be(e.getAttribute("href")??""),b=o?`${t}
${o}`:"";if(r?.key===b)return;if(r?.wrap?.remove(),!o){C.delete(e);return}let m={key:b,wrap:null};C.set(e,m);let f={kind:"file",threadId:t,itemId:null,path:o,isImage:!0};w(f).then(d=>{if(n.aborted||!e.isConnected||C.get(e)!==m)return;if(!d){C.delete(e);return}let g=le(e);if(!d.exists||d.isDirectory||!g)return;let s=x("span","bb-file-links-message-thumb-wrap");s.setAttribute(be,b);let a=x("img","bb-file-links-thumb");a.loading="lazy",a.decoding="async",a.alt=A(o),a.title=d.absolutePath,a.tabIndex=0,a.setAttribute("role","button"),a.setAttribute("aria-label",`View image: ${A(o)}`),a.addEventListener("error",()=>s.remove(),{once:!0}),a.src=_(f),u.set(a,f),s.appendChild(a),g.appendChild(s),m.wrap=s,ae.set(s,e)})}function Le(){for(let e of document.querySelectorAll(`${G} [data-markdown-preview] a[href]`)){let t=fe(e.closest(G));t&&ye(e,t)}for(let e of document.querySelectorAll(`[${be}]`)){let t=ae.get(e);(!t?.isConnected||C.get(t)?.wrap!==e||le(t)!==e.parentElement)&&(e.remove(),t&&C.get(t)?.wrap===e&&C.delete(t))}}function se(){for(let e of document.querySelectorAll(G))Ee(e);Le()}let P=0,de=new MutationObserver(()=>{P||(P=requestAnimationFrame(()=>{P=0,n.aborted||se()}))});de.observe(document.body,{childList:!0,subtree:!0,characterData:!0,attributes:!0,attributeFilter:["title","data-timeline-row-id","href"]}),se();function Z(e){let t=e.target?.closest?.(`[${L}], img.bb-file-links-thumb`);if(!t||!t.isConnected)return null;let r=u.get(t);return r?{element:t,info:r}:null}return document.addEventListener("click",e=>{let t=Z(e);!t||e.button!==0||t.element.hasAttribute(I)||(e.preventDefault(),e.stopPropagation(),t.element.tagName==="IMG"?O(t.info):e.metaKey||e.ctrlKey?re(t.info):H(t.info))},{capture:!0,...h}),document.addEventListener("keydown",e=>{if(e.key!=="Enter"&&e.key!==" ")return;let t=Z(e);!t||t.element.hasAttribute(I)||(e.preventDefault(),e.stopPropagation(),t.element.tagName==="IMG"?O(t.info):H(t.info))},{capture:!0,...h}),document.addEventListener("contextmenu",e=>{let t=Z(e);t&&(e.preventDefault(),e.stopPropagation(),xe(t.info,e.clientX,e.clientY))},{capture:!0,...h}),()=>{de.disconnect(),P&&cancelAnimationFrame(P),E(),R();for(let e of document.querySelectorAll(`[${L}]`))e.removeAttribute(L),e.removeAttribute(I),e.removeAttribute("aria-disabled"),e.removeAttribute("role"),e.removeAttribute("tabindex");for(let e of document.querySelectorAll(`[${he}]`))e.remove();for(let e of document.querySelectorAll(`[${ee}]`))oe(e);for(let e of document.querySelectorAll("[data-bb-file-links-pending]"))delete e.dataset.bbFileLinksPending;v.remove()}}function ze({threadId:i}){let n=pe();return ue(()=>{function u(k){let h=k.detail;if(!h||typeof h!="object"||h.accepted||h.threadId!==i)return;let v={target:h.target,location:null};h.accepted=h.action==="external"?n.experimental_openFileExternally(v):n.experimental_openFilePreview(v)}return window.addEventListener(te,u),()=>window.removeEventListener(te,u)},[n,i]),null}var Nn=ce(i=>{i.slots.experimental_threadHeaderAction({id:"navigation-bridge",title:"File links",component:ze}),i.contentScripts.register({id:"file-links",mount({pluginId:n,signal:u}){return Oe(n,u)}})});export{Nn as default};
