import{u as A}from"./useCrudGradeStore-187194ff.js";import{d as E,a0 as N,k as G,$ as R,r as M,E as U,w as _,ay as F,a6 as L,a as Q,o as j,c as q,b as e,f as t,t as x,n as i,az as H,e as l,a4 as h,a9 as f,a1 as v,v as C,a7 as y}from"./index-a30326ee.js";import{S as J}from"./sweetalert2.all-ae952bba.js";import{b as K,V as O}from"./VCard-95ab2cb2.js";import{V as w}from"./VCardText-ca73b5bb.js";import{V as b}from"./VContainer-714bc645.js";import{V as W}from"./VSelect-5b03c139.js";import{V as X}from"./VSpacer-e635fa2a.js";import{V as Y}from"./VImg-66082724.js";import{V as Z}from"./VChip-b913721b.js";import{V as ee}from"./VRow-3a68e704.js";import{V as te}from"./VPagination-0abd38f7.js";import{V as ae}from"./VDataTable-4db9dbd4.js";import"./_commonjsHelpers-725317a4.js";import"./VAvatar-8692be98.js";/* empty css              */import"./VTextField-b4cee9fb.js";import"./VField-cc909461.js";import"./VList-470bc819.js";import"./ssrBoot-4f3308ba.js";import"./VDivider-8572c83d.js";import"./dialog-transition-018760d9.js";import"./VMenu-4fbc188a.js";const oe={class:"me-3",style:{"inline-size":"80px"}},se={class:"app-grade-search-filter d-flex align-center flex-wrap gap-4"},ne={class:"d-flex align-center py-2",style:{"inline-size":"10rem"}},ie={colspan:"4"},le={style:{"inline-size":"100"},class:"d-flex justify-center"},re={class:"text-sm text-disabled"},$e=E({__name:"Index",setup(ce){const c=A(),k=N(),S=G(),{currentPage:n,totalPage:d,lastPage:z,totalData:D,grades:m,loading:T}=R(c),r=M(10),u=async(s=[])=>{await c.fetchAll({company_id:k.company.id,perPage:r.value,page:n.value,searchQuery:s})};U(async()=>{await u()}),_(n,async()=>{n.value>d.value&&(n.value=d.value)}),_(r,async()=>{n.value=1}),F([n,r],async()=>{await u()});const P=L(()=>{const s=m.value.length?(n.value-1)*d.value+1:0,a=m.value.length+(n.value-1)*d.value;return`Mostrando ${s} a ${a} de ${D.value} registros`}),V=async(s="create",a)=>{S.push({name:"Grade-Form",params:{action:s,id:a}})},B=async(s,a)=>{const p=!s[a];(await c.changeState({id:s.id,value:p,field:a})).code==200&&(s.state=p)},I=async s=>{J.fire({title:"¿Desea eliminar el registro?",showDenyButton:!0,showCancelButton:!1,confirmButtonText:"Si",denyButtonText:"No"}).then(async a=>{a.isConfirmed?(await c.fetchDelete(s),await u()):a.isDenied})},$=[{title:"Tipo",key:"type_education_name"},{title:"Nombre",key:"name"},{title:"Acciones",key:"actions"}];return(s,a)=>{const p=Q("PreloadInterno");return j(),q("div",null,[e(O,null,{default:t(()=>[e(K,{"primary-title":""},{default:t(()=>[x("Listado de grados")]),_:1}),e(w,null,{default:t(()=>[e(i(ae),{headers:$,items:i(m),"items-per-page":i(r)},H({top:t(()=>[e(b,{fluid:"",class:"d-flex flex-wrap py-4 gap-4"},{default:t(()=>[l("div",oe,[e(W,{modelValue:i(r),"onUpdate:modelValue":a[0]||(a[0]=o=>h(r)?r.value=o:null),density:"compact",variant:"outlined",items:[10,20,30,50]},null,8,["modelValue"])]),e(X),l("div",se,[e(f,{color:"primary",onClick:a[1]||(a[1]=o=>V())},{default:t(()=>[x(" Crear Grado ")]),_:1})])]),_:1})]),"item.path":t(({item:o})=>[l("div",ne,[e(Y,{src:o.path,class:"rounded"},null,8,["src"])])]),"item.state":t(({item:o})=>[e(Z,{color:o.state==1?"success":"error",onClick:g=>B(o,"state")},{default:t(()=>[e(v,{start:"",size:"16",icon:o.state==1?"tabler-bell":"tabler-alert-circle"},null,8,["icon"]),l("span",null,C(o.state==1?"Activo":"Inactivo"),1),e(y,{location:"top",transition:"scale-transition",activator:"parent",text:"Cambiar Estado"})]),_:2},1032,["color","onClick"])]),"item.actions":t(({item:o})=>[e(f,{icon:"",size:"x-small",color:"error",variant:"text",onClick:g=>I(o.id)},{default:t(()=>[e(v,{size:"22",icon:"tabler-trash"}),e(y,{location:"top",transition:"scale-transition",activator:"parent",text:"Eliminar"})]),_:2},1032,["onClick"]),e(f,{icon:"",size:"x-small",color:"default",variant:"text",onClick:g=>V("edit",o.id)},{default:t(()=>[e(v,{size:"22",icon:"tabler-edit"}),e(y,{location:"top",transition:"scale-transition",activator:"parent",text:"Editar"})]),_:2},1032,["onClick"])]),bottom:t(()=>[e(w,{class:"pt-2"},{default:t(()=>[e(ee,null,{default:t(()=>[e(b,{fluid:"",class:"d-flex align-center flex-wrap justify-space-between gap-4 py-3 px-5"},{default:t(()=>[l("span",re,C(i(P)),1),e(te,{modelValue:i(n),"onUpdate:modelValue":a[2]||(a[2]=o=>h(n)?n.value=o:null),size:"small","total-visible":5,length:i(z)},null,8,["modelValue","length"])]),_:1})]),_:1})]),_:1})]),_:2},[i(T).table?{name:"body",fn:t(()=>[l("tr",null,[l("td",ie,[l("div",le,[e(p)])])])]),key:"0"}:void 0]),1032,["items","items-per-page"])]),_:1})]),_:1})])}}});export{$e as default};