import{u as c,_ as u}from"./ModalStore.vue_vue_type_script_setup_true_lang-2fe94a13.js";import{d as b,Q as V,r as _,L as D,o as k,c as v,b as e,f as i,e as l,ae as m,a6 as x,B as g,k as r,a9 as B}from"./index-aa5d3caf.js";import{V as C}from"./VDataTable-03929f8a.js";import"./VForm-8695cfab.js";import"./helpers-3edea678.js";import"./VField-60417c4f.js";import"./AppTextField.vue_vue_type_script_setup_true_lang-2acb7ea8.js";import"./VTextField-a473323b.js";import"./VImg-82190d0d.js";import"./DialogCloseBtn.vue_vue_type_script_setup_true_lang-080de28d.js";import"./index-0df1062e.js";import"./VCard-7e854c2d.js";import"./VAvatar-31d2b53a.js";import"./VCardText-3a66a74a.js";import"./VRow-ef83ed33.js";/* empty css              */import"./VCol-f3c848ea.js";import"./VDialog-454bf9a1.js";import"./dialog-transition-19068789.js";import"./VSelect-c5364f97.js";import"./VList-8e5a8f01.js";import"./ssrBoot-35f8d448.js";import"./VDivider-6e8c4f39.js";import"./VMenu-129fda55.js";import"./VChip-912b787d.js";const N={class:"d-flex align-center"},y={class:"d-flex justify-end mb-6 mt-3 mr-3"},tt=b({__name:"Index",setup(T){const a=c(),{tenants:p}=V(a),o=_(!1),d=n=>{a.setHost(n)},f=[{title:"Nombre",key:"id",sortable:!1},{title:"Acciones",key:"action",sortable:!1}];return D(async()=>{await a.fetchList()}),(n,t)=>(k(),v("div",null,[e(r(C),{headers:f,items:r(p),"items-per-page":999999,"fixed-header":"",class:"mt-5"},{"item.action":i(({item:s})=>[l("div",N,[e(m,{onClick:$=>d(s.id)},{default:i(()=>[e(x,{icon:"tabler-list",size:"22"})]),_:2},1032,["onClick"])])]),top:i(()=>[l("div",y,[e(m,{onClick:t[0]||(t[0]=s=>o.value=!0)},{default:i(()=>t[2]||(t[2]=[g(" Nuevo subdominio ")])),_:1})])]),bottom:i(()=>t[3]||(t[3]=[])),_:1},8,["items"]),e(u,{isDialogDetailVisible:r(o),"onUpdate:isDialogDetailVisible":t[1]||(t[1]=s=>B(o)?o.value=s:null)},null,8,["isDialogDetailVisible"])]))}});export{tt as default};