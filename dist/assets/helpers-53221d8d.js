const s=e=>e==null||e===""?!0:!!(Array.isArray(e)&&e.length===0),d=e=>e==null,c=e=>Array.isArray(e)&&e.length===0,p=(e,n=null)=>{const t=e.split("/"),a=t[t.length-1],r=a.split("."),l=r[r.length-1];let i=n+"."+l;n==null&&(i=a);const o=document.createElement("a");o.href=e,o.target="_blank",o.setAttribute("download",i),document.body.appendChild(o),o.click(),document.body.removeChild(o)},m=e=>{const n=window.open("","_blank");if(n){const t=`
      <html>
        <head>
          <title>PDF Viewer</title>
        </head>
        <body>
          <embed width="100%" height="100%" src="data:application/pdf;base64,${e}" type="application/pdf">
        </body>
      </html>
    `;n.document.write(t)}else alert("La ventana emergente fue bloqueada por el navegador. Asegúrate de permitir ventanas emergentes.")},h=(e,n="excel")=>{if(e){const t=document.createElement("a");t.href=`data:application/vnd.ms-excel;base64,${e}`,t.download=n+".xlsx",t.click()}};export{h as a,c as b,s as c,p as d,d as i,m as o};
