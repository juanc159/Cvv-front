import{_ as b,a as B}from"./TableFullNew.vue_vue_type_script_setup_true_lang-5b970ee9.js";import{u as F}from"./useCrudStudentStore-5e2c90b6.js";import{d as N,R as T,r,o as V,c as g,b as t,f as a,e as _,ae as n,B as D,k as z,a6 as s,ac as l,ay as $}from"./index-45124b2c.js";import{S as x}from"./sweetalert2.esm.all-562d67d8.js";import{b as E,V as R}from"./VCard-5fd62cdf.js";import{V as A}from"./VCardText-bc141056.js";import"./DialogCloseBtn.vue_vue_type_script_setup_true_lang-33d91098.js";import"./VDialog-bff18aff.js";import"./dialog-transition-c9465328.js";import"./VField-9e33ebe8.js";import"./AppSelect.vue_vue_type_script_setup_true_lang-66866d70.js";import"./VSelect-8fdff58c.js";import"./VTextField-a51272e9.js";import"./VImg-f16b99f3.js";import"./VList-93087bdf.js";import"./ssrBoot-aa33b706.js";import"./VAvatar-197de976.js";import"./VDivider-4bd18a2a.js";import"./VMenu-53ea3bb3.js";import"./VChip-021ef7bf.js";import"./VRow-3e28075c.js";/* empty css              */import"./VCol-fa442cdc.js";import"./AppTextField.vue_vue_type_script_setup_true_lang-550b8754.js";import"./_commonjsHelpers-725317a4.js";import"./helpers-53221d8d.js";import"./index-9c720871.js";import"./VContainer-5edce376.js";import"./VPagination-82449c61.js";import"./VDataTable-a9afd072.js";const G={class:"app-teacher-search-filter d-flex align-center flex-wrap gap-4"},_t=N({__name:"Index",setup(I){const c=F(),y=T(),w=async o=>{x.fire({title:"¿Seguro desea reiniciar la contraseña al registro?",showDenyButton:!0,showCancelButton:!1,confirmButtonText:"Si",denyButtonText:"No"}).then(async e=>{e.isConfirmed?await c.fetchResetPassword(o):e.isDenied})},m=r(),C={url:"/student-list",headers:[{title:"Acciones",key:"actions"},{title:"Cédula ",key:"identity_document"},{title:"Nombre",key:"full_name"}],params:{company_id:y.company.id}},p=r({}),d=(o={})=>{p.value=o,m.value.changeFilter(o)},v=r({inputGeneral:{relationsGeneral:{all:["identity_document","full_name"]}}}),u=async(o="create",e)=>{$.push({name:"Student-Form",params:{action:o,id:e}})},k=async o=>{x.fire({title:"¿Desea eliminar el registro?",showDenyButton:!0,showCancelButton:!1,confirmButtonText:"Si",denyButtonText:"No"}).then(async e=>{e.isConfirmed?(await c.fetchDelete(o),await d(p.value)):e.isDenied})};return(o,e)=>{const h=b,S=B;return V(),g("div",null,[t(R,null,{default:a(()=>[t(E,{class:"d-flex justify-space-between"},{default:a(()=>[e[2]||(e[2]=_("div",null," Listado de estudiantes ",-1)),_("div",G,[t(n,{color:"primary",onClick:e[0]||(e[0]=i=>u())},{default:a(()=>e[1]||(e[1]=[D(" Crear Estudiante ")])),_:1})])]),_:1}),t(A,null,{default:a(()=>[t(h,{ref:"filterDialogNewRef",optionsFilter:z(v),onSendFilter:d},null,8,["optionsFilter"])]),_:1}),t(S,{ref_key:"tableFullNew",ref:m,optionsTable:C},{"item.actions":a(({item:i})=>[t(n,{icon:"",size:"x-small",color:"error",variant:"text",onClick:f=>k(i.id)},{default:a(()=>[t(s,{size:"22",icon:"tabler-trash"}),t(l,{location:"top",transition:"scale-transition",activator:"parent",text:"Eliminar"})]),_:2},1032,["onClick"]),t(n,{icon:"",size:"x-small",color:"default",variant:"text",onClick:f=>u("edit",i.id)},{default:a(()=>[t(s,{size:"22",icon:"tabler-edit"}),t(l,{location:"top",transition:"scale-transition",activator:"parent",text:"Editar"})]),_:2},1032,["onClick"]),t(n,{icon:"",size:"x-small",variant:"text",onClick:f=>w(i.id)},{default:a(()=>[t(s,{size:"22",icon:"tabler-lock-open"}),t(l,{location:"top",transition:"scale-transition",activator:"parent",text:"Resetear contraseña"})]),_:2},1032,["onClick"])]),_:1},512)]),_:1})])}}});export{_t as default};