import{s as g}from"./helpers-C_Z1zCmd.js";import{_ as h}from"./TableFull.vue_vue_type_script_setup_true_lang-DD2L174J.js";import{d as y,U as k,r as n,o as V,c as b,b as t,f as e,e as i,ad as C,C as w,k as l,a8 as v,al as m}from"./index-Cxlqk5Qh.js";import{V as x,b as B}from"./VCard-DyV6l6OD.js";import{V as F}from"./VGrid-DQzmkAMQ.js";import{V as T}from"./VImg-CqKmbBnC.js";import{a as A}from"./VList-DGBOQpoM.js";import"./constants-30sb_wC2.js";import"./ModalQuestion.vue_vue_type_script_setup_true_lang-CNCOuDg_.js";import"./DialogCloseBtn.vue_vue_type_script_setup_true_lang-CvL8JVZk.js";import"./VDialog-DCY4qtPQ.js";import"./VOverlay-BwR-THjB.js";import"./forwardRefs-C-GTDzx5.js";import"./dialog-transition-BH3exUTv.js";import"./VInput-B_H6eC6p.js";import"./VTooltip-BRFxMc0i.js";import"./AppSelect.vue_vue_type_script_setup_true_lang-CUnyCVXP.js";import"./VSelect-CmWVQrcu.js";import"./VTextField-ChIkeRh3.js";import"./VMenu-72LO3Vvo.js";import"./VCheckboxBtn-DlL6Yvo-.js";import"./VSelectionControl-4OKNNq7y.js";import"./VAvatar-DwGUaaIJ.js";import"./VChip-CjPuKpiA.js";import"./VDivider-ycNusSDd.js";import"./VRow-tCYJq-gA.js";import"./AppTextField.vue_vue_type_script_setup_true_lang-CnSRS8ib.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./VAlert-O0mi62XD.js";import"./createUrl-_RGxvNIz.js";import"./index-0F-JFElI.js";import"./VCheckbox-BHbGLEHa.js";import"./VContainer-Cp0ooK6T.js";import"./VDataTable-DvL7dnk9.js";import"./VSkeletonLoader-CKduUmYG.js";import"./ssrBoot-C7bKpzNz.js";const E=i("span",null," Compañias ",-1),I={class:"d-flex justify-end gap-3 flex-wrap"},N={class:"my-2"},S=i("span",null,"Ingresar",-1),yt=y({__name:"List",setup(G){const p=k(),s=(o={action:"create",id:null})=>{m.push({name:"Company-Form",params:{action:o.action,id:o.id}})},c=n(),d={url:"/company/list",headers:[{key:"name",title:"Nombre compañia",sortable:!1},{key:"slogan",title:"Eslogan",sortable:!1},{key:"is_active",title:"Estado",sortable:!1},{key:"actions",title:"Acciones",sortable:!1}],actions:{changeStatus:{url:"/company/changeStatus"},view:{show:!1},delete:{show:!1}}},u=n({inputGeneral:{relationsGeneral:{all:["name","nit","email","phone"]}},dialog:{width:500,inputs:[{input_type:"booleanActive",title:"Estado",key:"is_active"}]}}),f=o=>{p.company=o,m.push({name:"Home"})};return(o,r)=>{const _=h;return V(),b("div",null,[t(x,null,{default:e(()=>[t(B,{class:"d-flex justify-space-between"},{default:e(()=>[E,i("div",I,[t(C,{onClick:r[0]||(r[0]=a=>s())},{default:e(()=>[w(" Agregar compañia ")]),_:1})])]),_:1}),t(F,{class:"mt-2"},{default:e(()=>[t(_,{ref_key:"tableFull",ref:c,optionsTable:d,optionsFilter:l(u),onGoView:s},{"item.logo":e(({item:a})=>[i("div",N,[t(T,{style:{width:"80px"},src:("storageBack"in o?o.storageBack:l(g))(a.logo)},null,8,["src"])])]),"item.actions2":e(({item:a})=>[t(A,{onClick:$=>f(a)},{prepend:e(()=>[t(v,{size:"22",icon:"tabler-square-rounded-arrow-right"})]),default:e(()=>[S]),_:2},1032,["onClick"])]),_:1},8,["optionsFilter"])]),_:1})]),_:1})])}}});export{yt as default};