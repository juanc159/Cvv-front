import{V as H,r as S}from"./VForm-4b2663df.js";import{_ as J}from"./AppTextField.vue_vue_type_script_setup_true_lang-a9dd36c3.js";import{d as M,j as K,r as f,aB as I,E as Q,ab as T,o as c,c as v,b as e,f as l,n as i,g as C,e as h,v as g,F as B,i as q,y as W,a9 as x,t as F,aw as X,x as Y,a1 as D,a7 as Z,O as j,P as ee,_ as ae}from"./index-4eb24df8.js";import{u as $}from"./useImageUpload-2f4cde5a.js";import{V as b}from"./VCardText-f91f4ac1.js";import{V}from"./VRow-f760e8c0.js";import{V as p}from"./VCol-00f2d921.js";import{V as z,b as le}from"./VCard-ce961bf6.js";import{V as te}from"./VField-1c65ff78.js";import{V as oe}from"./VFileInput-a446792c.js";import{V as ie}from"./VDataTable-ba019e75.js";import"./helpers-3edea678.js";import"./VTextField-32e997f0.js";import"./VImg-67e70e7a.js";import"./sweetalert2.all-ae952bba.js";import"./_commonjsHelpers-725317a4.js";/* empty css              */import"./VAvatar-1e92a85e.js";import"./VChip-1061562c.js";import"./VSelect-4e15f533.js";import"./VList-8d710a46.js";import"./ssrBoot-f72363e6.js";import"./VDivider-8b44441e.js";import"./dialog-transition-27de2546.js";import"./VMenu-95167406.js";const re=k=>(j("data-v-7018c458"),k=k(),ee(),k),ne=re(()=>h("b",{class:"text-warning"},"*",-1)),se={key:0},ce=["onClick"],de=M({__name:"Planning",setup(k){const A=K();f(),f(),f([]);const N=f($()),P=["jpg","jpeg","png","pdf","ppsx","pptx"];N.value.allowedExtensions=P;const U=async()=>{const a=new FormData;a.append("teacher_id",JSON.stringify(d.value.id));let t=0;d.value.complementaries.forEach(u=>{u.subjects.forEach(m=>{m.files.forEach((o,s)=>{a.append("file_id_"+t,o.id),a.append("file_grade_id_"+t,u.grade_id),a.append("file_section_id_"+t,u.section_id),a.append("file_subject_id_"+t,m.value),a.append("file_file_"+t,o.file),a.append("file_name_"+t,o.name),a.append("file_delete_"+t,o.delete),t++})}),a.append("files_cant",t)}),_.form=!0,await T("/teacher-planningStore").post(a),_.form=!1},_=I({form:!1}),d=f(),n=I({});Q(async()=>{var o;_.form=!0;const{data:a,response:t,error:u,isFetching:m}=await T("/teacher-planning/"+A.params.id).get();_.form=m.value,(o=t.value)!=null&&o.ok&&a.value&&(d.value=a.value.data,d.value.complementaries.forEach(s=>{s.subjects.forEach(r=>{n["file-"+r.value]=f($()),n["file-"+r.value].allowedExtensions=["jpg","jpeg","png","pdf","ppsx","pptx"]})}))});const G=[{title:"Título",key:"name"},{title:"Acciones",key:"actions"}],L=async a=>{a.files.push({name:n["file-"+a.value].name,file:n["file-"+a.value].imageFile,id:null,delete:0}),n["file-"+a.value].clearData()},w=(a,t,u)=>{a[t].delete=u};return(a,t)=>{const u=X,m=J;return c(),v("div",null,[e(z,null,{default:l(()=>[e(b,null,{default:l(()=>[e(V,null,{default:l(()=>[e(p,null,{default:l(()=>[e(u,{"sub-title":"Formulario Teacher planificacion","btn-action":"list","validate-crud":!0,"btn-back":!0,onChangeScreenBack:a.$router.back},null,8,["onChangeScreenBack"])]),_:1})]),_:1}),i(d)?(c(),C(b,{key:0},{default:l(()=>[e(V,null,{default:l(()=>[e(p,{cols:"12",sm:"6"},{default:l(()=>{var o,s;return[h("h2",null,g((o=i(d))==null?void 0:o.name)+" "+g((s=i(d))==null?void 0:s.last_name),1)]}),_:1})]),_:1}),e(V,null,{default:l(()=>[(c(!0),v(B,null,q(i(d).complementaries,(o,s)=>(c(),C(p,{cols:"12",key:s},{default:l(()=>[e(z,{class:Y({"green-background":s%2===0,"red-background":s%2!==0})},{default:l(()=>[e(le,{"primary-title":""},{default:l(()=>[h("h2",null,"Grado: "+g(o.grade_name)+" "+g(o.section_name),1)]),_:2},1024),e(b,null,{default:l(()=>[(c(!0),v(B,null,q(o.subjects,(r,O)=>(c(),v("div",{key:O},[h("h3",null,"Planificacion: "+g(r.title),1),e(i(H),{"lazy-validation":""},{default:l(()=>[e(V,null,{default:l(()=>[e(p,{cols:"12",sm:"6"},{default:l(()=>[e(m,{clearable:"",modelValue:i(n)["file-"+r.value].name,"onUpdate:modelValue":y=>i(n)["file-"+r.value].name=y,rules:["requiredValidator"in a?a.requiredValidator:i(S)],label:"Titulo",requiredField:!0},null,8,["modelValue","onUpdate:modelValue","rules"])]),_:2},1024),e(p,{cols:"12",sm:"3"},{default:l(()=>[e(te,null,{default:l(()=>[F("Archivo "),ne]),_:1}),(c(),C(oe,{rules:["requiredValidator"in a?a.requiredValidator:i(S)],onChange:i(n)["file-"+r.value].handleImageSelected,key:i(n)["file-"+r.value].key,"onClick:clear":i(n)["file-"+r.value].clearData},null,8,["rules","onChange","onClick:clear"]))]),_:2},1024),e(p,{cols:"12",sm:"3"},{default:l(()=>[e(x,{size:"30",class:"mt-6",icon:"",color:"success",onClick:y=>L(r)},{default:l(()=>[e(D,{icon:"tabler-plus"})]),_:2},1032,["onClick"])]),_:2},1024),e(p,{cols:"12"},{default:l(()=>[e(i(ie),{headers:G,items:r.files,"items-per-page":999},{"item.actions":l(({item:y,index:E})=>[y.delete?(c(),v("span",se,[F(" Sera eliminado al guardar, "),h("b",{style:{cursor:"pointer"},onClick:R=>w(r.files,E,0)},"restaurar",8,ce)])):(c(),C(x,{key:1,icon:"",size:"x-small",color:"error",variant:"text",onClick:R=>w(r.files,E,1)},{default:l(()=>[e(D,{size:"22",icon:"tabler-trash"}),e(Z,{location:"top",transition:"scale-transition",activator:"parent",text:"Eliminar"})]),_:2},1032,["onClick"]))]),bottom:l(()=>[]),_:2},1032,["items"])]),_:2},1024)]),_:2},1024)]),_:2},1024)]))),128))]),_:2},1024)]),_:2},1032,["class"])]),_:2},1024))),128))]),_:1})]),_:1})):W("",!0),e(V,null,{default:l(()=>[e(p,{cols:"12",class:"d-flex justify-center"},{default:l(()=>[e(x,{loading:i(_).form,color:"primary",onClick:U},{default:l(()=>[F(" Guardar ")]),_:1},8,["loading"])]),_:1})]),_:1})]),_:1})]),_:1})])}}});const Ae=ae(de,[["__scopeId","data-v-7018c458"]]);export{Ae as default};