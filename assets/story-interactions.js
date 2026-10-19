
/* Scientific story interactions — illustrative unless a published aggregate is explicitly labelled. */
(() => {
"use strict";
const language=()=>document.documentElement.dataset.language==="en"?"en":"ko";
const say=(ko,en)=>language()==="en"?en:ko;
const escapeHTML=(v)=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const panel=(title,subtitle,contents,note="")=>'<div class="story-demo-header"><strong>'+title+'</strong><span>'+subtitle+'</span></div><div class="story-demo-body">'+contents+'</div>'+(note?'<p class="story-demo-micro">'+note+'</p>':"");
const b=(value,label,current)=>'<button class="story-demo-choice" type="button" data-choice="'+escapeHTML(value)+'" aria-pressed="'+(String(current)===String(value))+'">'+escapeHTML(label)+'</button>';
const range=(min,max,value,step,what)=>'<label style="display:block;font-size:13px;font-weight:800">'+escapeHTML(what)+'<input type="range" min="'+min+'" max="'+max+'" step="'+step+'" value="'+value+'" data-range="true" aria-label="'+escapeHTML(what)+'" /></label>';
const p=(title,body)=>'<div class="story-demo-panel"><h4>'+escapeHTML(title)+'</h4><p>'+escapeHTML(body)+'</p></div>';
const metric=(key,val,description)=>'<div class="story-demo-evidence"><div><strong>'+escapeHTML(key)+': '+escapeHTML(val)+'</strong> — '+escapeHTML(description)+'</div></div>';
const tree=(depth)=>{
 const elements=['<svg viewBox="0 0 420 220" role="img" aria-label="Illustrative hierarchical graph" style="max-height:210px;overflow:visible">'];
 let nodes=[{x:210,y:24}];
 for(let d=1;d<=depth;d++){
   const n=Math.pow(2,d),next=[],y=24+d*47;
   for(let i=0;i<n;i++){
     const x=19+(382*(i+.5)/n);
     const parent=nodes[Math.floor(i/2)];
     elements.push('<path d="M'+parent.x+' '+(parent.y+12)+' L'+x+' '+(y-10)+'" stroke="#7fa3bf" stroke-width="2" fill="none"/>');
     next.push({x,y});
   }
   nodes=next;
 }
 elements.push('<circle cx="210" cy="24" r="10" fill="#173d65"/>');
 for(const node of nodes)elements.push('<circle cx="'+node.x+'" cy="'+node.y+'" r="5" fill="#3d9a86"/>');
 elements.push('</svg>');return elements.join("");
};

/* Original Figure 1's question, now demonstrated: what changes in an
   intrinsically negatively curved metric, not merely when drawing a tree?
   Left = Euclidean geodesic-radius rings, right = conceptual Poincare-style
   projection of H2(-1). Both show the SAME binary tree, with identical r
   at each level. The screen projection is not a measurement of geodesic
   node distances. The numeric circumference comparison is exact for K=-1. */
const starComparison=(depth)=>{
 const n=Math.max(1,Math.min(6,Number(depth)||4));
 const radius=n*.56,flat=2*Math.PI*radius,hyper=2*Math.PI*Math.sinh(radius),ratio=hyper/flat,leaves=2**n;
 const euSpace=flat/leaves,hypSpace=hyper/leaves;
 const f2=x=>Number(x).toFixed(2);
 const geom=(hyperbolic)=>{
  const Cx=155,Cy=153,outer=113;
  const lines=[],nodes=[],ring=[];
  let before=[{x:Cx,y:Cy}];
  for(let d=1;d<=n;d++){
   const count=2**d,atRadius=hyperbolic?outer*Math.tanh((d*.56)/2):outer*d/n;
   const next=[];
   ring.push('<circle cx="'+Cx+'" cy="'+Cy+'" r="'+atRadius.toFixed(2)+'" fill="none" stroke="'+(hyperbolic?"#47a391":"#8ea5ba")+'" stroke-width="1.1" stroke-dasharray="3 6" opacity="'+(d===n?".80":".42")+'"/>');
   for(let i=0;i<count;i++){
    const theta=2*Math.PI*(i+.5)/count-Math.PI/2;
    const q={x:Cx+atRadius*Math.cos(theta),y:Cy+atRadius*Math.sin(theta)};
    const parent=before[Math.floor(i/2)];
    lines.push('<path d="M'+parent.x.toFixed(2)+' '+parent.y.toFixed(2)+' L'+q.x.toFixed(2)+' '+q.y.toFixed(2)+'" fill="none" stroke="'+(hyperbolic?"#239583":"#7d91ad")+'" stroke-width="'+(d===n?"1.05":"1.65")+'" opacity="'+(d===n?".62":".78")+'"/>');
    nodes.push('<circle cx="'+q.x.toFixed(2)+'" cy="'+q.y.toFixed(2)+'" r="'+(d===n?(n===6?2.6:3.4):4.0)+'" fill="'+(d===n?(hyperbolic?"#1a9e88":"#d48b41"):(hyperbolic?"#297d8c":"#4b80b3"))+'" stroke="var(--surface)" stroke-width=".85"/>');
    next.push(q);
   }
   before=next;
  }
  const title=say(hyperbolic?"음의 곡률 공간의 2D 투영":"유클리드 평면의 배치",hyperbolic?"Projected negative-curvature disk":"Euclidean plane placement");
  return '<svg class="story-star-geometry-svg" viewBox="0 0 310 310" role="img" aria-label="'+escapeHTML(title+" — "+leaves+" leaves, "+n+" levels")+'">'+
    '<circle cx="'+Cx+'" cy="'+Cy+'" r="'+outer+'" fill="'+(hyperbolic?"rgba(29,144,117,.055)":"rgba(69,110,163,.055)")+'" stroke="'+(hyperbolic?"#239583":"#7697b3")+'" stroke-width="1.5"/>'+
    ring.join("")+lines.join("")+
    '<circle cx="'+Cx+'" cy="'+Cy+'" r="6" fill="#1b3657" stroke="var(--surface)" stroke-width="1.4"/>'+nodes.join("")+
    '<text x="155" y="294" text-anchor="middle" font-size="10" fill="currentColor" opacity=".75">'+escapeHTML(say("동일한 트리 · 최종 "+leaves+"개 말단","Same tree · "+leaves+" terminal nodes"))+'</text></svg>';
 };
 const col=(h,key,num,width)=>'<div class="story-star-meter"><div class="story-star-meter-top"><span>'+escapeHTML(h)+'</span><strong>'+f2(num)+'</strong></div><div class="story-star-meter-track"><div class="'+key+'" style="width:'+width.toFixed(2)+'%"></div></div></div>';
 return '<div class="story-star-comparison" data-star-comparison="'+n+'">'+
  '<div class="story-star-views"><div class="story-star-space story-star-space--euclid"><div class="story-star-space-head"><span class="story-star-model">EUCLIDEAN · K = 0</span><strong>'+say("유클리드 평면","Euclidean plane")+'</strong><small>'+say("원주 길이가 반지름에 비례","Circumference grows linearly")+'</small></div>'+geom(false)+'</div>'+
  '<div class="story-star-space story-star-space--hyper"><div class="story-star-space-head"><span class="story-star-model">HYPERBOLIC · K = −1</span><strong>'+say("하이퍼볼릭 공간 · 2D 투영","Hyperbolic space · 2D projection")+'</strong><small>'+say("원주 길이가 sinh(r)로 증가","Circumference grows as sinh(r)")+'</small></div>'+geom(true)+'</div></div>'+
  '<div class="story-star-evidence"><div class="story-star-evidence-heading"><span>'+say("같은 거리에서 실제로 확보되는 원주 길이","Intrinsic circumference at the same distance")+'</span><strong>'+f2(ratio)+'× '+say("더 큼","larger")+'</strong></div>'+
  '<div class="story-star-evidence-formula">r = '+f2(radius)+' · '+leaves+' '+say("말단 노드","leaves")+' · K = −1</div>'+
  col(say("Euclidean  2πr","Euclidean  2πr"),"is-euclid",flat,100/ratio)+
  col(say("Hyperbolic  2πsinh(r)","Hyperbolic  2πsinh(r)"),"is-hyper",hyper,100)+
  '<p class="story-star-spacing">'+say("말단 하나당 원주 공간 (이론적 균등 배치)", "Circumference available per leaf (ideal even spacing)")+'<strong>'+f2(euSpace)+' → '+f2(hypSpace)+' <span>('+f2(ratio)+'×)</span></strong></p>'+
  '</div><p class="story-star-caveat">'+say("2D 원판은 Poincaré식 설명용 투영입니다. 화면상의 점 간 픽셀 거리가 하이퍼볼릭 거리는 아닙니다. 실제 StAR는 Lorentz 모델에서 계산하며, 아래 3D 체험에서 직접 비교할 수 있습니다.","The disk is a Poincare-style teaching projection: pixel spacing is not hyperbolic distance. StAR computes in the Lorentz model; inspect the separate 3D explainer below.")+'</p></div>';
};
const render=(id,index,value)=>{
 const sceneIndex=Number(index), ko=language()==="ko", neutral=say("설명용 대화형 개념도 · 실제 추론 또는 새 측정이 아닙니다.","Explanatory interactive sketch, not live inference or a new measurement");
 if(id==="star"&&sceneIndex===0){
   const n=Math.max(1,Math.min(6,Number(value??4)));
   return panel(say("왜 하이퍼볼릭인가? · 두 공간 직접 비교","Why hyperbolic? Compare two geometries"),say("동일 계층 · 동일 반지름 · 서로 다른 원주 성장","Same tree · same radial distance · different circumference growth"),
    '<div class="story-star-control">'+range(1,6,n,1,say("트리 깊이","Tree depth"))+'<div class="story-demo-line"><output data-value>'+n+'</output><span>'+say("말단 노드","Leaf nodes")+': <strong data-count>'+2**n+'</strong></span></div></div>'+starComparison(n),
    say("원주 길이는 수학적으로 계산한 값입니다. 배치된 점들은 설명용이며 학습된 StAR 임베딩 또는 새로운 실험 결과가 아닙니다.","Circumference values are calculated from geometry; node positions are illustrative, not learned StAR embeddings or new experimental results."));
 }
 if(id==="gref-rag"&&sceneIndex===3){
   const budget=String(value??"1024"),values={"512":["+0.05025","0.05025"],"1024":["+0.03909","0.03909"],"2048":["+0.02847","0.02847"]},f=values[budget]??values["1024"];
   return panel(say("동일 컨텍스트 예산 비교","Same-budget comparison"),say("리뷰 이후 추가 실험 · 4개 QA 데이터셋","Post-review, four QA datasets"),
    '<div class="story-demo-grid">'+["512","1024","2048"].map(x=>b(x,x+" tokens",budget)).join("")+'</div>'+p("Macro ΔF1 vs KG2RAG",f[0]+" "+say("(절대 F1 차이, 실측)","(absolute F1 difference, measured)")),
    say("모든 예산에서 양의 차이. 서로 다른 실험 표의 숫자를 합성하지 않았습니다.","All three budgets show positive differences. Values are not combined across incompatible protocols."));
 }
 if(id==="mot"&&(sceneIndex===1||sceneIndex===2)){
   if(sceneIndex===1){const pos=String(value??"middle");let msg={early:say("하위 층 번역: 이후 층을 따라 변환 오차가 전파될 수 있습니다.","Early translation: shift can propagate through upper layers."),middle:say("중간 위치: 두 오차의 균형을 찾는 설계 문제입니다.","Middle placement: trade off both competing errors."),late:say("상위 층 번역: 교정할 수 있는 남은 층이 부족합니다.","Late translation: insufficient remaining layers to correct error.")}[pos]||"";
    return panel(say("번역 채널 위치 탐색","Translation-channel placement"),"Figure 3–7 · competing errors",
      '<div class="story-demo-grid">'+["early","middle","late"].map((v,i)=>b(v,[say("초기","Early"),say("중간","Middle"),say("후기","Late")][i],pos)).join("")+'</div>'+p(say("구조적 해석","Interpretation"),msg),neutral);}
   const k=Number(value??2);
   return panel(say("Token-level Top-K 라우팅","Token-level Top-K routing"),"Figure 8 · demonstration",
    '<div>'+range(1,3,k,1,"K · "+say("선택 전문가 수","selected translators"))+'<div class="story-demo-line"><output data-value>'+k+'</output><span>'+say("활성 전문가","Active translators")+'</span></div></div><div class="story-demo-grid">'+[1,2,3].map(i=>p("T"+i,i<=k?say("라우팅에 참여","Selected"):say("비활성","Not selected"))).join("")+'</div>',
    say("Top-K 선택은 토큰별로 달라지는 학습된 게이트입니다. 여기서는 이해를 위한 선택 수만 바꿉니다.","Actual gate weights are learned per token; this control only illustrates how many experts participate."));
 }
 if(id==="ram-gnn"&&sceneIndex===2){let v=String(value??"A"),cases={A:["Abilities","Knowledge"],B:["Activities","Context"],C:["Knowledge","Skills"]};return panel(say("직업 노드별 관계 주목도","Occupation-specific relation focus"),say("정량적 attention 실측 아님","Illustrative; not measured attention"),
   '<div class="story-demo-grid">'+["A","B","C"].map(z=>b(z,say("가상 노드 ","Toy occupation ")+z,v)).join("")+'</div>'+p(say("선택 노드의 주요 채널","Illustrative salient relations"),(cases[v]??cases.A).join(" + ")),
   say("실제 직업별 수치나 인과관계를 추정하지 않습니다. 노드별로 다르게 가중치를 둔다는 원리만 표현합니다.","No individual occupation scores or causal claims are inferred; only the node-specific weighting principle is depicted."));}
 if(((id==="mpr-citeg"&&sceneIndex===2)||(id==="scienceon-mpr-citeg"&&sceneIndex===1))){
   const v=String(value??"A");return panel(say("문장별 인용 근거 탐색","Inspect sentence-level citations"),"CiteG · source attribution demo",
   '<div class="story-demo-grid">'+b("A",say("답변 문장 A [1]","Answer sentence A [1]"),v)+b("B",say("답변 문장 B [2]","Answer sentence B [2]"),v)+'</div>'+
   p(say("선택된 원문 근거","Selected supporting source"),v==="A"?say("문서 1의 해당 문장과 연결됩니다. 예시이며 실제 문헌 인용이 아닙니다.","Linked to matching evidence in Source [1]. Demonstration, not an actual paper citation."):say("문서 2의 해당 문장과 연결됩니다. 예시이며 실제 문헌 인용이 아닙니다.","Linked to matching evidence in Source [2]. Demonstration, not an actual paper citation.")),neutral);
 }
 if(id==="steel-rag"&&(sceneIndex===0||sceneIndex===3)){
   const v=String(value??"2024");return panel(say("실제 프로젝트 변화 비교","Project implementation comparison"),"2023 PoC → 2024 enhancement",
   '<div class="story-demo-grid">'+b("2023",say("2023년 PoC","2023 PoC"),v)+b("2024",say("2024년 고도화","2024 upgrade"),v)+'</div>'+
   p(v==="2023"?"Streamlit / Chroma / ChatGPT":"Unstructured / Embeddings / Excel",
   v==="2023"?say("초기 문서 추출·검색·검토 흐름을 구축하고, 복잡한 표 구조를 인식하는 문제를 발견했습니다.","Initial review and retrieval flow, with table-structure handling identified as a bottleneck."):say("다국어·다중문서·문서 우선순위·강종 선택·Priority/Integrated Excel이 추가됐습니다.","Expanded to multilingual, multi-document priorities, steel-grade selection and two Excel formats.")),
   say("2023/2024 발표자료에 기록된 기능만 구분했습니다.","Only features documented in the two presentations are compared."));
 }
 if(id==="blue-carbon"&&(sceneIndex===1||sceneIndex===3)){const v=String(value??"before");return panel(say("변화탐지 화면 비교","Compare monitoring states"),"Streamlit / GEE · schematic",
    '<div class="story-demo-grid">'+b("before",say("이전 시점","Before"),v)+b("after",say("이후 시점","After"),v)+'</div>'+
    p(say("표시되는 정보","Reading the comparison"),v==="before"?say("기준 관측 시점의 식생지수 또는 양식장 분포를 확인합니다.","Inspect a baseline vegetation-index or aquaculture layer."):say("이후 관측 시점과 기준 영상을 비교해 변화 후보를 확인합니다.","Compare follow-up imagery and highlight candidate changes.")),
   say("위성 픽셀, 위치, 실제 수치값을 생성하지 않습니다.","No synthetic satellite pixels, real coordinates, or measurement values are generated."));
 }
 if(id==="alibaba-search"&&(sceneIndex===0||sceneIndex===1)){const v=String(value??"QC");return panel(say("다국어 상품검색 과업 구분","Compare e-commerce relevance tasks"),"QC / QI",
   '<div class="story-demo-grid">'+b("QC","QC",v)+b("QI","QI",v)+'</div>'+
   p(v==="QC"?say("Query–Category 관련성","Query–Category relevance"):say("Query–Item 관련성","Query–Item relevance"),v==="QC"?say("질의가 상품 카테고리와 관련되는지를 분류합니다. 언어·범주 표현 정규화가 중요합니다.","Classify query-category relevance with consistent language and taxonomy handling."):say("질의와 구체적인 상품의 관련성을 판단합니다. 상품명·상세 정보의 노이즈가 영향을 줍니다.","Determine query-item relevance; noisy titles and descriptions matter.")),neutral);
 }
 if(id==="bioai"&&(sceneIndex===0||sceneIndex===2)){
  if(sceneIndex===0){const v=String(value??"AB");return panel(say("분자쌍 입력 순서 바꾸기","Swap a molecular pair"),say("실제 사용한 swap augmentation을 설명","Explains the documented swap augmentation"),
  '<div class="story-demo-grid">'+b("AB","SMILES A → B",v)+b("BA","SMILES B → A",v)+'</div>'+
  p(say("학습 시 목표","Training intent"),say("입력 순서가 바뀌어도 동일한 혼합체 라벨을 설명할 수 있도록 분자쌍을 뒤집어 학습 데이터를 증강했습니다. 정확한 불변성이 수학적으로 보장됐다는 의미는 아닙니다.","Swap augmentation exposes the model to both molecule orders and encourages order-robust blend predictions; it does not mathematically guarantee invariance.")),neutral);}
  const v=String(value??"F1"),rows=v==="F1"?[["GCN","0.55",55],["GAT","0.77",77],["Fusion","0.92",92]]:[["GCN","0.46",46],["GAT","0.62",62],["Fusion","0.90",90]];
  return panel(say("실제 모델 비교 결과","Reported model comparison"),"Slides 11 and 13",
   '<div><div class="story-demo-grid">'+b("F1","F1",v)+b("Jaccard","Jaccard",v)+'</div>'+rows.map(r=>'<div style="margin-top:13px"><div class="story-demo-line"><strong>'+r[0]+'</strong><output>'+r[1]+'</output></div><div style="height:11px;background:var(--line);border-radius:6px;overflow:hidden"><div style="width:'+r[2]+'%;height:100%;background:var(--atlas);border-radius:6px"></div></div></div>').join("")+'</div>'+p(say("해석","How to read"),say("GCN→GAT 비교와 최종 fusion 결과는 발표자료의 서로 다른 개발 단계에서 얻은 값입니다.","GCN/GAT comparison and final fusion results were reported at distinct development stages.")),say("표시값은 슬라이드 11, 13의 발표 수치입니다.","Values transcribed from slides 11 and 13."));
 }
 return "";
};
function mount(root,index){
 const id=root.dataset.storyAtlas||"",shell=root.querySelector(".story-shell"),existing=shell?.querySelector(".story-demo");
 if(!shell)return;
 const key=id+":"+index;
 const value=root._demoValues?.[key];
 const html=render(id,index,value);
 if(!html){existing?.remove();return}
 if(!existing){const place=document.createElement("section");place.className="story-demo";place.setAttribute("aria-label",say("연구 인터랙션","Interactive research demonstration"));shell.querySelector(".story-metrics")?.before(place);}
 const section=shell.querySelector(".story-demo");if(section)section.innerHTML=html;
}
function player(root){
 const shell=root.querySelector(".story-shell"),tabs=[...root.querySelectorAll(".story-storyboard [data-scene]")];if(!shell||!tabs.length)return;
 if(shell.querySelector(".story-player"))return;
 const box=document.createElement("div");box.className="story-player";
 box.innerHTML='<button type="button" data-step="-1" aria-label="'+say("이전 Figure","Previous figure")+'">← '+say("이전","Prev")+'</button>'+
 '<button type="button" data-play="false" aria-label="'+say("그림 자동 탐색","Play figure tour")+'">▶ '+say("자동 탐색","Play tour")+'</button>'+
 '<button type="button" data-step="1" aria-label="'+say("다음 Figure","Next figure")+'">'+say("다음","Next")+' →</button>'+
 '<span class="story-step-count" aria-live="polite"></span>';
 shell.querySelector(".story-storyboard").before(box);
 const refresh=()=>{const current=Number(root.querySelector('[data-scene][aria-selected="true"]')?.dataset.scene||0);box.querySelector(".story-step-count").textContent=String(current+1).padStart(2,"0")+" / "+String(tabs.length).padStart(2,"0");mount(root,current)};
 const stop=()=>{if(root._tour){clearInterval(root._tour);root._tour=null}const t=box.querySelector("[data-play]");if(t){t.dataset.play="false";t.textContent="▶ "+say("자동 탐색","Play tour")}};
 box.addEventListener("click",e=>{
 const step=e.target.closest("[data-step]");if(step){stop();let n=Number(root.querySelector('[data-scene][aria-selected="true"]')?.dataset.scene||0);tabs[(n+Number(step.dataset.step)+tabs.length)%tabs.length].click();refresh();return}
 const btn=e.target.closest("[data-play]");if(btn){if(root._tour){stop();return}if(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches){btn.textContent=say("동작 축소 설정에서는 수동 조작","Use manual steps when reduced motion is set");return}
 btn.dataset.play="true";btn.textContent="Ⅱ "+say("정지","Pause");root._tour=setInterval(()=>{if(document.hidden){stop();return}let n=Number(root.querySelector('[data-scene][aria-selected="true"]')?.dataset.scene||0);tabs[(n+1)%tabs.length].click();refresh()},6000)}
 });
 root.addEventListener("click",e=>{
  const choice=e.target.closest("[data-choice]");if(choice&&root.contains(choice)){
   const i=Number(root.querySelector('[data-scene][aria-selected="true"]')?.dataset.scene||0);
   root._demoValues??={};root._demoValues[root.dataset.storyAtlas+":"+i]=choice.dataset.choice;
   mount(root,i);root.querySelector('.story-demo [data-choice="'+choice.dataset.choice+'"]')?.focus();return;
  }
  if(e.target.closest("[data-scene]")){stop();queueMicrotask(refresh)}
 });
 root.addEventListener("keydown",e=>{if(e.target.closest("[data-scene]"))queueMicrotask(refresh)});
 root.addEventListener("input",e=>{
 const slider=e.target.closest(".story-demo input[data-range]");if(!slider)return;
 const id=root.dataset.storyAtlas,i=Number(root.querySelector('[data-scene][aria-selected="true"]')?.dataset.scene||0),v=Number(slider.value);
 root._demoValues??={};root._demoValues[id+":"+i]=v;
 const out=root.querySelector(".story-demo [data-value]");if(out)out.textContent=String(v);
 if(id==="star"){const visual=root.querySelector(".story-demo [data-star-comparison]");if(visual)visual.outerHTML=starComparison(v);const count=root.querySelector("[data-count]");if(count)count.textContent=String(Math.pow(2,v))}
 if(id==="mot"){root.querySelectorAll(".story-demo .story-demo-panel").forEach((el,j)=>{el.querySelector("p").textContent=j<v?say("라우팅에 참여","Selected"):say("비활성","Not selected")})}
 });
 refresh();
 window.addEventListener("pagehide",stop,{once:true});
 document.addEventListener("visibilitychange",()=>{if(document.hidden)stop()});
}
function init(){document.querySelectorAll("[data-story-atlas]").forEach(root=>{if(!root._portfolioInteractionsBound){root._portfolioInteractionsBound=true;player(root)}})}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
document.addEventListener("portfolio-language-change",()=>queueMicrotask(init));
})();