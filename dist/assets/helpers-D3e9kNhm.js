import{ay as i,U as l,R as d}from"./index-BAItGVH2.js";import{B as m}from"./constants-2GBt7OCP.js";const{toast:p}=i(),b=e=>e==null||e===""?!0:!!(Array.isArray(e)&&e.length===0),f=e=>e==null,w=e=>Array.isArray(e)&&e.length===0,g=(e,o=null)=>{const t=e.split("/"),r=t[t.length-1],s=r.split("."),c=s[s.length-1];let n=o+"."+c;o==null&&(n=r);const a=document.createElement("a");a.href=e,a.target="_blank",a.setAttribute("download",n),document.body.appendChild(a),a.click(),document.body.removeChild(a)},y=e=>{const o=window.open("","_blank");if(o){const t=`
      <html>
        <head>
          <title>PDF Viewer</title>
        </head>
        <body>
          <embed width="100%" height="100%" src="data:application/pdf;base64,${e}" type="application/pdf">
        </body>
      </html>
    `;o.document.write(t)}else alert("La ventana emergente fue bloqueada por el navegador. Asegúrate de permitir ventanas emergentes.")},A=(e,o="excel")=>{if(e){const t=document.createElement("a");t.href=`data:application/vnd.ms-excel;base64,${e}`,t.download=o+".xlsx",t.click()}};function k(e){return m+e}const v=async(e,o="archivo")=>{if(e)try{const t=encodeURIComponent(e),r=await fetch(`https://back.colegiovirgendelvalle.com.co/api/file/download?file=${t}`);r.ok||p("Error","Error al descargar el archivo","danger");const s=await r.blob(),c=window.URL.createObjectURL(s),n=document.createElement("a");n.href=c,n.download=o,document.body.appendChild(n),n.click(),n.remove(),window.URL.revokeObjectURL(c)}catch(t){console.error("Error:",t)}},E=e=>{const o=l(),{permissions:t}=d(o);return t.value.some(r=>r===e)};export{v as a,A as b,f as c,g as d,w as e,E as h,b as i,y as o,k as s};
