import{s as O}from"./helpers-UI-owBqb.js";import{V as R,r as v,u as J}from"./VForm-CflzIkWC.js";import{d as P,r as p,ax as Z,M as x,w as z,Z as H,o as c,c as $,b as e,f as o,k as a,q as K,af as I,ac as Q,C,g as F,G as M,e as w,ad as q,F as W,p as X,a8 as Y,al as h,ay as ee}from"./index-JUHG3Ra0.js";import{_ as ae}from"./BtnBack.vue_vue_type_script_setup_true_lang-Dfx70-XL.js";import{_ as le}from"./AppSelect.vue_vue_type_script_setup_true_lang-BHJiiSco.js";import{_ as oe}from"./AppTextField.vue_vue_type_script_setup_true_lang-CslU3hDe.js";import{u as re,V as te}from"./VFileInput-D_pwcqfe.js";import{V as ie,b as T}from"./VCard-DXan6Vt5.js";import{V as D}from"./VCardText-By1jDnqr.js";import{V as _,a as s}from"./VRow-B_Bm4wRW.js";import{V as ne}from"./VInput-CY4MTOYJ.js";import{V as se}from"./VImg-C7-MYBA0.js";import{V as de}from"./VDivider-DHEp3EFP.js";import{V as ue}from"./VTooltip-nRVzOrS2.js";import"./constants-2GBt7OCP.js";import"./forwardRefs-C-GTDzx5.js";import"./ModalQuestion.vue_vue_type_script_setup_true_lang-DLsum5uP.js";import"./DialogCloseBtn.vue_vue_type_script_setup_true_lang-C2V2K0F0.js";import"./VDialog-CvpPl8_0.js";import"./VOverlay-CissfPw_.js";import"./dialog-transition-C9ljwMdM.js";import"./VSelect-BhqTQBvj.js";import"./VTextField-Gu-kcpQN.js";import"./VList-Dm6mWoDV.js";import"./ssrBoot-B12CodCw.js";import"./VAvatar-DGTv0c_w.js";import"./VMenu-Bc2Z9qal.js";import"./VCheckboxBtn-8v2bFSE5.js";import"./VSelectionControl-8oBj7FIk.js";import"./VChip-Djdvgybf.js";import"./sweetalert2.esm.all-DOYwHpwi.js";/* empty css              */const me=w("span",null," Formulario Compañia ",-1),pe={class:"d-flex justify-space-between"},fe=w("span",null,"Información de adicional",-1),He=P({__name:"Form",setup(ce){const{toast:G}=ee(),V=p({}),k=p(!1),U=K(),B=p(),m=Z({form:!1}),j=p([]),r=p({id:null,name:null,slogan:null,image_principal:null,iframeGoogleMap:null,students_pending_subject:null,arrayDetails:[]}),N=()=>{for(const l in r.value)r.value[l]=null;r.value.arrayDetails=[]},A=async()=>{var f;r.value.id=U.params.id||null;const l=r.value.id?`/company/${r.value.id}/edit`:"/company/create";m.form=!0;const{response:i,data:n}=await I(l).get();m.form=!1,(f=i.value)!=null&&f.ok&&n.value&&(j.value=n.value.typeDetails,n.value.form&&(r.value=n.value.form))},E=async()=>{var i,n;const l=await((i=B.value)==null?void 0:i.validate());if(l!=null&&l.valid){const f=r.value.id?`/company/update/${r.value.id}`:"/company/store";u.value.imageFile&&(r.value.image_principal=u.value.imageFile);const g=new FormData;for(const d in r.value)["arrayDetails"].includes(d)||g.append(d,r.value[d]);g.append("arrayDetails",JSON.stringify(r.value.arrayDetails)),m.form=!0;const{data:t,response:b}=await I(f).post(g);m.form=!1,(n=b.value)!=null&&n.ok&&t.value&&t.value.code==200&&h.push({name:"Company-List"}),t.value.code===422&&(V.value=t.value.errors??{})}else G("Faltan Campos Por Diligenciar","","danger")};U.params.action=="view"&&(k.value=!0),x(async()=>{N(),await A()});const u=p(re());u.value.allowedExtensions=["jpg","jpeg","png"],z(u.value,(l,i)=>{l.imageFile&&(r.value.image_principal=l.imageFile)});const y=H(()=>Object.values(m).some(l=>l)),L=()=>{r.value.arrayDetails.push({id:null,type_detail_id:null,icon:null,color:null,content:null})},S=l=>{r.value.arrayDetails.splice(l,1)};return p(),(l,i)=>{const n=oe,f=le,g=ae;return c(),$("div",null,[e(ie,{disabled:a(m).form,loading:a(m).form},{default:o(()=>[e(T,{class:"d-flex justify-space-between"},{default:o(()=>[me]),_:1}),e(D,null,{default:o(()=>[e(R,{ref_key:"formValidation",ref:B,onSubmit:Q(()=>{},["prevent"]),disabled:a(k)},{default:o(()=>[e(_,null,{default:o(()=>[e(s,{sm:"4"},{default:o(()=>[e(_,null,{default:o(()=>[e(s,null,{default:o(()=>[e(ne,null,{default:o(()=>[C("Imagen principal")]),_:1}),(c(),F(te,{accept:"image/*",loading:a(u).loading,onChange:a(u).handleImageSelected,key:a(u).key},null,8,["loading","onChange"]))]),_:1})]),_:1}),a(u).imageUrl||a(r).image_principal?(c(),F(_,{key:0},{default:o(()=>[e(s,{class:"d-flex justify-center"},{default:o(()=>[e(se,{src:a(u).imageUrl??("storageBack"in l?l.storageBack:a(O))(a(r).image_principal),alt:"alt"},null,8,["src"])]),_:1})]),_:1})):M("",!0)]),_:1}),e(s,{sm:"8"},{default:o(()=>[e(_,null,{default:o(()=>[e(s,{cols:"12"},{default:o(()=>[e(n,{requiredField:!0,rules:["requiredValidator"in l?l.requiredValidator:a(v)],modelValue:a(r).name,"onUpdate:modelValue":i[0]||(i[0]=t=>a(r).name=t),label:"Nombre","error-messages":a(V).name,onInput:i[1]||(i[1]=t=>a(V).name=""),clearable:""},null,8,["rules","modelValue","error-messages"])]),_:1}),e(s,{cols:"12"},{default:o(()=>[e(n,{clearable:"",modelValue:a(r).slogan,"onUpdate:modelValue":i[2]||(i[2]=t=>a(r).slogan=t),rules:["requiredValidator"in l?l.requiredValidator:a(v)],"error-messages":a(V).slogan,label:"Eslogan",onInput:i[3]||(i[3]=t=>a(V).slogan=""),requiredField:!0},null,8,["modelValue","rules","error-messages"])]),_:1}),e(s,{cols:"12"},{default:o(()=>[e(n,{clearable:"",modelValue:a(r).iframeGoogleMap,"onUpdate:modelValue":i[4]||(i[4]=t=>a(r).iframeGoogleMap=t),label:"iframeGoogleMap"},null,8,["modelValue"])]),_:1}),e(s,{cols:"12"},{default:o(()=>[e(n,{modelValue:a(r).students_pending_subject,"onUpdate:modelValue":i[5]||(i[5]=t=>a(r).students_pending_subject=t),label:"Documento de materia pendiente",clearable:"",rules:["urlValidator"in l?l.urlValidator:a(J)]},null,8,["modelValue","rules"])]),_:1})]),_:1})]),_:1})]),_:1})]),_:1},8,["disabled"])]),_:1}),e(de,{class:"my-5"}),e(T,{"primary-title":""},{default:o(()=>[w("div",pe,[fe,e(q,{color:"success",onClick:i[6]||(i[6]=t=>L())},{default:o(()=>[C("Agregar")]),_:1})])]),_:1}),e(D,null,{default:o(()=>[(c(!0),$(W,null,X(a(r).arrayDetails,(t,b)=>(c(),F(_,{key:b},{default:o(()=>[e(s,{cols:"12",md:"2"},{default:o(()=>[e(f,{items:a(j),modelValue:t.type_detail_id,"onUpdate:modelValue":d=>t.type_detail_id=d,label:"Tipo",requiredField:!0},null,8,["items","modelValue","onUpdate:modelValue"])]),_:2},1024),e(s,{cols:"12",md:"2"},{default:o(()=>[e(n,{clearable:"",modelValue:t.icon,"onUpdate:modelValue":d=>t.icon=d,rules:["requiredValidator"in l?l.requiredValidator:a(v)],label:"Icono",requiredField:!0},null,8,["modelValue","onUpdate:modelValue","rules"])]),_:2},1024),e(s,{cols:"12",md:"2"},{default:o(()=>[e(n,{clearable:"",modelValue:t.color,"onUpdate:modelValue":d=>t.color=d,rules:["requiredValidator"in l?l.requiredValidator:a(v)],label:"Color",requiredField:!0},null,8,["modelValue","onUpdate:modelValue","rules"])]),_:2},1024),e(s,{cols:"12",md:"5"},{default:o(()=>[e(n,{clearable:"",modelValue:t.content,"onUpdate:modelValue":d=>t.content=d,rules:["requiredValidator"in l?l.requiredValidator:a(v)],label:"Contenido",requiredField:!0},null,8,["modelValue","onUpdate:modelValue","rules"])]),_:2},1024),e(s,{cols:"12",md:"1"},{default:o(()=>[e(q,{icon:"",color:"error",variant:"text",class:"mt-6",onClick:d=>S(b)},{default:o(()=>[e(Y,{icon:"tabler-trash"}),e(ue,{location:"top",transition:"scale-transition",activator:"parent",text:"Eliminar"})]),_:2},1032,["onClick"])]),_:2},1024)]),_:2},1024))),128))]),_:1}),e(D,{class:"d-flex justify-end gap-3 flex-wrap mt-5"},{default:o(()=>[e(g,{disabled:a(y),loading:a(y)},null,8,["disabled","loading"]),a(k)?M("",!0):(c(),F(q,{key:0,disabled:a(y),loading:a(y),onClick:i[7]||(i[7]=t=>E()),color:"primary"},{default:o(()=>[C(" Guardar ")]),_:1},8,["disabled","loading"]))]),_:1})]),_:1},8,["disabled","loading"])])}}});export{He as default};