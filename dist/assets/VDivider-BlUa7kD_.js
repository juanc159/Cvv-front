import{ag as c,ah as u,ap as h,aj as m,aW as g,at as y,a7 as f,Z as _,aP as s,ak as b,b as r}from"./index-C-RoIP79.js";const k=c({color:String,inset:Boolean,length:[Number,String],opacity:[Number,String],thickness:[Number,String],vertical:Boolean,...u(),...h()},"VDivider"),S=m()({name:"VDivider",props:k(),setup(e,l){let{attrs:i,slots:a}=l;const{themeClasses:n}=g(e),{textColorClasses:o,textColorStyles:d}=y(f(e,"color")),v=_(()=>{const t={};return e.length&&(t[e.vertical?"height":"width"]=s(e.length)),e.thickness&&(t[e.vertical?"borderRightWidth":"borderTopWidth"]=s(e.thickness)),t});return b(()=>{const t=r("hr",{class:[{"v-divider":!0,"v-divider--inset":e.inset,"v-divider--vertical":e.vertical},n.value,o.value,e.class],style:[v.value,d.value,{"--v-border-opacity":e.opacity},e.style],"aria-orientation":!i.role||i.role==="separator"?e.vertical?"vertical":"horizontal":void 0,role:`${i.role||"separator"}`},null);return a.default?r("div",{class:["v-divider__wrapper",{"v-divider__wrapper--vertical":e.vertical,"v-divider__wrapper--inset":e.inset}]},[t,r("div",{class:"v-divider__content"},[a.default()]),t]):t}),{}}});export{S as V};