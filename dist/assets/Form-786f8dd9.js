import{V as R,r as c}from"./VForm-82b534b6.js";import{_ as h}from"./AppSelect.vue_vue_type_script_setup_true_lang-b7e0313d.js";import{_ as z}from"./AppTextField.vue_vue_type_script_setup_true_lang-89ca00f3.js";import{d as K,r as _,j as P,$ as H,E as L,a6 as J,w as O,o as g,c as w,b as e,f as a,t as v,n as r,g as D,e as q,a9 as F,F as Q,i as W,aw as X,ax as Y,a1 as Z,a7 as x}from"./index-c8da8270.js";import{u as ee}from"./useCrudCompanyStore-cfd6d807.js";import{u as ae}from"./useImageUpload-ca33a9cb.js";import{b as $,V as k}from"./VCard-9b637e59.js";import{V as I}from"./VCardText-226732d4.js";import{V as p}from"./VRow-6c5af853.js";import{V as s}from"./VCol-be397803.js";import{V as le}from"./VFileInput-aa46f096.js";import{V as re}from"./VImg-65e8fe20.js";import"./helpers-3edea678.js";import"./VField-0d329c9c.js";import"./VSelect-c16639cd.js";import"./VTextField-8dd14402.js";import"./VList-673f3c47.js";import"./ssrBoot-f295921d.js";import"./VAvatar-9b21ebf5.js";import"./VDivider-a7ab4eb7.js";import"./dialog-transition-331cec7f.js";import"./VMenu-d6764b67.js";import"./VChip-34e261b3.js";import"./sweetalert2.all-ae952bba.js";import"./_commonjsHelpers-725317a4.js";/* empty css              */const oe=q("b",{class:"text-warning"},"*",-1),te={class:"d-flex justify-space-between"},ie=q("span",null,"Información de adicional",-1),Ae=K({__name:"Form",setup(ne){const u=_(ae()),b=P(),{toast:T}=Y(),y=_(),f=ee(),{form:i,loading:B,typeDetails:S}=H(f),m=_({}),C=_([]),N=async()=>{var t,V;const l=await((t=y.value)==null?void 0:t.validate());if(l!=null&&l.valid){const n=await f.fetchSave();(n==null?void 0:n.code)===200&&(C.value=[],m.value={},u.value.clearData(),await((V=y.value)==null?void 0:V.resetValidation())),(n==null?void 0:n.code)===422&&(m.value=n.errors??{})}else T("Faltan Campos Por Diligenciar","","danger")};L(async()=>{f.clearForm(),b.params.id&&await f.fetchDataForm(Number(b.params.id),b.params.action)});const A=J(()=>i.value.arrayDetails.filter(l=>l.delete!=1)),E=()=>{i.value.arrayDetails.push({type_detail_id:null,icon:null,color:null,content:null,delete:0})},G=l=>{i.value.arrayDetails[l].id?i.value.arrayDetails[l].delete=1:i.value.arrayDetails.splice(l,1)};O(i,(l,t)=>{l.id?C.value.image_principal=[]:C.value.image_principal=[c(u.value.imageUrl)]},{deep:!0});const M=l=>{u.value.handleImageSelected(l),setTimeout(()=>{i.value.image_principal=u.value.imageFile},1e3)};return(l,t)=>{const V=X,n=z,j=h;return g(),w("div",null,[e(V,{"sub-title":"Formulario de compañia",action:String(l.$route.params.action),"btn-action":"list","validate-crud":!0,"btn-back":!0,onChangeScreenBack:l.$router.back},null,8,["action","onChangeScreenBack"]),e(k,null,{default:a(()=>[e($,{"primary-title":""},{default:a(()=>[v("Información principal")]),_:1}),e(I,null,{default:a(()=>[e(p,null,{default:a(()=>[e(s)]),_:1}),e(r(R),{ref_key:"formValidation",ref:y,"lazy-validation":""},{default:a(()=>[e(p,null,{default:a(()=>[e(s,{cols:"12",md:"4"},{default:a(()=>[e(n,{clearable:"",modelValue:r(i).name,"onUpdate:modelValue":t[0]||(t[0]=o=>r(i).name=o),rules:["requiredValidator"in l?l.requiredValidator:r(c)],"error-messages":r(m).name,label:"Nombre",onKeypress:t[1]||(t[1]=o=>r(m).name=""),requiredField:!0},null,8,["modelValue","rules","error-messages"])]),_:1}),e(s,{cols:"12",md:"4"},{default:a(()=>[e(n,{clearable:"",modelValue:r(i).slogan,"onUpdate:modelValue":t[2]||(t[2]=o=>r(i).slogan=o),rules:["requiredValidator"in l?l.requiredValidator:r(c)],"error-messages":r(m).slogan,label:"Eslogan",onKeypress:t[3]||(t[3]=o=>r(m).slogan=""),requiredField:!0},null,8,["modelValue","rules","error-messages"])]),_:1}),e(s,{cols:"12",md:"4"},{default:a(()=>[e(n,{clearable:"",modelValue:r(i).iframeGoogleMap,"onUpdate:modelValue":t[4]||(t[4]=o=>r(i).iframeGoogleMap=o),label:"iframeGoogleMap",requiredField:!0},null,8,["modelValue"])]),_:1})]),_:1}),e(p,null,{default:a(()=>[e(s,{cols:"12",sm:"3"},{default:a(()=>[(g(),D(le,{accept:"image/*",key:r(u).key,onChange:t[5]||(t[5]=o=>M(o)),"onClick:clear":r(u).clearData},{label:a(()=>[v(" Imagen Principal "),oe]),_:1},8,["onClick:clear"]))]),_:1})]),_:1}),e(p,null,{default:a(()=>[e(s,{cols:"12"},{default:a(()=>[e(k,{width:"400"},{default:a(()=>[e(re,{src:r(u).imageUrl??r(i).image_principal},null,8,["src"])]),_:1})]),_:1})]),_:1})]),_:1},512)]),_:1})]),_:1}),e(k,{class:"mt-5"},{default:a(()=>[e($,{"primary-title":""},{default:a(()=>[q("div",te,[ie,e(F,{color:"success",onClick:t[6]||(t[6]=o=>E())},{default:a(()=>[v("Agregar")]),_:1})])]),_:1}),e(I,null,{default:a(()=>[(g(!0),w(Q,null,W(r(A),(o,U)=>(g(),D(p,{key:U},{default:a(()=>[e(s,{cols:"12",md:"2"},{default:a(()=>[e(j,{items:r(S),modelValue:o.type_detail_id,"onUpdate:modelValue":d=>o.type_detail_id=d,label:"Tipo",requiredField:!0},null,8,["items","modelValue","onUpdate:modelValue"])]),_:2},1024),e(s,{cols:"12",md:"2"},{default:a(()=>[e(n,{clearable:"",modelValue:o.icon,"onUpdate:modelValue":d=>o.icon=d,rules:["requiredValidator"in l?l.requiredValidator:r(c)],label:"Icono",requiredField:!0},null,8,["modelValue","onUpdate:modelValue","rules"])]),_:2},1024),e(s,{cols:"12",md:"2"},{default:a(()=>[e(n,{clearable:"",modelValue:o.color,"onUpdate:modelValue":d=>o.color=d,rules:["requiredValidator"in l?l.requiredValidator:r(c)],label:"Color",requiredField:!0},null,8,["modelValue","onUpdate:modelValue","rules"])]),_:2},1024),e(s,{cols:"12",md:"5"},{default:a(()=>[e(n,{clearable:"",modelValue:o.content,"onUpdate:modelValue":d=>o.content=d,rules:["requiredValidator"in l?l.requiredValidator:r(c)],label:"Contenido",requiredField:!0},null,8,["modelValue","onUpdate:modelValue","rules"])]),_:2},1024),e(s,{cols:"12",md:"1"},{default:a(()=>[e(F,{icon:"",size:"x-small",color:"error",variant:"text",class:"mt-6",onClick:d=>G(U)},{default:a(()=>[e(Z,{icon:"tabler-trash"}),e(x,{location:"top",transition:"scale-transition",activator:"parent",text:"Eliminar"})]),_:2},1032,["onClick"])]),_:2},1024)]),_:2},1024))),128))]),_:1})]),_:1}),e(p,{class:"mt-5"},{default:a(()=>[e(s,{cols:"12",class:"d-flex justify-center"},{default:a(()=>[e(F,{loading:r(B).form,color:"primary",onClick:N},{default:a(()=>[v(" Guardar ")]),_:1},8,["loading"])]),_:1})]),_:1})])}}});export{Ae as default};