import{V as R,r as p}from"./VForm-1d102ff3.js";import{_ as j}from"./AppSelect.vue_vue_type_script_setup_true_lang-80afef27.js";import{_ as K}from"./AppTextField.vue_vue_type_script_setup_true_lang-1438879e.js";import{d as L,r as g,Q as P,L as H,ab as Q,w as J,o as v,c as w,b as e,f as l,B as b,k as o,g as D,e as F,ae as k,F as O,m as W,p as X,az as Y,aA as Z,a6 as x,ac as h}from"./index-e87c998e.js";import{u as ee}from"./useCrudCompanyStore-52bbebee.js";import{u as ae}from"./useImageUpload-6d568f83.js";import{b as $,V as q}from"./VCard-4a612500.js";import{V as B}from"./VCardText-ecc7b3c9.js";import{V as f}from"./VRow-dbcc1c85.js";import{V as s}from"./VCol-40d12692.js";import{V as le}from"./VFileInput-27d1323b.js";import{V as re}from"./VImg-b8e40629.js";import"./helpers-1cd3e8aa.js";import"./VField-48555cec.js";import"./VSelect-117c2caf.js";import"./VTextField-19c0923c.js";import"./VList-725590b5.js";import"./ssrBoot-db5986a3.js";import"./VAvatar-310879b2.js";import"./VDivider-92bccdc3.js";import"./dialog-transition-e0e81da4.js";import"./VMenu-ccd8d291.js";import"./VChip-2fe349dc.js";import"./sweetalert2.esm.all-562d67d8.js";/* empty css              */const oe={class:"d-flex justify-space-between"},Te=L({__name:"Form",setup(te){const u=g(ae()),y=X(),{toast:I}=Z(),_=g(),c=ee(),{form:i,loading:T,typeDetails:S}=P(c),m=g({}),C=g([]),A=async()=>{var a,V;const r=await((a=_.value)==null?void 0:a.validate());if(r!=null&&r.valid){const n=await c.fetchSave();(n==null?void 0:n.code)===200&&(C.value=[],m.value={},u.value.clearData(),await((V=_.value)==null?void 0:V.resetValidation())),(n==null?void 0:n.code)===422&&(m.value=n.errors??{})}else I("Faltan Campos Por Diligenciar","","danger")};H(async()=>{c.clearForm(),y.params.id&&await c.fetchDataForm(Number(y.params.id),y.params.action)});const N=Q(()=>i.value.arrayDetails.filter(r=>r.delete!=1)),G=()=>{i.value.arrayDetails.push({type_detail_id:null,icon:null,color:null,content:null,delete:0})},M=r=>{i.value.arrayDetails[r].id?i.value.arrayDetails[r].delete=1:i.value.arrayDetails.splice(r,1)};J(i,(r,a)=>{r.id?C.value.image_principal=[]:C.value.image_principal=[p(u.value.imageUrl)]},{deep:!0});const z=r=>{u.value.handleImageSelected(r),setTimeout(()=>{i.value.image_principal=u.value.imageFile},1e3)};return(r,a)=>{const V=Y,n=K,E=j;return v(),w("div",null,[e(V,{"sub-title":"Formulario de compañia",action:String(r.$route.params.action),"btn-action":"list","validate-crud":!0,"btn-back":!0,onChangeScreenBack:r.$router.back},null,8,["action","onChangeScreenBack"]),e(q,null,{default:l(()=>[e($,{"primary-title":""},{default:l(()=>a[8]||(a[8]=[b("Información principal")])),_:1}),e(B,null,{default:l(()=>[e(f,null,{default:l(()=>[e(s)]),_:1}),e(o(R),{ref_key:"formValidation",ref:_,"lazy-validation":""},{default:l(()=>[e(f,null,{default:l(()=>[e(s,{cols:"12",md:"4"},{default:l(()=>[e(n,{clearable:"",modelValue:o(i).name,"onUpdate:modelValue":a[0]||(a[0]=t=>o(i).name=t),rules:["requiredValidator"in r?r.requiredValidator:o(p)],"error-messages":o(m).name,label:"Nombre",onKeypress:a[1]||(a[1]=t=>o(m).name=""),requiredField:!0},null,8,["modelValue","rules","error-messages"])]),_:1}),e(s,{cols:"12",md:"4"},{default:l(()=>[e(n,{clearable:"",modelValue:o(i).slogan,"onUpdate:modelValue":a[2]||(a[2]=t=>o(i).slogan=t),rules:["requiredValidator"in r?r.requiredValidator:o(p)],"error-messages":o(m).slogan,label:"Eslogan",onKeypress:a[3]||(a[3]=t=>o(m).slogan=""),requiredField:!0},null,8,["modelValue","rules","error-messages"])]),_:1}),e(s,{cols:"12",md:"4"},{default:l(()=>[e(n,{clearable:"",modelValue:o(i).iframeGoogleMap,"onUpdate:modelValue":a[4]||(a[4]=t=>o(i).iframeGoogleMap=t),label:"iframeGoogleMap",requiredField:!0},null,8,["modelValue"])]),_:1})]),_:1}),e(f,null,{default:l(()=>[e(s,{cols:"12",sm:"3"},{default:l(()=>[(v(),D(le,{accept:"image/*",key:o(u).key,onChange:a[5]||(a[5]=t=>z(t)),"onClick:clear":o(u).clearData},{label:l(()=>a[9]||(a[9]=[b(" Imagen Principal "),F("b",{class:"text-warning"},"*",-1)])),_:1},8,["onClick:clear"]))]),_:1})]),_:1}),e(f,null,{default:l(()=>[e(s,{cols:"12"},{default:l(()=>[e(q,{width:"400"},{default:l(()=>[e(re,{src:o(u).imageUrl??o(i).image_principal},null,8,["src"])]),_:1})]),_:1})]),_:1})]),_:1},512)]),_:1})]),_:1}),e(q,{class:"mt-5"},{default:l(()=>[e($,{"primary-title":""},{default:l(()=>[F("div",oe,[a[11]||(a[11]=F("span",null,"Información de adicional",-1)),e(k,{color:"success",onClick:a[6]||(a[6]=t=>G())},{default:l(()=>a[10]||(a[10]=[b("Agregar")])),_:1})])]),_:1}),e(B,null,{default:l(()=>[(v(!0),w(O,null,W(o(N),(t,U)=>(v(),D(f,{key:U},{default:l(()=>[e(s,{cols:"12",md:"2"},{default:l(()=>[e(E,{items:o(S),modelValue:t.type_detail_id,"onUpdate:modelValue":d=>t.type_detail_id=d,label:"Tipo",requiredField:!0},null,8,["items","modelValue","onUpdate:modelValue"])]),_:2},1024),e(s,{cols:"12",md:"2"},{default:l(()=>[e(n,{clearable:"",modelValue:t.icon,"onUpdate:modelValue":d=>t.icon=d,rules:["requiredValidator"in r?r.requiredValidator:o(p)],label:"Icono",requiredField:!0},null,8,["modelValue","onUpdate:modelValue","rules"])]),_:2},1024),e(s,{cols:"12",md:"2"},{default:l(()=>[e(n,{clearable:"",modelValue:t.color,"onUpdate:modelValue":d=>t.color=d,rules:["requiredValidator"in r?r.requiredValidator:o(p)],label:"Color",requiredField:!0},null,8,["modelValue","onUpdate:modelValue","rules"])]),_:2},1024),e(s,{cols:"12",md:"5"},{default:l(()=>[e(n,{clearable:"",modelValue:t.content,"onUpdate:modelValue":d=>t.content=d,rules:["requiredValidator"in r?r.requiredValidator:o(p)],label:"Contenido",requiredField:!0},null,8,["modelValue","onUpdate:modelValue","rules"])]),_:2},1024),e(s,{cols:"12",md:"1"},{default:l(()=>[e(k,{icon:"",size:"x-small",color:"error",variant:"text",class:"mt-6",onClick:d=>M(U)},{default:l(()=>[e(x,{icon:"tabler-trash"}),e(h,{location:"top",transition:"scale-transition",activator:"parent",text:"Eliminar"})]),_:2},1032,["onClick"])]),_:2},1024)]),_:2},1024))),128))]),_:1})]),_:1}),e(f,{class:"mt-5"},{default:l(()=>[e(s,{cols:"12",class:"d-flex justify-center"},{default:l(()=>[e(k,{loading:o(T).form,color:"primary",onClick:a[7]||(a[7]=t=>A())},{default:l(()=>a[12]||(a[12]=[b(" Guardar ")])),_:1},8,["loading"])]),_:1})]),_:1})])}}});export{Te as default};