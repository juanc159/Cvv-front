import{a as N}from"./formatters-BW8ehdzv.js";import{_ as T}from"./SchoolData.vue_vue_type_style_index_0_lang-DvGTuaVT.js";import{S as w}from"./sweetalert2.esm.all-DOYwHpwi.js";import{d as L,ax as B,r as V,M as D,af as C,Z as E,o as s,g as c,f as a,q as $,b as t,e as n,D as v,k as r,C as h,ae as A,c as g,p as z,F as y,E as G,ad as P,G as S,$ as j,a0 as F}from"./index-Beckcyx0.js";import{o as R}from"./helpers-DpEV7f3y.js";import{V as M,a as k}from"./VRow-C5AQkx25.js";import{V as U}from"./VInput-DfRUPHc8.js";import{V as q}from"./VTextField-BOnq8RWc.js";import{V as O}from"./VCard-Dl-v77MZ.js";import{V as Z}from"./VGrid-BuZ444Te.js";import{V as H,a as J,b as K}from"./VList-mp1GnCW_.js";import{V as Q}from"./VAvatar-Dv33BZj0.js";import{V as W}from"./VImg-hrG_q8t5.js";import{V as X}from"./VDivider-BjwItKp1.js";import{V as Y}from"./VContainer-DrU1XUHi.js";import{_ as ee}from"./_plugin-vue_export-helper-DlAUqK2U.js";import"./front-page-footer-BvU6iHJG.js";import"./DialogCloseBtn.vue_vue_type_script_setup_true_lang-DfLnVt2Q.js";import"./VDialog-LwCmN1GJ.js";import"./VOverlay-CInLCweo.js";import"./forwardRefs-C-GTDzx5.js";import"./dialog-transition-DfVxIrSo.js";import"./VToolbar-CXuL326q.js";import"./ssrBoot-pwlHSkgy.js";import"./VMenu-FixnG40M.js";import"./constants-2GBt7OCP.js";const ae=d=>(j("data-v-36de5726"),d=d(),F(),d),te={class:"our-team"},oe={class:"headers d-flex justify-center flex-column align-center"},se={class:"d-flex align-center text-h3 mb-1 flex-wrap justify-center"},re={class:"position-relative me-2"},le={class:"section-title"},ie=ae(()=>n("p",{class:"text-center"}," LISTADO DE ESTUDIANTES: ",-1)),ne={key:1,class:"font-weight-medium"},de=L({__name:"GradeSectionNotes",setup(d){const p=$(),l=B({form:!1}),u=V([]),x=V();D(async()=>{l.form=!0;const o=await C(`pw-dataGradeSectionNotes/${p.params.school_id}/${p.params.grade_id}/${p.params.section_id}`).get();l.form=!1,o.data&&(u.value=o.data.value.students,x.value=o.data.value.title)});const m=V(""),b=E(()=>u.value.filter(i=>i.full_name.toLowerCase().includes(m.value.toLowerCase()))),I=async o=>{var _;const{value:i}=await w.fire({title:"Ingrese su documento de identidad (Ejem: 12345678)",input:"text",inputLabel:"Cédula",inputPlaceholder:"Ingrese su cédula",inputAttributes:{maxlength:"10",autocapitalize:"off",autocorrect:"off"}});if(i!=o.identity_document)return w.fire("No coincide el dato suministrado (Ejem: 12345678)"),!1;l.form=!0;const{data:e,response:f}=await C(`pw-pdfNote/${o.id}`).get();l.form=!1,(_=f.value)!=null&&_.ok&&e.value&&R(e.value.pdf)};return(o,i)=>(s(),c(T,null,{default:a(()=>[t(Y,{id:"team"},{default:a(()=>[n("div",te,[n("div",oe,[n("div",se,[n("div",re,[n("h3",le,v(r(x)),1)])]),ie]),t(M,null,{default:a(()=>[t(k,{cols:"6"},{default:a(()=>[t(U,null,{default:a(()=>[h("Nombre del estudiante:")]),_:1}),t(q,{clearable:"",placeholder:"Buscar...",modelValue:r(m),"onUpdate:modelValue":i[0]||(i[0]=e=>A(m)?m.value=e:null)},null,8,["modelValue"])]),_:1}),t(k,{cols:"12"},{default:a(()=>[t(O,{loading:r(l).form,disabled:r(l).form},{default:a(()=>[t(Z,null,{default:a(()=>[t(H,{lines:"two",border:""},{default:a(()=>[(s(!0),g(y,null,z(r(b),(e,f)=>(s(),g(y,{key:e.name},[t(J,null,{prepend:a(()=>[t(Q,{color:e.photo?"":"primary",class:G(e.photo?null:"v-avatar-light-bg primary--text"),variant:e.photo?void 0:"tonal",size:"80"},{default:a(()=>[e.photo?(s(),c(W,{key:0,src:e.photo},null,8,["src"])):(s(),g("span",ne,v(("avatarText"in o?o.avatarText:r(N))(e.full_name)),1))]),_:2},1032,["color","class","variant"])]),append:a(()=>[e.pdf?(s(),c(P,{key:0,onClick:_=>I(e)},{default:a(()=>[h(" Visualizar notas ")]),_:2},1032,["onClick"])):S("",!0)]),default:a(()=>[t(K,null,{default:a(()=>[h(v(e.full_name),1)]),_:2},1024)]),_:2},1024),f!==r(u).length-1?(s(),c(X,{key:0})):S("",!0)],64))),128))]),_:1})]),_:1})]),_:1},8,["loading","disabled"])]),_:1})]),_:1})])]),_:1})]),_:1}))}}),ze=ee(de,[["__scopeId","data-v-36de5726"]]);export{ze as default};