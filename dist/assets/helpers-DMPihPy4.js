import{B as l}from"./constants-2GBt7OCP.js";const d=e=>e==null||e===""?!0:!!(Array.isArray(e)&&e.length===0),m=e=>e==null,p=e=>Array.isArray(e)&&e.length===0,h=(e,n=null)=>{const t=e.split("/"),r=t[t.length-1],a=r.split("."),i=a[a.length-1];let s=n+"."+i;n==null&&(s=r);const o=document.createElement("a");o.href=e,o.target="_blank",o.setAttribute("download",s),document.body.appendChild(o),o.click(),document.body.removeChild(o)},u=e=>{const n=window.open("","_blank");if(n){const t=`
      <html>
        <head>
          <title>PDF Viewer</title>
        </head>
        <body>
          <embed width="100%" height="100%" src="data:application/pdf;base64,${e}" type="application/pdf">
        </body>
      </html>
    `;n.document.write(t)}else alert("La ventana emergente fue bloqueada por el navegador. Asegúrate de permitir ventanas emergentes.")},b=(e,n="excel")=>{if(e){const t=document.createElement("a");t.href=`data:application/vnd.ms-excel;base64,${e}`,t.download=n+".xlsx",t.click()}};function f(e){return l+e}export{b as a,m as b,p as c,h as d,d as i,u as o,f as s};
