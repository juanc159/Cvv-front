import{F as g}from"./front-page-footer-ed94745a.js";import{V as y}from"./VRow-3a68e704.js";import{V}from"./VContainer-714bc645.js";import{V as w}from"./VCol-0df0a306.js";import{V as k}from"./VCard-95ab2cb2.js";import{V as x}from"./VImg-66082724.js";import{V as C}from"./VCardText-ca73b5bb.js";import{d as h,o as a,g as _,f as r,e,b as t,c as n,i as v,F as b,O as S,P as I,H as p,v as m,_ as E,r as u,E as B,ab as $,n as f}from"./index-a30326ee.js";/* empty css              */import"./VAvatar-8692be98.js";const F=o=>(S("data-v-170c1efe"),o=o(),I(),o),L={class:"our-team"},R=F(()=>e("div",{class:"headers d-flex justify-center flex-column align-center"},[e("div",{class:"d-flex align-center text-h3 mb-1 flex-wrap justify-center"},[e("div",{class:"position-relative me-2"},[e("h3",{class:"section-title"},"ELIGE EL COLEGIO")])]),e("p",{class:"text-center"},"Selecciona la institucion que desees")],-1)),j={class:"text-h5",style:{"min-block-size":"2.5rem"}},z={class:"text-body-1 text-disabled"},A=h({__name:"all-school",props:{companies:{type:Array,required:!0}},setup(o){return(i,c)=>(a(),_(V,{id:"team"},{default:r(()=>[e("div",L,[R,t(y,{class:"d-flex justify-center"},{default:r(()=>[(a(!0),n(b,null,v(o.companies,(s,l)=>(a(),_(w,{key:l,cols:"12",lg:"4",sm:"6"},{default:r(()=>[t(k,{flat:"","min-width":"262",class:"position-relative overflow-visible team-card mb-12",style:{cursor:"pointer"},to:{name:"Pw-school",params:{school_id:l+1}}},{default:r(()=>[e("div",{style:p({maxHeight:"185px",minHeight:"185px",borderRadius:"90px 20px 0 0",backgroundColor:`${s.backgroundColor}`})},[t(x,{style:{borderRadius:"20px 20px 0 0"},src:s.image_principal,height:"240",cover:"",class:"team-image"},null,8,["src"])],4),t(C,{class:"text-center pa-4",style:p({border:`1px solid ${s.borderColor}`,borderBlockStart:"none",borderRadius:"0 0 6px 6px",boxSizing:"border-box"})},{default:r(()=>[e("h5",j,m(s.name),1),e("span",z,m(s.position),1)]),_:2},1032,["style"])]),_:2},1032,["to"])]),_:2},1024))),128))]),_:1})])]),_:1}))}});const H=E(A,[["__scopeId","data-v-170c1efe"]]),O={class:"landing-page-wrapper"},P={navigation:"true","events-prefix":"swiper-"},W=h({__name:"Index",setup(o){const i=u([]),c=u([]);return B(async()=>{const s=await $("pw-dataPrincipal").get();s.data&&(i.value=s.data.value.banners,c.value=s.data.value.companies)}),(s,l)=>(a(),n("div",O,[e("swiper-container",P,[(a(!0),n(b,null,v(f(i),d=>(a(),n("swiper-slide",{key:d},[t(x,{src:d.path},null,8,["src"])]))),128))]),e("div",{style:p({"background-color":"rgb(var(--v-theme-surface))"})},[t(H,{companies:f(c)},null,8,["companies"])],4),t(g)]))}});export{W as default};