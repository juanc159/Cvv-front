import{ag as B,am as V,ah as h,an as P,ao as N,ai as x,ap as T,aj as R,aq as w,a7 as d,ar as _,as as L,at as A,au as I,av as M,ak as X,aw as Y,b as t,P as $,Q as j,z as u,a8 as q}from"./index-Bs2WbdAz.js";import{m as z,M as D}from"./VImg-BlPswqtp.js";const F=B({bordered:Boolean,color:String,content:[Number,String],dot:Boolean,floating:Boolean,icon:V,inline:Boolean,label:{type:String,default:"$vuetify.badge"},max:[Number,String],modelValue:{type:Boolean,default:!0},offsetX:[Number,String],offsetY:[Number,String],textColor:String,...h(),...P({location:"top end"}),...N(),...x(),...T(),...z({transition:"scale-rotate-transition"})},"VBadge"),E=R()({name:"VBadge",inheritAttrs:!1,props:F(),setup(a,o){const{backgroundColorClasses:c,backgroundColorStyles:g}=w(d(a,"color")),{roundedClasses:m}=_(a),{t:b}=L(),{textColorClasses:f,textColorStyles:v}=A(d(a,"textColor")),{themeClasses:C}=I(),{locationStyles:k}=M(a,!0,e=>(a.floating?a.dot?2:4:a.dot?8:12)+(["top","bottom"].includes(e)?+(a.offsetY??0):["left","right"].includes(e)?+(a.offsetX??0):0));return X(()=>{const e=Number(a.content),n=!a.max||isNaN(e)?a.content:e<=+a.max?e:`${a.max}+`,[y,S]=Y(o.attrs,["aria-atomic","aria-label","aria-live","role","title"]);return t(a.tag,u({class:["v-badge",{"v-badge--bordered":a.bordered,"v-badge--dot":a.dot,"v-badge--floating":a.floating,"v-badge--inline":a.inline},a.class]},S,{style:a.style}),{default:()=>{var s,l;return[t("div",{class:"v-badge__wrapper"},[(l=(s=o.slots).default)==null?void 0:l.call(s),t(D,{transition:a.transition},{default:()=>{var i,r;return[$(t("span",u({class:["v-badge__badge",C.value,c.value,m.value,f.value],style:[g.value,v.value,a.inline?{}:k.value],"aria-atomic":"true","aria-label":b(a.label,e),"aria-live":"polite",role:"status"},y),[a.dot?void 0:o.slots.badge?(r=(i=o.slots).badge)==null?void 0:r.call(i):a.icon?t(q,{icon:a.icon},null):n]),[[j,a.modelValue]])]}})])]}})}),{}}});export{E as V};