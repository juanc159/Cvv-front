import{ae as x,bI as Q,af as E,aO as U,ag as F,am as L,bp as R,ah as $,aD as z,aF as W,b0 as Y,Z as r,ai as ee,b as l,aj as y,bD as B,b2 as ae,aZ as le,b3 as te,aI as ne,al as se,bE as ie,bo as ce,bF as de,aq as oe,b4 as ue,bq as re,a$ as ve,b5 as fe,ap as pe,br as me,a_ as ke,aK as be,bG as he,a6 as C,I as _,aH as ye,bs as Ce,b$ as Ve,a1 as v,b6 as f,J as Ie,F as D,q as ge}from"./index-a30326ee.js";import{V as G}from"./VAvatar-8692be98.js";const T=Symbol.for("vuetify:v-chip-group"),Pe=x({column:Boolean,filter:Boolean,valueComparator:{type:Function,default:Q},...E(),...U({selectedClass:"v-chip--selected"}),...F(),...L(),...R({variant:"tonal"})},"VChipGroup");$()({name:"VChipGroup",props:Pe(),emits:{"update:modelValue":e=>!0},setup(e,p){let{slots:c}=p;const{themeClasses:o}=z(e),{isSelected:t,select:m,next:k,prev:b,selected:h}=W(e,T);return Y({VChip:{color:r(e,"color"),disabled:r(e,"disabled"),filter:r(e,"filter"),variant:r(e,"variant")}}),ee(()=>l(e.tag,{class:["v-chip-group",{"v-chip-group--column":e.column},o.value,e.class],style:e.style},{default:()=>{var u;return[(u=c.default)==null?void 0:u.call(c,{isSelected:t,select:m,next:k,prev:b,selected:h.value})]}})),{}}});const Se=x({activeClass:String,appendAvatar:String,appendIcon:y,closable:Boolean,closeIcon:{type:y,default:"$delete"},closeLabel:{type:String,default:"$vuetify.close"},draggable:Boolean,filter:Boolean,filterIcon:{type:String,default:"$complete"},label:Boolean,link:{type:Boolean,default:void 0},pill:Boolean,prependAvatar:String,prependIcon:y,ripple:{type:[Boolean,Object],default:!0},text:String,modelValue:{type:Boolean,default:!0},onClick:B(),onClickOnce:B(),...ae(),...E(),...le(),...te(),...ne(),...se(),...ie(),...ce(),...F({tag:"span"}),...L(),...R({variant:"tonal"})},"VChip"),_e=$()({name:"VChip",directives:{Ripple:de},props:Se(),emits:{"click:close":e=>!0,"update:modelValue":e=>!0,"group:selected":e=>!0,click:e=>!0},setup(e,p){let{attrs:c,emit:o,slots:t}=p;const{t:m}=oe(),{borderClasses:k}=ue(e),{colorClasses:b,colorStyles:h,variantClasses:u}=re(e),{densityClasses:q}=ve(e),{elevationClasses:w}=fe(e),{roundedClasses:O}=pe(e),{sizeClasses:K}=me(e),{themeClasses:M}=z(e),V=ke(e,"modelValue"),a=be(e,T,!1),s=he(e,c),j=C(()=>e.link!==!1&&s.isLink.value),i=C(()=>!e.disabled&&e.link!==!1&&(!!a||e.link||s.isClickable.value)),Z=C(()=>({"aria-label":m(e.closeLabel),onClick(n){n.stopPropagation(),V.value=!1,o("click:close",n)}}));function I(n){var d;o("click",n),i.value&&((d=s.navigate)==null||d.call(s,n),a==null||a.toggle())}function H(n){(n.key==="Enter"||n.key===" ")&&(n.preventDefault(),I(n))}return()=>{const n=s.isLink.value?"a":e.tag,d=!!(e.appendIcon||e.appendAvatar),J=!!(d||t.append),N=!!(t.close||e.closable),g=!!(t.filter||e.filter)&&a,P=!!(e.prependIcon||e.prependAvatar),X=!!(P||t.prepend),S=!a||a.isSelected.value;return V.value&&_(l(n,{class:["v-chip",{"v-chip--disabled":e.disabled,"v-chip--label":e.label,"v-chip--link":i.value,"v-chip--filter":g,"v-chip--pill":e.pill},M.value,k.value,S?b.value:void 0,q.value,w.value,O.value,K.value,u.value,a==null?void 0:a.selectedClass.value,e.class],style:[S?h.value:void 0,e.style],disabled:e.disabled||void 0,draggable:e.draggable,href:s.href.value,tabindex:i.value?0:void 0,onClick:I,onKeydown:i.value&&!j.value&&H},{default:()=>{var A;return[Ce(i.value,"v-chip"),g&&l(Ve,{key:"filter"},{default:()=>[_(l("div",{class:"v-chip__filter"},[t.filter?l(f,{key:"filter-defaults",disabled:!e.filterIcon,defaults:{VIcon:{icon:e.filterIcon}}},t.filter):l(v,{key:"filter-icon",icon:e.filterIcon},null)]),[[Ie,a.isSelected.value]])]}),X&&l("div",{key:"prepend",class:"v-chip__prepend"},[t.prepend?l(f,{key:"prepend-defaults",disabled:!P,defaults:{VAvatar:{image:e.prependAvatar,start:!0},VIcon:{icon:e.prependIcon,start:!0}}},t.prepend):l(D,null,[e.prependIcon&&l(v,{key:"prepend-icon",icon:e.prependIcon,start:!0},null),e.prependAvatar&&l(G,{key:"prepend-avatar",image:e.prependAvatar,start:!0},null)])]),l("div",{class:"v-chip__content"},[((A=t.default)==null?void 0:A.call(t,{isSelected:a==null?void 0:a.isSelected.value,selectedClass:a==null?void 0:a.selectedClass.value,select:a==null?void 0:a.select,toggle:a==null?void 0:a.toggle,value:a==null?void 0:a.value.value,disabled:e.disabled}))??e.text]),J&&l("div",{key:"append",class:"v-chip__append"},[t.append?l(f,{key:"append-defaults",disabled:!d,defaults:{VAvatar:{end:!0,image:e.appendAvatar},VIcon:{end:!0,icon:e.appendIcon}}},t.append):l(D,null,[e.appendIcon&&l(v,{key:"append-icon",end:!0,icon:e.appendIcon},null),e.appendAvatar&&l(G,{key:"append-avatar",end:!0,image:e.appendAvatar},null)])]),N&&l("div",ge({key:"close",class:"v-chip__close"},Z.value),[t.close?l(f,{key:"close-defaults",defaults:{VIcon:{icon:e.closeIcon,size:"x-small"}}},t.close):l(v,{key:"close-icon",icon:e.closeIcon,size:"x-small"},null)])]}}),[[ye("ripple"),i.value&&e.ripple,null]])}}});export{_e as V};