import{V as K,r as $}from"./VForm-BQiQkQz-.js";import{d as O}from"./helpers-DMPihPy4.js";import{_ as Q}from"./AppTextField.vue_vue_type_script_setup_true_lang-CDsRSVsM.js";import{_ as W}from"./HeaderAlertView.vue_vue_type_script_setup_true_lang-w-knt0mh.js";import{d as X,r as _,ax as z,M as Y,af as A,o as d,c as g,b as e,f as l,k as r,g as h,e as v,D as k,F as q,p as B,G as D,ad as F,C as b,q as Z,al as j,E as ee,a8 as E,$ as ae,a0 as le}from"./index-Bs2WbdAz.js";import{u as N}from"./useFileUpload-C3qVMGA-.js";import{V as w}from"./VCardText-zYKdyQs7.js";import{V as C,a as p}from"./VRow-ysiYWnAR.js";import{V as G,b as te}from"./VCard-BspOpUsK.js";import{V as oe}from"./VInput-C3OcKGmU.js";import{V as re}from"./VFileInput-DpEz4H6T.js";import{V as ie}from"./VDataTable-C_DhMFop.js";import{V as P}from"./VTooltip-0ZM8oGUy.js";import{_ as ne}from"./_plugin-vue_export-helper-DlAUqK2U.js";import"./forwardRefs-C-GTDzx5.js";import"./constants-2GBt7OCP.js";import"./VTextField-BiVPh_BE.js";import"./VField-Cn8Kq-0i.js";import"./VImg-BlPswqtp.js";import"./VOverlay-ANg0gJBd.js";import"./VAlert-B3NTcGhi.js";import"./VAvatar-DZ-0fdCL.js";import"./sweetalert2.esm.all-DOYwHpwi.js";/* empty css              */import"./VChip-DH3Tddx8.js";import"./VSelect-DNsSpSEv.js";import"./VList-D47dpQDl.js";import"./ssrBoot-C7Rswu4D.js";import"./VDivider-ClP2ZRkO.js";import"./dialog-transition-BJdMOtFa.js";import"./VMenu-Dy9jsiMP.js";import"./VCheckboxBtn-CUuSqgJb.js";import"./VSelectionControl-B2jVeEAq.js";const se=y=>(ae("data-v-8ae0e7e2"),y=y(),le(),y),de=se(()=>v("b",{class:"text-warning"},"*",-1)),ce={key:1},ue=["onClick"],pe=X({__name:"Planning",setup(y){const U=Z();_(),_(),_([]);const L=_(N()),M=["jpg","jpeg","png","pdf","ppsx","pptx"];L.value.allowedExtensions=M;const R=async()=>{var i;const a=new FormData;a.append("teacher_id",c.value.id);let t=0;c.value.complementaries.forEach(n=>{n.subjects.forEach(o=>{o.files.forEach((f,u)=>{a.append("file_id_"+t,f.id),a.append("file_grade_id_"+t,n.grade_id),a.append("file_section_id_"+t,n.section_id),a.append("file_subject_id_"+t,o.value),a.append("file_file_"+t,f.file),a.append("file_name_"+t,f.name),a.append("file_delete_"+t,f.delete),t++})}),a.append("files_cant",t)}),V.form=!0;const{data:m,response:x}=await A("/teacher-planningStore").post(a);V.form=!1,(i=x.value)!=null&&i.ok&&m.value&&j.push({name:"Teacher-Index"})},V=z({form:!1}),c=_(),s=z({});Y(async()=>{var i;V.form=!0;const{data:a,response:t,error:m,isFetching:x}=await A("/teacher-planning/"+U.params.id).get();V.form=!1,(i=t.value)!=null&&i.ok&&a.value&&(c.value=a.value.data,c.value.complementaries.forEach(n=>{n.subjects.forEach(o=>{s["file-"+o.value]=_(N()),s["file-"+o.value].allowedExtensions=["jpg","jpeg","png","pdf","ppsx","pptx"]})}))});const H=[{title:"Título",key:"name"},{title:"Acciones",key:"actions"}],J=async a=>{a.files.push({name:s["file-"+a.value].name,file:s["file-"+a.value].imageFile,id:null,delete:0}),s["file-"+a.value].clearData()},T=(a,t,m)=>{a[t].delete=m};return(a,t)=>{const m=W,x=Q;return d(),g("div",null,[e(G,null,{default:l(()=>[e(w,null,{default:l(()=>[e(C,null,{default:l(()=>[e(p,null,{default:l(()=>[e(m,{"sub-title":"Formulario Teacher planificacion","btn-action":"list","validate-crud":!0,"btn-back":!0,onChangeScreenBack:a.$router.back},null,8,["onChangeScreenBack"])]),_:1})]),_:1}),r(c)?(d(),h(w,{key:0},{default:l(()=>[e(C,null,{default:l(()=>[e(p,{cols:"12",sm:"6"},{default:l(()=>{var i,n;return[v("h2",null,k((i=r(c))==null?void 0:i.name)+" "+k((n=r(c))==null?void 0:n.last_name),1)]}),_:1})]),_:1}),e(C,null,{default:l(()=>[(d(!0),g(q,null,B(r(c).complementaries,(i,n)=>(d(),h(p,{cols:"12",key:n},{default:l(()=>[e(G,{class:ee({"green-background":n%2===0,"red-background":n%2!==0})},{default:l(()=>[e(te,{"primary-title":""},{default:l(()=>[v("h2",null,"Grado: "+k(i.grade_name)+" "+k(i.section_name),1)]),_:2},1024),e(w,null,{default:l(()=>[(d(!0),g(q,null,B(i.subjects,(o,f)=>(d(),g("div",{key:f},[v("h3",null,"Planificacion: "+k(o.title),1),e(r(K),{"lazy-validation":""},{default:l(()=>[e(C,null,{default:l(()=>[e(p,{cols:"12",sm:"6"},{default:l(()=>[e(x,{clearable:"",modelValue:r(s)["file-"+o.value].name,"onUpdate:modelValue":u=>r(s)["file-"+o.value].name=u,rules:["requiredValidator"in a?a.requiredValidator:r($)],label:"Titulo",requiredField:!0},null,8,["modelValue","onUpdate:modelValue","rules"])]),_:2},1024),e(p,{cols:"12",sm:"3"},{default:l(()=>[e(oe,null,{default:l(()=>[b("Archivo "),de]),_:1}),(d(),h(re,{rules:["requiredValidator"in a?a.requiredValidator:r($)],onChange:r(s)["file-"+o.value].handleImageSelected,key:r(s)["file-"+o.value].key,"onClick:clear":r(s)["file-"+o.value].clearData},null,8,["rules","onChange","onClick:clear"]))]),_:2},1024),e(p,{cols:"12",sm:"3"},{default:l(()=>[e(F,{size:"30",class:"mt-6",icon:"",color:"success",onClick:u=>J(o)},{default:l(()=>[e(E,{icon:"tabler-plus"})]),_:2},1032,["onClick"])]),_:2},1024),e(p,{cols:"12"},{default:l(()=>[e(ie,{headers:H,items:o.files,"items-per-page":999},{"item.actions":l(({item:u,index:I})=>[v("div",null,[u.id?(d(),h(F,{key:0,icon:"",size:"x-small",color:"primary",variant:"text",onClick:S=>("descargarArchivo"in a?a.descargarArchivo:r(O))(u.file,u.name)},{default:l(()=>[e(E,{size:"22",icon:"tabler-eye"}),e(P,{location:"top",transition:"scale-transition",activator:"parent",text:"Visualizar"})]),_:2},1032,["onClick"])):D("",!0),u.delete?(d(),g("span",ce,[b(" Sera eliminado al guardar, "),v("b",{style:{cursor:"pointer"},onClick:S=>T(o.files,I,0)},"restaurar",8,ue)])):(d(),h(F,{key:2,icon:"",size:"x-small",color:"error",variant:"text",onClick:S=>T(o.files,I,1)},{default:l(()=>[e(E,{size:"22",icon:"tabler-trash"}),e(P,{location:"top",transition:"scale-transition",activator:"parent",text:"Eliminar"})]),_:2},1032,["onClick"]))])]),bottom:l(()=>[]),_:2},1032,["items"])]),_:2},1024)]),_:2},1024)]),_:2},1024)]))),128))]),_:2},1024)]),_:2},1032,["class"])]),_:2},1024))),128))]),_:1})]),_:1})):D("",!0),e(C,null,{default:l(()=>[e(p,{cols:"12",class:"d-flex justify-center"},{default:l(()=>[e(F,{loading:r(V).form,color:"primary",onClick:t[0]||(t[0]=i=>R())},{default:l(()=>[b(" Guardar ")]),_:1},8,["loading"])]),_:1})]),_:1})]),_:1})]),_:1})])}}}),Ke=ne(pe,[["__scopeId","data-v-8ae0e7e2"]]);export{Ke as default};