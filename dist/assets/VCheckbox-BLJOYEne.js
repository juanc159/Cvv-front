import{m as A,V as t}from"./VCheckboxBtn-CJntfbgY.js";import{a as F,u as I,d as l}from"./VInput-DfRUPHc8.js";import{ag as B,bi as U,aj as j,aL as R,bj as $,Z as z,ak as D,b$ as L,b as u,z as r}from"./index-Beckcyx0.js";const M=B({...F(),...U(A(),["inline"])},"VCheckbox"),w=j()({name:"VCheckbox",inheritAttrs:!1,props:M(),emits:{"update:modelValue":e=>!0,"update:focused":e=>!0},setup(e,d){let{attrs:c,slots:o}=d;const s=R(e,"modelValue"),{isFocused:n,focus:i,blur:m}=I(e),b=$(),V=z(()=>e.id||`checkbox-${b}`);return D(()=>{const[p,f]=L(c),k=l.filterProps(e),v=t.filterProps(e);return u(l,r({class:["v-checkbox",e.class]},p,k,{modelValue:s.value,"onUpdate:modelValue":a=>s.value=a,id:V.value,focused:n.value,style:e.style}),{...o,default:a=>{let{id:x,messagesId:h,isDisabled:P,isReadonly:C,isValid:y}=a;return u(t,r(v,{id:x.value,"aria-describedby":h.value,disabled:P.value,readonly:C.value},f,{error:y.value===!1,modelValue:s.value,"onUpdate:modelValue":g=>s.value=g,onFocus:i,onBlur:m}),o)}})}),{}}});export{w as V};