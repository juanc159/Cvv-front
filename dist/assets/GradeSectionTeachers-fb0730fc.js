import{d as y}from"./helpers-53221d8d.js";import{_ as V}from"./SchoolData.vue_vue_type_style_index_0_lang-60dd62f5.js";import{d as k,r as _,L as C,af as S,o as r,g as f,f as n,b as l,e,C as o,k as p,c as i,m as x,F as h,p as w,N as b,E as $,V as B}from"./index-d0670919.js";import{V as N}from"./VRow-0989fd53.js";import{V as j}from"./VContainer-aaf75fb0.js";import{V as A}from"./VCol-f9ca3977.js";import{V as G}from"./VCard-e76a16db.js";import{V as R}from"./VImg-5105b70e.js";import{V as T}from"./VCardText-e103ba3a.js";import"./front-page-footer-f3bca69f.js";import"./DialogCloseBtn.vue_vue_type_script_setup_true_lang-03b2387b.js";import"./VToolbar-7f3be25e.js";import"./VDialog-33a1f9d0.js";import"./dialog-transition-267dc2dc.js";import"./ssrBoot-d5aa7b69.js";import"./VAvatar-c50d467b.js";import"./VMenu-eda721cc.js";/* empty css              */const z={class:"our-team"},E={class:"headers d-flex justify-center flex-column align-center"},F={class:"d-flex align-center text-h3 mb-1 flex-wrap justify-center"},H={class:"position-relative me-2"},I={class:"section-title"},L={class:"text-center"},P={class:"text-h3"},D={h5:"",class:"text-h5"},M={class:"text-body-1"},q={class:"text-body-1"},J={class:"text-body-1"},K={key:0},O={class:"d-flex"},Q=["onClick"],U=k({__name:"GradeSectionTeachers",setup(W){const d=w(),u=_(),m=_();return C(async()=>{const a=await S(`pw-dataGradeSection/${d.params.school_id}/${d.params.grade_id}/${d.params.section_id}`).get();a.data&&(u.value=a.data.value.teachers,m.value=a.data.value.title)}),(a,s)=>(r(),f(V,null,{default:n(()=>[l(j,{id:"team"},{default:n(()=>[e("div",z,[e("div",E,[e("div",F,[e("div",H,[e("h3",I,o(p(m)),1)])]),s[0]||(s[0]=e("p",{class:"text-center"},null,-1))]),l(N,null,{default:n(()=>[(r(!0),i(h,null,x(p(u),(t,v)=>(r(),f(A,{cols:"4",key:v},{default:n(()=>[l(G,{flat:"","min-width":"262",class:"position-relative overflow-visible team-card mb-12"},{default:n(()=>[e("div",{style:b({maxHeight:"185px",minHeight:"185px",borderRadius:"90px 20px 0 0",backgroundColor:`${t.backgroundColor}`})},[l(R,{src:t.photo,height:"240",class:"team-image"},null,8,["src"])],4),l(T,{class:"pa-4",style:b({border:`1px solid ${t.backgroundColor}`,borderBlockStart:"none",borderRadius:"0 0 6px 6px",boxSizing:"border-box"})},{default:n(()=>[e("div",L,[e("span",P,o(t.subject_name),1),s[1]||(s[1]=e("br",null,null,-1)),e("span",D,o(t.fullName),1),s[2]||(s[2]=e("br",null,null,-1)),e("span",M,o(t.jobPosition),1),s[3]||(s[3]=e("br",null,null,-1)),e("span",q,o(t.email),1),s[4]||(s[4]=e("br",null,null,-1)),e("span",J,o(t.phone),1)]),t.files.length>0?(r(),i("div",K,[s[6]||(s[6]=e("span",{class:"text-h4 mb-6"},"Planificación",-1)),(r(!0),i(h,null,x(t.files,(c,g)=>(r(),i("div",{key:g,class:"d-flex flex-column"},[e("div",O,[s[5]||(s[5]=e("span",{style:{"font-size":"20px"}},"*  ",-1)),e("a",{href:"#",onClick:X=>("descargarArchivo"in a?a.descargarArchivo:p(y))(c.path,c.name)},o(c.name),9,Q)])]))),128))])):$("",!0)]),_:2},1032,["style"])]),_:2},1024)]),_:2},1024))),128))]),_:1})])]),_:1})]),_:1}))}});const xe=B(U,[["__scopeId","data-v-b06c03a7"]]);export{xe as default};