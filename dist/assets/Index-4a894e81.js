import{u as c,_ as u}from"./ModalStore.vue_vue_type_script_setup_true_lang-0a0f464f.js";import{d as b,Q as V,r as _,L as D,o as k,c as v,b as e,f as i,e as l,ae as m,a6 as x,B as g,k as r,a9 as B}from"./index-e87c998e.js";import{V as C}from"./VDataTable-9c66d06f.js";import"./VForm-1d102ff3.js";import"./helpers-1cd3e8aa.js";import"./VField-48555cec.js";import"./AppTextField.vue_vue_type_script_setup_true_lang-1438879e.js";import"./VTextField-19c0923c.js";import"./VImg-b8e40629.js";import"./DialogCloseBtn.vue_vue_type_script_setup_true_lang-5cff8612.js";import"./index-9c720871.js";import"./VCard-4a612500.js";import"./VAvatar-310879b2.js";import"./VCardText-ecc7b3c9.js";import"./VRow-dbcc1c85.js";/* empty css              */import"./VCol-40d12692.js";import"./VDialog-95a7a5d8.js";import"./dialog-transition-e0e81da4.js";import"./VSelect-117c2caf.js";import"./VList-725590b5.js";import"./ssrBoot-db5986a3.js";import"./VDivider-92bccdc3.js";import"./VMenu-ccd8d291.js";import"./VChip-2fe349dc.js";const N={class:"d-flex align-center"},y={class:"d-flex justify-end mb-6 mt-3 mr-3"},tt=b({__name:"Index",setup(T){const a=c(),{tenants:p}=V(a),o=_(!1),d=n=>{a.setHost(n)},f=[{title:"Nombre",key:"id",sortable:!1},{title:"Acciones",key:"action",sortable:!1}];return D(async()=>{await a.fetchList()}),(n,t)=>(k(),v("div",null,[e(r(C),{headers:f,items:r(p),"items-per-page":999999,"fixed-header":"",class:"mt-5"},{"item.action":i(({item:s})=>[l("div",N,[e(m,{onClick:$=>d(s.id)},{default:i(()=>[e(x,{icon:"tabler-list",size:"22"})]),_:2},1032,["onClick"])])]),top:i(()=>[l("div",y,[e(m,{onClick:t[0]||(t[0]=s=>o.value=!0)},{default:i(()=>t[2]||(t[2]=[g(" Nuevo subdominio ")])),_:1})])]),bottom:i(()=>t[3]||(t[3]=[])),_:1},8,["items"]),e(u,{isDialogDetailVisible:r(o),"onUpdate:isDialogDetailVisible":t[1]||(t[1]=s=>B(o)?o.value=s:null)},null,8,["isDialogDetailVisible"])]))}});export{tt as default};