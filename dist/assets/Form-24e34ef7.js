import{V as k,r as f}from"./VForm-93a57085.js";import{_ as q}from"./AppTextField.vue_vue_type_script_setup_true_lang-5b730ec1.js";import{_ as S}from"./AppSelect.vue_vue_type_script_setup_true_lang-56c369f6.js";import{d as $,r as c,R as w,Q as B,L as T,o as A,c as j,b as r,f as t,k as o,ae as N,B as R,p as U,az as D,aA as z}from"./index-ba2685b5.js";import{u as E}from"./useImageUpload-548d0096.js";import{u as K}from"./useCrudSubjectStore-e54c0c9d.js";import{V as G}from"./VCardText-27ca00f5.js";import{V}from"./VRow-3431edda.js";import{V as u}from"./VCol-b72a8398.js";import{V as H}from"./VCard-1dca3b92.js";import"./helpers-53221d8d.js";import"./VField-e5cc8e8a.js";import"./VTextField-0453d93a.js";import"./VImg-2b1475bc.js";import"./VSelect-8440ed8f.js";import"./VList-dc57db0b.js";import"./ssrBoot-5fdfebdb.js";import"./VAvatar-ade85f75.js";import"./VDivider-c2c0a35b.js";import"./dialog-transition-c42e04e3.js";import"./VMenu-0d10e868.js";import"./VChip-c897905c.js";import"./sweetalert2.esm.all-562d67d8.js";/* empty css              */const pe=$({__name:"Form",setup(I){const _=U(),{toast:g}=z(),p=c(),m=K();w();const{form:n,loading:v,typeEducations:y}=B(m),C=c(E()),i=c({}),F=async()=>{var e,d;const a=await((e=p.value)==null?void 0:e.validate());if(a!=null&&a.valid){const l=await m.fetchSave();(l==null?void 0:l.code)===200&&(i.value={},C.value.clearData(),await((d=p.value)==null?void 0:d.resetValidation())),(l==null?void 0:l.code)===422&&(i.value=l.errors??{})}else g("Faltan Campos Por Diligenciar","","danger")};return T(async()=>{m.clearForm(),await m.fetchDataForm(Number(_.params.id),_.params.action)}),(a,e)=>{const d=D,l=S,b=q;return A(),j("div",null,[r(H,null,{default:t(()=>[r(G,null,{default:t(()=>[r(V,null,{default:t(()=>[r(u,null,{default:t(()=>[r(d,{"sub-title":"Formulario Subject",action:String(a.$route.params.action),"btn-action":"list","validate-crud":!0,"btn-back":!0,onChangeScreenBack:a.$router.back},null,8,["action","onChangeScreenBack"])]),_:1})]),_:1}),r(o(k),{ref_key:"formValidation",ref:p,"lazy-validation":""},{default:t(()=>[r(V,null,{default:t(()=>[r(u,{cols:"12",sm:"3"},{default:t(()=>[r(l,{clearable:"",modelValue:o(n).type_education_id,"onUpdate:modelValue":e[0]||(e[0]=s=>o(n).type_education_id=s),rules:["requiredValidator"in a?a.requiredValidator:o(f)],"error-messages":o(i).type_education_id,label:"Tipo",onChange:e[1]||(e[1]=s=>o(i).type_education_id=""),requiredField:!0,items:o(y)},null,8,["modelValue","rules","error-messages","items"])]),_:1}),r(u,{cols:"12",sm:"3"},{default:t(()=>[r(b,{clearable:"",modelValue:o(n).name,"onUpdate:modelValue":e[2]||(e[2]=s=>o(n).name=s),rules:["requiredValidator"in a?a.requiredValidator:o(f)],"error-messages":o(i).name,label:"Nombre",onKeypress:e[3]||(e[3]=s=>o(i).name=""),requiredField:!0},null,8,["modelValue","rules","error-messages"])]),_:1}),r(u,{cols:"12",sm:"3"},{default:t(()=>[r(b,{clearable:"",modelValue:o(n).code,"onUpdate:modelValue":e[4]||(e[4]=s=>o(n).code=s),rules:["requiredValidator"in a?a.requiredValidator:o(f)],"error-messages":o(i).code,label:"Codigo",onKeypress:e[5]||(e[5]=s=>o(i).code=""),requiredField:!0},null,8,["modelValue","rules","error-messages"])]),_:1})]),_:1}),r(V,null,{default:t(()=>[r(u,{cols:"12",class:"d-flex justify-center"},{default:t(()=>[r(N,{loading:o(v).form,color:"primary",onClick:e[6]||(e[6]=s=>F())},{default:t(()=>e[7]||(e[7]=[R(" Guardar ")])),_:1},8,["loading"])]),_:1})]),_:1})]),_:1},512)]),_:1})]),_:1})])}}});export{pe as default};