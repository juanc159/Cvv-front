import{d as k,r as A,b1 as D,o as s,c as o,b as e,f as a,e as t,a6 as u,F as f,m,k as p,af as j,C as c,V as z}from"./index-ba2685b5.js";import{V as B}from"./VRow-3431edda.js";import{V as v}from"./VCol-b72a8398.js";import{V as h,a as I}from"./VCard-1dca3b92.js";import{V as y}from"./VAvatar-ade85f75.js";import{V}from"./VCardText-27ca00f5.js";import{V as L}from"./VContainer-1d646a20.js";import{V as M}from"./VDivider-c2c0a35b.js";/* empty css              */import"./VImg-2b1475bc.js";const N={style:{"background-color":"rgb(var(--v-theme-surface))","border-radius":"3.75rem 3.75rem 0 0"}},T={class:"contact-us-section"},F={class:"mb-15"},H={class:"contact-card h-100"},R={class:"d-flex justify-center"},S={class:"d-flex justify-space-between flex-wrap gap-y-4"},q={class:"font-weight-medium text-high-emphasis"},E={key:0,style:{"list-style-type":"none"}},G={key:1},J=["innerHTML"],K=k({__name:"ContactArea",props:{school_id:{type:[Number,String],required:!0}},async setup(x){let n,i;const g=x,l=A({}),{data:d,response:O}=([n,i]=D(()=>j("pw-contactData/"+g.school_id).get()),n=await n,i(),n);return d.value.code==200&&(l.value=d.value.contactData),(P,_)=>(s(),o("div",N,[e(L,{id:"contact-us"},{default:a(()=>[t("div",T,[_[0]||(_[0]=t("div",{class:"headers d-flex justify-center flex-column align-center py-12"},[t("div",{class:"d-flex align-center text-h3 mb-1 flex-wrap justify-center"},[t("div",{class:"position-relative me-2"},[t("h3",{class:"section-title"},"Contactanos")])])],-1)),t("div",F,[e(B,{class:"match-height"},{default:a(()=>[e(v,{cols:"12",md:"4"},{default:a(()=>[t("div",H,[e(h,{variant:"outlined",border:"",class:"pa-2",style:{borderRadius:"3.75rem 0.375rem 0.375rem 0.375rem"}},{default:a(()=>[t("div",R,[e(y,{color:"primary",variant:"tonal",size:"170"},{default:a(()=>[e(u,{icon:"tabler-school",size:"100"})]),_:1})]),e(V,null,{default:a(()=>[t("div",S,[(s(!0),o(f,null,m(p(l).details,(r,b)=>(s(),o("div",{key:b,class:"w-100 d-flex gap-x-3 align-center"},[t("div",null,[e(y,{size:"36",color:r.color,variant:"tonal",class:"rounded-sm"},{default:a(()=>[e(u,{icon:r.icon,size:"24"},null,8,["icon"])]),_:2},1032,["color"])]),t("div",null,[t("b",null,c(r.type_detail_name),1),e(M),t("div",q,[Array.isArray(r.content)?(s(),o("ul",E,[(s(!0),o(f,null,m(r.content,(C,w)=>(s(),o("li",{key:w},c(C),1))),128))])):(s(),o("span",G,c(r.content),1))])])]))),128))])]),_:1})]),_:1})])]),_:1}),e(v,{cols:"12",md:"8"},{default:a(()=>[e(h,{flat:""},{default:a(()=>[e(I,{class:"pb-0"}),e(V,null,{default:a(()=>[t("div",{innerHTML:p(l).iframeGoogleMap},null,8,J)]),_:1})]),_:1})]),_:1})]),_:1})])])]),_:1})]))}});const se=z(K,[["__scopeId","data-v-25662868"]]);export{se as default};