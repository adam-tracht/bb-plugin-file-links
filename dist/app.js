var z=globalThis.__bbPluginRuntime;if(z==null||z.react==null)throw new Error('Cannot load "react": this bundle must be loaded by the BB app, which provides the shared plugin runtime (globalThis.__bbPluginRuntime).');var H=z.react,Te="default"in H?H.default:H,{Activity:Ee,Children:ye,Component:Ce,Fragment:Ae,Profiler:Ie,PureComponent:_e,StrictMode:Le,Suspense:Re,act:Se,cache:Pe,cacheSignal:Me,captureOwnerStack:Fe,cloneElement:$e,createContext:He,createElement:De,createRef:Ne,forwardRef:Be,isValidElement:Oe,lazy:ze,memo:Ve,startTransition:Ue,unstable_useCacheRefresh:je,use:qe,useActionState:Ge,useCallback:Ke,useContext:We,useDebugValue:Ze,useDeferredValue:Ye,useEffect:ee,useEffectEvent:Xe,useId:Je,useImperativeHandle:Qe,useInsertionEffect:et,useLayoutEffect:tt,useMemo:nt,useOptimistic:rt,useReducer:it,useRef:ot,useState:at,useSyncExternalStore:lt,useTransition:st,version:ut}=H;var V=globalThis.__bbPluginRuntime;if(V==null||V.sonner==null)throw new Error('Cannot load "sonner": this bundle must be loaded by the BB app, which provides the shared plugin runtime (globalThis.__bbPluginRuntime).');var D=V.sonner,ct="default"in D?D.default:D,{Toaster:mt,toast:w,useSonner:pt}=D;var U=globalThis.__bbPluginRuntime;if(U==null||U.pluginSdkApp==null)throw new Error('Cannot load "@get-bb/plugin-sdk/app": this bundle must be loaded by the BB app, which provides the shared plugin runtime (globalThis.__bbPluginRuntime).');var N=U.pluginSdkApp,ft="default"in N?N.default:N,{Markdown:ht,ThreadChat:gt,ThreadTitle:vt,UrlLink:xt,definePluginApp:te,experimental_BranchPicker:wt,experimental_Diff:kt,experimental_FileLink:Tt,experimental_Icon:Et,experimental_NewThreadComposer:yt,experimental_PermissionModePicker:Ct,experimental_ProviderIcon:At,experimental_ProviderModelPicker:It,experimental_SourceCode:_t,experimental_THREAD_ACTION_GROUPS:Lt,experimental_ThreadActionsContextMenu:Rt,experimental_ThreadActionsMenu:St,experimental_ThreadStatusGlyph:Pt,experimental_VoiceInputTextarea:Mt,experimental_copyToClipboard:ne,experimental_saveFile:Ft,experimental_useAppPanel:$t,experimental_useArchiveEnvironmentThreads:Ht,experimental_useBranches:Dt,experimental_useCheckoutState:Nt,experimental_useCodeTheme:Bt,experimental_useFixedTabTarget:Ot,experimental_usePluginId:zt,experimental_useProviders:Vt,experimental_useQuestionFormHost:Ut,experimental_useSidebarThreadActions:jt,experimental_useSidebarThreadPullRequest:qt,experimental_useSidebarThreadSplit:Gt,experimental_useSidebarThreads:Kt,experimental_useThreadActionRegistrations:Wt,experimental_useThreadActions:Zt,useBbContext:Yt,useBbNavigate:re,useComposer:Xt,useComposerView:Jt,useComposers:Qt,useEnvironmentProviders:en,useRealtime:tn,useRealtimeConnectionState:nn,useRpc:rn,useSdk:on,useSettings:an,useSidebarSplitLayout:ln,useSidebarThreadDraft:sn,useSidebarThreadDraftIds:un,useSidebarThreadRowStatus:dn,useSidebarThreadRowStatuses:cn,useSidebarThreadShortcut:mn}=N;var q="bb-file-links:navigate",ce="bb-file-links-styles",k="data-bb-file-links-link",j="data-bb-file-links-thumb",oe="data-bb-file-links-owned",C="data-bb-file-links-missing",ie="[data-timeline-row-id]",me=/^(Read file|Reading file|Viewed image:|Viewing image:|Read|Reading)\s+(.+)$/,pe=/^thr_[A-Za-z0-9_]+:[a-z-]+:([A-Za-z0-9_-]{1,120})(?::|$)/,be=new Set(["Read file","Read","Viewed image:"]),fe=/\.(?:png|jpe?g|gif|webp|svg|bmp)$/i,he=`
  [${k}] {
    cursor: pointer;
    text-decoration-line: underline;
    text-decoration-style: dotted;
    text-decoration-color: color-mix(in srgb, currentColor 45%, transparent);
    text-underline-offset: 2px;
  }
  [${k}]:hover,
  [${k}]:focus-visible {
    text-decoration-style: solid;
    text-decoration-color: currentColor;
    outline: none;
  }
  [${k}][${C}],
  [${k}][${C}]:hover {
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
`;function y(u){let i=u.replace(/\/+$/,"");return i.slice(i.lastIndexOf("/")+1)}function ge(u){return pe.exec(u.getAttribute("data-timeline-row-id")??"")?.[1]??null}function ve(u){let i=u.getAttribute("data-timeline-row-id")?.split(":")[0]??"";if(/^thr_[A-Za-z0-9_]+$/.test(i))return i;let d=window.location.pathname.match(/\/threads\/(thr_[A-Za-z0-9_]+)/);return d?d[1]:null}function xe(u){let i=me.exec(u.title.trim());if(!i)return null;let[,d,T]=i,c=u.lastElementChild;return!(c instanceof HTMLElement)||c.textContent?.trim()!==y(T)?null:{prefix:d,path:T,name:c}}function b(u,i){let d=document.createElement(u);return d.setAttribute(oe,"true"),i&&(d.className=i),d}function we(u,i){let d=new WeakMap,T=new Map,c={signal:i},E=document.createElement("style");E.id=ce,E.textContent=he,document.head.appendChild(E);function G(e){let t=new URLSearchParams({threadId:e.threadId,path:e.path});return e.itemId&&t.set("itemId",e.itemId),`/api/v1/plugins/${encodeURIComponent(u)}/http/image?${t}`}async function K(e,t){try{let o=await(await fetch(`/api/v1/plugins/${encodeURIComponent(u)}/rpc/${e}`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(t),signal:i})).json();return o.ok?o.result??null:null}catch{return null}}function W(e){return{threadId:e.threadId,path:e.path,...e.itemId?{itemId:e.itemId}:{}}}function A(e){let t=`${e.threadId}
${e.itemId??""}
${e.path}`,r=T.get(t);return r||(r=K("resolve",W(e)),T.set(t,r),r.then(o=>{o||T.delete(t)})),r}function Z(e,t,r){let o={action:e,threadId:t,target:r,accepted:!1};return window.dispatchEvent(new CustomEvent(q,{detail:o})),o.accepted}async function L(e){let t=await A(e);if(!i.aborted){if(!t){w.error(`Could not locate ${y(e.path)}`);return}if(!t.exists){w.error("File not found",{description:t.absolutePath});return}if(!Z("preview",e.threadId,t.target)){if(e.isImage){$(e);return}w.error("BB could not open a preview here")}}}async function Y(e){let t=await A(e);if(!i.aborted){if(t&&!t.exists){w.error("File not found",{description:t.absolutePath});return}(!t||!Z("external",e.threadId,t.target))&&w.error(`Could not open ${y(e.path)}`)}}async function X(e){let t=await A(e);if(i.aborted)return;let r=t?.absolutePath??e.path;await ne({text:r})?w.success("Copied path",{description:r}):w.error("Could not copy the path")}async function ae(e){let t=await K("reveal",W(e));!i.aborted&&!t?.revealed&&w.error("Could not reveal the file in Finder")}let R=null,S=null;function x(){S?.abort(),S=null,R?.remove(),R=null}async function le(e,t,r){x();let o=b("div","bb-file-links-menu");o.setAttribute("role","menu");let h=b("div","bb-file-links-menu-path");h.textContent=e.path,o.appendChild(h);let f=n=>n?.exists===!0,g=[{label:"Open preview",run:()=>{L(e)},when:f},{label:"Open in default app",run:()=>{Y(e)},when:f},{label:"Copy full path",run:()=>{X(e)}},{label:"Reveal in Finder",run:()=>{ae(e)},when:n=>n?.canReveal===!0}];e.isImage&&g.splice(1,0,{label:"View image",run:()=>$(e),when:f});let l=[],v=new Map;for(let n of g){let s=b("button","bb-file-links-menu-item");s.type="button",s.setAttribute("role","menuitem"),s.textContent=n.label,s.addEventListener("click",O=>{O.stopPropagation(),x(),n.run()}),n.when&&(s.hidden=!0,v.set(s,n.when)),l.push(s),o.appendChild(s)}document.body.appendChild(o),R=o;let m=o.getBoundingClientRect();o.style.left=`${Math.max(4,Math.min(t,window.innerWidth-m.width-4))}px`,o.style.top=`${Math.max(4,Math.min(r,window.innerHeight-m.height-4))}px`,l.find(n=>!n.hidden)?.focus(),S=new AbortController;let a=AbortSignal.any([i,S.signal]);document.addEventListener("pointerdown",n=>{o.contains(n.target)||x()},{capture:!0,signal:a}),document.addEventListener("keydown",n=>{if(n.key==="Escape"){n.preventDefault(),n.stopPropagation(),x();return}if(n.key!=="ArrowDown"&&n.key!=="ArrowUp")return;n.preventDefault();let s=l.filter(de=>!de.hidden),O=s.indexOf(document.activeElement),ue=n.key==="ArrowDown"?1:-1;s[(O+ue+s.length)%s.length]?.focus()},{capture:!0,signal:a}),window.addEventListener("blur",x,{signal:a}),window.addEventListener("resize",x,{signal:a}),document.addEventListener("scroll",x,{capture:!0,signal:a});let p=await A(e);if(R===o){h.textContent=p?.absolutePath??e.path,p&&!p.exists&&(h.textContent+=" (not found)");for(let[n,s]of v)n.hidden=!s(p);l.find(n=>!n.hidden)?.focus()}}let P=null,M=null,F=null;function I(){M?.abort(),M=null,P?.remove(),P=null,F?.isConnected&&F.focus(),F=null}function $(e){I(),x(),F=document.activeElement instanceof HTMLElement?document.activeElement:null;let t=b("div");t.id="bb-file-links-lightbox",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.setAttribute("aria-label",`Image preview: ${y(e.path)}`);let r=b("button","bb-file-links-close");r.type="button",r.setAttribute("aria-label","Close image preview"),r.textContent="\xD7";let o=b("div","bb-file-links-dialog"),h=b("img","bb-file-links-expanded");h.src=G(e),h.alt=y(e.path);let f=b("div","bb-file-links-caption"),g=b("span");g.textContent=e.path;let l=b("button","bb-file-links-button");l.type="button",l.textContent="Open preview";let v=b("button","bb-file-links-button");v.type="button",v.textContent="Copy path",f.append(g,l,v),o.append(h,f),t.append(r,o),document.body.appendChild(t),P=t,r.focus(),A(e).then(a=>{P===t&&a&&(g.textContent=a.absolutePath)}),M=new AbortController;let m=AbortSignal.any([i,M.signal]);r.addEventListener("click",I,{signal:m}),l.addEventListener("click",()=>{I(),L({...e,isImage:!1})},{signal:m}),v.addEventListener("click",()=>{X(e)},{signal:m}),t.addEventListener("click",a=>{(a.target===t||a.target===o)&&I()},{signal:m}),document.addEventListener("keydown",a=>{if(a.key==="Escape")a.preventDefault(),a.stopPropagation(),I();else if(a.key==="Tab"){let p=[r,l,v],n=p.indexOf(document.activeElement);a.preventDefault();let s=a.shiftKey?-1:1;p[(n+s+p.length)%p.length].focus()}},{capture:!0,signal:m})}function se(e){let t=ve(e),r=null;if(t)for(let v of e.querySelectorAll("span[title]")){if(v.closest(ie)!==e)continue;let m=xe(v);if(!m)continue;let a={threadId:t,itemId:ge(e),path:m.path,isImage:fe.test(m.path)},p=d.get(m.name);if(!p||p.path!==a.path||p.threadId!==t||p.itemId!==a.itemId){let n=m.name;d.set(n,a),n.setAttribute(k,"true"),n.setAttribute("role","link"),n.setAttribute("tabindex","0"),n.removeAttribute(C),n.removeAttribute("aria-disabled"),A(a).then(s=>{i.aborted||d.get(n)!==a||!s||s.exists||(n.setAttribute(C,"true"),n.setAttribute("aria-disabled","true"))})}a.isImage&&be.has(m.prefix)&&(r=a);break}let o=e.querySelector(`:scope > [${j}]`);if(!r){o?.remove();return}let h=`${r.threadId}
${r.path}`;if(o?.getAttribute(j)===h)return;o?.remove();let f=r,g=b("div","bb-file-links-thumb-wrap");g.setAttribute(j,h);let l=b("img","bb-file-links-thumb");l.loading="lazy",l.decoding="async",l.alt=y(f.path),l.title=f.path,l.tabIndex=0,l.setAttribute("role","button"),l.setAttribute("aria-label",`View image: ${y(f.path)}`),l.addEventListener("error",()=>g.remove(),{once:!0}),l.src=G(f),d.set(l,f),g.appendChild(l),e.appendChild(g)}function J(){for(let e of document.querySelectorAll(ie))se(e)}let _=0,Q=new MutationObserver(()=>{_||(_=requestAnimationFrame(()=>{_=0,i.aborted||J()}))});Q.observe(document.body,{childList:!0,subtree:!0,characterData:!0,attributes:!0,attributeFilter:["title","data-timeline-row-id"]}),J();function B(e){let t=e.target?.closest?.(`[${k}], img.bb-file-links-thumb`);if(!t||!t.isConnected)return null;let r=d.get(t);return r?{element:t,info:r}:null}return document.addEventListener("click",e=>{let t=B(e);!t||e.button!==0||t.element.hasAttribute(C)||(e.preventDefault(),e.stopPropagation(),t.element.tagName==="IMG"?$(t.info):e.metaKey||e.ctrlKey?Y(t.info):L(t.info))},{capture:!0,...c}),document.addEventListener("keydown",e=>{if(e.key!=="Enter"&&e.key!==" ")return;let t=B(e);!t||t.element.hasAttribute(C)||(e.preventDefault(),e.stopPropagation(),t.element.tagName==="IMG"?$(t.info):L(t.info))},{capture:!0,...c}),document.addEventListener("contextmenu",e=>{let t=B(e);t&&(e.preventDefault(),e.stopPropagation(),le(t.info,e.clientX,e.clientY))},{capture:!0,...c}),()=>{Q.disconnect(),_&&cancelAnimationFrame(_),x(),I();for(let e of document.querySelectorAll(`[${k}]`))e.removeAttribute(k),e.removeAttribute(C),e.removeAttribute("aria-disabled"),e.removeAttribute("role"),e.removeAttribute("tabindex");for(let e of document.querySelectorAll(`[${oe}]`))e.remove();E.remove()}}function ke({threadId:u}){let i=re();return ee(()=>{function d(T){let c=T.detail;if(!c||typeof c!="object"||c.accepted||c.threadId!==u)return;let E={target:c.target,location:null};c.accepted=c.action==="external"?i.experimental_openFileExternally(E):i.experimental_openFilePreview(E)}return window.addEventListener(q,d),()=>window.removeEventListener(q,d)},[i,u]),null}var gn=te(u=>{u.slots.experimental_threadHeaderAction({id:"navigation-bridge",title:"File links",component:ke}),u.contentScripts.register({id:"file-links",mount({pluginId:i,signal:d}){return we(i,d)}})});export{gn as default};
