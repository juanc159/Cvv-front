import{r as f,c as F,V as j,e as L}from"./VForm-CpYnBFon.js";import{d as Z,U as z,R as H,r as t,Z as q,o as k,c as I,b as o,f as d,k as e,ae as J,af as U,e as K,C as g,D as O,ac as Q,ad as B,g as W,G as X}from"./index-C-RoIP79.js";import{_ as Y}from"./AppSelect.vue_vue_type_script_setup_true_lang-D37r87Ar.js";import{_ as h}from"./AppTextField.vue_vue_type_script_setup_true_lang-HXC8j4Aj.js";import{_ as ee}from"./DialogCloseBtn.vue_vue_type_script_setup_true_lang-CjGDKBEO.js";import{c as ae}from"./createUrl-DS6EPtCa.js";import{V as le}from"./VDialog-BxZzlAfP.js";import{V as re}from"./VCard-GJ_BTlvQ.js";import{V as oe,a as se}from"./VToolbar-BFIcKJ-8.js";import{V as D}from"./VGrid-C2i_c2Fs.js";import{V as de,a as p}from"./VRow-BaYJ45FZ.js";const we=Z({__name:"ModalForm",emits:["execute"],setup(ie,{expose:T,emit:$}){const A=z(),{company:w}=H(A),V=t({}),_=t(),N=$,y=t("Crear usuario"),c=t(!1),n=t(!1),i=t(!1),r=t({id:null,name:null,surname:null,email:null,password:null,confirmedPassword:null,role_id:null,company_id:null}),P=()=>{for(const a in r.value)r.value[a]=null},v=()=>{c.value=!c.value},R=async(a=null,l=!1)=>{n.value=l,P(),v(),y.value=a?"Editar usuario":"Crear usuario",r.value.id=a,r.value.company_id=w.value.id,await M()},C=t([]),S=t([]),M=async()=>{var u;const a=r.value.id?`/user/${r.value.id}/edit`:"/user/create";i.value=!0;const{data:l,response:m}=await U(ae(a,{query:{company_id:w.value.id}}));i.value=!1,(u=m.value)!=null&&u.ok&&l.value&&(C.value=l.value.roles,S.value=l.value.companies,l.value.form&&(r.value=l.value.form))},x=async()=>{var l,m;const a=await((l=_.value)==null?void 0:l.validate());if(a!=null&&a.valid){const u=r.value.id?`/user/update/${r.value.id}`:"/user/store";i.value=!0;const{response:b,data:s}=await U(u).post(r.value);i.value=!1,(m=b.value)!=null&&m.ok&&s.value&&(N("execute"),v())}},E=q(()=>r.value.id?[]:[a=>f(a)]),G=q(()=>r.value.id?[a=>F(r.value.password,a)]:[a=>f(a),a=>F(r.value.password,a)]);return T({openModal:R}),(a,l)=>{const m=ee,u=h,b=Y;return k(),I("div",null,[o(le,{modelValue:e(c),"onUpdate:modelValue":l[7]||(l[7]=s=>J(c)?c.value=s:null),overlay:!1,"max-width":"40rem",transition:"dialog-transition",persistent:""},{default:d(()=>[o(m,{onClick:v}),o(re,{loading:e(i),disabled:e(i),class:"w-100"},{default:d(()=>[K("div",null,[o(oe,{color:"primary"},{default:d(()=>[o(se,null,{default:d(()=>[g(O(e(y)),1)]),_:1})]),_:1})]),o(D,null,{default:d(()=>[o(j,{ref_key:"refForm",ref:_,onSubmit:Q(()=>{},["prevent"])},{default:d(()=>[o(de,null,{default:d(()=>[o(p,{cols:"12"},{default:d(()=>[o(u,{requiredField:!0,clearable:"",disabled:e(n),label:"Nombres",rules:["requiredValidator"in a?a.requiredValidator:e(f)],modelValue:e(r).name,"onUpdate:modelValue":l[0]||(l[0]=s=>e(r).name=s),"error-messages":e(V).name},null,8,["disabled","rules","modelValue","error-messages"])]),_:1}),o(p,{cols:"12"},{default:d(()=>[o(u,{requiredField:!0,clearable:"",disabled:e(n),label:"Apellidos",rules:["requiredValidator"in a?a.requiredValidator:e(f)],modelValue:e(r).surname,"onUpdate:modelValue":l[1]||(l[1]=s=>e(r).surname=s),"error-messages":e(V).surname},null,8,["disabled","rules","modelValue","error-messages"])]),_:1}),o(p,{cols:"12"},{default:d(()=>[o(u,{requiredField:!0,clearable:"",disabled:e(n),label:"Correo",type:"email",rules:["requiredValidator"in a?a.requiredValidator:e(f),"emailValidator"in a?a.emailValidator:e(L)],modelValue:e(r).email,"onUpdate:modelValue":l[2]||(l[2]=s=>e(r).email=s),"error-messages":e(V).email},null,8,["disabled","rules","modelValue","error-messages"])]),_:1}),o(p,{cols:"12"},{default:d(()=>[o(u,{requiredField:!0,clearable:"",disabled:e(n),label:"Contraseña",type:"password",rules:e(E),modelValue:e(r).password,"onUpdate:modelValue":l[3]||(l[3]=s=>e(r).password=s),"error-messages":e(V).password},null,8,["disabled","rules","modelValue","error-messages"])]),_:1}),o(p,{cols:"12"},{default:d(()=>[o(u,{requiredField:!0,label:"Confirmar Contraseña",type:"password",rules:e(G),modelValue:e(r).confirmedPassword,"onUpdate:modelValue":l[4]||(l[4]=s=>e(r).confirmedPassword=s)},null,8,["rules","modelValue"])]),_:1}),o(p,{cols:"12"},{default:d(()=>[o(b,{requiredField:!0,items:e(C),label:"Rol",rules:["requiredValidator"in a?a.requiredValidator:e(f)],modelValue:e(r).role_id,"onUpdate:modelValue":l[5]||(l[5]=s=>e(r).role_id=s),"error-messages":e(V).role_id,clearable:"",disabled:e(n)},null,8,["items","rules","modelValue","error-messages","disabled"])]),_:1})]),_:1})]),_:1},512)]),_:1}),o(D,{class:"d-flex justify-end gap-3 flex-wrap mt-5"},{default:d(()=>[o(B,{color:"secondary",disabled:e(i),loading:e(i),onClick:v},{default:d(()=>[g("Cancelar ")]),_:1},8,["disabled","loading"]),e(n)?X("",!0):(k(),W(B,{key:0,disabled:e(i),loading:e(i),onClick:l[6]||(l[6]=s=>x()),color:"primary"},{default:d(()=>[g(" Guardar ")]),_:1},8,["disabled","loading"]))]),_:1})]),_:1},8,["loading","disabled"])]),_:1},8,["modelValue"])])}}});export{we as _};