import{V as A,r as D}from"./VForm-c2f52528.js";import{_}from"./AppTextField.vue_vue_type_script_setup_true_lang-ae3869bc.js";import{_ as U}from"./DialogCloseBtn.vue_vue_type_script_setup_true_lang-03b2387b.js";import{r as T,ck as j,cl as B,aD as L,af as S,d as F,w as H,o as N,c as P,b as d,f as h,k as b,ae as V,B as $}from"./index-d0670919.js";import{a as O,w as M}from"./index-9c720871.js";import{V as J}from"./VCard-e76a16db.js";import{V as E}from"./VCardText-e103ba3a.js";import{V as z}from"./VRow-0989fd53.js";import{V as I}from"./VCol-f9ca3977.js";import{V as G}from"./VDialog-33a1f9d0.js";function K(){const o="127.0.0.1",s="http",l=T(localStorage.getItem("baseUrl")??`${s}://${o}:8000/api`),n=`${o}://${o}:8000`;return{baseURL:l,baseURLBack:n,setBaseUrl:p=>{l.value=p}}}class Q extends Error{constructor(t,s){super(t,s),this.name="FetchError",s!=null&&s.cause&&!this.cause&&(this.cause=s.cause)}}function W(o){var i,a,e,f,u;const t=((i=o.error)==null?void 0:i.message)||((a=o.error)==null?void 0:a.toString())||"",s=((e=o.request)==null?void 0:e.method)||((f=o.options)==null?void 0:f.method)||"GET",l=((u=o.request)==null?void 0:u.url)||String(o.request)||"/",n=`[${s}] ${JSON.stringify(l)}`,c=o.response?`${o.response.status} ${o.response.statusText}`:"<no response>",p=`${n}: ${c}${t?` ${t}`:""}`,r=new Q(p,o.error?{cause:o.error}:void 0);for(const m of["request","options","response"])Object.defineProperty(r,m,{get(){return o[m]}});for(const[m,y]of[["data","_data"],["status","status"],["statusCode","status"],["statusText","statusText"],["statusMessage","statusText"]])Object.defineProperty(r,m,{get(){return o.response&&o.response[y]}});return r}const X=new Set(Object.freeze(["PATCH","POST","PUT","DELETE"]));function R(o="GET"){return X.has(o.toUpperCase())}function Y(o){if(o===void 0)return!1;const t=typeof o;return t==="string"||t==="number"||t==="boolean"||t===null?!0:t!=="object"?!1:Array.isArray(o)?!0:o.buffer?!1:o.constructor&&o.constructor.name==="Object"||typeof o.toJSON=="function"}const Z=new Set(["image/svg","application/xml","application/xhtml","application/html"]),x=/^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;function ee(o=""){if(!o)return"json";const t=o.split(";").shift()||"";return x.test(t)?"json":Z.has(t)||t.startsWith("text/")?"text":"blob"}function oe(o,t,s,l){const n=te((t==null?void 0:t.headers)??(o==null?void 0:o.headers),s==null?void 0:s.headers,l);let c;return(s!=null&&s.query||s!=null&&s.params||t!=null&&t.params||t!=null&&t.query)&&(c={...s==null?void 0:s.params,...s==null?void 0:s.query,...t==null?void 0:t.params,...t==null?void 0:t.query}),{...s,...t,query:c,params:c,headers:n}}function te(o,t,s){if(!t)return new s(o);const l=new s(t);if(o)for(const[n,c]of Symbol.iterator in o||Array.isArray(o)?o:new s(o))l.set(n,c);return l}async function w(o,t){if(t)if(Array.isArray(t))for(const s of t)await s(o);else await t(o)}const se=new Set([408,409,425,429,500,502,503,504]),re=new Set([101,204,205,304]);function C(o={}){const{fetch:t=globalThis.fetch,Headers:s=globalThis.Headers,AbortController:l=globalThis.AbortController}=o;async function n(r){const i=r.error&&r.error.name==="AbortError"&&!r.options.timeout||!1;if(r.options.retry!==!1&&!i){let e;typeof r.options.retry=="number"?e=r.options.retry:e=R(r.options.method)?0:1;const f=r.response&&r.response.status||500;if(e>0&&(Array.isArray(r.options.retryStatusCodes)?r.options.retryStatusCodes.includes(f):se.has(f))){const u=typeof r.options.retryDelay=="function"?r.options.retryDelay(r):r.options.retryDelay||0;return u>0&&await new Promise(m=>setTimeout(m,u)),c(r.request,{...r.options,retry:e-1})}}const a=W(r);throw Error.captureStackTrace&&Error.captureStackTrace(a,c),a}const c=async function(i,a={}){var m;const e={request:i,options:oe(i,a,o.defaults,s),response:void 0,error:void 0};e.options.method=(m=e.options.method)==null?void 0:m.toUpperCase(),e.options.onRequest&&await w(e,e.options.onRequest),typeof e.request=="string"&&(e.options.baseURL&&(e.request=O(e.request,e.options.baseURL)),e.options.query&&(e.request=M(e.request,e.options.query))),e.options.body&&R(e.options.method)&&(Y(e.options.body)?(e.options.body=typeof e.options.body=="string"?e.options.body:JSON.stringify(e.options.body),e.options.headers=new s(e.options.headers||{}),e.options.headers.has("content-type")||e.options.headers.set("content-type","application/json"),e.options.headers.has("accept")||e.options.headers.set("accept","application/json")):("pipeTo"in e.options.body&&typeof e.options.body.pipeTo=="function"||typeof e.options.body.pipe=="function")&&("duplex"in e.options||(e.options.duplex="half")));let f;if(!e.options.signal&&e.options.timeout){const y=new l;f=setTimeout(()=>{const g=new Error("[TimeoutError]: The operation was aborted due to timeout");g.name="TimeoutError",g.code=23,y.abort(g)},e.options.timeout),e.options.signal=y.signal}try{e.response=await t(e.request,e.options)}catch(y){return e.error=y,e.options.onRequestError&&await w(e,e.options.onRequestError),await n(e)}finally{f&&clearTimeout(f)}if(e.response.body&&!re.has(e.response.status)&&e.options.method!=="HEAD"){const y=(e.options.parseResponse?"json":e.options.responseType)||ee(e.response.headers.get("content-type")||"");switch(y){case"json":{const g=await e.response.text(),k=e.options.parseResponse||j;e.response._data=k(g);break}case"stream":{e.response._data=e.response.body;break}default:e.response._data=await e.response[y]()}}return e.options.onResponse&&await w(e,e.options.onResponse),!e.options.ignoreResponseError&&e.response.status>=400&&e.response.status<600?(e.options.onResponseError&&await w(e,e.options.onResponseError),await n(e)):e.response},p=async function(i,a){return(await c(i,a))._data};return p.raw=c,p.native=(...r)=>t(...r),p.create=(r={},i={})=>C({...o,...i,defaults:{...o.defaults,...i.defaults,...r}}),p}const v=function(){if(typeof globalThis<"u")return globalThis;if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("unable to locate global object")}(),ae=v.fetch?(...o)=>v.fetch(...o):()=>Promise.reject(new Error("[ofetch] global.fetch is not supported!")),ne=v.Headers,ie=v.AbortController,q=C({fetch:ae,Headers:ne,AbortController:ie});q.create({baseURL:"https://back.colegiovirgendelvalle.com.co/api",async onRequest({options:o}){const t=B("accessToken").value;t&&(o.headers={...o.headers,Authorization:`Bearer ${t}`})}});const le=q.create({baseURL:"https://back.colegiovirgendelvalle.com.co/",async onRequest({options:o}){}}),ce=L("useTenantStore",{state:()=>({loading:{form:!1,table:!1},tenants:[]}),getters:{},actions:{async setHost(o){localStorage.setItem("baseUrl",`http://${o}.127.0.0.1:8000/api`),window.location.href="http://"+o+".localhost:5173",setTimeout(()=>{window.location.reload()},1e3)},async setHostLogin(o){window.location.href="http://"+o+".localhost:5173"},async setHostCentral(){const o=T(K());o.value.baseURL,localStorage.setItem("baseUrl",o.value.baseURL),window.location.reload()},async fetchSave(o){var c;this.loading.form=!0;const{data:t,response:s,error:l,isFetching:n}=await S("/tenant-store").post(o);return this.loading.form=!1,(c=s.value)!=null&&c.ok&&t.value&&await le("/linkstorage",{method:"get"}),t.value},async fetchList(){var n;this.loading.form=!0;const{data:o,response:t,error:s,isFetching:l}=await S("/tenant-list").post({typeData:"todos"});return this.loading.form=!1,(n=t.value)!=null&&n.ok&&o.value&&(this.tenants=o.value.data),o.value}}}),Te=F({__name:"ModalStore",props:{isDialogDetailVisible:{type:Boolean}},emits:["update:isDialogDetailVisible"],setup(o,{emit:t}){const s=T(),l=ce(),n=T({name:null}),c=async()=>{var a;const i=await((a=s.value)==null?void 0:a.validate());i!=null&&i.valid&&(await l.fetchSave(n.value),p("update:isDialogDetailVisible",!1),await l.fetchList())},p=t;H(n.value,i=>{n.value.name&&(n.value.name=n.value.name.replaceAll(" ","_"))});const r=()=>{p("update:isDialogDetailVisible",!1)};return(i,a)=>{const e=U,f=_;return N(),P("div",null,[d(G,{"model-value":o.isDialogDetailVisible,width:"500",persistent:""},{default:h(()=>[d(e,{onClick:a[0]||(a[0]=u=>r())}),d(J,{title:"Nuevo subdominio"},{default:h(()=>[d(E,null,{default:h(()=>[d(b(A),{ref_key:"formValidation",ref:s},{default:h(()=>[d(z,null,{default:h(()=>[d(I,{cols:"12"},{default:h(()=>[d(f,{modelValue:b(n).name,"onUpdate:modelValue":a[1]||(a[1]=u=>b(n).name=u),class:"mt-1",label:"Nombre de tenant a crear",rules:["requiredValidator"in i?i.requiredValidator:b(D)]},null,8,["modelValue","rules"])]),_:1})]),_:1})]),_:1},512)]),_:1}),d(E,{class:"d-flex justify-end"},{default:h(()=>[d(V,{loading:b(l).loading.form,color:"secondary",class:"mr-5",onClick:a[2]||(a[2]=u=>r())},{default:h(()=>a[4]||(a[4]=[$(" Cancelar ")])),_:1},8,["loading"]),d(V,{loading:b(l).loading.form,onClick:a[3]||(a[3]=u=>c())},{default:h(()=>a[5]||(a[5]=[$(" Crear ")])),_:1},8,["loading"])]),_:1})]),_:1})]),_:1},8,["model-value"])])}}});export{Te as _,ce as u};