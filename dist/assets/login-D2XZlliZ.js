import{V as I,r as V}from"./VForm-BQiQkQz-.js";import{d as L,r as m,U as B,R as D,al as u,o as q,c as A,e as r,b as t,k as e,D as R,f as s,ac as S,ae as T,ad as F,C as M,F as N,N as _}from"./index-Bs2WbdAz.js";import{_ as U}from"./AppTextField.vue_vue_type_script_setup_true_lang-CDsRSVsM.js";import{u as b,a as j,b as E}from"./misc-mask-light-39TI1EVc.js";import{V as H}from"./VNodeRenderer-LCvOHgIM.js";import{i as P}from"./helpers-DMPihPy4.js";import{a as c,V as k}from"./VRow-ysiYWnAR.js";import{V as $}from"./VImg-BlPswqtp.js";import{V as G}from"./VCard-BspOpUsK.js";import{V as v}from"./VCardText-zYKdyQs7.js";import{V as K}from"./VCheckbox-CYTM7pzL.js";import"./VInput-C3OcKGmU.js";import"./forwardRefs-C-GTDzx5.js";import"./VTooltip-0ZM8oGUy.js";import"./VOverlay-ANg0gJBd.js";import"./VTextField-BiVPh_BE.js";import"./VField-Cn8Kq-0i.js";import"./constants-2GBt7OCP.js";/* empty css              */import"./VAvatar-DZ-0fdCL.js";import"./VCheckboxBtn-CUuSqgJb.js";import"./VSelectionControl-B2jVeEAq.js";const Y="/assets/auth-v2-login-illustration-bordered-dark-cDkPk8mY.png",z="/assets/auth-v2-login-illustration-bordered-light-CIHqcIVA.png",J="/assets/auth-v2-login-illustration-dark-ClExSVqL.png",O="/assets/auth-v2-login-illustration-light-C4sKfRS1.png",Q={href:"javascript:void(0)"},W={class:"auth-logo d-flex align-center gap-x-3"},X={class:"auth-title"},Z={class:"position-relative bg-background w-100 me-0"},ee={class:"d-flex align-center justify-center w-100 h-100",style:{"padding-inline":"6.25rem"}},te=["src"],ae=r("h4",{class:"text-h4 mb-1"}," Bienvenido Apreciado Usuario ",-1),se=r("p",{class:"mb-0"}," Por favor, ingrese su usuario (cédula / correo electrónico) y contraseña. ",-1),oe={class:"d-flex align-center flex-wrap justify-space-between mt-1 mb-4"},qe=L({__name:"login",setup(re){const h=m(),p=B(),{loading:g,tokenGoogle:le,rememberMe:f}=D(p),y=m({}),n=m({user:"",password:"",remember:!1}),d=m(!1),w=b(O,J,z,Y,!0),C=b(E,j),x=async()=>{var a;const l=await((a=h.value)==null?void 0:a.validate());if(l!=null&&l.valid){const o=await p.login(n);if(o.code==200){if(o.user.type_user=="student"){u.push({name:"DashboardStudent"});return}if(o.user.type_user=="teacher"){u.push({name:"DashboardTeacher"});return}if(o.user.type_user=="admin"){if(P(o.user.company_id)){u.push({name:"Company-List"});return}u.push({name:"Home"});return}}o.code===422&&(y.value=o.errors??{})}};return p.checkAuthentication()&&u.push({name:"Home"}),(l,a)=>{const o=U;return q(),A(N,null,[r("a",Q,[r("div",W,[t(e(H),{nodes:e(_).app.logo},null,8,["nodes"]),r("h1",X,R(e(_).app.title),1)])]),t(k,{"no-gutters":"",class:"auth-wrapper bg-surface"},{default:s(()=>[t(c,{md:"8",class:"d-none d-md-flex"},{default:s(()=>[r("div",Z,[r("div",ee,[t($,{"max-width":"613",src:e(w),class:"auth-illustration mt-16 mb-2"},null,8,["src"])]),r("img",{class:"auth-footer-mask flip-in-rtl",src:e(C),alt:"auth-footer-mask",height:"280",width:"100"},null,8,te)])]),_:1}),t(c,{cols:"12",md:"4",class:"auth-card-v2 d-flex align-center justify-center"},{default:s(()=>[t(G,{flat:"","max-width":500,class:"mt-12 mt-sm-0 pa-6"},{default:s(()=>[t(v,null,{default:s(()=>[ae,se]),_:1}),t(v,null,{default:s(()=>[t(I,{ref_key:"refForm",ref:h,onSubmit:S(()=>{},["prevent"])},{default:s(()=>[t(k,null,{default:s(()=>[t(c,{cols:"12"},{default:s(()=>[t(o,{modelValue:e(n).user,"onUpdate:modelValue":a[0]||(a[0]=i=>e(n).user=i),autofocus:"",label:"Correo electrónico / Cédula de identidad",clearable:"",rules:["requiredValidator"in l?l.requiredValidator:e(V)]},null,8,["modelValue","rules"])]),_:1}),t(c,{cols:"12"},{default:s(()=>[t(o,{modelValue:e(n).password,"onUpdate:modelValue":a[1]||(a[1]=i=>e(n).password=i),label:"Contraseña",placeholder:"············",type:e(d)?"text":"password","append-inner-icon":e(d)?"tabler-eye-off":"tabler-eye","onClick:appendInner":a[2]||(a[2]=i=>d.value=!e(d)),clearable:"",rules:["requiredValidator"in l?l.requiredValidator:e(V)]},null,8,["modelValue","type","append-inner-icon","rules"]),r("div",oe,[t(K,{modelValue:e(f),"onUpdate:modelValue":a[3]||(a[3]=i=>T(f)?f.value=i:null),label:"Recuérdame"},null,8,["modelValue"])]),t(F,{class:"mt-2",loading:e(g),disabled:e(g),block:"",type:"submit",onClick:a[4]||(a[4]=i=>x())},{default:s(()=>[M(" Ingresar ")]),_:1},8,["loading","disabled"])]),_:1})]),_:1})]),_:1},512)]),_:1})]),_:1})]),_:1})]),_:1})],64)}}});export{qe as default};