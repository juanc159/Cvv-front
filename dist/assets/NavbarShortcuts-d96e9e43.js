import{P as g}from"./vue3-perfect-scrollbar.esm-3c2936d4.js";import{d as _,q as h,a as V,o as n,g as l,f as e,b as t,a6 as r,B as x,k as m,c as C,F as v,m as y,D as S,e as p,C as d}from"./index-aa5d3caf.js";import{V as k}from"./VMenu-129fda55.js";import{V as B,a as I,b as A}from"./VCard-7e854c2d.js";import{V as w}from"./VDivider-6e8c4f39.js";import{V as D}from"./VRow-ef83ed33.js";import{V as M}from"./VCol-f3c848ea.js";import{V as N}from"./VAvatar-31d2b53a.js";import"./dialog-transition-19068789.js";import"./VCardText-3a66a74a.js";import"./VImg-82190d0d.js";/* empty css              */const P={class:"text-base font-weight-medium mt-2 mb-0"},z={class:"text-sm"},R=_({__name:"Shortcuts",props:{togglerIcon:{default:"tabler-layout-grid-add"},shortcuts:{}},setup(i){const o=i,c=h();return(f,s)=>{const u=V("IconBtn");return n(),l(u,null,{default:e(()=>[t(r,{size:"26",icon:o.togglerIcon},null,8,["icon"]),t(k,{activator:"parent",offset:"14px",location:"bottom end"},{default:e(()=>[t(B,{width:"340","max-height":"560",class:"d-flex flex-column"},{default:e(()=>[t(I,{class:"py-4"},{append:e(()=>[t(u,null,{default:e(()=>[t(r,{icon:"tabler-layout-grid-add"})]),_:1})]),default:e(()=>[t(A,null,{default:e(()=>s[0]||(s[0]=[x("Shortcuts")])),_:1})]),_:1}),t(w),t(m(g),{options:{wheelPropagation:!1}},{default:e(()=>[t(D,{class:"ma-0 mt-n1"},{default:e(()=>[(n(!0),C(v,null,y(o.shortcuts,(a,b)=>(n(),l(M,{key:a.title,cols:"6",class:S(["text-center border-t cursor-pointer pa-4 shortcut-icon",(b+1)%2?"border-e":""]),onClick:$=>m(c).push(a.to)},{default:e(()=>[t(N,{variant:"tonal",size:"48"},{default:e(()=>[t(r,{icon:a.icon},null,8,["icon"])]),_:2},1024),p("h6",P,d(a.title),1),p("span",z,d(a.subtitle),1)]),_:2},1032,["class","onClick"]))),128))]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}}});const Q=_({__name:"NavbarShortcuts",setup(i){const o=[{icon:"tabler-calendar",title:"Calendar",subtitle:"Appointments",to:{name:"apps-calendar"}},{icon:"tabler-file",title:"Invoice App",subtitle:"Manage Accounts",to:{name:"apps-invoice-list"}},{icon:"tabler-user",title:"Users",subtitle:"Manage Users",to:{name:"apps-user-list"}},{icon:"tabler-lock",title:"Role Management",subtitle:"Permission",to:{name:"apps-roles"}},{icon:"tabler-layout-dashboard",title:"Dashboard",subtitle:"Dashboard Analytics",to:{name:"dashboards-analytics"}},{icon:"tabler-settings",title:"Settings",subtitle:"Account Settings",to:{name:"pages-account-settings-tab",params:{tab:"account"}}}];return(c,f)=>{const s=R;return n(),l(s,{shortcuts:o})}}});export{Q as default};