import{r as B,V as L}from"./VForm-CflzIkWC.js";import{s as N}from"./helpers-UI-owBqb.js";import{A as O}from"./constants-2GBt7OCP.js";import{d as P,U as K,r as f,ax as M,M as Y,Z as b,o as d,c as y,b as l,f as i,k as e,q as G,af as D,a as z,ac as H,C as F,G as E,g as h,F as Z,p as J,D as Q,ad as W,e as X,al as ee,ay as ae}from"./index-JUHG3Ra0.js";import{_ as oe}from"./BtnBack.vue_vue_type_script_setup_true_lang-Dfx70-XL.js";import{_ as te}from"./AppTextField.vue_vue_type_script_setup_true_lang-CslU3hDe.js";import{u as le,V as re}from"./VFileInput-D_pwcqfe.js";import{V as ie,b as se}from"./VCard-DXan6Vt5.js";import{V as T}from"./VCardText-By1jDnqr.js";import{V as ne,a as g}from"./VRow-B_Bm4wRW.js";import{V as ue}from"./VInput-CY4MTOYJ.js";import{V as me}from"./VImg-C7-MYBA0.js";import{V as de}from"./VAlert-DHdQe3lw.js";import"./forwardRefs-C-GTDzx5.js";import"./ModalQuestion.vue_vue_type_script_setup_true_lang-DLsum5uP.js";import"./DialogCloseBtn.vue_vue_type_script_setup_true_lang-C2V2K0F0.js";import"./VDialog-CvpPl8_0.js";import"./VOverlay-CissfPw_.js";import"./dialog-transition-C9ljwMdM.js";import"./VTooltip-nRVzOrS2.js";import"./VTextField-Gu-kcpQN.js";import"./sweetalert2.esm.all-DOYwHpwi.js";import"./VChip-Djdvgybf.js";import"./VAvatar-DGTv0c_w.js";/* empty css              */const ce=X("span",null," Formulario servicio ",-1),fe={key:0,class:"text-warning"},Ne=P({__name:"Form",setup(pe){const A=K(),{toast:x}=ae(),c=f({}),V=f(!1),w=G(),C=f(),n=M({form:!1}),a=f({id:null,image:null,title:null,html:null,company_id:null}),S=()=>{for(const o in a.value)a.value[o]=null},$=async()=>{var m;a.value.id=w.params.id||null;const o=a.value.id?`/service/${a.value.id}/edit`:"/service/create";n.form=!0;const{response:t,data:s}=await D(o).get();n.form=!1,(m=t.value)!=null&&m.ok&&s.value&&s.value.form&&(a.value=s.value.form)},j=async()=>{var t,s;const o=await((t=C.value)==null?void 0:t.validate());if(o!=null&&o.valid){a.value.company_id=A.company.id;const m=a.value.id?`/service/update/${a.value.id}`:"/service/store",v=new FormData;for(const _ in a.value)["arrayDetails"].includes(_)||v.append(_,a.value[_]);n.form=!0;const{data:r,response:k}=await D(m).post(v);n.form=!1,(s=k.value)!=null&&s.ok&&r.value&&r.value.code==200&&ee.push({name:"Service-List"}),r.value.code===422&&(c.value=r.value.errors??{})}else x("Faltan Campos Por Diligenciar","","danger")};w.params.action=="view"&&(V.value=!0),Y(async()=>{S(),await $()});const p=b(()=>Object.values(n).some(o=>o)),u=f(le()),q=["jpg","jpeg","png"];u.value.allowedExtensions=q;const R=o=>{u.value.handleImageSelected(o),setTimeout(()=>{a.value.image=u.value.imageFile},1e3)},U=b(()=>{if(c.value.html)return c.value.html}),I=b(()=>a.value.id?[]:[B]);return(o,t)=>{const s=te,m=z("Editor"),v=oe;return d(),y("div",null,[l(ie,{disabled:e(n).form,loading:e(n).form},{default:i(()=>[l(se,{class:"d-flex justify-space-between"},{default:i(()=>[ce]),_:1}),l(T,null,{default:i(()=>[l(L,{ref_key:"formValidation",ref:C,onSubmit:H(()=>{},["prevent"]),disabled:e(V)},{default:i(()=>[l(ne,null,{default:i(()=>[l(g,{cols:"12",sm:"3"},{default:i(()=>[l(s,{clearable:"",modelValue:e(a).title,"onUpdate:modelValue":t[0]||(t[0]=r=>e(a).title=r),rules:["requiredValidator"in o?o.requiredValidator:e(B)],"error-messages":e(c).title,label:"Título",onInput:t[1]||(t[1]=r=>e(c).title=""),requiredField:!0},null,8,["modelValue","rules","error-messages"])]),_:1}),l(g,{cols:"12",sm:"3"},{default:i(()=>[l(ue,null,{default:i(()=>[F(" Imagen "),e(I).length>0?(d(),y("b",fe,"*")):E("",!0)]),_:1}),(d(),h(re,{accept:"image/*",rules:e(I),key:e(u).key,onChange:t[2]||(t[2]=r=>R(r)),"onClick:clear":e(u).clearData},null,8,["rules","onClick:clear"]))]),_:1}),l(g,{cols:"12",sm:"3"},{default:i(()=>[l(me,{src:e(u).imageUrl??("storageBack"in o?o.storageBack:e(N))(e(a).image)},null,8,["src"])]),_:1}),l(g,{cols:"12"},{default:i(()=>[l(m,{"api-key":"API_KEY_EDITOR"in o?o.API_KEY_EDITOR:e(O),init:{toolbar_mode:"sliding",plugins:"code anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker",toolbar:"code undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat"},"initial-value":"",modelValue:e(a).html,"onUpdate:modelValue":t[3]||(t[3]=r=>e(a).html=r)},null,8,["api-key","modelValue"]),(d(!0),y(Z,null,J(e(U),(r,k)=>(d(),h(de,{key:k,class:"my-2",variant:"tonal",color:"error"},{default:i(()=>[F(Q(r),1)]),_:2},1024))),128))]),_:1})]),_:1})]),_:1},8,["disabled"])]),_:1}),l(T,{class:"d-flex justify-end gap-3 flex-wrap mt-5"},{default:i(()=>[l(v,{disabled:e(p),loading:e(p)},null,8,["disabled","loading"]),e(V)?E("",!0):(d(),h(W,{key:0,disabled:e(p),loading:e(p),onClick:t[4]||(t[4]=r=>j()),color:"primary"},{default:i(()=>[F(" Guardar ")]),_:1},8,["disabled","loading"]))]),_:1})]),_:1},8,["disabled","loading"])])}}});export{Ne as default};