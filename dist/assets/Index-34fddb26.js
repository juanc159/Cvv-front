import{V as F,r as v}from"./VForm-1d102ff3.js";import{_ as w}from"./AppSelect.vue_vue_type_script_setup_true_lang-80afef27.js";import{d as x,R as B,aF as q,r as m,L as A,af as _,o as y,c as T,b as o,f as r,B as u,k as a,e as D,g as E,ae as I,aA as N}from"./index-e87c998e.js";import{u as S}from"./useImageUpload-6d568f83.js";import{b as $,V as L}from"./VCard-4a612500.js";import{V as R}from"./VCardText-ecc7b3c9.js";import{V as g}from"./VRow-dbcc1c85.js";import{V as p}from"./VCol-40d12692.js";import{V as U}from"./VField-48555cec.js";import{V as j}from"./VFileInput-27d1323b.js";import"./helpers-1cd3e8aa.js";import"./VSelect-117c2caf.js";import"./VTextField-19c0923c.js";import"./VImg-b8e40629.js";import"./VList-725590b5.js";import"./ssrBoot-db5986a3.js";import"./VAvatar-310879b2.js";import"./VDivider-92bccdc3.js";import"./dialog-transition-e0e81da4.js";import"./VMenu-ccd8d291.js";import"./VChip-2fe349dc.js";import"./sweetalert2.esm.all-562d67d8.js";/* empty css              */const me=x({__name:"Index",setup(z){const C=B(),{toast:k}=N(),l=q({form:!1}),s=m({company_id:null,type_education_id:null,archive:null}),f=m({}),c=m(),V=m([]),d=m(S());d.value.allowedExtensions=["xls","xlsx"],A(async()=>{var i;l.form=!0;const{data:t,response:e}=await _("note-dataForm").get();l.form=!1,(i=e.value)!=null&&i.ok&&t.value&&(V.value=t.value.typeEducations)});const b=async()=>{var e;s.value.archive=d.value.imageFile,s.value.company_id=C.company.id;const t=await((e=c.value)==null?void 0:e.validate());if(t!=null&&t.valid){const i=new FormData;for(const n in s.value)i.append(n,s.value[n]);l.form=!0,await _("note-store").post(i),l.form=!1}else k("Faltan Campos Por Diligenciar","","danger")};return(t,e)=>{const i=w;return y(),T("div",null,[o(L,{disabled:a(l).form,loading:a(l).form},{default:r(()=>[o($,{"primary-title":""},{default:r(()=>e[3]||(e[3]=[u("Cargar Notas")])),_:1}),o(R,null,{default:r(()=>[o(a(F),{ref_key:"formValidation",ref:c,"lazy-validation":""},{default:r(()=>[o(g,null,{default:r(()=>[o(p,{cols:"12",sm:"4"},{default:r(()=>[o(i,{clearable:"",modelValue:a(s).type_education_id,"onUpdate:modelValue":e[0]||(e[0]=n=>a(s).type_education_id=n),rules:["requiredValidator"in t?t.requiredValidator:a(v)],"error-messages":a(f).type_education_id,label:"Tipo",onChange:e[1]||(e[1]=n=>a(f).type_education_id=""),requiredField:!0,items:a(V)},null,8,["modelValue","rules","error-messages","items"])]),_:1}),o(p,{cols:"12",sm:"4"},{default:r(()=>[o(U,null,{default:r(()=>e[4]||(e[4]=[u("Archivo "),D("b",{class:"text-warning"},"*",-1)])),_:1}),(y(),E(j,{key:a(d).key,onChange:a(d).handleImageSelected,"onClick:clear":a(d).clearData,rules:["requiredValidator"in t?t.requiredValidator:a(v)]},null,8,["onChange","onClick:clear","rules"]))]),_:1})]),_:1}),o(g,null,{default:r(()=>[o(p,{cols:"12",class:"d-flex justify-center"},{default:r(()=>[o(I,{loading:a(l).form,color:"primary",onClick:e[2]||(e[2]=n=>b())},{default:r(()=>e[5]||(e[5]=[u(" Guardar ")])),_:1},8,["loading"])]),_:1})]),_:1})]),_:1},512)]),_:1})]),_:1},8,["disabled","loading"])])}}});export{me as default};