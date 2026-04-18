import{V as c,U as l}from"./index-DXOSpjPH.js";import{B as d}from"./constants-Csqy1jag.js";const h=e=>e==null||e===""?!0:!!(Array.isArray(e)&&e.length===0),u=e=>e==null,f=e=>Array.isArray(e)&&e.length===0,A=(e,n=null)=>{const t=e.split("/"),s=t[t.length-1],r=s.split("."),i=r[r.length-1];let a=n+"."+i;n==null&&(a=s);const o=document.createElement("a");o.href=e,o.target="_blank",o.setAttribute("download",a),document.body.appendChild(o),o.click(),document.body.removeChild(o)},b=e=>{const n=window.open("","_blank");if(n){const t=`
      <html>
        <head>
          <title>PDF Viewer</title>
        </head>
        <body>
          <embed width="100%" height="100%" src="data:application/pdf;base64,${e}" type="application/pdf">
        </body>
      </html>
    `;n.document.write(t)}else alert("La ventana emergente fue bloqueada por el navegador. Asegúrate de permitir ventanas emergentes.")},g=(e,n="excel")=>{if(e){const t=document.createElement("a");t.href=`data:application/vnd.ms-excel;base64,${e}`,t.download=n+".xlsx",t.click()}};function y(e){return d+e}const w=e=>{const n=c(),{permissions:t}=l(n);return t.value.some(s=>s===e)};export{g as a,f as b,h as c,A as d,w as h,u as i,b as o,y as s};
