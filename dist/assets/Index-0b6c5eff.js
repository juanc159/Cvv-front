import{u as A}from"./useCrudBannerStore-66daf55b.js";import{d as E,R,Q as N,r as L,L as M,w as x,aB as Q,ab as U,a as q,o as F,c as j,b as t,f as a,B as _,k as i,aC as G,e as l,a9 as h,ae as f,a6 as v,C,ac as V,q as H}from"./index-aa5d3caf.js";import{S as J}from"./sweetalert2.esm.all-562d67d8.js";import{b as K,V as O}from"./VCard-7e854c2d.js";import{V as b}from"./VCardText-3a66a74a.js";import{V as w}from"./VContainer-3f476ced.js";import{V as W}from"./VSelect-c5364f97.js";import{V as X}from"./VSpacer-68db2230.js";import{V as Y}from"./VImg-82190d0d.js";import{V as Z}from"./VChip-912b787d.js";import{V as tt}from"./VRow-ef83ed33.js";import{V as et}from"./VPagination-62fd104f.js";import{V as at}from"./VDataTable-03929f8a.js";import"./VAvatar-31d2b53a.js";/* empty css              */import"./VTextField-a473323b.js";import"./VField-60417c4f.js";import"./VList-8e5a8f01.js";import"./ssrBoot-35f8d448.js";import"./VDivider-6e8c4f39.js";import"./dialog-transition-19068789.js";import"./VMenu-129fda55.js";const ot={class:"me-3",style:{"inline-size":"80px"}},nt={class:"app-banner-search-filter d-flex align-center flex-wrap gap-4"},st={class:"d-flex align-center py-2",style:{"inline-size":"10rem"}},it={colspan:"4"},lt={style:{"inline-size":"100"},class:"d-flex justify-center"},rt={class:"text-sm text-disabled"},Tt=E({__name:"Index",setup(ct){const c=A(),S=R(),k=H(),{currentPage:s,totalPage:d,lastPage:B,totalData:D,banners:u,loading:z}=N(c),r=L(10),m=async(n=[])=>{await c.fetchAll({company_id:S.company.id,perPage:r.value,page:s.value,searchQuery:n})};M(async()=>{await m()}),x(s,async()=>{s.value>d.value&&(s.value=d.value)}),x(r,async()=>{s.value=1}),Q([s,r],async()=>{await m()});const I=U(()=>{const n=u.value.length?(s.value-1)*d.value+1:0,e=u.value.length+(s.value-1)*d.value;return`Mostrando ${n} a ${e} de ${D.value} registros`}),y=async(n="create",e)=>{k.push({name:"Banner-Form",params:{action:n,id:e}})},P=async(n,e)=>{const p=!n[e];(await c.changeState({id:n.id,value:p,field:e})).code==200&&(n.state=p)},T=async n=>{J.fire({title:"¿Desea eliminar el registro?",showDenyButton:!0,showCancelButton:!1,confirmButtonText:"Si",denyButtonText:"No"}).then(async e=>{e.isConfirmed?(await c.fetchDelete(n),await m()):e.isDenied})},$=[{title:"Imagen",key:"path"},{title:"Estado",key:"state"},{title:"Acciones",key:"actions"}];return(n,e)=>{const p=q("PreloadInterno");return F(),j("div",null,[t(O,null,{default:a(()=>[t(K,{"primary-title":""},{default:a(()=>e[3]||(e[3]=[_("Listado de banners")])),_:1}),t(b,null,{default:a(()=>[t(i(at),{headers:$,items:i(u),"items-per-page":i(r)},G({top:a(()=>[t(w,{fluid:"",class:"d-flex flex-wrap py-4 gap-4"},{default:a(()=>[l("div",ot,[t(W,{modelValue:i(r),"onUpdate:modelValue":e[0]||(e[0]=o=>h(r)?r.value=o:null),density:"compact",variant:"outlined",items:[10,20,30,50]},null,8,["modelValue"])]),t(X),l("div",nt,[t(f,{color:"primary",onClick:e[1]||(e[1]=o=>y())},{default:a(()=>e[4]||(e[4]=[_(" Subir Banner ")])),_:1})])]),_:1})]),"item.path":a(({item:o})=>[l("div",st,[t(Y,{src:o.path,class:"rounded"},null,8,["src"])])]),"item.state":a(({item:o})=>[t(Z,{color:o.state==1?"success":"error",onClick:g=>P(o,"state")},{default:a(()=>[t(v,{start:"",size:"16",icon:o.state==1?"tabler-bell":"tabler-alert-circle"},null,8,["icon"]),l("span",null,C(o.state==1?"Activo":"Inactivo"),1),t(V,{location:"top",transition:"scale-transition",activator:"parent",text:"Cambiar Estado"})]),_:2},1032,["color","onClick"])]),"item.actions":a(({item:o})=>[t(f,{icon:"",size:"x-small",color:"error",variant:"text",onClick:g=>T(o.id)},{default:a(()=>[t(v,{size:"22",icon:"tabler-trash"}),t(V,{location:"top",transition:"scale-transition",activator:"parent",text:"Eliminar"})]),_:2},1032,["onClick"]),t(f,{icon:"",size:"x-small",color:"default",variant:"text",onClick:g=>y("edit",o.id)},{default:a(()=>[t(v,{size:"22",icon:"tabler-edit"}),t(V,{location:"top",transition:"scale-transition",activator:"parent",text:"Editar"})]),_:2},1032,["onClick"])]),bottom:a(()=>[t(b,{class:"pt-2"},{default:a(()=>[t(tt,null,{default:a(()=>[t(w,{fluid:"",class:"d-flex align-center flex-wrap justify-space-between gap-4 py-3 px-5"},{default:a(()=>[l("span",rt,C(i(I)),1),t(et,{modelValue:i(s),"onUpdate:modelValue":e[2]||(e[2]=o=>h(s)?s.value=o:null),size:"small","total-visible":5,length:i(B)},null,8,["modelValue","length"])]),_:1})]),_:1})]),_:1})]),_:2},[i(z).table?{name:"body",fn:a(()=>[l("tr",null,[l("td",it,[l("div",lt,[t(p)])])])]),key:"0"}:void 0]),1032,["items","items-per-page"])]),_:1})]),_:1})])}}});export{Tt as default};