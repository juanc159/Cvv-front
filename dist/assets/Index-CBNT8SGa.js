import{d as z,U as B,ax as D,r as t,M as F,af as c,Z as S,o as r,c as m,b as a,f as l,F as V,p as x,k as i,ad as U,C as A,g as y,e as g,D as M}from"./index-Bs2WbdAz.js";import{u as T}from"./useFileUpload-C3qVMGA-.js";import{V as k}from"./VCardText-zYKdyQs7.js";import{V as f,a as p}from"./VRow-ysiYWnAR.js";import{V as j}from"./VCard-BspOpUsK.js";import{V as G}from"./VDivider-ClP2ZRkO.js";import{V as I}from"./VSwitch-DWEzie9P.js";import"./sweetalert2.esm.all-DOYwHpwi.js";/* empty css              */import"./VAvatar-DZ-0fdCL.js";import"./VImg-BlPswqtp.js";import"./VInput-C3OcKGmU.js";import"./VSelectionControl-B2jVeEAq.js";const L={class:"demo-space-x"},ee=z({__name:"Index",setup(R){B();const o=D({form:!1,excel:!1});t({company_id:null,type_education_id:null,archive:null}),t({}),t(),t();const _=t([]),w=t(T());w.value.allowedExtensions=["xls","xlsx"];const v=t(!1),u=t({});F(async()=>{var e;await N(),o.form=!0;const{data:s,response:n}=await c("note-dataForm").get();(e=n.value)!=null&&e.ok&&s.value&&(_.value=s.value.typeEducations,v.value=s.value.blockData),o.form=!1});const N=async()=>{var e;const{data:s,response:n}=await c("/type_educations/visualization/show").get();(e=n.value)!=null&&e.ok&&s.value&&(u.value=s.value.selectedNotes)};t({type_education_id:null}),S(()=>v.value?"Sí":"No");const b=async()=>{o.form=!0,await c("/type_educations/visualization/store").post({selectedNotes:u.value}),o.form=!1};return(s,n)=>(r(),m("div",null,[a(j,{disabled:i(o).form,loading:i(o).form,class:"mt-3",title:"Visualización de las notas"},{default:l(()=>[(r(!0),m(V,null,x(i(_),e=>(r(),y(k,{key:e.value},{default:l(()=>[a(G),a(f,null,{default:l(()=>[a(p,null,{default:l(()=>[g("span",null,M(e.title),1)]),_:2},1024)]),_:2},1024),a(f,null,{default:l(()=>[(r(!0),m(V,null,x(e.cantNotes,(d,h)=>(r(),y(p,{cols:"12",sm:"4",key:h},{default:l(()=>[g("div",L,[a(I,{modelValue:i(u)[e.value]["note_"+d],"onUpdate:modelValue":C=>i(u)[e.value]["note_"+d]=C,label:"Nota "+d,color:"success"},null,8,["modelValue","onUpdate:modelValue","label"])])]),_:2},1024))),128))]),_:2},1024)]),_:2},1024))),128)),a(k,null,{default:l(()=>[a(f,null,{default:l(()=>[a(p,{cols:"12",class:"d-flex justify-center"},{default:l(()=>[a(U,{loading:i(o).form,disabled:i(o).form,color:"primary",onClick:n[0]||(n[0]=e=>b())},{default:l(()=>[A(" Guardar Visualización ")]),_:1},8,["loading","disabled"])]),_:1})]),_:1})]),_:1})]),_:1},8,["disabled","loading"])]))}});export{ee as default};