import{V as F,r as f}from"./VForm-4b2663df.js";import{_ as q}from"./AppTextField.vue_vue_type_script_setup_true_lang-a9dd36c3.js";import{_ as S}from"./AppSelect.vue_vue_type_script_setup_true_lang-4e86becd.js";import{d as k,j as $,r as b,a0 as w,$ as B,E as T,o as j,c as A,b as r,f as t,n as e,a9 as N,t as E,aw as R,ax as U}from"./index-4eb24df8.js";import{u as D}from"./useCrudSubjectStore-90febddb.js";import{V as K}from"./VCardText-f91f4ac1.js";import{V as c}from"./VRow-f760e8c0.js";import{V as u}from"./VCol-00f2d921.js";import{V as z}from"./VCard-ce961bf6.js";import"./helpers-3edea678.js";import"./VField-1c65ff78.js";import"./VTextField-32e997f0.js";import"./VImg-67e70e7a.js";import"./VSelect-4e15f533.js";import"./VList-8d710a46.js";import"./ssrBoot-f72363e6.js";import"./VAvatar-1e92a85e.js";import"./VDivider-8b44441e.js";import"./dialog-transition-27de2546.js";import"./VMenu-95167406.js";import"./VChip-1061562c.js";/* empty css              */const ne=k({__name:"Form",setup(G){const V=$(),{toast:g}=U(),p=b(),d=D();w();const{form:n,loading:y,typeEducations:v}=B(d),s=b({}),C=async()=>{var o,m;const a=await((o=p.value)==null?void 0:o.validate());if(a!=null&&a.valid){const l=await d.fetchSave();(l==null?void 0:l.code)===200&&(s.value={},await((m=p.value)==null?void 0:m.resetValidation())),(l==null?void 0:l.code)===422&&(s.value=l.errors??{})}else g("Faltan Campos Por Diligenciar","","danger")};return T(async()=>{d.clearForm(),await d.fetchDataForm(Number(V.params.id),V.params.action)}),(a,o)=>{const m=R,l=S,_=q;return j(),A("div",null,[r(z,null,{default:t(()=>[r(K,null,{default:t(()=>[r(c,null,{default:t(()=>[r(u,null,{default:t(()=>[r(m,{"sub-title":"Formulario Subject",action:String(a.$route.params.action),"btn-action":"list","validate-crud":!0,"btn-back":!0,onChangeScreenBack:a.$router.back},null,8,["action","onChangeScreenBack"])]),_:1})]),_:1}),r(e(F),{ref_key:"formValidation",ref:p,"lazy-validation":""},{default:t(()=>[r(c,null,{default:t(()=>[r(u,{cols:"12",sm:"3"},{default:t(()=>[r(l,{clearable:"",modelValue:e(n).type_education_id,"onUpdate:modelValue":o[0]||(o[0]=i=>e(n).type_education_id=i),rules:["requiredValidator"in a?a.requiredValidator:e(f)],"error-messages":e(s).type_education_id,label:"Tipo",onChange:o[1]||(o[1]=i=>e(s).type_education_id=""),requiredField:!0,items:e(v)},null,8,["modelValue","rules","error-messages","items"])]),_:1}),r(u,{cols:"12",sm:"3"},{default:t(()=>[r(_,{clearable:"",modelValue:e(n).name,"onUpdate:modelValue":o[2]||(o[2]=i=>e(n).name=i),rules:["requiredValidator"in a?a.requiredValidator:e(f)],"error-messages":e(s).name,label:"Nombre",onKeypress:o[3]||(o[3]=i=>e(s).name=""),requiredField:!0},null,8,["modelValue","rules","error-messages"])]),_:1}),r(u,{cols:"12",sm:"3"},{default:t(()=>[r(_,{clearable:"",modelValue:e(n).code,"onUpdate:modelValue":o[4]||(o[4]=i=>e(n).code=i),rules:["requiredValidator"in a?a.requiredValidator:e(f)],"error-messages":e(s).code,label:"Codigo",onKeypress:o[5]||(o[5]=i=>e(s).code=""),requiredField:!0},null,8,["modelValue","rules","error-messages"])]),_:1})]),_:1}),r(c,null,{default:t(()=>[r(u,{cols:"12",class:"d-flex justify-center"},{default:t(()=>[r(N,{loading:e(y).form,color:"primary",onClick:C},{default:t(()=>[E(" Guardar ")]),_:1},8,["loading"])]),_:1})]),_:1})]),_:1},512)]),_:1})]),_:1})])}}});export{ne as default};