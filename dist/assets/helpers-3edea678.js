const d=e=>e==null||e===""?!0:!!(Array.isArray(e)&&e.length===0),l=e=>e==null,c=e=>Array.isArray(e)&&e.length===0,p=(e,n=null)=>{const r=e.split("/"),o=r[r.length-1],i=o.split("."),s=i[i.length-1];let a=n+"."+s;n==null&&(a=o);const t=document.createElement("a");t.href=e,t.target="_blank",t.setAttribute("download",a),document.body.appendChild(t),t.click(),document.body.removeChild(t)},m=e=>{const n=window.open("","_blank");if(n){const r=`
      <html>
        <head>
          <title>PDF Viewer</title>
        </head>
        <body>
          <embed width="100%" height="100%" src="data:application/pdf;base64,${e}" type="application/pdf">
        </body>
      </html>
    `;n.document.write(r)}else alert("La ventana emergente fue bloqueada por el navegador. Asegúrate de permitir ventanas emergentes.")};export{c as a,d as b,p as d,l as i,m as o};
