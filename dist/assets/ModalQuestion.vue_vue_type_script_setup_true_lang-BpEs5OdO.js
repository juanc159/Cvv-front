import{_ as D}from"./DialogCloseBtn.vue_vue_type_script_setup_true_lang-CL7iUoQP.js";import{V as u}from"./VCardText-zYKdyQs7.js";import{d as I,ax as T,o as k,g as S,f as s,b as n,a8 as c,k as a,e as m,D as i,ad as p,C as f}from"./index-Bs2WbdAz.js";import{V as v}from"./VCard-BspOpUsK.js";import{V as y}from"./VDialog-BgUnOFX0.js";const j=I({__name:"ModalQuestion",emits:["success","cancel"],setup(B,{expose:b,emit:V}){const r=V,e=T({isDialogVisible:!1,isLoading:!1,principalIcon:"tabler-alert-circle",title:"¿Está seguro que desea proceder con esta acción?",subTitle:"",btnSuccessText:"Si",btnSuccessIcon:"tabler-check",btnCancelText:"Cancelar",btnCancelIcon:"tabler-x",id:null}),l=()=>{e.isDialogVisible=!e.isDialogVisible},g=async(d=null)=>{l(),e.id=d},x=async()=>{l(),r("success",e.id)},C=async()=>{l(),r("cancel")};return b({openModal:g,componentData:e}),(d,t)=>{const _=D;return k(),S(y,{modelValue:a(e).isDialogVisible,"onUpdate:modelValue":t[3]||(t[3]=o=>a(e).isDialogVisible=o),"max-width":"40rem",persistent:""},{default:s(()=>[n(_,{onClick:t[0]||(t[0]=o=>l())}),n(v,{loading:a(e).isLoading},{default:s(()=>[n(u,{class:"text-center"},{default:s(()=>[n(c,{icon:a(e).principalIcon,size:"5rem"},null,8,["icon"]),m("h2",null,i(a(e).title),1),m("span",null,i(a(e).subTitle),1)]),_:1}),n(u,{class:"d-flex justify-center"},{default:s(()=>[n(p,{variant:"flat",color:"secondary",class:"mr-3",onClick:t[1]||(t[1]=o=>C())},{default:s(()=>[n(c,{start:"",icon:a(e).btnCancelIcon},null,8,["icon"]),f(" "+i(a(e).btnCancelText),1)]),_:1}),n(p,{variant:"flat",onClick:t[2]||(t[2]=o=>x())},{default:s(()=>[n(c,{start:"",icon:a(e).btnSuccessIcon},null,8,["icon"]),f(" "+i(a(e).btnSuccessText),1)]),_:1})]),_:1})]),_:1},8,["loading"])]),_:1},8,["modelValue"])}}});export{j as _};