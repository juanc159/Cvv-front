import{C as h}from"./vue3-perfect-scrollbar-b-F0S3T7.js";import{d as _,t as g,a as V,o,g as r,f as e,b as t,a8 as n,k as d,c as v,F as x,p as C,E as y,e as i,D as f}from"./index-BVvdxTMg.js";import{V as k}from"./VMenu-B5OB3Xn1.js";import{V as w,a as A}from"./VCard-DtrWcyGV.js";import{V as I}from"./VDivider-Dp-PmhlA.js";import{V as S,a as B}from"./VRow-HGD8rSc_.js";import{V as D}from"./VAvatar-T8kTWVsF.js";import"./VOverlay-DTsboUuv.js";import"./VImg-C6lUpkie.js";import"./forwardRefs-C-GTDzx5.js";import"./dialog-transition-B1R0JLT2.js";import"./VGrid-B0igNbSt.js";const z=i("h6",{class:"text-base font-weight-medium"}," Shortcuts ",-1),M={class:"text-base font-weight-medium mt-3 mb-0"},N={class:"text-sm mb-0"},R=_({__name:"Shortcuts",props:{togglerIcon:{default:"tabler-layout-grid-add"},shortcuts:{}},setup(l){const s=l,c=g();return(m,p)=>{const u=V("IconBtn");return o(),r(u,null,{default:e(()=>[t(n,{icon:s.togglerIcon},null,8,["icon"]),t(k,{activator:"parent",offset:"12px",location:"bottom end"},{default:e(()=>[t(w,{width:m.$vuetify.display.smAndDown?330:380,"max-height":"560",class:"d-flex flex-column"},{default:e(()=>[t(A,{class:"py-3"},{append:e(()=>[t(u,{size:"small",color:"high-emphasis"},{default:e(()=>[t(n,{size:"20",icon:"tabler-plus"})]),_:1})]),default:e(()=>[z]),_:1}),t(I),t(d(h),{options:{wheelPropagation:!1}},{default:e(()=>[t(S,{class:"ma-0 mt-n1"},{default:e(()=>[(o(!0),v(x,null,C(s.shortcuts,(a,b)=>(o(),r(B,{key:a.title,cols:"6",class:y(["text-center border-t cursor-pointer pa-6 shortcut-icon",(b+1)%2?"border-e":""]),onClick:$=>d(c).push(a.to)},{default:e(()=>[t(D,{variant:"tonal",size:"50"},{default:e(()=>[t(n,{size:"26",color:"high-emphasis",icon:a.icon},null,8,["icon"])]),_:2},1024),i("h6",M,f(a.title),1),i("p",N,f(a.subtitle),1)]),_:2},1032,["class","onClick"]))),128))]),_:1})]),_:1})]),_:1},8,["width"])]),_:1})]),_:1})}}}),Q=_({__name:"NavbarShortcuts",setup(l){const s=[{icon:"tabler-calendar",title:"Calendar",subtitle:"Appointments",to:{name:"apps-calendar"}},{icon:"tabler-file-dollar",title:"Invoice App",subtitle:"Manage Accounts",to:{name:"apps-invoice-list"}},{icon:"tabler-user",title:"Users",subtitle:"Manage Users",to:{name:"apps-user-list"}},{icon:"tabler-users",title:"Role Management",subtitle:"Permission",to:{name:"apps-roles"}},{icon:"tabler-device-desktop-analytics",title:"Dashboard",subtitle:"Dashboard Analytics",to:{name:"dashboards-analytics"}},{icon:"tabler-settings",title:"Settings",subtitle:"Account Settings",to:{name:"pages-account-settings-tab",params:{tab:"account"}}}];return(c,m)=>{const p=R;return o(),r(p,{shortcuts:s})}}});export{Q as default};