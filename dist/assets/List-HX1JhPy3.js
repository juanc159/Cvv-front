import{s as f}from"./helpers-DpEV7f3y.js";import{_}from"./TableFull.vue_vue_type_script_setup_true_lang-iMx3QSUu.js";import{d as g,U as v,r as l,o as k,c as y,b as t,f as o,e as i,ad as V,C as b,k as n,al as h}from"./index-Beckcyx0.js";import{V as w,b as x}from"./VCard-Dl-v77MZ.js";import{V as B}from"./VGrid-BuZ444Te.js";import{V as C}from"./VImg-hrG_q8t5.js";import"./constants-2GBt7OCP.js";import"./ModalQuestion.vue_vue_type_script_setup_true_lang-DKqZcpIX.js";import"./DialogCloseBtn.vue_vue_type_script_setup_true_lang-DfLnVt2Q.js";import"./VDialog-LwCmN1GJ.js";import"./VOverlay-CInLCweo.js";import"./forwardRefs-C-GTDzx5.js";import"./dialog-transition-DfVxIrSo.js";import"./VInput-DfRUPHc8.js";import"./VTooltip-_UTdwfxP.js";import"./AppSelect.vue_vue_type_script_setup_true_lang-B1_3oUZk.js";import"./VSelect-BBDYoSot.js";import"./VTextField-BOnq8RWc.js";import"./VList-mp1GnCW_.js";import"./ssrBoot-pwlHSkgy.js";import"./VAvatar-Dv33BZj0.js";import"./VDivider-BjwItKp1.js";import"./VMenu-FixnG40M.js";import"./VCheckboxBtn-CJntfbgY.js";import"./VSelectionControl-LLIosjUH.js";import"./VChip-BErw9K7y.js";import"./VRow-C5AQkx25.js";import"./AppTextField.vue_vue_type_script_setup_true_lang-DHJAiZPb.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./VAlert-BbKSuXcR.js";import"./createUrl-DKIh3q5D.js";import"./index-0F-JFElI.js";import"./VCheckbox-BLJOYEne.js";import"./VContainer-DrU1XUHi.js";import"./VDataTable-DfPlzshC.js";import"./VSkeletonLoader-BKimATlz.js";const F=i("span",null," Servicios ",-1),S={class:"d-flex justify-end gap-3 flex-wrap"},T={class:"my-2"},ut=g({__name:"List",setup(A){const m=v(),a=(e={action:"create",id:null})=>{h.push({name:"Service-Form",params:{action:e.action,id:e.id}})},p=l(),c={url:"/service/list",params:{company_id:m.company.id},headers:[{key:"title",title:"Título",sortable:!1},{key:"image",title:"Imagen",sortable:!1},{key:"is_active",title:"Estado",sortable:!1},{key:"actions",title:"Acciones",sortable:!1}],actions:{changeStatus:{url:"/service/changeStatus"},view:{show:!1},delete:{url:"/service/delete"}}},d=l({inputGeneral:{relationsGeneral:{all:["title"]}},dialog:{width:500,inputs:[{input_type:"booleanActive",title:"Estado",key:"is_active"}]}});return(e,r)=>{const u=_;return k(),y("div",null,[t(w,null,{default:o(()=>[t(x,{class:"d-flex justify-space-between"},{default:o(()=>[F,i("div",S,[t(V,{onClick:r[0]||(r[0]=s=>a())},{default:o(()=>[b(" Agregar servicio ")]),_:1})])]),_:1}),t(B,{class:"mt-2"},{default:o(()=>[t(u,{ref_key:"tableFull",ref:p,optionsTable:c,optionsFilter:n(d),onGoView:a},{"item.image":o(({item:s})=>[i("div",T,[t(C,{style:{width:"80px"},src:("storageBack"in e?e.storageBack:n(f))(s.image)},null,8,["src"])])]),_:1},8,["optionsFilter"])]),_:1})]),_:1})])}}});export{ut as default};