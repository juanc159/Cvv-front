import{u as R}from"./useCrudUserStore-259971f4.js";import{d as A,R as E,Q as N,r as U,L,w as g,aB as M,ab as Q,a as q,o as F,c as j,b as t,f as a,B as C,k as n,aC as G,e as r,a9 as _,ae as f,a6 as v,C as h,ac as y,q as H}from"./index-aa5d3caf.js";import{S as J}from"./sweetalert2.esm.all-562d67d8.js";import{b as K,V as O}from"./VCard-7e854c2d.js";import{V as w}from"./VCardText-3a66a74a.js";import{V as b}from"./VContainer-3f476ced.js";import{V as W}from"./VSelect-c5364f97.js";import{V as X}from"./VSpacer-68db2230.js";import{V as Y}from"./VChip-912b787d.js";import{V as Z}from"./VRow-ef83ed33.js";import{V as tt}from"./VPagination-62fd104f.js";import{V as et}from"./VDataTable-03929f8a.js";import"./VAvatar-31d2b53a.js";import"./VImg-82190d0d.js";/* empty css              */import"./VTextField-a473323b.js";import"./VField-60417c4f.js";import"./VList-8e5a8f01.js";import"./ssrBoot-35f8d448.js";import"./VDivider-6e8c4f39.js";import"./dialog-transition-19068789.js";import"./VMenu-129fda55.js";const at={class:"me-3",style:{"inline-size":"80px"}},ot={class:"app-user-search-filter d-flex align-center flex-wrap gap-4"},st={colspan:"4"},lt={style:{"inline-size":"100"},class:"d-flex justify-center"},nt={class:"text-sm text-disabled"},Tt=A({__name:"Index",setup(it){const c=R(),k=E(),S=H(),{currentPage:l,totalPage:u,lastPage:B,totalData:D,users:p,loading:P}=N(c),i=U(10),m=async(s=[])=>{await c.fetchAll({company_id:k.company.id,perPage:i.value,page:l.value,searchQuery:s})};L(async()=>{await m()}),g(l,async()=>{l.value>u.value&&(l.value=u.value)}),g(i,async()=>{l.value=1}),M([l,i],async()=>{await m()});const T=Q(()=>{const s=p.value.length?(l.value-1)*u.value+1:0,e=p.value.length+(l.value-1)*u.value;return`Mostrando ${s} a ${e} de ${D.value} registros`}),V=async(s="create",e)=>{S.push({name:"Users-Form",params:{action:s,id:e}})},z=async(s,e)=>{const d=!s[e];(await c.changeState({id:s.id,value:d,field:e})).code==200&&(s.state=d)},I=async s=>{J.fire({title:"¿Desea eliminar el registro?",showDenyButton:!0,showCancelButton:!1,confirmButtonText:"Si",denyButtonText:"No"}).then(async e=>{e.isConfirmed?(await c.fetchDelete(s),await m()):e.isDenied})},$=[{title:"Nombre",key:"name"},{title:"Correo",key:"email"},{title:"Rol",key:"role"},{title:"Estado",key:"state"},{title:"Acciones",key:"actions"}];return(s,e)=>{const d=q("PreloadInterno");return F(),j("div",null,[t(O,null,{default:a(()=>[t(K,{"primary-title":""},{default:a(()=>e[3]||(e[3]=[C("Listado de usuarios")])),_:1}),t(w,null,{default:a(()=>[t(n(et),{headers:$,items:n(p),"items-per-page":n(i)},G({top:a(()=>[t(b,{fluid:"",class:"d-flex flex-wrap py-4 gap-4"},{default:a(()=>[r("div",at,[t(W,{modelValue:n(i),"onUpdate:modelValue":e[0]||(e[0]=o=>_(i)?i.value=o:null),density:"compact",variant:"outlined",items:[10,20,30,50]},null,8,["modelValue"])]),t(X),r("div",ot,[t(f,{color:"primary",onClick:e[1]||(e[1]=o=>V())},{default:a(()=>e[4]||(e[4]=[C(" Crear usuario ")])),_:1})])]),_:1})]),"item.state":a(({item:o})=>[t(Y,{color:o.state==1?"success":"error",onClick:x=>z(o,"state")},{default:a(()=>[t(v,{start:"",size:"16",icon:o.state==1?"tabler-bell":"tabler-alert-circle"},null,8,["icon"]),r("span",null,h(o.state==1?"Activo":"Inactivo"),1),t(y,{location:"top",transition:"scale-transition",activator:"parent",text:"Cambiar Estado"})]),_:2},1032,["color","onClick"])]),"item.actions":a(({item:o})=>[t(f,{icon:"",size:"x-small",color:"error",variant:"text",onClick:x=>I(o.id)},{default:a(()=>[t(v,{size:"22",icon:"tabler-trash"}),t(y,{location:"top",transition:"scale-transition",activator:"parent",text:"Eliminar"})]),_:2},1032,["onClick"]),t(f,{icon:"",size:"x-small",color:"default",variant:"text",onClick:x=>V("edit",o.id)},{default:a(()=>[t(v,{size:"22",icon:"tabler-edit"}),t(y,{location:"top",transition:"scale-transition",activator:"parent",text:"Editar"})]),_:2},1032,["onClick"])]),bottom:a(()=>[t(w,{class:"pt-2"},{default:a(()=>[t(Z,null,{default:a(()=>[t(b,{fluid:"",class:"d-flex align-center flex-wrap justify-space-between gap-4 py-3 px-5"},{default:a(()=>[r("span",nt,h(n(T)),1),t(tt,{modelValue:n(l),"onUpdate:modelValue":e[2]||(e[2]=o=>_(l)?l.value=o:null),size:"small","total-visible":5,length:n(B)},null,8,["modelValue","length"])]),_:1})]),_:1})]),_:1})]),_:2},[n(P).table?{name:"body",fn:a(()=>[r("tr",null,[r("td",st,[r("div",lt,[t(d)])])])]),key:"0"}:void 0]),1032,["items","items-per-page"])]),_:1})]),_:1})])}}});export{Tt as default};