import{s as B}from"./helpers-DMPihPy4.js";import{d as y,r as C,aH as I,k as i,o as l,g as d,f as t,b as c,c as b,p as x,F as g,G as V,$ as N,a0 as T,e,af as D,D as p,al as O,O as $,ae as j,C as P,Z as U,q as W}from"./index-Bs2WbdAz.js";import{V as q,a as z}from"./VRow-ysiYWnAR.js";import{V as S}from"./VContainer-BiaKKa3x.js";import{V as G}from"./VAvatar-DZ-0fdCL.js";import{V as A}from"./VImg-BlPswqtp.js";import{_ as R}from"./_plugin-vue_export-helper-DlAUqK2U.js";import{V as H}from"./VCard-BspOpUsK.js";import{V as E}from"./VCardText-zYKdyQs7.js";import{V as L,a as Z,b as J,c as K}from"./VTabs-BFeWpG1G.js";import{V as M}from"./VChip-DH3Tddx8.js";import{_ as Q}from"./SchoolData.vue_vue_type_style_index_0_lang-CC8ZBI2G.js";import X from"./ContactArea-CQNUyxoq.js";import"./constants-2GBt7OCP.js";/* empty css              */import"./forwardRefs-C-GTDzx5.js";import"./VOverlay-ANg0gJBd.js";import"./ssrBoot-C7Rswu4D.js";import"./front-page-footer-SnhHL_xf.js";import"./DialogCloseBtn.vue_vue_type_script_setup_true_lang-CL7iUoQP.js";import"./VToolbar-0se5OrAH.js";import"./VDialog-BgUnOFX0.js";import"./dialog-transition-BJdMOtFa.js";import"./VMenu-Dy9jsiMP.js";import"./VDivider-ClP2ZRkO.js";const Y=a=>(N("data-v-4e9c079c"),a=a(),T(),a),ee=Y(()=>e("div",{class:"our-team"},[e("div",{class:"headers d-flex justify-center flex-column align-center"},[e("div",{class:"d-flex align-center text-h3 mb-1 flex-wrap justify-center"},[e("div",{class:"position-relative me-2"},[e("h3",{class:"section-title text-center"}," Servicios adicionales o complementarios ")])]),e("p",{class:"text-center"}," Además de sus servicios educativos obligatorios, el aprendizaje de danza latinoamericana, música... ")])],-1)),te={class:"activity"},se={class:"mt-1"},ae=y({__name:"Services",props:{school_id:{type:[Number,String],required:!0}},async setup(a){let o,n;const m=a,s=C([]),{data:_,response:F}=([o,n]=I(()=>D("pw-services/"+m.school_id).get()),o=await o,n(),o);_.value.code==200&&(s.value=_.value.services);const u=h=>{O.push({name:"Pw-ServiceData",params:{service_id:h,school_id:m.school_id}})};return(h,f)=>i(s).length>0?(l(),d(S,{key:0,id:"team"},{default:t(()=>[ee,c(q,null,{default:t(()=>[(l(!0),b(g,null,x(i(s),(r,v)=>(l(),d(z,{key:v,cols:"12",md:"4",class:"d-flex justify-space-around w-100"},{default:t(()=>[e("div",te,[r.image?(l(),d(G,{key:0,color:"primary",variant:"tonal",size:"170",onClick:w=>u(r.id)},{default:t(()=>[c(A,{src:("storageBack"in h?h.storageBack:i(B))(r.image)},null,8,["src"])]),_:2},1032,["onClick"])):V("",!0),e("h3",se,p(r.title),1)])]),_:2},1024))),128))]),_:1})]),_:1})):V("",!0)}}),oe=R(ae,[["__scopeId","data-v-4e9c079c"]]),k=a=>(N("data-v-4ef5e960"),a=a(),T(),a),re={class:"our-team"},le={class:"text-center"},ce={class:"text-h3"},ne=k(()=>e("br",null,null,-1)),ie={h5:"",class:"text-h5"},de=k(()=>e("br",null,null,-1)),ue={class:"text-body-1"},pe=k(()=>e("br",null,null,-1)),_e={class:"text-body-1"},me=k(()=>e("br",null,null,-1)),he={class:"text-body-1"},fe=y({__name:"TeacherData",props:{teachers:{type:Object,required:!0}},setup(a){const o=a;return(n,m)=>o.teachers?(l(),d(S,{key:0,id:"team"},{default:t(()=>[e("div",re,[c(q,null,{default:t(()=>[(l(!0),b(g,null,x(o.teachers,(s,_)=>(l(),d(z,{key:_,cols:"12",lg:"3",sm:"6"},{default:t(()=>[c(H,{flat:"","min-width":"262",class:"position-relative overflow-visible team-card mb-12"},{default:t(()=>[e("div",{style:$({maxHeight:"185px",minHeight:"185px",borderRadius:"90px 20px 0 0",backgroundColor:`${s.backgroundColor}`})},[c(A,{src:("storageBack"in n?n.storageBack:i(B))(s.photo),height:"240",class:"team-image"},null,8,["src"])],4),c(E,{class:"text-center pa-4",style:$({border:`1px solid ${s.backgroundColor}`,borderBlockStart:"none",borderRadius:"0 0 6px 6px",boxSizing:"border-box"})},{default:t(()=>[e("div",le,[e("span",ce,p(s.subject_name),1),ne,e("span",ie,p(s.fullName),1),de,e("span",ue,p(s.jobPosition),1),pe,e("span",_e,p(s.email),1),me,e("span",he,p(s.phone),1)])]),_:2},1032,["style"])]),_:2},1024)]),_:2},1024))),128))]),_:1})])]),_:1})):V("",!0)}}),ve=R(fe,[["__scopeId","data-v-4ef5e960"]]),be=e("div",{class:"our-team"},[e("div",{class:"headers d-flex justify-center flex-column align-center"},[e("div",{class:"d-flex align-center text-h3 mb-1 flex-wrap justify-center"},[e("div",{class:"position-relative me-2"},[e("h3",{class:"section-title text-center"}," Nuestro gran equipo docentes ")])]),e("p",{class:"text-center"}," Educadores comprometidos con el éxito de tus hijos ")])],-1),xe={style:{"background-color":"rgb(var(--v-theme-surface))"}},ge=y({__name:"Teachers",props:{school_id:{type:[Number,String],required:!0}},async setup(a){let o,n;const m=a,s=C([]),{data:_,response:F}=([o,n]=I(()=>D("pw-teachers/"+m.school_id).get()),o=await o,n(),o);_.value.code==200&&(s.value=_.value.tabsData);const u=C();return(h,f)=>(l(),d(S,{id:"team"},{default:t(()=>[be,c(H,null,{default:t(()=>[c(L,{"next-icon":"tabler-arrow-right","prev-icon":"tabler-arrow-left",modelValue:i(u),"onUpdate:modelValue":f[0]||(f[0]=r=>j(u)?u.value=r:null),grow:"",stacked:"","fixed-tabs":"","show-arrows":""},{default:t(()=>[(l(!0),b(g,null,x(i(s),(r,v)=>(l(),d(J,{key:v},{default:t(()=>[c(M,{class:"ma-2",label:""},{default:t(()=>[e("span",null,p(r.number_records),1)]),_:2},1024),P(" "+p(r.title),1)]),_:2},1024))),128))]),_:1},8,["modelValue"]),c(E,null,{default:t(()=>[c(Z,{modelValue:i(u),"onUpdate:modelValue":f[1]||(f[1]=r=>j(u)?u.value=r:null)},{default:t(()=>[(l(!0),b(g,null,x(i(s),(r,v)=>(l(),d(K,{key:v},{default:t(()=>{var w;return[e("div",xe,[((w=r.data)==null?void 0:w.length)>0?(l(),d(ve,{key:0,teachers:r.data},null,8,["teachers"])):V("",!0)])]}),_:2},1024))),128))]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1}))}}),Le=y({__name:"School",setup(a){const o=W(),n=U(()=>o.params.school_id);return(m,s)=>(l(),d(Q,null,{default:t(()=>[c(oe,{class:"mt-6",school_id:i(n)},null,8,["school_id"]),c(ge,{class:"mt-6",school_id:i(n)},null,8,["school_id"]),c(X,{class:"mt-6",school_id:i(n)},null,8,["school_id"])]),_:1}))}});export{Le as default};