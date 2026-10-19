/* StAR Lorentz-model teaching visualization.
 * Geometry H^2(-c) = { (t,x,y) | -t^2+x^2+y^2 = -1/c, t>0 } in Minkowski R^(2,1).
 * The 3D drawing is an ordinary Euclidean screen projection, NOT an induced
 * Euclidean-curvature plot. Varying tree depth changes radial distance and
 * hyperbolic circumference; K = -c stays constant at every depth.
 */
(() => {
 "use strict";
 const root=document.getElementById("star-lorentz-explorer");if(!root)return;
 const svg=root.querySelector("[data-lorentz-canvas]"),depthSlider=root.querySelector("[data-depth]"),curvatureSlider=root.querySelector("[data-curvature]");
 const depthOutput=root.querySelector("[data-depth-readout]"),curvatureOutput=root.querySelector("[data-curvature-readout]");
 let theta=0.44,tilt=.69,drag=null;
 const language=()=>document.documentElement.dataset.language==="en"?"en":"ko";
 const svgEscape=s=>String(s).replace(/[&<>"']/g,k=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[k]));
 const clamp=(x,min,max)=>Math.max(min,Math.min(max,x));
 function render(){
  const depth=Number(depthSlider.value),c=Number(curvatureSlider.value),sc=Math.sqrt(c),rMax=depth*.36;
  const hyperRadius=r=>Math.sinh(sc*r)/sc,hyperHeight=r=>Math.cosh(sc*r)/sc,baseZ=1/sc;
  function point(r,az){const q=hyperRadius(r);return {x:q*Math.cos(az),y:q*Math.sin(az),z:hyperHeight(r)};}
  function rotate(v){const a=v.x*Math.cos(theta)-v.y*Math.sin(theta),b=v.x*Math.sin(theta)+v.y*Math.cos(theta);return {x:a,y:b*Math.cos(tilt)-(v.z-baseZ)*Math.sin(tilt)};}
  const all=[];const circles=[],radials=[];
  for(let j=0;j<=10;j++){let ring=[];let r=j*rMax/10;for(let k=0;k<=80;k++){let q=rotate(point(r,2*Math.PI*k/80));ring.push(q);all.push(q);}circles.push(ring);}
  for(let a=0;a<18;a++){let arm=[];for(let j=0;j<=48;j++){let q=rotate(point(rMax*j/48,2*Math.PI*a/18));arm.push(q);all.push(q);}radials.push(arm);}
  const nodes=[];for(let d=0;d<=depth;d++){let count=Math.pow(2,d);for(let k=0;k<count;k++){let q=rotate(point(.36*d,2*Math.PI*k/count+.2));nodes.push({d,k,q});all.push(q);}}
  let minX=Math.min(...all.map(v=>v.x)),maxX=Math.max(...all.map(v=>v.x)),minY=Math.min(...all.map(v=>v.y)),maxY=Math.max(...all.map(v=>v.y));
  const zoom=Math.min(730/(maxX-minX+1e-4),490/(maxY-minY+1e-4)),ox=400-(minX+maxX)/2*zoom,oy=300-(minY+maxY)/2*zoom;
  const pos=q=>(ox+zoom*q.x).toFixed(1)+","+(oy+zoom*q.y).toFixed(1);
  const poly=(points,stroke,width,opacity,dashed)=>'<polyline points="'+points.map(pos).join(" ")+'" fill="none" stroke="'+stroke+'" stroke-width="'+width+'" opacity="'+opacity+'"'+(dashed?' stroke-dasharray="'+dashed+'"':"")+'/>';
  let paths='<rect width="800" height="600" fill="transparent"/>';
  const nodelines=[];
  for(const n of nodes){if(n.d===0)continue;let parent=nodes.find(x=>x.d===n.d-1&&x.k===Math.floor(n.k/2));if(!parent)continue;nodelines.push(poly([parent.q,n.q],"#d7a54c",2.6,.88,""));}
  paths+=circles.map((points,i)=>poly(points,i===0?"#2d718e":"#679ab4",i===10?1.7:1.1,i===10?.70:.35,i%2?"3 7":"")).join("");
  paths+=radials.map(q=>poly(q,"#679ab4",1,.24,"")).join("");
  paths+=nodelines.join("");
  paths+=nodes.map(n=>{let q=pos(n.q).split(",");return '<circle cx="'+q[0]+'" cy="'+q[1]+'" r="'+(n.d===depth?5.1:4.0)+'" stroke="#ffffff" stroke-width="1.7" fill="'+(n.d===0?"#207c8b":n.d===depth?"#d3a14a":"#527fc0")+'"/>';}).join("");
  const l=language(),rad=hyperRadius(rMax),circ=2*Math.PI*rad,euc=2*Math.PI*rMax;
  svg.innerHTML='<title>'+svgEscape(l==="ko"?"일정한 음의 곡률을 갖는 Lorentz hyperboloid 좌표를 3차원으로 투영한 계층 트리":"A projected hierarchical tree on a constant-negative-curvature Lorentz hyperboloid")+'</title><desc>'+svgEscape(l==="ko"?"깊이 "+depth+", 곡률 -"+c.toFixed(1)+". 3차원 모형은 개념 설명용이며 유클리드 공간의 표면 곡률을 나타내지 않습니다.":"Depth "+depth+", curvature -"+c.toFixed(1)+". A screen projection, not Euclidean surface curvature.")+'</desc>'+paths;
  depthOutput.textContent=String(depth);
  curvatureOutput.textContent="−"+c.toFixed(1);
  root.querySelector("[data-lorentz-depth-label]").textContent=l==="ko"?"깊이 "+depth+" · "+(Math.pow(2,depth))+"개 말단 노드":"Depth "+depth+" · "+Math.pow(2,depth)+" leaf nodes";
  root.querySelector("[data-lorentz-curvature-label]").textContent="K = −"+c.toFixed(1)+" ("+(l==="ko"?"모든 깊이에서 일정":"constant at every depth")+")";
  root.querySelector("[data-lorentz-expansion]").textContent=(circ/euc).toFixed(2)+"×";
  root.querySelector("[data-lorentz-circ]").textContent=circ.toFixed(2)+" / "+euc.toFixed(2);
  root.querySelector("[data-lorentz-note]").textContent=l==="ko"?
  "표면 모양만으로 곡률을 판단하면 안 됩니다. 실제 StAR는 Lorentz 공간의 Minkowski 계량과 거리·메시지 전달을 사용합니다. 이 화면은 계층이 깊어질수록 동일 반경의 원주 공간이 유클리드보다 빠르게 커진다는 직관을 나타냅니다.":
  "Do not infer intrinsic curvature from the screen shape. StAR uses a Lorentz manifold with the Minkowski metric for distances and message passing. This view illustrates faster-than-Euclidean growth of radial circumference at greater depth.";
 }
 [depthSlider,curvatureSlider].forEach(input=>input.addEventListener("input",render));
 svg.addEventListener("pointerdown",e=>{drag={x:e.clientX,y:e.clientY,theta,tilt};try{svg.setPointerCapture(e.pointerId)}catch{}});
 svg.addEventListener("pointermove",e=>{if(!drag)return;theta=drag.theta+(e.clientX-drag.x)*.009;tilt=clamp(drag.tilt+(e.clientY-drag.y)*.004,.22,1.35);render();});
 svg.addEventListener("pointerup",()=>{drag=null});svg.addEventListener("pointercancel",()=>{drag=null});
 root.querySelector("[data-lorentz-reset]").addEventListener("click",()=>{theta=.44;tilt=.69;depthSlider.value="4";curvatureSlider.value="1.0";render()});
 document.addEventListener("portfolio-language-change",render);
 render();
})();