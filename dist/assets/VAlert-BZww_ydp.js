import{c as L}from"./VAvatar-BM2Dvdnc.js";import{ag as z,am as D,ah as $,bb as F,b3 as R,aU as j,an as p,bp as w,ao as E,ai as O,ap as M,bd as N,aj as U,aL as W,Z as o,aW as Y,be as Z,bf as q,b4 as G,aY as H,av as J,bt as K,ar as Q,at as X,a7 as ee,as as ae,b as t,bh as te,a8 as le,b1 as d,ad as ne,z as se}from"./index-C-RoIP79.js";const oe=L("v-alert-title"),re=["success","info","warning","error"],ie=z({border:{type:[Boolean,String],validator:e=>typeof e=="boolean"||["top","end","bottom","start"].includes(e)},borderColor:String,closable:Boolean,closeIcon:{type:D,default:"$close"},closeLabel:{type:String,default:"$vuetify.close"},icon:{type:[Boolean,String,Function,Object],default:null},modelValue:{type:Boolean,default:!0},prominent:Boolean,title:String,text:String,type:{type:String,validator:e=>re.includes(e)},...$(),...F(),...R(),...j(),...p(),...w(),...E(),...O(),...M(),...N({variant:"flat"})},"VAlert"),de=U()({name:"VAlert",props:ie(),emits:{"click:close":e=>!0,"update:modelValue":e=>!0},setup(e,v){let{emit:m,slots:a}=v;const r=W(e,"modelValue"),n=o(()=>{if(e.icon!==!1)return e.type?e.icon??`$${e.type}`:e.icon}),y=o(()=>({color:e.color??e.type,variant:e.variant})),{themeClasses:b}=Y(e),{colorClasses:f,colorStyles:k,variantClasses:P}=Z(y),{densityClasses:V}=q(e),{dimensionStyles:C}=G(e),{elevationClasses:g}=H(e),{locationStyles:x}=J(e),{positionClasses:S}=K(e),{roundedClasses:_}=Q(e),{textColorClasses:h,textColorStyles:B}=X(ee(e,"borderColor")),{t:T}=ae(),i=o(()=>({"aria-label":T(e.closeLabel),onClick(s){r.value=!1,m("click:close",s)}}));return()=>{const s=!!(a.prepend||n.value),A=!!(a.title||e.title),I=!!(a.close||e.closable);return r.value&&t(e.tag,{class:["v-alert",e.border&&{"v-alert--border":!!e.border,[`v-alert--border-${e.border===!0?"start":e.border}`]:!0},{"v-alert--prominent":e.prominent},b.value,f.value,V.value,g.value,S.value,_.value,P.value,e.class],style:[k.value,C.value,x.value,e.style],role:"alert"},{default:()=>{var c,u;return[te(!1,"v-alert"),e.border&&t("div",{key:"border",class:["v-alert__border",h.value],style:B.value},null),s&&t("div",{key:"prepend",class:"v-alert__prepend"},[a.prepend?t(d,{key:"prepend-defaults",disabled:!n.value,defaults:{VIcon:{density:e.density,icon:n.value,size:e.prominent?44:28}}},a.prepend):t(le,{key:"prepend-icon",density:e.density,icon:n.value,size:e.prominent?44:28},null)]),t("div",{class:"v-alert__content"},[A&&t(oe,{key:"title"},{default:()=>{var l;return[((l=a.title)==null?void 0:l.call(a))??e.title]}}),((c=a.text)==null?void 0:c.call(a))??e.text,(u=a.default)==null?void 0:u.call(a)]),a.append&&t("div",{key:"append",class:"v-alert__append"},[a.append()]),I&&t("div",{key:"close",class:"v-alert__close"},[a.close?t(d,{key:"close-defaults",defaults:{VBtn:{icon:e.closeIcon,size:"x-small",variant:"text"}}},{default:()=>{var l;return[(l=a.close)==null?void 0:l.call(a,{props:i.value})]}}):t(ne,se({key:"close-btn",icon:e.closeIcon,size:"x-small",variant:"text"},i.value),null)])]}})}}});export{de as V};