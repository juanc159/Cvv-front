import{_ as u}from"./TableFull.vue_vue_type_script_setup_true_lang-CX6rMgc_.js";import{d,U as f,r,o as _,c as y,b as t,f as e,e as n,ad as b,C as k,k as V,al as h}from"./index-Bs2WbdAz.js";import{b as g,V as w}from"./VCard-BspOpUsK.js";import{V as x}from"./VCardText-zYKdyQs7.js";import"./ModalQuestion.vue_vue_type_script_setup_true_lang-BpEs5OdO.js";import"./DialogCloseBtn.vue_vue_type_script_setup_true_lang-CL7iUoQP.js";import"./VDialog-BgUnOFX0.js";import"./VOverlay-ANg0gJBd.js";import"./VImg-BlPswqtp.js";import"./forwardRefs-C-GTDzx5.js";import"./dialog-transition-BJdMOtFa.js";import"./VField-Cn8Kq-0i.js";import"./VInput-C3OcKGmU.js";import"./VTooltip-0ZM8oGUy.js";import"./AppSelect.vue_vue_type_script_setup_true_lang-D0Cd77lf.js";import"./VSelect-DNsSpSEv.js";import"./VTextField-BiVPh_BE.js";import"./VList-D47dpQDl.js";import"./ssrBoot-C7Rswu4D.js";import"./VAvatar-DZ-0fdCL.js";import"./VDivider-ClP2ZRkO.js";import"./VMenu-Dy9jsiMP.js";import"./VCheckboxBtn-CUuSqgJb.js";import"./VSelectionControl-B2jVeEAq.js";import"./VChip-DH3Tddx8.js";import"./VRow-ysiYWnAR.js";/* empty css              */import"./AppTextField.vue_vue_type_script_setup_true_lang-CDsRSVsM.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./helpers-DMPihPy4.js";import"./constants-2GBt7OCP.js";import"./VAlert-B3NTcGhi.js";import"./createUrl-cDKNZYk4.js";import"./index-0F-JFElI.js";import"./VContainer-BiaKKa3x.js";import"./VDataTable-C_DhMFop.js";import"./VSkeletonLoader-D-ODeh2i.js";import"./VCheckbox-CYTM7pzL.js";const C=n("span",null," Materias ",-1),T={class:"d-flex justify-end gap-3 flex-wrap"},ut=d({__name:"List",setup(F){const s=f(),i=(o={action:"create",id:null})=>{h.push({name:"Subject-Form",params:{action:o.action,id:o.id}})},l=r(),p={url:"/subject/list",params:{company_id:s.company.id},headers:[{key:"type_education_name",title:"Tipo de educación",sortable:!1},{key:"name",title:"Nombre",sortable:!1},{key:"code",title:"Código",sortable:!1},{key:"actions",title:"Acciones",sortable:!1}],actions:{changeStatus:{url:"/subject/changeStatus"},view:{show:!1},delete:{url:"/subject/delete"}}},m=r({inputGeneral:{relationsGeneral:{all:["name","code"],typeEducation:["name"]}},dialog:{width:500,inputs:[{input_type:"selectInfinite",title:"Tipo de educación",key:"typeEducation",relation:"typeEducation",relation_key:"type_education_id",multiple:!0,api:"selectInifiniteTypeEducation"}]}});return(o,a)=>{const c=u;return _(),y("div",null,[t(w,null,{default:e(()=>[t(g,{class:"d-flex justify-space-between"},{default:e(()=>[C,n("div",T,[t(b,{onClick:a[0]||(a[0]=j=>i())},{default:e(()=>[k(" Agregar materia ")]),_:1})])]),_:1}),t(x,{class:"mt-2"},{default:e(()=>[t(c,{ref_key:"tableFull",ref:l,optionsTable:p,optionsFilter:V(m),onGoView:i},null,8,["optionsFilter"])]),_:1})]),_:1})])}}});export{ut as default};