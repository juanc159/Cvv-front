import{_ as ne}from"./AppLoadingIndicator.vue_vue_type_script_setup_true_lang-d1129ff2.js";import{d as R,U as N,T as W,V as K,r as A,W as ie,X as se,Y as Q,t as M,p as X,w,a as H,o,g as v,f as u,e as $,G as D,b as h,k as e,x as c,O as k,C as O,P as V,h as f,y as b,c as P,F as Z,m as J,D as j,q as oe,Z as le,v as Y,$ as S,a0 as re,z as B,B as G,E as T,a1 as x,a2 as ce,a3 as ve,a4 as ue,a5 as pe,H as de,I as me,Q as fe,R as ge,a6 as he,M as F,S as ye}from"./index-e87c998e.js";import Ne from"./Footer-ea06e1aa.js";import{_ as be}from"./NavbarThemeSwitcher.vue_vue_type_script_setup_true_lang-0ecbde61.js";import{_ as _e}from"./UserProfile.vue_vue_type_script_setup_true_lang-ddcfa123.js";import{c as Ce,a as ee,_ as ke}from"./I18n.vue_vue_type_script_setup_true_lang-bbd1007e.js";import{P as Ve}from"./vue3-perfect-scrollbar.esm-45964b4f.js";import{V as Ae}from"./VNodeRenderer-d5eb0cb7.js";import{V as Ie}from"./VSpacer-9cacc393.js";import"./VMenu-ccd8d291.js";import"./dialog-transition-e0e81da4.js";import"./VList-725590b5.js";import"./ssrBoot-db5986a3.js";import"./VAvatar-310879b2.js";import"./VImg-b8e40629.js";import"./VDivider-92bccdc3.js";import"./formatters-1588bd0d.js";import"./VBadge-860221ff.js";const Se=R({name:"TransitionExpand",setup(C,{slots:a}){const l=t=>{const y=getComputedStyle(t).width;t.style.width=y,t.style.position="absolute",t.style.visibility="hidden",t.style.height="auto";const g=getComputedStyle(t).height;t.style.width="",t.style.position="",t.style.visibility="",t.style.height="0px",getComputedStyle(t).height,requestAnimationFrame(()=>{t.style.height=g})},i=t=>{t.style.height="auto"},s=t=>{const y=getComputedStyle(t).height;t.style.height=y,getComputedStyle(t).height,requestAnimationFrame(()=>{t.style.height="0px"})};return()=>N(N(W),{name:"expand",onEnter:l,onAfterEnter:i,onLeave:s},()=>{var t;return(t=a.default)==null?void 0:t.call(a)})}}),we=K(Se,[["__scopeId","data-v-c7a0f8a6"]]),$e={class:"nav-header"},Re=R({__name:"VerticalNav",props:{tag:{default:"aside"},navItems:{},isOverlayNavActive:{type:Boolean},toggleIsOverlayNavActive:{}},setup(C){const a=C,l=A(),i=ie(l);se(Q,i);const s=M(),t=p=>"heading"in p?Me:"children"in p?Le:ae,y=X();w(()=>y.name,()=>{a.toggleIsOverlayNavActive(!1)});const g=A(!1),m=p=>g.value=p,_=p=>{g.value=p.target.scrollTop>0},I=s.isVerticalNavMini(i);return(p,n)=>{const d=H("RouterLink");return o(),v(f(a.tag),{ref_key:"refNav",ref:l,class:j(["layout-vertical-nav",[{"overlay-nav":e(s).isLessThanOverlayNavBreakpoint,hovered:e(i),visible:p.isOverlayNavActive,scrolled:e(g)}]])},{default:u(()=>[$("div",$e,[D(p.$slots,"nav-header",{},()=>[h(d,{to:"/",class:"app-logo app-title-wrapper"},{default:u(()=>[h(e(Ae),{nodes:e(c).app.logo},null,8,["nodes"]),h(W,{name:"vertical-nav-app-title"},{default:u(()=>[k($("h1",{class:"app-logo-title leading-normal"},O(e(c).app.title),513),[[V,!e(I)]])]),_:1})]),_:1}),k((o(),v(f(e(c).app.iconRenderer||"div"),b({class:["header-action d-none nav-unpin",e(s).isVerticalNavCollapsed&&"d-lg-block"]},e(c).icons.verticalNavUnPinned,{onClick:n[0]||(n[0]=r=>e(s).isVerticalNavCollapsed=!e(s).isVerticalNavCollapsed)}),null,16,["class"])),[[V,e(s).isVerticalNavCollapsed]]),k((o(),v(f(e(c).app.iconRenderer||"div"),b({class:["header-action d-none nav-pin",!e(s).isVerticalNavCollapsed&&"d-lg-block"]},e(c).icons.verticalNavPinned,{onClick:n[1]||(n[1]=r=>e(s).isVerticalNavCollapsed=!e(s).isVerticalNavCollapsed)}),null,16,["class"])),[[V,!e(s).isVerticalNavCollapsed]]),(o(),v(f(e(c).app.iconRenderer||"div"),b({class:"header-action d-lg-none"},e(c).icons.close,{onClick:n[2]||(n[2]=r=>p.toggleIsOverlayNavActive(!1))}),null,16))],!0)]),D(p.$slots,"before-nav-items",{},()=>[n[3]||(n[3]=$("div",{class:"vertical-nav-items-shadow"},null,-1))],!0),D(p.$slots,"nav-items",{updateIsVerticalNavScrolled:m},()=>[(o(),v(e(Ve),{key:e(s).isAppRTL,tag:"ul",class:"nav-items",options:{wheelPropagation:!1},onPsScrollY:_},{default:u(()=>[(o(!0),P(Z,null,J(p.navItems,(r,E)=>(o(),v(f(t(r)),{key:E,item:r},null,8,["item"]))),128))]),_:1}))],!0)]),_:3},8,["class"])}}}),Oe=K(Re,[["__scopeId","data-v-3b5d6cab"]]),Te={class:"nav-group-children"},Le=R({name:"VerticalNavGroup",__name:"VerticalNavGroup",props:{item:{}},setup(C){const a=C,l=X(),i=oe(),s=M(),t=s.isVerticalNavMini(),y=le(Q,A(!1)),g=A(!1),m=A(!1),_=n=>n.some(d=>{let r=S.value.includes(d.title);return"children"in d&&(r=_(d.children)||r),r}),I=n=>{n.forEach(d=>{"children"in d&&I(d.children),S.value=S.value.filter(r=>r!==d.title)})};w(()=>l.path,()=>{const n=Y(a.item.children,i);m.value=n&&!s.isVerticalNavMini(y).value,g.value=n},{immediate:!0}),w(m,n=>{const d=S.value.indexOf(a.item.title);n&&d===-1?S.value.push(a.item.title):!n&&d!==-1&&(S.value.splice(d,1),I(a.item.children))},{immediate:!0}),w(S,n=>{if(n.at(-1)===a.item.title)return;const r=Y(a.item.children,i);r||_(a.item.children)||(m.value=r,g.value=r)},{deep:!0}),w(s.isVerticalNavMini(y),n=>{m.value=n?!1:g.value});const p=re();return(n,d)=>e(Ce)(n.item)?(o(),P("li",{key:0,class:j(["nav-group",[{active:e(g),open:e(m),disabled:n.item.disable}]])},[$("div",{class:"nav-group-label",onClick:d[0]||(d[0]=r=>m.value=!e(m))},[(o(),v(f(e(c).app.iconRenderer||"div"),b(n.item.icon||e(c).verticalNav.defaultNavItemIconProps,{class:"nav-item-icon"}),null,16)),(o(),v(f(e(p)?x:"div"),b({name:"transition-slide-x"},e(p)?void 0:{class:"d-flex align-center flex-grow-1"}),{default:u(()=>[k((o(),v(f(e(c).app.i18n.enable?"i18n-t":"span"),b(e(B)(n.item.title,"span"),{key:"title",class:"nav-item-title"}),{default:u(()=>[G(O(n.item.title),1)]),_:1},16)),[[V,!e(t)]]),n.item.badgeContent?k((o(),v(f(e(c).app.i18n.enable?"i18n-t":"span"),b({key:0},e(B)(n.item.badgeContent,"span"),{key:"badge",class:["nav-item-badge",n.item.badgeClass]}),{default:u(()=>[G(O(n.item.badgeContent),1)]),_:1},16,["class"])),[[V,!e(t)]]):T("",!0),k((o(),v(f(e(c).app.iconRenderer||"div"),b(e(c).icons.chevronRight,{key:"arrow",class:"nav-group-arrow"}),null,16)),[[V,!e(t)]])]),_:1},16))]),h(e(we),null,{default:u(()=>[k($("ul",Te,[(o(!0),P(Z,null,J(n.item.children,r=>(o(),v(f("children"in r?"VerticalNavGroup":e(ae)),{key:r.title,item:r},null,8,["item"]))),128))],512),[[V,e(m)]])]),_:1})],2)):T("",!0)}}),Pe=R({props:{navItems:{type:Array,required:!0},verticalNavAttrs:{type:Object,default:()=>({})}},setup(C,{slots:a}){const{width:l}=ce(),i=M(),s=A(!1),t=A(!1),y=ve(s);return ue(s,t),w(l,()=>{!i.isLessThanOverlayNavBreakpoint&&t.value&&(t.value=!1)}),()=>{var q,z,U;const g=pe(C,"verticalNavAttrs"),{wrapper:m,wrapperProps:_,...I}=g.value,p=N(Oe,{isOverlayNavActive:s.value,toggleIsOverlayNavActive:y,navItems:C.navItems,...I},{"nav-header":()=>{var L;return(L=a["vertical-nav-header"])==null?void 0:L.call(a)},"before-nav-items":()=>{var L;return(L=a["before-vertical-nav-items"])==null?void 0:L.call(a)}}),n=N("header",{class:["layout-navbar",{"navbar-blur":i.isNavbarBlurEnabled}]},[N("div",{class:"navbar-content-container"},(q=a.navbar)==null?void 0:q.call(a,{toggleVerticalOverlayNavActive:y}))]),d=N("main",{class:"layout-page-content"},N("div",{class:"page-content-container"},(z=a.default)==null?void 0:z.call(a))),r=N("footer",{class:"layout-footer"},[N("div",{class:"footer-content-container"},(U=a.footer)==null?void 0:U.call(a))]),E=N("div",{class:["layout-overlay",{visible:t.value}],onClick:()=>{t.value=!t.value}});return N("div",{class:["layout-wrapper",...i._layoutClasses]},[m?N(m,_,{default:()=>p}):p,N("div",{class:"layout-content-wrapper"},[n,d,r]),E])}}}),ae=R({__name:"VerticalNavLink",props:{item:{}},setup(C){const l=M().isVerticalNavMini();return(i,s)=>e(ee)(i.item.action,i.item.subject)?(o(),P("li",{key:0,class:j(["nav-link",{disabled:i.item.disable}])},[(o(),v(f(i.item.to?"RouterLink":"a"),b(e(me)(i.item),{class:{"router-link-active router-link-exact-active":e(de)(i.item,i.$router)}}),{default:u(()=>[(o(),v(f(e(c).app.iconRenderer||"div"),b(i.item.icon||e(c).verticalNav.defaultNavItemIconProps,{class:"nav-item-icon"}),null,16)),h(x,{name:"transition-slide-x"},{default:u(()=>[k((o(),v(f(e(c).app.i18n.enable?"i18n-t":"span"),b({key:"title",class:"nav-item-title"},e(B)(i.item.title,"span")),{default:u(()=>[G(O(i.item.title),1)]),_:1},16)),[[V,!e(l)]]),i.item.badgeContent?k((o(),v(f(e(c).app.i18n.enable?"i18n-t":"span"),b({key:"badge",class:["nav-item-badge",i.item.badgeClass]},e(B)(i.item.badgeContent,"span")),{default:u(()=>[G(O(i.item.badgeContent),1)]),_:1},16,["class"])),[[V,!e(l)]]):T("",!0)]),_:1})]),_:1},16,["class"]))],2)):T("",!0)}}),Be={key:0,class:"nav-section-title"},Ge={class:"title-wrapper"},Me=R({__name:"VerticalNavSectionTitle",props:{item:{}},setup(C){const l=M().isVerticalNavMini();return(i,s)=>e(ee)(i.item.action,i.item.subject)?(o(),P("li",Be,[$("div",Ge,[h(W,{name:"vertical-nav-section-title",mode:"out-in"},{default:u(()=>[(o(),v(f(e(l)?e(c).app.iconRenderer:e(c).app.i18n.enable?"i18n-t":"span"),b({key:e(l),class:e(l)?"placeholder-icon":"title-text"},{...e(c).icons.sectionTitlePlaceholder,...e(B)(i.item.heading,"span")}),{default:u(()=>[G(O(e(l)?null:i.item.heading),1)]),_:1},16,["class"]))]),_:1})])])):T("",!0)}}),{getMenuData:te}=fe(ge());console.log(te.value);const Ee=te,De={class:"d-flex h-100 align-center"},ia=R({__name:"DefaultLayoutWithVerticalNav",setup(C){const a=A(!1),l=A(null);return w([a,l],()=>{a.value&&l.value&&l.value.fallbackHandle(),!a.value&&l.value&&l.value.resolveHandle()},{immediate:!0}),(i,s)=>{const t=H("IconBtn"),y=ne,g=H("RouterView");return o(),v(e(Pe),{"nav-items":e(Ee)},{navbar:u(({toggleVerticalOverlayNavActive:m})=>{var _;return[$("div",De,[h(t,{id:"vertical-nav-toggle-btn",class:"ms-n3 d-lg-none",onClick:I=>m(!0)},{default:u(()=>[h(he,{size:"26",icon:"tabler-menu-2"})]),_:2},1032,["onClick"]),h(be),h(Ie),e(F).app.i18n.enable&&((_=e(F).app.i18n.langConfig)!=null&&_.length)?(o(),v(ke,{key:0,languages:e(F).app.i18n.langConfig},null,8,["languages"])):T("",!0),h(_e)])]}),footer:u(()=>[h(Ne)]),default:u(()=>[h(y,{ref_key:"refLoadingIndicator",ref:l},null,512),h(g,null,{default:u(({Component:m})=>[(o(),v(ye,{timeout:0,onFallback:s[0]||(s[0]=_=>a.value=!0),onResolve:s[1]||(s[1]=_=>a.value=!1)},{default:u(()=>[(o(),v(f(m)))]),_:2},1024))]),_:1})]),_:1},8,["nav-items"])}}});export{ia as default};