import{h as F,s as N,b as Q}from"./helpers-I2trEFsP.js";import{a as $}from"./formatters-PFDjqhUb.js";import{_ as A}from"./ModalQuestion.vue_vue_type_script_setup_true_lang-CkvfkyqV.js";import{_ as R}from"./TableFull.vue_vue_type_script_setup_true_lang-C7ufSjmP.js";import{d as I,U as G,r as d,ax as j,o as m,c as w,b as t,f as o,af as _,e as r,k as s,g as P,C as h,ad as y,G as L,E as O,D as q,a8 as k,al as g}from"./index-BVvdxTMg.js";import{V as z,b as U}from"./VCard-DtrWcyGV.js";import{V as H}from"./VGrid-B0igNbSt.js";import{V as J}from"./VAvatar-T8kTWVsF.js";import{V as K}from"./VImg-C6lUpkie.js";import{a as v}from"./VList-JerdU-PU.js";import"./constants-2GBt7OCP.js";import"./DialogCloseBtn.vue_vue_type_script_setup_true_lang-PG4Kffi-.js";import"./VDialog-B_IRusEp.js";import"./VOverlay-DTsboUuv.js";import"./forwardRefs-C-GTDzx5.js";import"./dialog-transition-B1R0JLT2.js";import"./VInput-Ct_eF-8w.js";import"./VTooltip-Gx6Y75Cr.js";import"./AppSelect.vue_vue_type_script_setup_true_lang-DCQCJ7hU.js";import"./VSelect-C7hJsTvZ.js";import"./VTextField-BkYy4Xiq.js";import"./VMenu-B5OB3Xn1.js";import"./VCheckboxBtn-CVkDnrM8.js";import"./VSelectionControl-DBcINQq4.js";import"./VChip-BYH5jgVI.js";import"./VDivider-Dp-PmhlA.js";import"./VRow-HGD8rSc_.js";import"./AppTextField.vue_vue_type_script_setup_true_lang-CiHzRy2o.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./VAlert-D-uTjEQU.js";import"./createUrl-C-eoZjiV.js";import"./index-0F-JFElI.js";import"./VCheckbox-B9jQhM3A.js";import"./VContainer-hijot2r6.js";import"./VDataTable--3ZFGT8_.js";import"./VSkeletonLoader-Djc6mIWh.js";import"./ssrBoot-sGHe7kvv.js";const W=r("span",null," Docentes ",-1),X={class:"d-flex justify-end gap-3 flex-wrap"},Y={key:1},Z=r("span",null,"Descargar Nómina",-1),ee=r("span",null,"Resetear contraseña",-1),ae=r("span",null,"Planificación",-1),Ge=I({__name:"List",setup(te){const b=G(),c=(e={action:"create",id:null})=>{if(e.action=="order")return g.push({name:"Teacher-Order"}),!1;if(e.action=="planning")return g.push({name:"Teacher-Planning",params:{id:e.id}}),!1;g.push({name:"Teacher-Form",params:{action:e.action,id:e.id}})},V=d(),T={url:"/teacher/list",params:{company_id:b.company.id},headers:[{title:"Acciones",key:"actions",sortable:!1,width:50},{title:"Estado",key:"is_active",sortable:!1},{title:"Foto",key:"photo",sortable:!1},{title:"Tipo de educación",key:"type_education_name",sortable:!1},{title:"Cargo",key:"job_position_name",sortable:!1},{title:"Nombre(s)",key:"name",sortable:!1},{title:"Apellido(s)",key:"last_name",sortable:!1},{title:"Correo",key:"email",sortable:!1},{title:"Telefono",key:"phone",sortable:!1}],actions:{changeStatus:{url:"/teacher/changeStatus"},view:{show:!1},delete:{url:"/teacher/delete"}}},x=d({inputGeneral:{relationsGeneral:{all:["name","last_name","email","phone"],typeEducation:["name"],jobPosition:["name"]}},dialog:{width:500,inputs:[{input_type:"selectInfinite",title:"Tipo de educación",key:"typeEducation",relation:"typeEducation",relation_key:"type_education_id",multiple:!0,api:"selectInifiniteTypeEducation"}]}}),n=j({excel:!1,resetPlanifications:!1}),S=async e=>{var l;n.excel=!0;const{data:i,response:f}=await _("/teacher-downloadConsolidated/"+e.id).get();if(n.excel=!1,(l=f.value)!=null&&l.ok&&i.value){const a="Nómina "+e.name+" "+e.last_name;Q(i.value.excel,a)}},u=d(),B=e=>{u.value.componentData.title="¿Seguro desea reiniciar la contraseña al registro?",u.value.openModal(e)},E=async e=>{await _("/teacher-resetPassword/"+e).get()},p=d(),M=()=>{p.value.componentData.title="¿Seguro desea reiniciar las planificaciones de todos los profesores?",p.value.componentData.subTitle="Se eliminarán todas las planificaciones. Tenga en cuenta que esta acción no se puede deshacer.",p.value.openModal()},D=async()=>{n.resetPlanifications=!0,await _("/teacher-resetPlanifications").delete({company_id:b.company.id}),n.resetPlanifications=!1};return(e,i)=>{const f=R,l=A;return m(),w("div",null,[t(z,null,{default:o(()=>[t(U,{class:"d-flex justify-space-between"},{default:o(()=>[W,r("div",X,[("hasPermission"in e?e.hasPermission:s(F))("teacher.reset_planifications")?(m(),P(y,{key:0,loading:s(n).resetPlanifications,disabled:s(n).resetPlanifications,color:"primary",onClick:M},{default:o(()=>[h(" Reiniciar Planificaciones ")]),_:1},8,["loading","disabled"])):L("",!0),t(y,{color:"primary",onClick:i[0]||(i[0]=a=>c({action:"order",id:null}))},{default:o(()=>[h(" Ordenar Docentes ")]),_:1}),t(y,{onClick:i[1]||(i[1]=a=>c())},{default:o(()=>[h(" Agregar docente ")]),_:1})])]),_:1}),t(H,{class:"mt-2"},{default:o(()=>[t(f,{ref_key:"tableFull",ref:V,optionsTable:T,optionsFilter:s(x),onGoView:c},{"item.photo":o(({item:a})=>[t(J,{color:a.photo?"":"primary",class:O(a.photo?null:"v-avatar-light-bg primary--text"),variant:a.photo?void 0:"tonal"},{default:o(()=>[a.photo?(m(),P(K,{key:0,style:{width:"80px"},src:("storageBack"in e?e.storageBack:s(N))(a.photo)},null,8,["src"])):(m(),w("span",Y,q(("avatarText"in e?e.avatarText:s($))(a.name+" "+a.last_name)),1))]),_:2},1032,["color","class","variant"])]),"item.actions2":o(({item:a})=>[t(v,{onClick:C=>S(a)},{prepend:o(()=>[t(k,{icon:"tabler-file-download"})]),default:o(()=>[Z]),_:2},1032,["onClick"]),t(v,{onClick:C=>B(a.id)},{prepend:o(()=>[t(k,{icon:"tabler-lock-open"})]),default:o(()=>[ee]),_:2},1032,["onClick"]),t(v,{onClick:C=>c({action:"planning",id:a.id})},{prepend:o(()=>[t(k,{icon:"tabler-file"})]),default:o(()=>[ae]),_:2},1032,["onClick"])]),_:1},8,["optionsFilter"])]),_:1})]),_:1}),t(l,{ref_key:"refModalQuestion",ref:u,onSuccess:E},null,512),t(l,{ref_key:"refModalQuestionResetPlanifications",ref:p,onSuccess:D},null,512)])}}});export{Ge as default};