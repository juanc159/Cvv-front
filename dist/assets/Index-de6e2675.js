import{_ as b,a as B}from"./TableFullNew.vue_vue_type_script_setup_true_lang-97cc8020.js";import{u as F}from"./useCrudStudentStore-dbb4355b.js";import{d as N,R as T,r,o as V,c as g,b as t,f as i,e as _,ae as n,B as D,k as z,a6 as s,ac as l,ay as $}from"./index-ba2685b5.js";import{S as x}from"./sweetalert2.esm.all-562d67d8.js";import{b as E,V as R}from"./VCard-1dca3b92.js";import{V as A}from"./VCardText-27ca00f5.js";import"./DialogCloseBtn.vue_vue_type_script_setup_true_lang-0d50680a.js";import"./VDialog-36be7163.js";import"./dialog-transition-c42e04e3.js";import"./VField-e5cc8e8a.js";import"./AppSelect.vue_vue_type_script_setup_true_lang-56c369f6.js";import"./VSelect-8440ed8f.js";import"./VTextField-0453d93a.js";import"./VImg-2b1475bc.js";import"./VList-dc57db0b.js";import"./ssrBoot-5fdfebdb.js";import"./VAvatar-ade85f75.js";import"./VDivider-c2c0a35b.js";import"./VMenu-0d10e868.js";import"./VChip-c897905c.js";import"./VRow-3431edda.js";/* empty css              */import"./VCol-b72a8398.js";import"./AppTextField.vue_vue_type_script_setup_true_lang-5b730ec1.js";import"./_commonjsHelpers-725317a4.js";import"./helpers-53221d8d.js";import"./createUrl-4a1dbebf.js";import"./index-9c720871.js";import"./VContainer-1d646a20.js";import"./VPagination-db7fed11.js";import"./VDataTable-19d538e8.js";const G={class:"app-teacher-search-filter d-flex align-center flex-wrap gap-4"},xt=N({__name:"Index",setup(I){const c=F(),y=T(),w=async o=>{x.fire({title:"¿Seguro desea reiniciar la contraseña al registro?",showDenyButton:!0,showCancelButton:!1,confirmButtonText:"Si",denyButtonText:"No"}).then(async e=>{e.isConfirmed?await c.fetchResetPassword(o):e.isDenied})},m=r(),C={url:"/student-list",headers:[{title:"Acciones",key:"actions"},{title:"Cédula ",key:"identity_document"},{title:"Nombre",key:"full_name"}],params:{company_id:y.company.id}},p=r({}),d=(o={})=>{p.value=o,m.value.changeFilter(o)},v=r({inputGeneral:{relationsGeneral:{all:["identity_document","full_name"]}}}),u=async(o="create",e)=>{$.push({name:"Student-Form",params:{action:o,id:e}})},k=async o=>{x.fire({title:"¿Desea eliminar el registro?",showDenyButton:!0,showCancelButton:!1,confirmButtonText:"Si",denyButtonText:"No"}).then(async e=>{e.isConfirmed?(await c.fetchDelete(o),await d(p.value)):e.isDenied})};return(o,e)=>{const h=b,S=B;return V(),g("div",null,[t(R,null,{default:i(()=>[t(E,{class:"d-flex justify-space-between"},{default:i(()=>[e[2]||(e[2]=_("div",null," Listado de estudiantes ",-1)),_("div",G,[t(n,{color:"primary",onClick:e[0]||(e[0]=a=>u())},{default:i(()=>e[1]||(e[1]=[D(" Crear Estudiante ")])),_:1})])]),_:1}),t(A,null,{default:i(()=>[t(h,{ref:"filterDialogNewRef",optionsFilter:z(v),onSendFilter:d},null,8,["optionsFilter"])]),_:1}),t(S,{ref_key:"tableFullNew",ref:m,optionsTable:C},{"item.actions":i(({item:a})=>[t(n,{icon:"",size:"x-small",color:"error",variant:"text",onClick:f=>k(a.id)},{default:i(()=>[t(s,{size:"22",icon:"tabler-trash"}),t(l,{location:"top",transition:"scale-transition",activator:"parent",text:"Eliminar"})]),_:2},1032,["onClick"]),t(n,{icon:"",size:"x-small",color:"default",variant:"text",onClick:f=>u("edit",a.id)},{default:i(()=>[t(s,{size:"22",icon:"tabler-edit"}),t(l,{location:"top",transition:"scale-transition",activator:"parent",text:"Editar"})]),_:2},1032,["onClick"]),t(n,{icon:"",size:"x-small",variant:"text",onClick:f=>w(a.id)},{default:i(()=>[t(s,{size:"22",icon:"tabler-lock-open"}),t(l,{location:"top",transition:"scale-transition",activator:"parent",text:"Resetear contraseña"})]),_:2},1032,["onClick"])]),_:1},512)]),_:1})])}}});export{xt as default};