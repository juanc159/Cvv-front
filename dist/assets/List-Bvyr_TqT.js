import{s as f}from"./helpers-C_Z1zCmd.js";import{_}from"./TableFull.vue_vue_type_script_setup_true_lang-DD2L174J.js";import{d as b,U as h,r as n,o as V,c as g,b as t,f as o,e as a,ad as k,C as y,k as l,al as w}from"./index-Cxlqk5Qh.js";import{V as B,b as v}from"./VCard-DyV6l6OD.js";import{V as x}from"./VGrid-DQzmkAMQ.js";import{V as C}from"./VImg-CqKmbBnC.js";import"./constants-30sb_wC2.js";import"./ModalQuestion.vue_vue_type_script_setup_true_lang-CNCOuDg_.js";import"./DialogCloseBtn.vue_vue_type_script_setup_true_lang-CvL8JVZk.js";import"./VDialog-DCY4qtPQ.js";import"./VOverlay-BwR-THjB.js";import"./forwardRefs-C-GTDzx5.js";import"./dialog-transition-BH3exUTv.js";import"./VInput-B_H6eC6p.js";import"./VTooltip-BRFxMc0i.js";import"./AppSelect.vue_vue_type_script_setup_true_lang-CUnyCVXP.js";import"./VSelect-CmWVQrcu.js";import"./VTextField-ChIkeRh3.js";import"./VList-DGBOQpoM.js";import"./ssrBoot-C7bKpzNz.js";import"./VAvatar-DwGUaaIJ.js";import"./VDivider-ycNusSDd.js";import"./VMenu-72LO3Vvo.js";import"./VCheckboxBtn-DlL6Yvo-.js";import"./VSelectionControl-4OKNNq7y.js";import"./VChip-CjPuKpiA.js";import"./VRow-tCYJq-gA.js";import"./AppTextField.vue_vue_type_script_setup_true_lang-CnSRS8ib.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./VAlert-O0mi62XD.js";import"./createUrl-_RGxvNIz.js";import"./index-0F-JFElI.js";import"./VCheckbox-BHbGLEHa.js";import"./VContainer-Cp0ooK6T.js";import"./VDataTable-DvL7dnk9.js";import"./VSkeletonLoader-CKduUmYG.js";const F=a("span",null," Banners ",-1),T={class:"d-flex justify-end gap-3 flex-wrap"},A={class:"my-2"},ut=b({__name:"List",setup(S){const p=h(),i=(e={action:"create",id:null})=>{w.push({name:"Banner-Form",params:{action:e.action,id:e.id}})},m=n(),c={url:"/banner/list",params:{company_id:p.company.id},headers:[{key:"path",title:"Imagen",sortable:!1},{key:"is_active",title:"Estado",sortable:!1},{key:"actions",title:"Acciones",sortable:!1}],actions:{changeStatus:{url:"/banner/changeStatus"},view:{show:!1},delete:{url:"/banner/delete"}}},d=n({inputGeneral:{relationsGeneral:{all:[]}},dialog:{width:500,inputs:[{input_type:"booleanActive",title:"Estado",key:"is_active"}]}});return(e,r)=>{const u=_;return V(),g("div",null,[t(B,null,{default:o(()=>[t(v,{class:"d-flex justify-space-between"},{default:o(()=>[F,a("div",T,[t(k,{onClick:r[0]||(r[0]=s=>i())},{default:o(()=>[y(" Agregar banner ")]),_:1})])]),_:1}),t(x,{class:"mt-2"},{default:o(()=>[t(u,{ref_key:"tableFull",ref:m,optionsTable:c,optionsFilter:l(d),onGoView:i},{"item.path":o(({item:s})=>[a("div",A,[t(C,{style:{width:"80px"},src:("storageBack"in e?e.storageBack:l(f))(s.path)},null,8,["src"])])]),_:1},8,["optionsFilter"])]),_:1})]),_:1})])}}});export{ut as default};