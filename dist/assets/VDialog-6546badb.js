import{ag as P,bl as y,aj as D,aG as h,b1 as S,r as w,bA as x,w as f,ab as B,y as v,ak as F,bm as m,b as g,bn as I,bo as R,b6 as T,br as A}from"./index-77212f31.js";import{V as O}from"./dialog-transition-4887f6bb.js";const k=P({fullscreen:Boolean,retainFocus:{type:Boolean,default:!0},scrollable:Boolean,...y({origin:"center center",scrollStrategy:"block",transition:{component:O},zIndex:2400})},"VDialog"),N=D()({name:"VDialog",props:k(),emits:{"update:modelValue":a=>!0},setup(a,b){let{slots:c}=b;const n=h(a,"modelValue"),{scopeId:p}=S(),o=w();function i(l){var r,s;const e=l.relatedTarget,t=l.target;if(e!==t&&((r=o.value)!=null&&r.contentEl)&&((s=o.value)!=null&&s.globalTop)&&![document,o.value.contentEl].includes(t)&&!o.value.contentEl.contains(t)){const u=A(o.value.contentEl);if(!u.length)return;const d=u[0],E=u[u.length-1];e===d?E.focus():d.focus()}}x&&f(()=>n.value&&a.retainFocus,l=>{l?document.addEventListener("focusin",i):document.removeEventListener("focusin",i)},{immediate:!0}),f(n,async l=>{var e,t;await T(),l?(e=o.value.contentEl)==null||e.focus({preventScroll:!0}):(t=o.value.activatorEl)==null||t.focus({preventScroll:!0})});const V=B(()=>v({"aria-haspopup":"dialog","aria-expanded":String(n.value)},a.activatorProps));return F(()=>{const[l]=m.filterProps(a);return g(m,v({ref:o,class:["v-dialog",{"v-dialog--fullscreen":a.fullscreen,"v-dialog--scrollable":a.scrollable},a.class],style:a.style},l,{modelValue:n.value,"onUpdate:modelValue":e=>n.value=e,"aria-modal":"true",activatorProps:V.value,role:"dialog"},p),{activator:c.activator,default:function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];return g(I,{root:"VDialog"},{default:()=>{var s;return[(s=c.default)==null?void 0:s.call(c,...t)]}})}})}),R({},o)}});export{N as V};