import{s as x}from"./helpers-DMPihPy4.js";import{V as O,r as v}from"./VForm-BQiQkQz-.js";import{d as R,r as f,ax as J,M as P,w as Z,Z as h,o as c,c as I,b as e,f as l,ac as z,k as a,C,g as F,G as j,e as w,ad as q,F as H,p as K,q as Q,af as M,al as W,ay as X,a8 as Y}from"./index-Bs2WbdAz.js";import{_ as ee}from"./BtnBack.vue_vue_type_script_setup_true_lang-CL3mBGu5.js";import{_ as ae}from"./AppSelect.vue_vue_type_script_setup_true_lang-D0Cd77lf.js";import{_ as le}from"./AppTextField.vue_vue_type_script_setup_true_lang-CDsRSVsM.js";import{u as oe}from"./useFileUpload-C3qVMGA-.js";import{b as T,V as re}from"./VCard-BspOpUsK.js";import{V as D}from"./VCardText-zYKdyQs7.js";import{V as _,a as d}from"./VRow-ysiYWnAR.js";import{V as te}from"./VInput-C3OcKGmU.js";import{V as ie}from"./VFileInput-DpEz4H6T.js";import{V as ne}from"./VImg-BlPswqtp.js";import{V as se}from"./VDivider-ClP2ZRkO.js";import{V as de}from"./VTooltip-0ZM8oGUy.js";import"./constants-2GBt7OCP.js";import"./forwardRefs-C-GTDzx5.js";import"./ModalQuestion.vue_vue_type_script_setup_true_lang-BpEs5OdO.js";import"./DialogCloseBtn.vue_vue_type_script_setup_true_lang-CL7iUoQP.js";import"./VDialog-BgUnOFX0.js";import"./VOverlay-ANg0gJBd.js";import"./dialog-transition-BJdMOtFa.js";import"./VSelect-DNsSpSEv.js";import"./VTextField-BiVPh_BE.js";import"./VField-Cn8Kq-0i.js";import"./VList-D47dpQDl.js";import"./ssrBoot-C7Rswu4D.js";import"./VAvatar-DZ-0fdCL.js";import"./VMenu-Dy9jsiMP.js";import"./VCheckboxBtn-CUuSqgJb.js";import"./VSelectionControl-B2jVeEAq.js";import"./VChip-DH3Tddx8.js";import"./sweetalert2.esm.all-DOYwHpwi.js";/* empty css              */const ue=w("span",null," Formulario Compañia ",-1),me={class:"d-flex justify-space-between"},pe=w("span",null,"Información de adicional",-1),He=R({__name:"Form",setup(fe){const{toast:G}=X(),V=f({}),k=f(!1),U=Q(),B=f(),m=J({form:!1}),$=f([]),r=f({id:null,name:null,slogan:null,image_principal:null,iframeGoogleMap:null,arrayDetails:[]}),N=()=>{for(const o in r.value)r.value[o]=null;r.value.arrayDetails=[]},A=async()=>{var p;r.value.id=U.params.id||null;const o=r.value.id?`/company/${r.value.id}/edit`:"/company/create";m.form=!0;const{response:i,data:n}=await M(o).get();m.form=!1,(p=i.value)!=null&&p.ok&&n.value&&($.value=n.value.typeDetails,n.value.form&&(r.value=n.value.form))},E=async()=>{var i,n;const o=await((i=B.value)==null?void 0:i.validate());if(o!=null&&o.valid){const p=r.value.id?`/company/update/${r.value.id}`:"/company/store";u.value.imageFile&&(r.value.image_principal=u.value.imageFile);const g=new FormData;for(const s in r.value)["arrayDetails"].includes(s)||g.append(s,r.value[s]);g.append("arrayDetails",JSON.stringify(r.value.arrayDetails)),m.form=!0;const{data:t,response:b}=await M(p).post(g);m.form=!1,(n=b.value)!=null&&n.ok&&t.value&&t.value.code==200&&W.push({name:"Company-List"}),t.value.code===422&&(V.value=t.value.errors??{})}else G("Faltan Campos Por Diligenciar","","danger")};U.params.action=="view"&&(k.value=!0),P(async()=>{N(),await A()});const u=f(oe());u.value.allowedExtensions=["jpg","jpeg","png"],Z(u.value,(o,i)=>{o.imageFile&&(r.value.image_principal=o.imageFile)});const y=h(()=>Object.values(m).some(o=>o)),L=()=>{r.value.arrayDetails.push({id:null,type_detail_id:null,icon:null,color:null,content:null})},S=o=>{r.value.arrayDetails.splice(o,1)};return(o,i)=>{const n=le,p=ae,g=ee;return c(),I("div",null,[e(re,{disabled:a(m).form,loading:a(m).form},{default:l(()=>[e(T,{class:"d-flex justify-space-between"},{default:l(()=>[ue]),_:1}),e(D,null,{default:l(()=>[e(O,{ref_key:"formValidation",ref:B,onSubmit:z(()=>{},["prevent"]),disabled:a(k)},{default:l(()=>[e(_,null,{default:l(()=>[e(d,{sm:"4"},{default:l(()=>[e(_,null,{default:l(()=>[e(d,null,{default:l(()=>[e(te,null,{default:l(()=>[C("Imagen principal")]),_:1}),(c(),F(ie,{accept:"image/*",loading:a(u).loading,onChange:a(u).handleImageSelected,key:a(u).key},null,8,["loading","onChange"]))]),_:1})]),_:1}),a(u).imageUrl||a(r).image_principal?(c(),F(_,{key:0},{default:l(()=>[e(d,{class:"d-flex justify-center"},{default:l(()=>[e(ne,{src:a(u).imageUrl??("storageBack"in o?o.storageBack:a(x))(a(r).image_principal),alt:"alt"},null,8,["src"])]),_:1})]),_:1})):j("",!0)]),_:1}),e(d,{sm:"8"},{default:l(()=>[e(_,null,{default:l(()=>[e(d,{cols:"12"},{default:l(()=>[e(n,{requiredField:!0,rules:["requiredValidator"in o?o.requiredValidator:a(v)],modelValue:a(r).name,"onUpdate:modelValue":i[0]||(i[0]=t=>a(r).name=t),label:"Nombre","error-messages":a(V).name,onInput:i[1]||(i[1]=t=>a(V).name=""),clearable:""},null,8,["rules","modelValue","error-messages"])]),_:1}),e(d,{cols:"12"},{default:l(()=>[e(n,{clearable:"",modelValue:a(r).slogan,"onUpdate:modelValue":i[2]||(i[2]=t=>a(r).slogan=t),rules:["requiredValidator"in o?o.requiredValidator:a(v)],"error-messages":a(V).slogan,label:"Eslogan",onInput:i[3]||(i[3]=t=>a(V).slogan=""),requiredField:!0},null,8,["modelValue","rules","error-messages"])]),_:1}),e(d,{cols:"12"},{default:l(()=>[e(n,{clearable:"",modelValue:a(r).iframeGoogleMap,"onUpdate:modelValue":i[4]||(i[4]=t=>a(r).iframeGoogleMap=t),label:"iframeGoogleMap"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1})]),_:1},8,["disabled"])]),_:1}),e(se,{class:"my-5"}),e(T,{"primary-title":""},{default:l(()=>[w("div",me,[pe,e(q,{color:"success",onClick:i[5]||(i[5]=t=>L())},{default:l(()=>[C("Agregar")]),_:1})])]),_:1}),e(D,null,{default:l(()=>[(c(!0),I(H,null,K(a(r).arrayDetails,(t,b)=>(c(),F(_,{key:b},{default:l(()=>[e(d,{cols:"12",md:"2"},{default:l(()=>[e(p,{items:a($),modelValue:t.type_detail_id,"onUpdate:modelValue":s=>t.type_detail_id=s,label:"Tipo",requiredField:!0},null,8,["items","modelValue","onUpdate:modelValue"])]),_:2},1024),e(d,{cols:"12",md:"2"},{default:l(()=>[e(n,{clearable:"",modelValue:t.icon,"onUpdate:modelValue":s=>t.icon=s,rules:["requiredValidator"in o?o.requiredValidator:a(v)],label:"Icono",requiredField:!0},null,8,["modelValue","onUpdate:modelValue","rules"])]),_:2},1024),e(d,{cols:"12",md:"2"},{default:l(()=>[e(n,{clearable:"",modelValue:t.color,"onUpdate:modelValue":s=>t.color=s,rules:["requiredValidator"in o?o.requiredValidator:a(v)],label:"Color",requiredField:!0},null,8,["modelValue","onUpdate:modelValue","rules"])]),_:2},1024),e(d,{cols:"12",md:"5"},{default:l(()=>[e(n,{clearable:"",modelValue:t.content,"onUpdate:modelValue":s=>t.content=s,rules:["requiredValidator"in o?o.requiredValidator:a(v)],label:"Contenido",requiredField:!0},null,8,["modelValue","onUpdate:modelValue","rules"])]),_:2},1024),e(d,{cols:"12",md:"1"},{default:l(()=>[e(q,{icon:"",color:"error",variant:"text",class:"mt-6",onClick:s=>S(b)},{default:l(()=>[e(Y,{icon:"tabler-trash"}),e(de,{location:"top",transition:"scale-transition",activator:"parent",text:"Eliminar"})]),_:2},1032,["onClick"])]),_:2},1024)]),_:2},1024))),128))]),_:1}),e(D,{class:"d-flex justify-end gap-3 flex-wrap mt-5"},{default:l(()=>[e(g,{disabled:a(y),loading:a(y)},null,8,["disabled","loading"]),a(k)?j("",!0):(c(),F(q,{key:0,disabled:a(y),loading:a(y),onClick:i[6]||(i[6]=t=>E()),color:"primary"},{default:l(()=>[C(" Guardar ")]),_:1},8,["disabled","loading"]))]),_:1})]),_:1},8,["disabled","loading"])])}}});export{He as default};