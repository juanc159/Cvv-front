import{u as f,_ as u}from"./ModalStore.vue_vue_type_script_setup_true_lang-32b4bc38.js";import{d as _,$ as b,r as V,E as D,o as v,c as x,b as t,f as e,e as l,a9 as m,a1 as k,t as g,n as r,a4 as C}from"./index-4eb24df8.js";import{V as N}from"./VDataTable-ba019e75.js";import"./VForm-4b2663df.js";import"./helpers-3edea678.js";import"./VField-1c65ff78.js";import"./AppTextField.vue_vue_type_script_setup_true_lang-a9dd36c3.js";import"./VTextField-32e997f0.js";import"./VImg-67e70e7a.js";import"./index-d8e09ff2.js";import"./VCard-ce961bf6.js";import"./VAvatar-1e92a85e.js";import"./VCardText-f91f4ac1.js";import"./VRow-f760e8c0.js";/* empty css              */import"./VCol-00f2d921.js";import"./VDialog-de45fcc5.js";import"./dialog-transition-27de2546.js";import"./VSelect-4e15f533.js";import"./VList-8d710a46.js";import"./ssrBoot-f72363e6.js";import"./VDivider-8b44441e.js";import"./VMenu-95167406.js";import"./VChip-1061562c.js";const y={class:"d-flex align-center"},B={class:"d-flex justify-end mb-6 mt-3 mr-3"},Z=_({__name:"Index",setup(T){const a=f(),{tenants:p}=b(a),i=V(!1),c=n=>{a.setHost(n)},d=[{title:"Nombre",key:"id",sortable:!1},{title:"Acciones",key:"action",sortable:!1}];return D(async()=>{await a.fetchList()}),(n,o)=>(v(),x("div",null,[t(r(N),{headers:d,items:r(p),"items-per-page":999999,"fixed-header":"",class:"mt-5"},{"item.action":e(({item:s})=>[l("div",y,[t(m,{onClick:$=>c(s.id)},{default:e(()=>[t(k,{icon:"tabler-list",size:"22"})]),_:2},1032,["onClick"])])]),top:e(()=>[l("div",B,[t(m,{onClick:o[0]||(o[0]=s=>i.value=!0)},{default:e(()=>[g(" Nuevo subdominio ")]),_:1})])]),bottom:e(()=>[]),_:1},8,["items"]),t(u,{isDialogDetailVisible:r(i),"onUpdate:isDialogDetailVisible":o[1]||(o[1]=s=>C(i)?i.value=s:null)},null,8,["isDialogDetailVisible"])]))}});export{Z as default};