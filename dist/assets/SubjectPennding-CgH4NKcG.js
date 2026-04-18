import{s as I}from"./helpers-CO5lKplG.js";import{d as P,t as A,h as g,bl as F,aP as L,c as R,i as k,o as n,e as c,p as t,k as e,m as a,E as u,j as d,H as h,F as b,q as V,D as x,a0 as O}from"./index-BNRbPMBU.js";import M from"./SchoolData-CEIhH-Tg.js";import{V as w}from"./VContainer-Boawf_2I.js";import{V as q}from"./VImg-bbHb43gf.js";import{V as C,a as N}from"./VRow-CdfgvbWv.js";import{V as H}from"./VCard-CSABW5c_.js";import{V as J,a as U}from"./VToolbar-DTdTzFBr.js";import{V as z}from"./VCardText-D76RIEPl.js";import{V as S,a as T,b as D,d as G}from"./VList-LM_yhZWd.js";import{V as K}from"./VDivider-Hiqf3_Ij.js";import"./constants-Csqy1jag.js";import"./front-page-footer-BtJIC5P0.js";import"./DialogCloseBtn-t25Zg__t.js";import"./VDialog-BY5TFt5V.js";import"./VOverlay-Dcy05FBW.js";import"./scopeId-DbuyUd1n.js";import"./forwardRefs-C-GTDzx5.js";import"./dialog-transition-SivyHCvM.js";import"./VAvatar-C14fvrlC.js";import"./ssrBoot-CIoiiuGF.js";import"./VMenu-CfELvWks.js";/* empty css              */const Q="/assets/Virgen-D8_JaCe0.png",W=P({__name:"SubjectPennding",async setup(_,{expose:y}){y();let l,i;const f=A(),v=g({id:"",title:"",image:"",html:""}),o=g(""),r=g(""),{data:s,response:p}=([l,i]=F(()=>L(`pw-materiaPendiente/${f.params.school_id}`).get()),l=await l,i(),l);s.value.code==200&&(v.value=s.value.pendingRegistrations,r.value=s.value.term_name,o.value=s.value.students_pending_subject);const m={route:f,plannings:v,students_pending_subject:o,term_name:r,data:s,response:p,get ingVirgenCvv(){return Q},SchoolData:M};return Object.defineProperty(m,"__isScriptSetup",{enumerable:!1,value:!0}),m}}),X={class:"our-team"},Y={class:"headers d-flex justify-center flex-column align-center"},Z={class:"d-flex align-center text-h3 mb-1 flex-wrap justify-center"},$={class:"position-relative me-2 d-flex flex-column justify-center align-center"},tt={class:"section-title text-center"},et={key:0,class:"font-weight-bold mb-6"},it=["href"],st=["href"];function nt(_,y,l,i,f,v){const o=k("v-list-item-content"),r=k("v-list-item-group");return n(),c(i.SchoolData,{swiperBanners:!1},{default:t(()=>[e(w,{id:"team"},{default:t(()=>[a("div",X,[a("div",Y,[a("div",Z,[a("div",$,[e(q,{width:"100",src:i.ingVirgenCvv},null,8,["src"]),a("h3",tt," Materias Pendientes "+u(i.term_name),1)])])]),e(C,null,{default:t(()=>[e(N,null,{default:t(()=>[i.students_pending_subject?(n(),d("h2",et,[a("a",{target:"_blank",href:i.students_pending_subject}," LISTADO DE ESTUDIANTES CON MATERIA PENDIENTE ",8,it)])):h("v-if",!0),e(w,null,{default:t(()=>[e(C,null,{default:t(()=>[(n(!0),d(b,null,V(i.plannings,(s,p)=>(n(),c(N,{key:p,cols:"12",md:"6"},{default:t(()=>[e(H,{class:"mb-4"},{default:t(()=>[h(" Toolbar "),a("div",null,[e(J,{color:"primary",class:"text-center"},{default:t(()=>[e(U,null,{default:t(()=>[x(u(s.grade_name),1)]),_:2},1024)]),_:2},1024)]),e(z,null,{default:t(()=>[e(S,null,{default:t(()=>[e(r,null,{default:t(()=>[(n(!0),d(b,null,V(s.files_by_subject,(m,B)=>(n(),c(T,{key:B},{default:t(()=>[e(o,null,{default:t(()=>[e(D,{class:"font-weight-medium text-h6"},{default:t(()=>[x(" ● "+u(m.subject_name),1)]),_:2},1024),e(S,null,{default:t(()=>[e(r,null,{default:t(()=>[(n(!0),d(b,null,V(m.files,(j,E)=>(n(),c(T,{key:E},{default:t(()=>[e(o,null,{default:t(()=>[e(D,{class:"text-h5"},{default:t(()=>[x(u(j.name),1)]),_:2},1024),e(G,null,{default:t(()=>[a("a",{href:("storageBack"in _?_.storageBack:O(I))(j.path),target:"_blank",class:"text-h6 text-primary"},"Ver Archivo",8,st)]),_:2},1024)]),_:2},1024)]),_:2},1024))),128))]),_:2},1024)]),_:2},1024),e(K)]),_:2},1024)]),_:2},1024))),128))]),_:2},1024)]),_:2},1024)]),_:2},1024)]),_:2},1024)]),_:2},1024))),128))]),_:1})]),_:1}),h(` <v-card-text>
                      <v-list>
                        <v-list-item-group>
                          <v-list-item v-for="(files, sectionName) in sections" :key="sectionName">
                            <v-list-item-content>
                              <v-list-item-title class="font-weight-medium text-h6">Sección {{ sectionName
                              }}</v-list-item-title>
                              <v-list>
                                <v-list-item-group>
                                  <v-list-item v-for="(subjectFiles, subjectName) in files" :key="subjectName">
                                    <v-list-item-content>
                                      <v-list-item-title class="text-body-1 font-weight-bold">● {{ subjectName
                                      }}</v-list-item-title>
                                      <v-list>
                                        <v-list-item v-for="file in subjectFiles" :key="file.id">
                                          <v-list-item-content>
                                            <v-list-item-title class="text-body-1">{{ file.name }}</v-list-item-title>
                                            <v-list-item-subtitle>
                                              <a :href="storageBack(file.path)" target="_blank" class="text-primary">Ver
                                                Archivo</a>
                                            </v-list-item-subtitle>
                                          </v-list-item-content>
                                        </v-list-item>
                                      </v-list>
                                    </v-list-item-content>
                                  </v-list-item>
                                </v-list-item-group>
                              </v-list>
                              <v-divider></v-divider>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </v-card-text> `)]),_:1})]),_:1})])]),_:1})]),_:1})}const St=R(W,[["render",nt],["__scopeId","data-v-dcf42235"],["__file","/var/www/html/src/pages/Pw/SubjectPennding.vue"]]);export{St as default};
