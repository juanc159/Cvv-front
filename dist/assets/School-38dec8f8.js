import{d as b,r as h,aG as S,o,g as u,f as t,e,b as n,c as y,m as g,k as i,F as w,af as j,E as N,C as A,ay as T,V as $,a9 as C,ab as B,p as q}from"./index-e87c998e.js";import{V as z}from"./VRow-dbcc1c85.js";import{V as E}from"./VContainer-483cff4f.js";import{V as I}from"./VCol-40d12692.js";import{V as R}from"./VAvatar-310879b2.js";import{V as D}from"./VImg-b8e40629.js";import{_ as F}from"./TeacherData-6aeb4f00.js";import{V as U,a as W,b as G,c as L}from"./VTabs-727fc94b.js";import{V as P}from"./VCardText-ecc7b3c9.js";import{V as H}from"./VCard-4a612500.js";import{_ as J}from"./SchoolData.vue_vue_type_style_index_0_lang-7a151dd6.js";import K from"./ContactArea-4daef036.js";/* empty css              */import"./ssrBoot-db5986a3.js";import"./front-page-footer-21c8b329.js";import"./DialogCloseBtn.vue_vue_type_script_setup_true_lang-5cff8612.js";import"./VToolbar-dee2cffc.js";import"./VDialog-95a7a5d8.js";import"./dialog-transition-e0e81da4.js";import"./VMenu-ccd8d291.js";import"./VDivider-92bccdc3.js";const M={class:"activity"},O={class:"mt-1"},Q=b({__name:"Services",props:{school_id:{type:[Number,String],required:!0}},async setup(_){let s,c;const m=_,r=h([]),{data:d,response:f}=([s,c]=S(()=>j("pw-services/"+m.school_id).get()),s=await s,c(),s);d.value.code==200&&(r.value=d.value.services);const p=V=>{T.push({name:"Pw-ServiceData",params:{service_id:V,school_id:m.school_id}})};return(V,x)=>(o(),u(E,{id:"team"},{default:t(()=>[x[0]||(x[0]=e("div",{class:"our-team"},[e("div",{class:"headers d-flex justify-center flex-column align-center"},[e("div",{class:"d-flex align-center text-h3 mb-1 flex-wrap justify-center"},[e("div",{class:"position-relative me-2"},[e("h3",{class:"section-title text-center"}," Servicios adicionales o complementarios ")])]),e("p",{class:"text-center"}," Además de sus servicios educativos obligatorios, el aprendizaje de danza latinoamericana, música... ")])],-1)),n(z,null,{default:t(()=>[(o(!0),y(w,null,g(i(r),(a,l)=>(o(),u(I,{key:l,cols:"12",md:"4",class:"d-flex justify-space-around w-100"},{default:t(()=>[e("div",M,[a.image?(o(),u(R,{key:0,color:"primary",variant:"tonal",size:"170",onClick:v=>p(a.id)},{default:t(()=>[n(D,{src:a.image},null,8,["src"])]),_:2},1032,["onClick"])):N("",!0),e("h3",O,A(a.title),1)])]),_:2},1024))),128))]),_:1})]),_:1}))}});const X=$(Q,[["__scopeId","data-v-e0c545f2"]]),Y={style:{"background-color":"rgb(var(--v-theme-surface))"}},Z=b({__name:"Teachers",props:{school_id:{type:[Number,String],required:!0}},async setup(_){let s,c;const m=_,r=h(),d=h([]),f=h([]),{data:p,response:V}=([s,c]=S(()=>j("pw-teachers/"+m.school_id).get()),s=await s,c(),s);return p.value.code==200&&(d.value=p.value.teachers,f.value=p.value.typeEducations),(x,a)=>(o(),u(E,{id:"team"},{default:t(()=>[a[2]||(a[2]=e("div",{class:"our-team"},[e("div",{class:"headers d-flex justify-center flex-column align-center"},[e("div",{class:"d-flex align-center text-h3 mb-1 flex-wrap justify-center"},[e("div",{class:"position-relative me-2"},[e("h3",{class:"section-title text-center"}," Nuestro gran equipo docentes ")])]),e("p",{class:"text-center"}," Educadores comprometidos con el éxito de tus hijos ")])],-1)),n(H,null,{default:t(()=>[n(U,{modelValue:i(r),"onUpdate:modelValue":a[0]||(a[0]=l=>C(r)?r.value=l:null),grow:"",stacked:""},{default:t(()=>[(o(!0),y(w,null,g(i(f),(l,v)=>(o(),u(G,{key:v},{default:t(()=>[e("span",null,A(l.title),1)]),_:2},1024))),128))]),_:1},8,["modelValue"]),n(P,null,{default:t(()=>[n(W,{modelValue:i(r),"onUpdate:modelValue":a[1]||(a[1]=l=>C(r)?r.value=l:null)},{default:t(()=>[(o(!0),y(w,null,g(i(f),(l,v)=>(o(),u(L,{key:v},{default:t(()=>{var k;return[e("div",Y,[((k=i(d)[l.title])==null?void 0:k.length)>0?(o(),u(F,{key:0,teachers:i(d)[l.title]},null,8,["teachers"])):N("",!0)])]}),_:2},1024))),128))]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1}))}}),ge=b({__name:"School",setup(_){const s=q(),c=B(()=>s.params.school_id);return(m,r)=>(o(),u(J,null,{default:t(()=>[n(X,{class:"mt-6",school_id:i(c)},null,8,["school_id"]),n(Z,{class:"mt-6",school_id:i(c)},null,8,["school_id"]),n(K,{class:"mt-6",school_id:i(c)},null,8,["school_id"])]),_:1}))}});export{ge as default};