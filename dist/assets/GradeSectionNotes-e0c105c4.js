import{a as I}from"./formatters-1588bd0d.js";import{_ as T}from"./SchoolData.vue_vue_type_style_index_0_lang-c9cefaf0.js";import{S as w}from"./sweetalert2.all-ae952bba.js";import{d as L,j as B,aB as E,r as v,E as D,ab as y,a6 as $,o as s,g as m,f as a,b as t,e as n,v as V,n as r,t as h,a4 as A,c as g,i as P,F as S,O as j,P as z,x as G,a9 as F,y as C,_ as R}from"./index-a30326ee.js";import{o as O}from"./helpers-3edea678.js";import{V as U}from"./VRow-3a68e704.js";import{V as b}from"./VCol-0df0a306.js";import{V as M}from"./VField-cc909461.js";import{V as q}from"./VTextField-b4cee9fb.js";import{V as H}from"./VCard-95ab2cb2.js";import{V as J}from"./VCardText-ca73b5bb.js";import{V as K,a as Q,b as W}from"./VList-470bc819.js";import{V as X}from"./VContainer-714bc645.js";import{V as Y}from"./VAvatar-8692be98.js";import{V as Z}from"./VImg-66082724.js";import{V as ee}from"./VDivider-8572c83d.js";import"./front-page-footer-ed94745a.js";import"./ssrBoot-4f3308ba.js";import"./_commonjsHelpers-725317a4.js";/* empty css              */const ae=d=>(j("data-v-36de5726"),d=d(),z(),d),te={class:"our-team"},oe={class:"headers d-flex justify-center flex-column align-center"},se={class:"d-flex align-center text-h3 mb-1 flex-wrap justify-center"},re={class:"position-relative me-2"},le={class:"section-title"},ie=ae(()=>n("p",{class:"text-center"}," LISTADO DE ESTUDIANTES: ",-1)),ne={key:1,class:"font-weight-medium"},de=L({__name:"GradeSectionNotes",setup(d){const u=B(),l=E({form:!1}),f=v([]),x=v();D(async()=>{l.form=!0;const o=await y(`pw-dataGradeSectionNotes/${u.params.school_id}/${u.params.grade_id}/${u.params.section_id}`).get();l.form=!1,o.data&&(f.value=o.data.value.students,x.value=o.data.value.title)});const c=v(""),N=$(()=>f.value.filter(i=>i.full_name.toLowerCase().includes(c.value.toLowerCase()))),k=async o=>{var _;const{value:i}=await w.fire({title:"Ingrese su documento de identidad (Ejem: 12345678)",input:"text",inputLabel:"Cédula",inputPlaceholder:"Ingrese su cédula",inputAttributes:{maxlength:"10",autocapitalize:"off",autocorrect:"off"}});if(i!=o.identity_document)return w.fire("No coincide el dato suministrado (Ejem: 12345678)"),!1;l.form=!0;const{data:e,response:p}=await y(`pw-pdfNote/${o.id}`).get();l.form=!1,(_=p.value)!=null&&_.ok&&e.value&&O(e.value.pdf)};return(o,i)=>(s(),m(T,null,{default:a(()=>[t(X,{id:"team"},{default:a(()=>[n("div",te,[n("div",oe,[n("div",se,[n("div",re,[n("h3",le,V(r(x)),1)])]),ie]),t(U,null,{default:a(()=>[t(b,{cols:"6"},{default:a(()=>[t(M,null,{default:a(()=>[h("Nombre del estudiante:")]),_:1}),t(q,{clearable:"",placeholder:"Buscar...",modelValue:r(c),"onUpdate:modelValue":i[0]||(i[0]=e=>A(c)?c.value=e:null)},null,8,["modelValue"])]),_:1}),t(b,{cols:"12"},{default:a(()=>[t(H,{loading:r(l).form,disabled:r(l).form},{default:a(()=>[t(J,null,{default:a(()=>[t(K,{lines:"two",border:""},{default:a(()=>[(s(!0),g(S,null,P(r(N),(e,p)=>(s(),g(S,{key:e.name},[t(Q,null,{prepend:a(()=>[t(Y,{color:e.photo?"":"primary",class:G(e.photo?null:"v-avatar-light-bg primary--text"),variant:e.photo?void 0:"tonal",size:"80"},{default:a(()=>[e.photo?(s(),m(Z,{key:0,src:e.photo},null,8,["src"])):(s(),g("span",ne,V(("avatarText"in o?o.avatarText:r(I))(e.full_name)),1))]),_:2},1032,["color","class","variant"])]),append:a(()=>[e.pdf?(s(),m(F,{key:0,onClick:_=>k(e)},{default:a(()=>[h(" Visualizar notas ")]),_:2},1032,["onClick"])):C("",!0)]),default:a(()=>[t(W,null,{default:a(()=>[h(V(e.full_name),1)]),_:2},1024)]),_:2},1024),p!==r(f).length-1?(s(),m(ee,{key:0})):C("",!0)],64))),128))]),_:1})]),_:1})]),_:1},8,["loading","disabled"])]),_:1})]),_:1})])]),_:1})]),_:1}))}});const Le=R(de,[["__scopeId","data-v-36de5726"]]);export{Le as default};