import{F as g}from"./front-page-footer-ef861422.js";import{V as y}from"./VRow-3431edda.js";import{V}from"./VContainer-1d646a20.js";import{V as k}from"./VCol-b72a8398.js";import{V as w}from"./VCard-1dca3b92.js";import{V as x}from"./VImg-2b1475bc.js";import{V as C}from"./VCardText-27ca00f5.js";import{d as v,o,g as d,f as r,e,b as t,c as n,m as h,F as b,N as m,C as _,V as S,r as u,L as $,af as B,k as f}from"./index-ba2685b5.js";/* empty css              */import"./VAvatar-ade85f75.js";const E={class:"our-team"},I={class:"text-h5",style:{"min-block-size":"2.5rem"}},L={class:"text-body-1 text-disabled"},F=v({__name:"all-school",props:{companies:{type:Array,required:!0}},setup(c){return(i,a)=>(o(),d(V,{id:"team"},{default:r(()=>[e("div",E,[a[0]||(a[0]=e("div",{class:"headers d-flex justify-center flex-column align-center"},[e("div",{class:"d-flex align-center text-h3 mb-1 flex-wrap justify-center"},[e("div",{class:"position-relative me-2"},[e("h3",{class:"section-title"},"ELIGE EL COLEGIO")])]),e("p",{class:"text-center"},"Selecciona la institucion que desees")],-1)),t(y,{class:"d-flex justify-center"},{default:r(()=>[(o(!0),n(b,null,h(c.companies,(s,l)=>(o(),d(k,{key:l,cols:"12",lg:"4",sm:"6"},{default:r(()=>[t(w,{flat:"","min-width":"262",class:"position-relative overflow-visible team-card mb-12",style:{cursor:"pointer"},to:{name:"Pw-school",params:{school_id:l+1}}},{default:r(()=>[e("div",{style:m({maxHeight:"185px",minHeight:"185px",borderRadius:"90px 20px 0 0",backgroundColor:`${s.backgroundColor}`})},[t(x,{style:{borderRadius:"20px 20px 0 0"},src:s.image_principal,height:"240",cover:"",class:"team-image"},null,8,["src"])],4),t(C,{class:"text-center pa-4",style:m({border:`1px solid ${s.borderColor}`,borderBlockStart:"none",borderRadius:"0 0 6px 6px",boxSizing:"border-box"})},{default:r(()=>[e("h5",I,_(s.name),1),e("span",L,_(s.position),1)]),_:2},1032,["style"])]),_:2},1032,["to"])]),_:2},1024))),128))]),_:1})])]),_:1}))}});const R=S(F,[["__scopeId","data-v-170c1efe"]]),j={class:"landing-page-wrapper"},z={navigation:"true","events-prefix":"swiper-"},A={style:{"background-color":"rgb(var(--v-theme-surface))"}},K=v({__name:"Index",setup(c){const i=u([]),a=u([]);return $(async()=>{const s=await B("pw-dataPrincipal").get();s.data&&(i.value=s.data.value.banners,a.value=s.data.value.companies)}),(s,l)=>(o(),n("div",j,[e("swiper-container",z,[(o(!0),n(b,null,h(f(i),p=>(o(),n("swiper-slide",{key:p},[t(x,{src:p.path},null,8,["src"])]))),128))]),e("div",A,[t(R,{companies:f(a)},null,8,["companies"])]),t(g)]))}});export{K as default};