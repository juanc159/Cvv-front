import{_ as Zt}from"./AppLoadingIndicator.vue_vue_type_script_setup_true_lang-fefe674d.js";import{d as J,o as h,c as F,F as $t,i as Dt,g as _,h as N,j as Bt,k as te,l as mt,r as H,w as ot,m as ee,n as u,f as k,e as b,p as $,q as G,s as Vt,t as It,v as gt,x as Z,y as ht,z as M,b as T,A as ne,B as oe,C as ie,D as se,E as re,G as O,H as ut,I as At,J as St,T as le,a as Nt,S as ae}from"./index-4eb24df8.js";import ce from"./Footer-d325f300.js";import{_ as ue}from"./NavbarThemeSwitcher.vue_vue_type_script_setup_true_lang-43b3e244.js";import{_ as fe}from"./UserProfile.vue_vue_type_script_setup_true_lang-1ab1a456.js";import{c as pe,a as de,_ as me}from"./I18n.vue_vue_type_script_setup_true_lang-84307bd5.js";import{V as ge}from"./VNodeRenderer-e98f7237.js";import{V as he}from"./VSpacer-ed9198dc.js";import"./VMenu-95167406.js";import"./dialog-transition-27de2546.js";import"./VList-8d710a46.js";import"./ssrBoot-f72363e6.js";import"./VAvatar-1e92a85e.js";import"./VImg-67e70e7a.js";import"./VDivider-8b44441e.js";import"./VBadge-ef78889a.js";const ve={class:"nav-items"},ye=J({__name:"HorizontalNav",props:{navItems:{}},setup(t){const e=n=>"children"in n?be:Ht;return(n,o)=>(h(),F("ul",ve,[(h(!0),F($t,null,Dt(n.navItems,(i,r)=>(h(),_(N(e(i)),{key:r,item:i},null,8,["item"]))),128))]))}}),we={class:"nav-group-label"},be=J({name:"HorizontalNavGroup",__name:"HorizontalNavGroup",props:{item:{},childrenAtEnd:{type:Boolean,default:!1},isSubItem:{type:Boolean,default:!1}},setup(t){const e=t,n=Bt(),o=te(),i=mt(),r=H(!1);return ot(()=>n.path,()=>{const s=ee(e.item.children,o);r.value=s},{immediate:!0}),(s,l)=>u(pe)(s.item)?(h(),_(u(on),{key:0,"is-rtl":u(i).isAppRTL,class:Z(["nav-group",[{active:u(r),"children-at-end":s.childrenAtEnd,"sub-item":s.isSubItem,disabled:s.item.disable}]]),tag:"li","content-container-tag":"ul","popper-inline-end":s.childrenAtEnd},{content:k(()=>[(h(!0),F($t,null,Dt(s.item.children,a=>(h(),_(N("children"in a?"HorizontalNavGroup":u(Ht)),{key:a.title,item:a,"children-at-end":"","is-sub-item":""},null,8,["item"]))),128))]),default:k(()=>[b("div",we,[(h(),_(N(u($).app.iconRenderer||"div"),G({class:"nav-item-icon"},s.item.icon||u($).verticalNav.defaultNavItemIconProps),null,16)),(h(),_(N(u($).app.i18n.enable?"i18n-t":"span"),G(u(Vt)(s.item.title,"span"),{class:"nav-item-title"}),{default:k(()=>[It(gt(s.item.title),1)]),_:1},16)),(h(),_(N(u($).app.iconRenderer||"div"),G(u($).icons.chevronDown,{class:"nav-group-arrow"}),null,16))])]),_:1},8,["is-rtl","class","popper-inline-end"])):ht("",!0)}}),xe={class:"layout-navbar"},Ce={class:"navbar-content-container"},_e={class:"layout-horizontal-nav"},Re={class:"horizontal-nav-content-container"},ke={class:"layout-page-content"},Ae={class:"layout-footer"},Se={class:"footer-content-container"},Ne=J({__name:"HorizontalNavLayout",props:{navItems:{}},setup(t){const e=mt();return(n,o)=>(h(),F("div",{class:Z(["layout-wrapper",u(e)._layoutClasses])},[b("div",{class:Z(["layout-navbar-and-nav-container",u(e).isNavbarBlurEnabled&&"header-blur"])},[b("div",xe,[b("div",Ce,[M(n.$slots,"navbar")])]),b("div",_e,[b("div",Re,[T(u(ye),{"nav-items":n.navItems},null,8,["nav-items"])])])],2),b("main",ke,[M(n.$slots,"default")]),b("footer",Ae,[b("div",Se,[M(n.$slots,"footer")])])],2))}}),Ht=J({__name:"HorizontalNavLink",props:{item:{},isSubItem:{type:Boolean,default:!1}},setup(t){const e=t;return(n,o)=>u(de)(n.item.action,n.item.subject)?(h(),F("li",{key:0,class:Z(["nav-link",[{"sub-item":e.isSubItem,disabled:n.item.disable}]])},[(h(),_(N(n.item.to?"RouterLink":"a"),G(u(oe)(n.item),{class:{"router-link-active router-link-exact-active":u(ne)(n.item,n.$router)}}),{default:k(()=>[(h(),_(N(u($).app.iconRenderer||"div"),G({class:"nav-item-icon"},n.item.icon||u($).verticalNav.defaultNavItemIconProps),null,16)),(h(),_(N(u($).app.i18n.enable?"i18n-t":"span"),G({class:"nav-item-title"},u(Vt)(n.item.title,"span")),{default:k(()=>[It(gt(n.item.title),1)]),_:1},16))]),_:1},16,["class"]))],2)):ht("",!0)}}),ft=Math.min,j=Math.max,it=Math.round,D=t=>({x:t,y:t}),Ee={left:"right",right:"left",bottom:"top",top:"bottom"},Le={start:"end",end:"start"};function Et(t,e,n){return j(t,ft(e,n))}function vt(t,e){return typeof t=="function"?t(e):t}function Y(t){return t.split("-")[0]}function yt(t){return t.split("-")[1]}function Mt(t){return t==="x"?"y":"x"}function Ft(t){return t==="y"?"height":"width"}function wt(t){return["top","bottom"].includes(Y(t))?"y":"x"}function zt(t){return Mt(wt(t))}function Te(t,e,n){n===void 0&&(n=!1);const o=yt(t),i=zt(t),r=Ft(i);let s=i==="x"?o===(n?"end":"start")?"right":"left":o==="start"?"bottom":"top";return e.reference[r]>e.floating[r]&&(s=st(s)),[s,st(s)]}function Oe(t){const e=st(t);return[pt(t),e,pt(e)]}function pt(t){return t.replace(/start|end/g,e=>Le[e])}function Pe(t,e,n){const o=["left","right"],i=["right","left"],r=["top","bottom"],s=["bottom","top"];switch(t){case"top":case"bottom":return n?e?i:o:e?o:i;case"left":case"right":return e?r:s;default:return[]}}function $e(t,e,n,o){const i=yt(t);let r=Pe(Y(t),n==="start",o);return i&&(r=r.map(s=>s+"-"+i),e&&(r=r.concat(r.map(pt)))),r}function st(t){return t.replace(/left|right|bottom|top/g,e=>Ee[e])}function De(t){return{top:0,right:0,bottom:0,left:0,...t}}function Be(t){return typeof t!="number"?De(t):{top:t,right:t,bottom:t,left:t}}function rt(t){return{...t,top:t.y,left:t.x,right:t.x+t.width,bottom:t.y+t.height}}function Lt(t,e,n){let{reference:o,floating:i}=t;const r=wt(e),s=zt(e),l=Ft(s),a=Y(e),c=r==="y",p=o.x+o.width/2-i.width/2,f=o.y+o.height/2-i.height/2,g=o[l]/2-i[l]/2;let d;switch(a){case"top":d={x:p,y:o.y-i.height};break;case"bottom":d={x:p,y:o.y+o.height};break;case"right":d={x:o.x+o.width,y:f};break;case"left":d={x:o.x-i.width,y:f};break;default:d={x:o.x,y:o.y}}switch(yt(e)){case"start":d[s]-=g*(n&&c?-1:1);break;case"end":d[s]+=g*(n&&c?-1:1);break}return d}const Ve=async(t,e,n)=>{const{placement:o="bottom",strategy:i="absolute",middleware:r=[],platform:s}=n,l=r.filter(Boolean),a=await(s.isRTL==null?void 0:s.isRTL(e));let c=await s.getElementRects({reference:t,floating:e,strategy:i}),{x:p,y:f}=Lt(c,o,a),g=o,d={},m=0;for(let v=0;v<l.length;v++){const{name:y,fn:w}=l[v],{x,y:C,data:L,reset:R}=await w({x:p,y:f,initialPlacement:o,placement:g,strategy:i,middlewareData:d,rects:c,platform:s,elements:{reference:t,floating:e}});if(p=x??p,f=C??f,d={...d,[y]:{...d[y],...L}},R&&m<=50){m++,typeof R=="object"&&(R.placement&&(g=R.placement),R.rects&&(c=R.rects===!0?await s.getElementRects({reference:t,floating:e,strategy:i}):R.rects),{x:p,y:f}=Lt(c,g,a)),v=-1;continue}}return{x:p,y:f,placement:g,strategy:i,middlewareData:d}};async function Wt(t,e){var n;e===void 0&&(e={});const{x:o,y:i,platform:r,rects:s,elements:l,strategy:a}=t,{boundary:c="clippingAncestors",rootBoundary:p="viewport",elementContext:f="floating",altBoundary:g=!1,padding:d=0}=vt(e,t),m=Be(d),y=l[g?f==="floating"?"reference":"floating":f],w=rt(await r.getClippingRect({element:(n=await(r.isElement==null?void 0:r.isElement(y)))==null||n?y:y.contextElement||await(r.getDocumentElement==null?void 0:r.getDocumentElement(l.floating)),boundary:c,rootBoundary:p,strategy:a})),x=f==="floating"?{...s.floating,x:o,y:i}:s.reference,C=await(r.getOffsetParent==null?void 0:r.getOffsetParent(l.floating)),L=await(r.isElement==null?void 0:r.isElement(C))?await(r.getScale==null?void 0:r.getScale(C))||{x:1,y:1}:{x:1,y:1},R=rt(r.convertOffsetParentRelativeRectToViewportRelativeRect?await r.convertOffsetParentRelativeRectToViewportRelativeRect({rect:x,offsetParent:C,strategy:a}):x);return{top:(w.top-R.top+m.top)/L.y,bottom:(R.bottom-w.bottom+m.bottom)/L.y,left:(w.left-R.left+m.left)/L.x,right:(R.right-w.right+m.right)/L.x}}const Ie=function(t){return t===void 0&&(t={}),{name:"flip",options:t,async fn(e){var n,o;const{placement:i,middlewareData:r,rects:s,initialPlacement:l,platform:a,elements:c}=e,{mainAxis:p=!0,crossAxis:f=!0,fallbackPlacements:g,fallbackStrategy:d="bestFit",fallbackAxisSideDirection:m="none",flipAlignment:v=!0,...y}=vt(t,e);if((n=r.arrow)!=null&&n.alignmentOffset)return{};const w=Y(i),x=Y(l)===l,C=await(a.isRTL==null?void 0:a.isRTL(c.floating)),L=g||(x||!v?[st(l)]:Oe(l));!g&&m!=="none"&&L.push(...$e(l,v,m,C));const R=[l,...L],ct=await Wt(e,y),nt=[];let K=((o=r.flip)==null?void 0:o.overflows)||[];if(p&&nt.push(ct[w]),f){const I=Te(i,s,C);nt.push(ct[I[0]],ct[I[1]])}if(K=[...K,{placement:i,overflows:nt}],!nt.every(I=>I<=0)){var Ct,_t;const I=(((Ct=r.flip)==null?void 0:Ct.index)||0)+1,kt=R[I];if(kt)return{data:{index:I,overflows:K},reset:{placement:kt}};let Q=(_t=K.filter(z=>z.overflows[0]<=0).sort((z,W)=>z.overflows[1]-W.overflows[1])[0])==null?void 0:_t.placement;if(!Q)switch(d){case"bestFit":{var Rt;const z=(Rt=K.map(W=>[W.placement,W.overflows.filter(U=>U>0).reduce((U,Ut)=>U+Ut,0)]).sort((W,U)=>W[1]-U[1])[0])==null?void 0:Rt[0];z&&(Q=z);break}case"initialPlacement":Q=l;break}if(i!==Q)return{reset:{placement:Q}}}return{}}}},He=function(t){return t===void 0&&(t={}),{name:"shift",options:t,async fn(e){const{x:n,y:o,placement:i}=e,{mainAxis:r=!0,crossAxis:s=!1,limiter:l={fn:y=>{let{x:w,y:x}=y;return{x:w,y:x}}},...a}=vt(t,e),c={x:n,y:o},p=await Wt(e,a),f=wt(Y(i)),g=Mt(f);let d=c[g],m=c[f];if(r){const y=g==="y"?"top":"left",w=g==="y"?"bottom":"right",x=d+p[y],C=d-p[w];d=Et(x,d,C)}if(s){const y=f==="y"?"top":"left",w=f==="y"?"bottom":"right",x=m+p[y],C=m-p[w];m=Et(x,m,C)}const v=l.fn({...e,[g]:d,[f]:m});return{...v,data:{x:v.x-n,y:v.y-o}}}}};function B(t){return Gt(t)?(t.nodeName||"").toLowerCase():"#document"}function A(t){var e;return(t==null||(e=t.ownerDocument)==null?void 0:e.defaultView)||window}function V(t){var e;return(e=(Gt(t)?t.ownerDocument:t.document)||window.document)==null?void 0:e.documentElement}function Gt(t){return t instanceof Node||t instanceof A(t).Node}function P(t){return t instanceof Element||t instanceof A(t).Element}function E(t){return t instanceof HTMLElement||t instanceof A(t).HTMLElement}function Tt(t){return typeof ShadowRoot>"u"?!1:t instanceof ShadowRoot||t instanceof A(t).ShadowRoot}function et(t){const{overflow:e,overflowX:n,overflowY:o,display:i}=S(t);return/auto|scroll|overlay|hidden|clip/.test(e+o+n)&&!["inline","contents"].includes(i)}function Me(t){return["table","td","th"].includes(B(t))}function bt(t){const e=xt(),n=S(t);return n.transform!=="none"||n.perspective!=="none"||(n.containerType?n.containerType!=="normal":!1)||!e&&(n.backdropFilter?n.backdropFilter!=="none":!1)||!e&&(n.filter?n.filter!=="none":!1)||["transform","perspective","filter"].some(o=>(n.willChange||"").includes(o))||["paint","layout","strict","content"].some(o=>(n.contain||"").includes(o))}function Fe(t){let e=q(t);for(;E(e)&&!lt(e);){if(bt(e))return e;e=q(e)}return null}function xt(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}function lt(t){return["html","body","#document"].includes(B(t))}function S(t){return A(t).getComputedStyle(t)}function at(t){return P(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.pageXOffset,scrollTop:t.pageYOffset}}function q(t){if(B(t)==="html")return t;const e=t.assignedSlot||t.parentNode||Tt(t)&&t.host||V(t);return Tt(e)?e.host:e}function jt(t){const e=q(t);return lt(e)?t.ownerDocument?t.ownerDocument.body:t.body:E(e)&&et(e)?e:jt(e)}function dt(t,e,n){var o;e===void 0&&(e=[]),n===void 0&&(n=!0);const i=jt(t),r=i===((o=t.ownerDocument)==null?void 0:o.body),s=A(i);return r?e.concat(s,s.visualViewport||[],et(i)?i:[],s.frameElement&&n?dt(s.frameElement):[]):e.concat(i,dt(i,[],n))}function Xt(t){const e=S(t);let n=parseFloat(e.width)||0,o=parseFloat(e.height)||0;const i=E(t),r=i?t.offsetWidth:n,s=i?t.offsetHeight:o,l=it(n)!==r||it(o)!==s;return l&&(n=r,o=s),{width:n,height:o,$:l}}function Yt(t){return P(t)?t:t.contextElement}function X(t){const e=Yt(t);if(!E(e))return D(1);const n=e.getBoundingClientRect(),{width:o,height:i,$:r}=Xt(e);let s=(r?it(n.width):n.width)/o,l=(r?it(n.height):n.height)/i;return(!s||!Number.isFinite(s))&&(s=1),(!l||!Number.isFinite(l))&&(l=1),{x:s,y:l}}const ze=D(0);function qt(t){const e=A(t);return!xt()||!e.visualViewport?ze:{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}}function We(t,e,n){return e===void 0&&(e=!1),!n||e&&n!==A(t)?!1:e}function tt(t,e,n,o){e===void 0&&(e=!1),n===void 0&&(n=!1);const i=t.getBoundingClientRect(),r=Yt(t);let s=D(1);e&&(o?P(o)&&(s=X(o)):s=X(t));const l=We(r,n,o)?qt(r):D(0);let a=(i.left+l.x)/s.x,c=(i.top+l.y)/s.y,p=i.width/s.x,f=i.height/s.y;if(r){const g=A(r),d=o&&P(o)?A(o):o;let m=g.frameElement;for(;m&&o&&d!==g;){const v=X(m),y=m.getBoundingClientRect(),w=S(m),x=y.left+(m.clientLeft+parseFloat(w.paddingLeft))*v.x,C=y.top+(m.clientTop+parseFloat(w.paddingTop))*v.y;a*=v.x,c*=v.y,p*=v.x,f*=v.y,a+=x,c+=C,m=A(m).frameElement}}return rt({width:p,height:f,x:a,y:c})}function Ge(t){let{rect:e,offsetParent:n,strategy:o}=t;const i=E(n),r=V(n);if(n===r)return e;let s={scrollLeft:0,scrollTop:0},l=D(1);const a=D(0);if((i||!i&&o!=="fixed")&&((B(n)!=="body"||et(r))&&(s=at(n)),E(n))){const c=tt(n);l=X(n),a.x=c.x+n.clientLeft,a.y=c.y+n.clientTop}return{width:e.width*l.x,height:e.height*l.y,x:e.x*l.x-s.scrollLeft*l.x+a.x,y:e.y*l.y-s.scrollTop*l.y+a.y}}function je(t){return Array.from(t.getClientRects())}function Jt(t){return tt(V(t)).left+at(t).scrollLeft}function Xe(t){const e=V(t),n=at(t),o=t.ownerDocument.body,i=j(e.scrollWidth,e.clientWidth,o.scrollWidth,o.clientWidth),r=j(e.scrollHeight,e.clientHeight,o.scrollHeight,o.clientHeight);let s=-n.scrollLeft+Jt(t);const l=-n.scrollTop;return S(o).direction==="rtl"&&(s+=j(e.clientWidth,o.clientWidth)-i),{width:i,height:r,x:s,y:l}}function Ye(t,e){const n=A(t),o=V(t),i=n.visualViewport;let r=o.clientWidth,s=o.clientHeight,l=0,a=0;if(i){r=i.width,s=i.height;const c=xt();(!c||c&&e==="fixed")&&(l=i.offsetLeft,a=i.offsetTop)}return{width:r,height:s,x:l,y:a}}function qe(t,e){const n=tt(t,!0,e==="fixed"),o=n.top+t.clientTop,i=n.left+t.clientLeft,r=E(t)?X(t):D(1),s=t.clientWidth*r.x,l=t.clientHeight*r.y,a=i*r.x,c=o*r.y;return{width:s,height:l,x:a,y:c}}function Ot(t,e,n){let o;if(e==="viewport")o=Ye(t,n);else if(e==="document")o=Xe(V(t));else if(P(e))o=qe(e,n);else{const i=qt(t);o={...e,x:e.x-i.x,y:e.y-i.y}}return rt(o)}function Kt(t,e){const n=q(t);return n===e||!P(n)||lt(n)?!1:S(n).position==="fixed"||Kt(n,e)}function Je(t,e){const n=e.get(t);if(n)return n;let o=dt(t,[],!1).filter(l=>P(l)&&B(l)!=="body"),i=null;const r=S(t).position==="fixed";let s=r?q(t):t;for(;P(s)&&!lt(s);){const l=S(s),a=bt(s);!a&&l.position==="fixed"&&(i=null),(r?!a&&!i:!a&&l.position==="static"&&!!i&&["absolute","fixed"].includes(i.position)||et(s)&&!a&&Kt(t,s))?o=o.filter(p=>p!==s):i=l,s=q(s)}return e.set(t,o),o}function Ke(t){let{element:e,boundary:n,rootBoundary:o,strategy:i}=t;const s=[...n==="clippingAncestors"?Je(e,this._c):[].concat(n),o],l=s[0],a=s.reduce((c,p)=>{const f=Ot(e,p,i);return c.top=j(f.top,c.top),c.right=ft(f.right,c.right),c.bottom=ft(f.bottom,c.bottom),c.left=j(f.left,c.left),c},Ot(e,l,i));return{width:a.right-a.left,height:a.bottom-a.top,x:a.left,y:a.top}}function Qe(t){return Xt(t)}function Ue(t,e,n){const o=E(e),i=V(e),r=n==="fixed",s=tt(t,!0,r,e);let l={scrollLeft:0,scrollTop:0};const a=D(0);if(o||!o&&!r)if((B(e)!=="body"||et(i))&&(l=at(e)),o){const c=tt(e,!0,r,e);a.x=c.x+e.clientLeft,a.y=c.y+e.clientTop}else i&&(a.x=Jt(i));return{x:s.left+l.scrollLeft-a.x,y:s.top+l.scrollTop-a.y,width:s.width,height:s.height}}function Pt(t,e){return!E(t)||S(t).position==="fixed"?null:e?e(t):t.offsetParent}function Qt(t,e){const n=A(t);if(!E(t))return n;let o=Pt(t,e);for(;o&&Me(o)&&S(o).position==="static";)o=Pt(o,e);return o&&(B(o)==="html"||B(o)==="body"&&S(o).position==="static"&&!bt(o))?n:o||Fe(t)||n}const Ze=async function(t){let{reference:e,floating:n,strategy:o}=t;const i=this.getOffsetParent||Qt,r=this.getDimensions;return{reference:Ue(e,await i(n),o),floating:{x:0,y:0,...await r(n)}}};function tn(t){return S(t).direction==="rtl"}const en={convertOffsetParentRelativeRectToViewportRelativeRect:Ge,getDocumentElement:V,getClippingRect:Ke,getOffsetParent:Qt,getElementRects:Ze,getClientRects:je,getDimensions:Qe,getScale:X,isElement:P,isRTL:tn},nn=(t,e,n)=>{const o=new Map,i={platform:en,...n},r={...i.platform,_c:o};return Ve(t,e,{...i,platform:r})},on=J({__name:"HorizontalNavPopper",props:{popperInlineEnd:{type:Boolean,default:!1},tag:{default:"div"},contentContainerTag:{default:"div"},isRtl:{type:Boolean}},setup(t){const e=t,n=mt(),o=H(),i=H(),r=H({left:"0px",top:"0px"}),s=async()=>{if(o.value!==void 0&&i.value!==void 0){const{x:f,y:g}=await nn(o.value,i.value,{placement:e.popperInlineEnd?e.isRtl?"left-start":"right-start":"bottom-start",middleware:[Ie({boundary:document.querySelector("body")}),He({boundary:document.querySelector("body")})]});r.value.left=`${f}px`,r.value.top=`${g}px`}};ie(()=>n.horizontalNavType).toMatch(f=>f==="static").then(()=>{se("scroll",s)});const l=H(!1),a=()=>{l.value=!0,s()},c=()=>{l.value=!1};re(s),ot([()=>n.isAppRTL,()=>n.appContentWidth],s);const p=Bt();return ot(()=>p.fullPath,c),(f,g)=>(h(),F("div",{class:Z(["nav-popper",[{"popper-inline-end":f.popperInlineEnd,"show-content":u(l)}]])},[b("div",{ref_key:"refPopperContainer",ref:o,class:"popper-triggerer",onMouseenter:a,onMouseleave:c},[M(f.$slots,"default")],544),u(O).horizontalNav.transition?typeof u(O).horizontalNav.transition=="string"?(h(),_(le,{key:1,name:u(O).horizontalNav.transition},{default:k(()=>[At(b("div",{ref_key:"refPopper",ref:i,class:"popper-content",style:ut(u(r)),onMouseenter:a,onMouseleave:c},[b("div",null,[M(f.$slots,"content")])],36),[[St,u(l)]])]),_:3},8,["name"])):(h(),_(N(u(O).horizontalNav.transition),{key:2},{default:k(()=>[At(b("div",{ref_key:"refPopper",ref:i,class:"popper-content",style:ut(u(r)),onMouseenter:a,onMouseleave:c},[b("div",null,[M(f.$slots,"content")])],36),[[St,u(l)]])]),_:3})):(h(),F("div",{key:0,ref_key:"refPopper",ref:i,class:"popper-content",style:ut(u(r)),onMouseenter:a,onMouseleave:c},[b("div",null,[M(f.$slots,"content")])],36))],2))}}),sn=[{title:"Home",to:{name:"root"},icon:{icon:"tabler-smart-home"}},{title:"Second page",to:{name:"second-page"},icon:{icon:"tabler-file"}}],rn={class:"app-title font-weight-bold leading-normal text-xl text-capitalize"},_n=J({__name:"DefaultLayoutWithHorizontalNav",setup(t){const e=H(!1),n=H(null);return ot([e,n],()=>{e.value&&n.value&&n.value.fallbackHandle(),!e.value&&n.value&&n.value.resolveHandle()},{immediate:!0}),(o,i)=>{const r=Nt("RouterLink"),s=Zt,l=Nt("RouterView");return h(),_(u(Ne),{"nav-items":u(sn)},{navbar:k(()=>{var a;return[T(r,{to:"/",class:"app-logo d-flex align-center gap-x-3"},{default:k(()=>[T(u(ge),{nodes:u(O).app.logo},null,8,["nodes"]),b("h1",rn,gt(u(O).app.title),1)]),_:1}),T(he),u(O).app.i18n.enable&&((a=u(O).app.i18n.langConfig)!=null&&a.length)?(h(),_(me,{key:0,languages:u(O).app.i18n.langConfig},null,8,["languages"])):ht("",!0),T(ue,{class:"me-2"}),T(fe)]}),footer:k(()=>[T(ce)]),default:k(()=>[T(s,{ref_key:"refLoadingIndicator",ref:n},null,512),T(l,null,{default:k(({Component:a})=>[(h(),_(ae,{timeout:0,onFallback:i[0]||(i[0]=c=>e.value=!0),onResolve:i[1]||(i[1]=c=>e.value=!1)},{default:k(()=>[(h(),_(N(a)))]),_:2},1024))]),_:1})]),_:1},8,["nav-items"])}}});export{_n as default};