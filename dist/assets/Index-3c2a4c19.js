import{_ as V,a as b}from"./TableFullNew.vue_vue_type_script_setup_true_lang-8c413965.js";import{u as F}from"./useCrudServiceStore-98745726.js";import{d as T,R as N,r as s,o as B,c as D,b as t,f as o,e as n,ae as l,B as E,k as z,a6 as c,C as $,ac as p,q as I}from"./index-77212f31.js";import{S as A}from"./sweetalert2.esm.all-562d67d8.js";import{b as R,V as G}from"./VCard-361c560a.js";import{V as x}from"./VCardText-9bfba233.js";import{V as q}from"./VImg-dc235749.js";import{V as L}from"./VChip-68c712f3.js";import"./DialogCloseBtn.vue_vue_type_script_setup_true_lang-ae6cffed.js";import"./VDialog-6546badb.js";import"./dialog-transition-4887f6bb.js";import"./VField-5ee14dd0.js";import"./AppSelect.vue_vue_type_script_setup_true_lang-1079265a.js";import"./VSelect-fa3a52a1.js";import"./VTextField-8989d56a.js";import"./VList-f5c84533.js";import"./ssrBoot-440b5260.js";import"./VAvatar-c03b23a0.js";import"./VDivider-68b338a1.js";import"./VMenu-da80d115.js";import"./VRow-ebf9c426.js";/* empty css              */import"./VCol-ba01f7e5.js";import"./AppTextField.vue_vue_type_script_setup_true_lang-fec26226.js";import"./_commonjsHelpers-725317a4.js";import"./helpers-53221d8d.js";import"./createUrl-44ba7e66.js";import"./index-9c720871.js";import"./VContainer-9815c922.js";import"./VPagination-038556cc.js";import"./VDataTable-0c608ed4.js";const H={class:"app-teacher-search-filter d-flex align-center flex-wrap gap-4"},J={class:"d-flex align-center py-2",style:{"inline-size":"10rem"}},kt=T({__name:"Index",setup(K){const m=F(),C=N(),g=I(),d=async(a="create",e)=>{g.push({name:"Service-Form",params:{action:a,id:e}})},k=async(a,e)=>{const r=!a[e];(await m.changeState({id:a.id,value:r,field:e})).code==200&&(a.state=r)},w=async a=>{A.fire({title:"¿Desea eliminar el registro?",showDenyButton:!0,showCancelButton:!1,confirmButtonText:"Si",denyButtonText:"No"}).then(async e=>{e.isConfirmed?(await m.fetchDelete(a),await v(f.value)):e.isDenied})},u=s(),S={url:"/service-list",params:{company_id:C.company.id},headers:[{title:"Título",key:"title"},{title:"Imagen",key:"image"},{title:"Estado",key:"state"},{title:"Acciones",key:"actions"}]},f=s({}),v=(a={})=>{f.value=a,u.value.changeFilter(a)},h=s({inputGeneral:{relationsGeneral:{all:["name"],typeEducation:["name"]}},dialog:{width:500,inputs:[{input_type:"booleanActive",title:"Estado",key:"state"}]}});return(a,e)=>{const r=V,_=b;return B(),D("div",null,[t(G,null,{default:o(()=>[t(R,{class:"d-flex justify-space-between"},{default:o(()=>[e[2]||(e[2]=n("div",null," Listado de servicios ",-1)),n("div",H,[t(l,{color:"primary",onClick:e[0]||(e[0]=i=>d())},{default:o(()=>e[1]||(e[1]=[E(" Crear Service ")])),_:1})])]),_:1}),t(x,null,{default:o(()=>[t(r,{ref:"filterDialogNewRef",optionsFilter:z(h),onSendFilter:v},null,8,["optionsFilter"])]),_:1}),t(_,{ref_key:"tableFullNew",ref:u,optionsTable:S},{"item.image":o(({item:i})=>[n("div",J,[t(q,{src:i.image,class:"rounded"},null,8,["src"])])]),"item.state":o(({item:i})=>[t(L,{color:i.state==1?"success":"error",onClick:y=>k(i,"state")},{default:o(()=>[t(c,{start:"",size:"16",icon:i.state==1?"tabler-bell":"tabler-alert-circle"},null,8,["icon"]),n("span",null,$(i.state==1?"Activo":"Inactivo"),1),t(p,{location:"top",transition:"scale-transition",activator:"parent",text:"Cambiar Estado"})]),_:2},1032,["color","onClick"])]),"item.actions":o(({item:i})=>[t(l,{icon:"",size:"x-small",color:"error",variant:"text",onClick:y=>w(i.id)},{default:o(()=>[t(c,{size:"22",icon:"tabler-trash"}),t(p,{location:"top",transition:"scale-transition",activator:"parent",text:"Eliminar"})]),_:2},1032,["onClick"]),t(l,{icon:"",size:"x-small",color:"default",variant:"text",onClick:y=>d("edit",i.id)},{default:o(()=>[t(c,{size:"22",icon:"tabler-edit"}),t(p,{location:"top",transition:"scale-transition",activator:"parent",text:"Editar"})]),_:2},1032,["onClick"])]),_:1},512),t(x)]),_:1})])}}});export{kt as default};