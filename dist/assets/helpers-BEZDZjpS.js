import{ay as i}from"./index-Cn7h1RaR.js";import{B as l}from"./constants-2GBt7OCP.js";const{toast:d}=i(),h=e=>e==null||e===""?!0:!!(Array.isArray(e)&&e.length===0),b=e=>e==null,f=e=>Array.isArray(e)&&e.length===0,u=(e,o=null)=>{const t=e.split("/"),a=t[t.length-1],c=a.split("."),s=c[c.length-1];let n=o+"."+s;o==null&&(n=a);const r=document.createElement("a");r.href=e,r.target="_blank",r.setAttribute("download",n),document.body.appendChild(r),r.click(),document.body.removeChild(r)},w=e=>{const o=window.open("","_blank");if(o){const t=`
      <html>
        <head>
          <title>PDF Viewer</title>
        </head>
        <body>
          <embed width="100%" height="100%" src="data:application/pdf;base64,${e}" type="application/pdf">
        </body>
      </html>
    `;o.document.write(t)}else alert("La ventana emergente fue bloqueada por el navegador. Asegúrate de permitir ventanas emergentes.")},g=(e,o="excel")=>{if(e){const t=document.createElement("a");t.href=`data:application/vnd.ms-excel;base64,${e}`,t.download=o+".xlsx",t.click()}};function y(e){return l+e}const A=async(e,o="archivo")=>{if(e)try{const t=encodeURIComponent(e),a=await fetch(`https://back.colegiovirgendelvalle.com.co//api/file/download?file=${t}`);a.ok||d("Error","Error al descargar el archivo","danger");const c=await a.blob(),s=window.URL.createObjectURL(c),n=document.createElement("a");n.href=s,n.download=o,document.body.appendChild(n),n.click(),n.remove(),window.URL.revokeObjectURL(s)}catch(t){console.error("Error:",t)}};export{A as a,g as b,b as c,u as d,f as e,h as i,w as o,y as s};
