import{d as v,a0 as x,$ as h,k as C,o as u,g as m,f as t,b as o,n as e,t as s,v as k,a1 as f,y as I}from"./index-4eb24df8.js";import{V as d}from"./VAvatar-1e92a85e.js";import{V as p}from"./VImg-67e70e7a.js";import{V as L}from"./VMenu-95167406.js";import{V as S,a as r,b as n}from"./VList-8d710a46.js";import{a as w,V as _}from"./VBadge-ef78889a.js";import{V as A}from"./VDivider-8b44441e.js";const V="/assets/avatar-1-129659bb.png",U=v({__name:"UserProfile",setup(B){const a=x(),{company:l,user:i}=h(a),g=C(),b=()=>{a.logout(),g.push("/login")},y=()=>{l.value={},a.getMenuData};return(D,c)=>(u(),m(_,{dot:"",location:"bottom right","offset-x":"3","offset-y":"3",bordered:"",color:"success"},{default:t(()=>[o(d,{class:"cursor-pointer",color:"primary",variant:"tonal"},{default:t(()=>[o(p,{src:e(V)},null,8,["src"]),o(L,{activator:"parent",width:"230",location:"bottom end",offset:"14px"},{default:t(()=>[o(S,null,{default:t(()=>[o(r,null,{prepend:t(()=>[o(w,{start:""},{default:t(()=>[o(_,{dot:"",location:"bottom right","offset-x":"3","offset-y":"3",color:"success"},{default:t(()=>[o(d,{color:"primary",variant:"tonal"},{default:t(()=>[o(p,{src:e(V)},null,8,["src"])]),_:1})]),_:1})]),_:1})]),default:t(()=>[o(n,{class:"font-weight-semibold"},{default:t(()=>[s(k(e(i).name),1)]),_:1})]),_:1}),e(l).id&&!e(i).company_id?(u(),m(r,{key:0,to:{name:"Company-Index"},onClick:y},{prepend:t(()=>[o(f,{class:"me-2",icon:"tabler-logout",size:"22"})]),default:t(()=>[o(n,null,{default:t(()=>[s("Cambiar Empresa")]),_:1})]),_:1})):I("",!0),o(A,{class:"my-2"}),o(r,{onClick:c[0]||(c[0]=N=>b())},{prepend:t(()=>[o(f,{class:"me-2",icon:"tabler-logout",size:"22"})]),default:t(()=>[o(n,null,{default:t(()=>[s("Logout")]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}))}});export{U as _};