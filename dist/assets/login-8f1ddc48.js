import{V as B,r as V,e as I}from"./VForm-8695cfab.js";import{_ as x}from"./AppTextField.vue_vue_type_script_setup_true_lang-2acb7ea8.js";import{d as L,aE as q,r as f,R as T,Q as R,o as A,g as M,f as s,b as o,e as d,k as e,ae as N,B as D,q as $,M as j}from"./index-aa5d3caf.js";import{u as g,a as F,b as P}from"./misc-mask-light-77c026eb.js";import{a as S,b as U}from"./auth-v2-login-illustration-bordered-light-4d72425c.js";import{V as E}from"./VNodeRenderer-11ee87b9.js";import{V as b}from"./VImg-82190d0d.js";import{V as u}from"./VCol-f3c848ea.js";import{V as G}from"./VCard-7e854c2d.js";import{V as h}from"./VCardText-3a66a74a.js";import{V as k}from"./VRow-ef83ed33.js";import"./helpers-3edea678.js";import"./VField-60417c4f.js";import"./VTextField-a473323b.js";/* empty css              */import"./VAvatar-31d2b53a.js";const Q="/assets/auth-v2-login-illustration-dark-0878e8b9.png",z="/assets/auth-v2-login-illustration-light-d1fd488d.png",H={class:"position-relative bg-background rounded-lg w-100 ma-8 me-0"},J={class:"d-flex align-center justify-center w-100 h-100"},me=L({__name:"login",setup(K){const l=q({email:"",password:""}),m=f({}),n=f(!1),c=f(),v=g(z,Q,U,S,!0),_=g(P,F),p=T();p.loading=!1;const{loading:w}=R(p),y=$(),C=async()=>{var a;const r=await((a=c.value)==null?void 0:a.validate());if(r!=null&&r.valid){const t=await p.login(l);t.code==200&&y.push({name:"root"}),t.code===422&&(m.value=t.errors??{})}};return(r,a)=>{const t=x;return A(),M(k,{"no-gutters":"",class:"auth-wrapper bg-surface"},{default:s(()=>[o(u,{md:"8",class:"d-none d-md-flex"},{default:s(()=>[d("div",H,[d("div",J,[o(b,{"max-width":"505",src:e(v),class:"auth-illustration mt-16 mb-2"},null,8,["src"])]),o(b,{class:"auth-footer-mask",src:e(_)},null,8,["src"])])]),_:1}),o(u,{cols:"12",md:"4",class:"auth-card-v2 d-flex align-center justify-center"},{default:s(()=>[o(G,{flat:"","max-width":500,class:"mt-12 mt-sm-0 pa-4"},{default:s(()=>[o(h,null,{default:s(()=>[o(e(E),{nodes:e(j).app.logo,class:"mb-6"},null,8,["nodes"]),a[4]||(a[4]=d("h4",{class:"text-h4 mb-1"}," Bienvenido Apreciado Administrador ",-1)),a[5]||(a[5]=d("p",{class:"mb-0"}," Por favor, ingrese su correo y su contraseña. ",-1))]),_:1}),o(h,null,{default:s(()=>[o(e(B),{ref_key:"formValidation",ref:c},{default:s(()=>[o(k,null,{default:s(()=>[o(u,{cols:"12"},{default:s(()=>[o(t,{clearable:"",modelValue:e(l).email,"onUpdate:modelValue":a[0]||(a[0]=i=>e(l).email=i),autofocus:"",label:"Correo",type:"email",rules:["requiredValidator"in r?r.requiredValidator:e(V),"emailValidator"in r?r.emailValidator:e(I)],"error-messages":e(m).email},null,8,["modelValue","rules","error-messages"])]),_:1}),o(u,{cols:"12"},{default:s(()=>[o(t,{clearable:"",modelValue:e(l).password,"onUpdate:modelValue":a[1]||(a[1]=i=>e(l).password=i),label:"Contraseña",placeholder:"············",type:e(n)?"text":"password","append-inner-icon":e(n)?"tabler-eye-off":"tabler-eye","onClick:appendInner":a[2]||(a[2]=i=>n.value=!e(n)),rules:["requiredValidator"in r?r.requiredValidator:e(V)],"error-messages":e(m).password},null,8,["modelValue","type","append-inner-icon","rules","error-messages"]),o(N,{loading:e(w),block:"",onClick:a[3]||(a[3]=i=>C()),type:"button",class:"mt-5"},{default:s(()=>a[6]||(a[6]=[D(" Ingresar ")])),_:1},8,["loading"])]),_:1})]),_:1})]),_:1},512)]),_:1})]),_:1})]),_:1})]),_:1})}}});export{me as default};