import{ag as D,bI as H,ah as L,bV as J,ai as R,ao as E,b9 as T,aj as z,aU as F,bW as Q,a$ as Z,a5 as r,ak as ee,b as l,al as y,bG as B,aR as ae,b7 as le,aS as te,bX as ne,an as se,bq as ie,b8 as ce,br as de,as as oe,aV as ue,ba as re,bb as ve,aW as fe,ar as pe,bc as be,aL as me,bY as ke,bu as he,ab as C,O as G,b6 as ye,bd as Ce,bT as Ve,a6 as v,bi as f,P as Ie,F as _,y as ge}from"./index-4f81429d.js";import{V as x}from"./VAvatar-509cb4e6.js";const $=Symbol.for("vuetify:v-chip-group"),Pe=D({column:Boolean,filter:Boolean,valueComparator:{type:Function,default:H},...L(),...J({selectedClass:"v-chip--selected"}),...R(),...E(),...T({variant:"tonal"})},"VChipGroup");z()({name:"VChipGroup",props:Pe(),emits:{"update:modelValue":e=>!0},setup(e,p){let{slots:c}=p;const{themeClasses:o}=F(e),{isSelected:t,select:b,next:m,prev:k,selected:h}=Q(e,$);return Z({VChip:{color:r(e,"color"),disabled:r(e,"disabled"),filter:r(e,"filter"),variant:r(e,"variant")}}),ee(()=>l(e.tag,{class:["v-chip-group",{"v-chip-group--column":e.column},o.value,e.class],style:e.style},{default:()=>{var u;return[(u=c.default)==null?void 0:u.call(c,{isSelected:t,select:b,next:m,prev:k,selected:h.value})]}})),{}}});const Se=D({activeClass:String,appendAvatar:String,appendIcon:y,closable:Boolean,closeIcon:{type:y,default:"$delete"},closeLabel:{type:String,default:"$vuetify.close"},draggable:Boolean,filter:Boolean,filterIcon:{type:String,default:"$complete"},label:Boolean,link:{type:Boolean,default:void 0},pill:Boolean,prependAvatar:String,prependIcon:y,ripple:{type:[Boolean,Object],default:!0},text:String,modelValue:{type:Boolean,default:!0},onClick:B(),onClickOnce:B(),...ae(),...L(),...le(),...te(),...ne(),...se(),...ie(),...ce(),...R({tag:"span"}),...E(),...T({variant:"tonal"})},"VChip"),Ge=z()({name:"VChip",directives:{Ripple:de},props:Se(),emits:{"click:close":e=>!0,"update:modelValue":e=>!0,"group:selected":e=>!0,click:e=>!0},setup(e,p){let{attrs:c,emit:o,slots:t}=p;const{t:b}=oe(),{borderClasses:m}=ue(e),{colorClasses:k,colorStyles:h,variantClasses:u}=re(e),{densityClasses:w}=ve(e),{elevationClasses:O}=fe(e),{roundedClasses:M}=pe(e),{sizeClasses:j}=be(e),{themeClasses:q}=F(e),V=me(e,"modelValue"),a=ke(e,$,!1),s=he(e,c),K=C(()=>e.link!==!1&&s.isLink.value),i=C(()=>!e.disabled&&e.link!==!1&&(!!a||e.link||s.isClickable.value)),W=C(()=>({"aria-label":b(e.closeLabel),onClick(n){n.stopPropagation(),V.value=!1,o("click:close",n)}}));function I(n){var d;o("click",n),i.value&&((d=s.navigate)==null||d.call(s,n),a==null||a.toggle())}function X(n){(n.key==="Enter"||n.key===" ")&&(n.preventDefault(),I(n))}return()=>{const n=s.isLink.value?"a":e.tag,d=!!(e.appendIcon||e.appendAvatar),N=!!(d||t.append),U=!!(t.close||e.closable),g=!!(t.filter||e.filter)&&a,P=!!(e.prependIcon||e.prependAvatar),Y=!!(P||t.prepend),S=!a||a.isSelected.value;return V.value&&G(l(n,{class:["v-chip",{"v-chip--disabled":e.disabled,"v-chip--label":e.label,"v-chip--link":i.value,"v-chip--filter":g,"v-chip--pill":e.pill},q.value,m.value,S?k.value:void 0,w.value,O.value,M.value,j.value,u.value,a==null?void 0:a.selectedClass.value,e.class],style:[S?h.value:void 0,e.style],disabled:e.disabled||void 0,draggable:e.draggable,href:s.href.value,tabindex:i.value?0:void 0,onClick:I,onKeydown:i.value&&!K.value&&X},{default:()=>{var A;return[Ce(i.value,"v-chip"),g&&l(Ve,{key:"filter"},{default:()=>[G(l("div",{class:"v-chip__filter"},[t.filter?l(f,{key:"filter-defaults",disabled:!e.filterIcon,defaults:{VIcon:{icon:e.filterIcon}}},t.filter):l(v,{key:"filter-icon",icon:e.filterIcon},null)]),[[Ie,a.isSelected.value]])]}),Y&&l("div",{key:"prepend",class:"v-chip__prepend"},[t.prepend?l(f,{key:"prepend-defaults",disabled:!P,defaults:{VAvatar:{image:e.prependAvatar,start:!0},VIcon:{icon:e.prependIcon,start:!0}}},t.prepend):l(_,null,[e.prependIcon&&l(v,{key:"prepend-icon",icon:e.prependIcon,start:!0},null),e.prependAvatar&&l(x,{key:"prepend-avatar",image:e.prependAvatar,start:!0},null)])]),l("div",{class:"v-chip__content"},[((A=t.default)==null?void 0:A.call(t,{isSelected:a==null?void 0:a.isSelected.value,selectedClass:a==null?void 0:a.selectedClass.value,select:a==null?void 0:a.select,toggle:a==null?void 0:a.toggle,value:a==null?void 0:a.value.value,disabled:e.disabled}))??e.text]),N&&l("div",{key:"append",class:"v-chip__append"},[t.append?l(f,{key:"append-defaults",disabled:!d,defaults:{VAvatar:{end:!0,image:e.appendAvatar},VIcon:{end:!0,icon:e.appendIcon}}},t.append):l(_,null,[e.appendIcon&&l(v,{key:"append-icon",end:!0,icon:e.appendIcon},null),e.appendAvatar&&l(x,{key:"append-avatar",end:!0,image:e.appendAvatar},null)])]),U&&l("div",ge({key:"close",class:"v-chip__close"},W.value),[t.close?l(f,{key:"close-defaults",defaults:{VIcon:{icon:e.closeIcon,size:"x-small"}}},t.close):l(v,{key:"close-icon",icon:e.closeIcon,size:"x-small"},null)])]}}),[[ye("ripple"),i.value&&e.ripple,null]])}}});export{Ge as V};