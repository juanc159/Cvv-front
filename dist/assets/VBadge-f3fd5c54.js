import{ag as m,ah as g,ai as b,aj as v,ak as f,b as o,al as N,am as L,an as A,ao as I,ap as T,aq as w,a5 as d,ar as R,as as _,at as $,au as X,av as Y,aw as j,ax as q,O as D,P as F,y as u,a6 as M}from"./index-77212f31.js";const O=m({start:Boolean,end:Boolean,...g(),...b()},"VListItemAction"),G=v()({name:"VListItemAction",props:O(),setup(a,t){let{slots:n}=t;return f(()=>o(a.tag,{class:["v-list-item-action",{"v-list-item-action--start":a.start,"v-list-item-action--end":a.end},a.class],style:a.style},n)),{}}});const z=m({bordered:Boolean,color:String,content:[Number,String],dot:Boolean,floating:Boolean,icon:N,inline:Boolean,label:{type:String,default:"$vuetify.badge"},max:[Number,String],modelValue:{type:Boolean,default:!0},offsetX:[Number,String],offsetY:[Number,String],textColor:String,...g(),...L({location:"top end"}),...A(),...b(),...I(),...T({transition:"scale-rotate-transition"})},"VBadge"),H=v()({name:"VBadge",inheritAttrs:!1,props:z(),setup(a,t){const{backgroundColorClasses:n,backgroundColorStyles:V}=w(d(a,"color")),{roundedClasses:y}=R(a),{t:C}=_(),{textColorClasses:k,textColorStyles:B}=$(d(a,"textColor")),{themeClasses:S}=X(),{locationStyles:P}=Y(a,!0,e=>(a.floating?a.dot?2:4:a.dot?8:12)+(["top","bottom"].includes(e)?+(a.offsetY??0):["left","right"].includes(e)?+(a.offsetX??0):0));return f(()=>{const e=Number(a.content),s=!a.max||isNaN(e)?a.content:e<=+a.max?e:`${a.max}+`,[h,x]=j(t.attrs,["aria-atomic","aria-label","aria-live","role","title"]);return o(a.tag,u({class:["v-badge",{"v-badge--bordered":a.bordered,"v-badge--dot":a.dot,"v-badge--floating":a.floating,"v-badge--inline":a.inline},a.class]},x,{style:a.style}),{default:()=>{var l,i;return[o("div",{class:"v-badge__wrapper"},[(i=(l=t.slots).default)==null?void 0:i.call(l),o(q,{transition:a.transition},{default:()=>{var r,c;return[D(o("span",u({class:["v-badge__badge",S.value,n.value,y.value,k.value],style:[V.value,B.value,a.inline?{}:P.value],"aria-atomic":"true","aria-label":C(a.label,e),"aria-live":"polite",role:"status"},h),[a.dot?void 0:t.slots.badge?(c=(r=t.slots).badge)==null?void 0:c.call(r):a.icon?o(M,{icon:a.icon},null):s]),[[F,a.modelValue]])]}})])]}})}),{}}});export{H as V,G as a};