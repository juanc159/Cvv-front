import{ag as j,ah as W,b3 as Z,aj as E,b4 as J,ak as $,b as a,Z as I,V as K,z as q,a3 as X,T as Y,b5 as D,ao as p,aq as ee,a7 as te,ar as ne,b6 as re,aB as h,r as ae,w as T,b7 as se,aF as ie,aI as le,P as N,b8 as oe,F as ue,aO as ce,Q as de}from"./index-7eoxc86Q.js";function ve(e){return{aspectStyles:I(()=>{const l=Number(e.aspectRatio);return l?{paddingBottom:String(1/l*100)+"%"}:void 0})}}const M=j({aspectRatio:[String,Number],contentClass:null,inline:Boolean,...W(),...Z()},"VResponsive"),U=E()({name:"VResponsive",props:M(),setup(e,l){let{slots:i}=l;const{aspectStyles:n}=ve(e),{dimensionStyles:d}=J(e);return $(()=>{var v;return a("div",{class:["v-responsive",{"v-responsive--inline":e.inline},e.class],style:[d.value,e.style]},[a("div",{class:"v-responsive__sizer",style:n.value},null),(v=i.additional)==null?void 0:v.call(i),i.default&&a("div",{class:["v-responsive__content",e.contentClass]},[i.default()])])}),{}}}),ge=j({transition:{type:[Boolean,String,Object],default:"fade-transition",validator:e=>e!==!0}},"transition"),z=(e,l)=>{let{slots:i}=l;const{transition:n,disabled:d,group:v,...f}=e,{component:g=v?X:Y,...b}=typeof n=="object"?n:{};return K(g,q(typeof n=="string"?{name:d?"":n}:b,typeof n=="string"?{}:Object.fromEntries(Object.entries({disabled:d,group:v}).filter(r=>{let[s,c]=r;return c!==void 0})),f),i)};function me(e,l){if(!D)return;const i=l.modifiers||{},n=l.value,{handler:d,options:v}=typeof n=="object"?n:{handler:n,options:{}},f=new IntersectionObserver(function(){var c;let g=arguments.length>0&&arguments[0]!==void 0?arguments[0]:[],b=arguments.length>1?arguments[1]:void 0;const r=(c=e._observe)==null?void 0:c[l.instance.$.uid];if(!r)return;const s=g.some(S=>S.isIntersecting);d&&(!i.quiet||r.init)&&(!i.once||s||r.init)&&d(s,g,b),s&&i.once?x(e,l):r.init=!0},v);e._observe=Object(e._observe),e._observe[l.instance.$.uid]={init:!1,observer:f},f.observe(e)}function x(e,l){var n;const i=(n=e._observe)==null?void 0:n[l.instance.$.uid];i&&(i.observer.unobserve(e),delete e._observe[l.instance.$.uid])}const fe={mounted:me,unmounted:x},be=j({alt:String,cover:Boolean,color:String,draggable:{type:[Boolean,String],default:void 0},eager:Boolean,gradient:String,lazySrc:String,options:{type:Object,default:()=>({root:void 0,rootMargin:void 0,threshold:void 0})},sizes:String,src:{type:[String,Object],default:""},crossorigin:String,referrerpolicy:String,srcset:String,position:String,...M(),...W(),...p(),...ge()},"VImg"),_e=E()({name:"VImg",directives:{intersect:fe},props:be(),emits:{loadstart:e=>!0,load:e=>!0,error:e=>!0},setup(e,l){let{emit:i,slots:n}=l;const{backgroundColorClasses:d,backgroundColorStyles:v}=ee(te(e,"color")),{roundedClasses:f}=ne(e),g=re("VImg"),b=h(""),r=ae(),s=h(e.eager?"loading":"idle"),c=h(),S=h(),u=I(()=>e.src&&typeof e.src=="object"?{src:e.src.src,srcset:e.srcset||e.src.srcset,lazySrc:e.lazySrc||e.src.lazySrc,aspect:Number(e.aspectRatio||e.src.aspect||0)}:{src:e.src,srcset:e.srcset,lazySrc:e.lazySrc,aspect:Number(e.aspectRatio||0)}),_=I(()=>u.value.aspect||c.value/S.value||0);T(()=>e.src,()=>{R(s.value!=="idle")}),T(_,(t,o)=>{!t&&o&&r.value&&y(r.value)}),se(()=>R());function R(t){if(!(e.eager&&t)&&!(D&&!t&&!e.eager)){if(s.value="loading",u.value.lazySrc){const o=new Image;o.src=u.value.lazySrc,y(o,null)}u.value.src&&ie(()=>{var o;i("loadstart",((o=r.value)==null?void 0:o.currentSrc)||u.value.src),setTimeout(()=>{var m;if(!g.isUnmounted)if((m=r.value)!=null&&m.complete){if(r.value.naturalWidth||w(),s.value==="error")return;_.value||y(r.value,null),s.value==="loading"&&k()}else _.value||y(r.value),C()})})}}function k(){var t;g.isUnmounted||(C(),y(r.value),s.value="loaded",i("load",((t=r.value)==null?void 0:t.currentSrc)||u.value.src))}function w(){var t;g.isUnmounted||(s.value="error",i("error",((t=r.value)==null?void 0:t.currentSrc)||u.value.src))}function C(){const t=r.value;t&&(b.value=t.currentSrc||t.src)}let P=-1;le(()=>{clearTimeout(P)});function y(t){let o=arguments.length>1&&arguments[1]!==void 0?arguments[1]:100;const m=()=>{if(clearTimeout(P),g.isUnmounted)return;const{naturalHeight:O,naturalWidth:F}=t;O||F?(c.value=F,S.value=O):!t.complete&&s.value==="loading"&&o!=null?P=window.setTimeout(m,o):(t.currentSrc.endsWith(".svg")||t.currentSrc.startsWith("data:image/svg+xml"))&&(c.value=1,S.value=1)};m()}const V=I(()=>({"v-img__img--cover":e.cover,"v-img__img--contain":!e.cover})),A=()=>{var m;if(!u.value.src||s.value==="idle")return null;const t=a("img",{class:["v-img__img",V.value],style:{objectPosition:e.position},src:u.value.src,srcset:u.value.srcset,alt:e.alt,crossorigin:e.crossorigin,referrerpolicy:e.referrerpolicy,draggable:e.draggable,sizes:e.sizes,ref:r,onLoad:k,onError:w},null),o=(m=n.sources)==null?void 0:m.call(n);return a(z,{transition:e.transition,appear:!0},{default:()=>[N(o?a("picture",{class:"v-img__picture"},[o,t]):t,[[de,s.value==="loaded"]])]})},H=()=>a(z,{transition:e.transition},{default:()=>[u.value.lazySrc&&s.value!=="loaded"&&a("img",{class:["v-img__img","v-img__img--preload",V.value],style:{objectPosition:e.position},src:u.value.lazySrc,alt:e.alt,crossorigin:e.crossorigin,referrerpolicy:e.referrerpolicy,draggable:e.draggable},null)]}),L=()=>n.placeholder?a(z,{transition:e.transition,appear:!0},{default:()=>[(s.value==="loading"||s.value==="error"&&!n.error)&&a("div",{class:"v-img__placeholder"},[n.placeholder()])]}):null,G=()=>n.error?a(z,{transition:e.transition,appear:!0},{default:()=>[s.value==="error"&&a("div",{class:"v-img__error"},[n.error()])]}):null,Q=()=>e.gradient?a("div",{class:"v-img__gradient",style:{backgroundImage:`linear-gradient(${e.gradient})`}},null):null,B=h(!1);{const t=T(_,o=>{o&&(requestAnimationFrame(()=>{requestAnimationFrame(()=>{B.value=!0})}),t())})}return $(()=>{const t=U.filterProps(e);return N(a(U,q({class:["v-img",{"v-img--booting":!B.value},d.value,f.value,e.class],style:[{width:ce(e.width==="auto"?c.value:e.width)},v.value,e.style]},t,{aspectRatio:_.value,"aria-label":e.alt,role:e.alt?"img":void 0}),{additional:()=>a(ue,null,[a(A,null,null),a(H,null,null),a(Q,null,null),a(L,null,null),a(G,null,null)]),default:n.default}),[[oe("intersect"),{handler:R,options:e.options},null,{once:!0}]])}),{currentSrc:b,image:r,state:s,naturalWidth:c,naturalHeight:S}}});export{fe as I,z as M,_e as V,ge as m};