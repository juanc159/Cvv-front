import{_}from"./TableFull.vue_vue_type_script_setup_true_lang-CX6rMgc_.js";import{_ as b}from"./ModalForm.vue_vue_type_script_setup_true_lang-BBAvx2Z_.js";import{d as h,U as y,R as k,r as a,o as V,c as v,b as e,f as t,e as s,ad as x,C as F,k as w}from"./index-Bs2WbdAz.js";import{b as C,V as T}from"./VCard-BspOpUsK.js";import{V as g}from"./VCardText-zYKdyQs7.js";import"./ModalQuestion.vue_vue_type_script_setup_true_lang-BpEs5OdO.js";import"./DialogCloseBtn.vue_vue_type_script_setup_true_lang-CL7iUoQP.js";import"./VDialog-BgUnOFX0.js";import"./VOverlay-ANg0gJBd.js";import"./VImg-BlPswqtp.js";import"./forwardRefs-C-GTDzx5.js";import"./dialog-transition-BJdMOtFa.js";import"./VField-Cn8Kq-0i.js";import"./VInput-C3OcKGmU.js";import"./VTooltip-0ZM8oGUy.js";import"./AppSelect.vue_vue_type_script_setup_true_lang-D0Cd77lf.js";import"./VSelect-DNsSpSEv.js";import"./VTextField-BiVPh_BE.js";import"./VList-D47dpQDl.js";import"./ssrBoot-C7Rswu4D.js";import"./VAvatar-DZ-0fdCL.js";import"./VDivider-ClP2ZRkO.js";import"./VMenu-Dy9jsiMP.js";import"./VCheckboxBtn-CUuSqgJb.js";import"./VSelectionControl-B2jVeEAq.js";import"./VChip-DH3Tddx8.js";import"./VRow-ysiYWnAR.js";/* empty css              */import"./AppTextField.vue_vue_type_script_setup_true_lang-CDsRSVsM.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./helpers-DMPihPy4.js";import"./constants-2GBt7OCP.js";import"./VAlert-B3NTcGhi.js";import"./createUrl-cDKNZYk4.js";import"./index-0F-JFElI.js";import"./VContainer-BiaKKa3x.js";import"./VDataTable-C_DhMFop.js";import"./VSkeletonLoader-D-ODeh2i.js";import"./VCheckbox-CYTM7pzL.js";import"./VForm-BQiQkQz-.js";import"./VToolbar-0se5OrAH.js";const E=s("span",null," Usuarios ",-1),M={class:"d-flex justify-end gap-3 flex-wrap"},Ve=h({__name:"List",setup(A){const l=y(),{company:n,user:B}=k(l),r=a(),m={url:"/user/list",params:{company_id:n.value.id},headers:[{key:"full_name",title:"Nombre Completo",sortable:!1},{key:"email",title:"Email",sortable:!1},{key:"role_name",title:"Rol",sortable:!1},{key:"is_active",title:"Estado",sortable:!1},{key:"actions",title:"Acciones",sortable:!1}],actions:{changeStatus:{url:"/user/changeStatus"},view:{show:!1},delete:{show:!1}}},p=a({inputGeneral:{relationsGeneral:{all:["name","surname","email","phone"],rol:["name"]}},dialog:{width:500,inputs:[{input_type:"booleanActive",title:"Estado",key:"is_active"}]}}),o=a(),c=()=>{o.value.openModal()},u=async(i={action:"created",id:null})=>{o.value.openModal(i.id)},d=()=>{r.value.executeFetchTable()};return(i,N)=>{const f=_;return V(),v("div",null,[e(T,null,{default:t(()=>[e(C,{class:"d-flex justify-space-between"},{default:t(()=>[E,s("div",M,[e(x,{onClick:c},{default:t(()=>[F(" Agregar usuario ")]),_:1})])]),_:1}),e(g,{class:"mt-2"},{default:t(()=>[e(f,{ref_key:"tableFull",ref:r,optionsTable:m,optionsFilter:w(p),onGoView:u},null,8,["optionsFilter"])]),_:1})]),_:1}),e(b,{ref_key:"refModalForm",ref:o,onExecute:d},null,512)])}}});export{Ve as default};