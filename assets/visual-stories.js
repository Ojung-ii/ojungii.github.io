
(() => {
"use strict";
const $=(s,c=document)=>c.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const palettes={ink:"#193351",blue:"#3f7dba",mint:"#48a893",orange:"#d19a4b",purple:"#9875d3",pale:"#edf2f8"};
const S=(x,y,value,klass="svtext",anchor="start")=>'<text x="'+x+'" y="'+y+'" text-anchor="'+anchor+'" class="'+klass+'">'+esc(value)+'</text>';
const R=(x,y,w,h,label,kind="svcard",sub="")=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="17" class="'+kind+'"/>'+S(x+14,y+29,label,"svtext")+(sub?S(x+14,y+48,sub,"svsmall"):"");
const C=(x,y,r,label,fill=palettes.blue)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+fill+'" stroke="#fff" stroke-width="3"/>'+S(x,y+4,label,"svlight","middle");
const L=(x,y,x2,y2,dash=false)=>'<path d="M'+x+' '+y+' L'+x2+' '+y2+'" class="'+(dash?"svdash":"svline")+'"/>';
const P=(d,col=palettes.blue,w=3)=>'<path d="'+d+'" fill="none" stroke="'+col+'" stroke-width="'+w+'" stroke-linecap="round" stroke-linejoin="round"/>';
const wrap=(content)=>'<svg viewBox="0 0 720 380" role="img" aria-label="Interactive research figure reconstruction" xmlns="http://www.w3.org/2000/svg"><rect width="720" height="380" rx="18" fill="transparent"/>'+content+'</svg>';
const boxes=(items,sub=[])=>wrap(items.map((item,i)=>{let x=27+i*(666/items.length);let w=640/items.length-12;return R(x,125,w,94,item,i%2?"svgood":"svcard",sub[i]||"")+(i?L(x-18,170,x-2,170):"")}).join("")+S(38,75,"ARCHITECTURE · selected logical stages","svtitle"));
const bar=(names,values,scale=0)=>{const max=scale||Math.max(...values);return wrap(S(30,46,"Observed ablation F1 decreases (HotpotQA)","svtitle")+names.map((n,i)=>{let y=90+i*85,w=Math.round(values[i]/max*410);return S(30,y+12,n,"svtext")+'<rect x="220" y="'+(y-12)+'" width="420" height="28" rx="9" class="svmuted"/><rect x="220" y="'+(y-12)+'" width="'+w+'" height="28" rx="9" fill="'+palettes.blue+'"/>'+S(220+w+12,y+8,"−"+values[i].toFixed(2)+" F1","svsmall")}).join(""));
const SCENES = {
"star":{
 layout:"split",eyebrow:"FIGURE-BY-FIGURE · SIGIR 2026",headline:"의미가 비슷한 근거와 구조적으로 맞는 근거는 다릅니다",summary:"원문 Figure 1–2를 재해석하고, 실제 HotpotQA 소거 실험을 함께 읽습니다. 그림은 논문에서 설명하는 동작을 교육용으로 재구성한 것입니다.",
 source:"StAR · SIGIR 2026 camera-ready (Figures 1–2; Tables 1 and ablation)",
 url:"https://doi.org/10.1145/3805712.3809897",
 metrics:[["SIGIR 2026","Short paper · 1저자"],["Spearman ρ","Query-level alignment"],["Lorentz","Hyperbolic manifold"]],
 scenes:[
 {fig:"FIGURE 1",title:"왜 하이퍼볼릭 공간인가?",desc:"유클리드 공간의 의미적 근접성이 계층적 연관성을 보장하지 않습니다. 왼쪽은 의미적 유사도 중심 배치, 오른쪽은 계층을 표현하기 쉬운 하이퍼볼릭 디스크 직관입니다. 실제 논문의 구조 계산은 디스크가 아닌 Lorentz 모델에서 수행합니다.",points:["계층 깊이와 가지 분리를 함께 표현하는 음의 곡률","그림의 Poincaré disk는 직관용이며 논문 구현은 Lorentz 공간","질의–후보 구조가 잘 맞는지 다시 평가"],diagram:"star-geometry",variants:[["semantic","Semantic proximity"],["structure","Structural hierarchy"]]},
 {fig:"FIGURE 2",title:"Q-graph에서 구조적 점수까지",desc:"Retriever backbone이 제공하는 filtered triples와 node scores로 Q-graph 및 C-subgraphs를 만들고, 노드의 semantic embedding과 normalized depth·radial distance를 결합합니다. 단일 hyperbolic message-passing layer와 Fréchet mean으로 graph representation을 얻습니다.",points:["Semantic + depth + radial-distance features","Tangent-space mapping → Lorentz exp/log operations","Query–candidate hyperbolic geodesic distance"],diagram:"star-method",variants:[["graph","Structure construction"],["score","Scoring + gate"]]},
 {fig:"ABLATION",title:"무엇이 성능을 만들었는가?",desc:"HotpotQA F1 소거 실험에서 구조 특징 제거의 영향이 가장 컸습니다. 아래 막대는 실제 F1 하락폭이며 정확도 예측 시뮬레이션이 아닙니다.",points:["−StructFeats: −5.47 F1","−Gating: −3.26 F1","−HypMP: −2.53 F1"],diagram:"star-ablation"}
 ]},
"gref-rag":{
 layout:"cinema",eyebrow:"EVIDENCE STORY · EACL MANUSCRIPT",headline:"더 많이 찾는 것보다, 답에 필요한 연결을 남기는 것",summary:"실제 논문 Figure 1의 영화감독 출생년도 비교를 중심으로 출처–연결–정답 근거가 어떻게 정리되는지 보여줍니다.",
 source:"GRef-RAG EACL manuscript (Figures 1–3; Main Results)",url:"",
 metrics:[["2 phases","Global Seed → Local Refinement"],["67.8%","Fewer context tokens vs KG2RAG"],["+1.77 F1","Macro average vs KG2RAG"]],
 scenes:[
 {fig:"FIGURE 1",title:"두 영화의 감독 중 누가 먼저 태어났을까?",desc:"실제 논문의 동기 사례: Poola Rangadu 감독은 Adurthi Subba Rao(1912), Paganini Horror 감독은 Luigi Cozzi(1947)입니다. 넓은 문맥은 다른 영화·인물 정보까지 끌어오지만, 정제된 문맥은 비교에 필요한 문장만 남깁니다.",points:["Poola Rangadu → Adurthi Subba Rao → 1912","Paganini Horror → Luigi Cozzi → 1947","1912 < 1947: Poola Rangadu 쪽 감독이 먼저 출생"],diagram:"gref-case",variants:[["broad","Broad context"],["refined","Refined evidence"]]},
 {fig:"FIGURE 2",title:"두 단계의 검색과 정제",desc:"문서 anchor, chunk, sentence를 서로 다른 granularity로 인덱싱합니다. Global Seed Search에서 lexical/dense/anchor 점수를 융합하고, Local Refinement에서 mention-linked paths 또는 multi-anchor bundles의 marginal semantic coverage를 비교합니다.",points:["Heterogeneous candidate retrieval → fused seed ranking","Source sentence → mentioned document anchor → target evidence","Bundle coverage gain에 따라 선택·중복 제거·순서화"],diagram:"gref-pipeline",variants:[["seed","Global Seed Search"],["refine","Local Refinement"]]},
 {fig:"FIGURE 3",title:"Coverage와 답변 품질은 같은 축이 아닙니다",desc:"논문 Figure 3의 R@5–F1 및 context–F1 진단을 개념적으로 재배열했습니다. 차트의 임의 산점도를 생성하지 않고 원고에 명시된 macro F1 +1.77, 평균 context token −67.8%를 보여줍니다.",points:["Source-level retrieval coverage ≠ final answer accuracy","Same generator·prompt·answer normalization protocol","Compressed context와 quality 사이의 trade-off가 핵심"],diagram:"gref-result"}
 ]},
"mot":{
 layout:"columns",eyebrow:"SYSTEMS LAB · NEURIPS WORKSHOP MANUSCRIPT",headline:"한 에이전트가 읽은 문맥을 다른 모델이 다시 읽어야 할까요?",summary:"원문 Figure 1–6의 핵심 관계를 따라 multi-agent 캐시 공유, 두 종류의 오류, 토큰 단위 translator routing, correction loss를 탐색합니다.",
 source:"MoT manuscript (Main Figures 1–6)",url:"https://arxiv.org/abs/2607.28979",
 metrics:[["51.0%","7B→0.5B closed-set QA avg accuracy"],["0.43","7B→0.5B extractive F1"],["Token-level","Top-K translator gating"]],
 scenes:[
 {fig:"FIGURE 1",title:"에이전트 간 KV 메모리 재사용",desc:"Agent 1이 이미 prefill한 context와 dialogue history를 Agent 2가 다른 모델에서 재활용하도록 KV cache를 번역합니다. 복사가 아니라 모델 간 representation transfer입니다.",points:["Source model의 KV cache는 target LLM이 직접 이해할 수 없음","Cache-to-cache translation 후 target-side context replay","반복 prefill을 줄이는 multi-agent motivation"],diagram:"mot-agents"},
 {fig:"FIGURE 2",title:"10-agent: 품질과 GPU 메모리",desc:"원고의 10-agent 성능 경향을 질적으로 재구성했습니다. 원문에서 MoT는 다른 방법 대비 양질의 F1을 유지하며 peak GPU memory를 1 GiB 이상 줄였다고 보고합니다. 점 좌표는 논문의 원본 그래프를 복사하지 않았습니다.",points:["Lower GPU memory while retaining QA quality","MoT (Free / Retain) 두 방식 구분","숫자 축 값은 원문 Figure 2 참조"],diagram:"mot-landscape"},
 {fig:"FIGURES 3–4",title:"너무 일찍 번역해도, 너무 늦게 번역해도 문제",desc:"Early injection은 translation shift가 상층에 전파되고, late injection은 target model이 수정할 여유가 부족합니다. 원문은 translation channel 시작 위치에 따른 U-shape validation loss와 propagated last-state shift를 분석합니다.",points:["Early: propagated translation shift","Late: correction-deficit error","Middle-layer choice and explicit correction are complementary"],diagram:"mot-errors",variants:[["early","Early injection"],["late","Late injection"]]},
 {fig:"FIGURE 5",title:"MoT + Context Correction Loss 전체 구조",desc:"원문 Figure 5의 다섯 단계와 token-level Top-K translator mixture를 재구성했습니다. Context Correction Loss는 translated cache를 replay한 target trajectory를 native target trajectory에 맞춥니다.",points:["1 Context Prefill → 2 KV Translation → 3 Context Replay","4 Prompt Prefill → 5 Completion Output","Token-level gates + target-side correction loss"],diagram:"mot-framework",variants:[["mixture","Translator mixture"],["replay","Replay + correction"]]},
 {fig:"FIGURE 6",title:"Ablation과 multi-agent 분석",desc:"원문은 loss ablation, translator architecture ablation, multi-agent scaling을 나눠 평가합니다. 구체적인 ablation 막대값 없이 비교 구조만 표시해 수치를 만들어내지 않습니다.",points:["Loss ablation","MoT architecture ablation","Number-of-agent scaling"],diagram:"mot-analysis"}
 ]},
"ram-gnn":{
 layout:"split",eyebrow:"GRAPH LEARNING · OCCUPATIONAL AI RISK",headline:"개별 직업의 AI 노출만으로는 보이지 않는 위험",summary:"EPJ 제출 원고의 Figure 1–2를 중심으로 MONET의 다섯 관계와 node-level relation attention을 다시 그렸습니다.",
 source:"Beyond Direct AI Exposure (EPJ manuscript, Figures 1–2)",url:"",
 metrics:[["606","Occupational nodes"],["5 relations","Abilities·Activities·Context·Knowledge·Skills"],["≈52K","Undirected relation edges"]],
 scenes:[
 {fig:"FIGURE 1",title:"직접 노출이 낮아도 관계를 통해 위험할 수 있습니다",desc:"직업별 직접 AI 노출만 측정하면 주변의 고노출 직업군과 강하게 연결된 직업을 놓칩니다. 원문 Figure 1의 latent network-mediated risk 개념과 관계별 diffusion path를 재구성했습니다.",points:["Direct AI exposure vs relationally transmitted vulnerability","MONET captures multiple kinds of occupational dependence","Diffusion diagnostics inform policy screening; individual fate prediction이 아님"],diagram:"ram-risk"},
 {fig:"FIGURE 2A",title:"MONET: 다섯 관계 레이어",desc:"Abilities, Activities, Context, Knowledge, Skills의 다섯 관계는 서로 다른 직업 유사성을 나타냅니다. 레이어 버튼을 선택하면 강조되는 연결 채널이 바뀝니다.",points:["606 occupations","Five independently constructed relation graphs","Flattening layers can erase distinct relation signals"],diagram:"ram-layers",variants:[["Abilities","Abilities"],["Activities","Activities"],["Context","Context"],["Knowledge","Knowledge"],["Skills","Skills"]]},
 {fig:"FIGURE 2B–D",title:"관계별 GNN + 노드별 attention",desc:"각 relation layer의 별도 encoder가 message passing을 수행하고, relation-specific attention scorer가 각 occupation에 필요한 정보를 가중 결합합니다. 이를 high-risk occupation detection에 사용합니다.",points:["Per-relation graph encoder","Node-specific relation attention","Weighted integration → risk detection"],diagram:"ram-method"},
 {fig:"RESULTS",title:"모델링과 해석",desc:"원고는 단일 그래프 baseline에 비해 multilayer structure 유지의 중요성을 보여줍니다. 전체 relation attention에서는 Abilities와 Knowledge가 높은 비중을 갖지만, 다른 레이어가 불필요하다는 의미는 아닙니다.",points:["Macro F1 약 +3 points (원고 요약)","Abilities + Knowledge combined attention ≈94.8%","Attention은 인과적 위험 전파의 증거가 아닌 모델 해석 신호"],diagram:"ram-result"}
 ]},
"steel-rag":{
 layout:"columns",eyebrow:"INDUSTRIAL CASE STUDY · DOCUMENT RAG",headline:"1만 건 규격서를 사람이 검증할 수 있는 근거로",summary:"실제 담당 업무인 PDF·표 구조화, 임베딩 검색, 원문 연결, 검토서 산출을 기준으로 입력–검색–검증 경로를 재구성했습니다.",
 source:"Project portfolio / documented implementation notes",url:"",
 metrics:[["10K+","Specification documents"],["+20%","Retrieval performance"],["−90%","Review time"]],
 scenes:[
 {fig:"WORKFLOW",title:"PDF에서 검토서까지",desc:"도식은 세아베스틸 프로젝트의 공개 가능한 정보로 구성했습니다. 모델이 결과를 생성하는 순간보다, 검색한 내용이 어떤 원문과 연결되는지가 중요합니다.",points:["Parse paragraphs and tables from industrial PDFs","Store summary–original linkage for traceability","Search → compare requirements → human review / XLSX"],diagram:"steel-workflow",variants:[["input","Parsing"],["retrieval","Evidence retrieval"],["output","Review output"]]},
 {fig:"EVIDENCE",title:"산업 RAG의 핵심은 근거 확인",desc:"검토 담당자가 검색 결과에서 원본 문서와 대응 항목을 확인할 수 있도록 설계한 접근을 도식화했습니다. 도식의 문서 텍스트는 실제 고객 규격을 공개하지 않은 예시입니다.",points:["Original source remains inspectable","Domain terminology and table cells normalized","Human-in-the-loop verification"],diagram:"steel-evidence"}
 ]},
"scienceon-mpr-citeg":{
 layout:"cinema",eyebrow:"CIKM WORKSHOP · SCIENTIFIC RAG",headline:"검색 다양성과 문장 단위 citation을 분리해 설계",summary:"CIKM 워크숍 원고 Figure 1에 근거한 MPR + CiteG 두 모듈을 다시 구성했습니다.",
 source:"MPR-CiteG paper (Figure 1)",url:"https://arxiv.org/abs/2607.22706",
 metrics:[["2nd","ScienceON AI Challenge"],["Q·S·F·G","Four query portfolios"],["Citation","Sentence-level grounding"]],
 scenes:[
 {fig:"PAPER FIGURE 1 / RETRIEVER",title:"하나의 질문에서 Q·S·F·G 네 검색 포트폴리오로",desc:"Qwen2.5-14B-Instruct가 Primary Keywords(5개) 및 Expanded Keywords(3개)를 만들고, Boolean query portfolio Q·S·F·G로 문헌을 다양하게 찾은 뒤 재랭킹합니다.",points:["Q: expansion; S: synonym robustness","F: primary-key-focused; G: combined broad query","Merge → re-rank → top documents"],diagram:"scienceon-portfolios",variants:[["Q","Q"],["S","S"],["F","F"],["G","G"]]},
 {fig:"PAPER FIGURE 1 / GENERATOR",title:"답변 문장마다 어느 문서가 근거인지 연결",desc:"문서 조건부 생성으로 얻은 답변을 sentence-level citation grounding으로 검증합니다. 아래 문장과 source 번호는 작동 방식을 설명하는 예시입니다.",points:["Document-conditioned response generation","Match output sentence to one evidence source","Return answer with explicit citation references"],diagram:"scienceon-citations"}
 ]},
"alibaba-search":{
 layout:"columns",eyebrow:"MULTILINGUAL IR · COMPETITION",headline:"다국어 검색의 첫 관문은 데이터 품질",summary:"포트폴리오·공개 기술보고서에 확인되는 데이터 정제, 언어/과업 태깅, LoRA 기반 fine-tuning 흐름을 사례 연구 형식으로 다시 구성했습니다.",
 source:"Alibaba competition portfolio / technical report",url:"https://arxiv.org/abs/2510.18499",
 metrics:[["0.8819","Final competition score"],["4th","Competition rank"],["Special","Award"]],
 scenes:[
 {fig:"DATA PIPELINE",title:"언어가 다르면 relevance 신호도 달라집니다",desc:"원문 질의–상품명–카테고리 입력을 정제하고, 언어 및 QC/QI 유형 정보를 함께 구성해 모델이 비교 조건을 학습할 수 있도록 합니다. 실제 데이터가 아닌 구조적 예시입니다.",points:["Quality refinement / noisy label handling","Language + task tagging","Task-specific multilingual relevance training"],diagram:"alibaba-data",variants:[["noisy","Raw inputs"],["clean","Refined inputs"]]},
 {fig:"MODEL",title:"공통 백본과 태스크 지향 fine-tuning",desc:"eCeLLM 계열 모델 및 LoRA를 사용한 프로젝트 구조를 개념도로 재구성했습니다. 확인되지 않은 내부 하이퍼파라미터·실험 곡선은 표시하지 않습니다.",points:["Multilingual query–product matching","LoRA adaptation","QC/QI relevance outputs"],diagram:"alibaba-model"}
 ]},
"blue-carbon":{
 layout:"split",eyebrow:"GEO AI · PUBLIC SERVICE",headline:"위성영상의 변화를 현장 관리 의사결정으로",summary:"SAR·광학영상과 Google Earth Engine 기반 분석을 실제 관리 프로세스에 맞춰 재구성했습니다. 지도는 실제 관측 위치가 아닌 개념도입니다.",
 source:"Project portfolio / public service description",url:"",
 metrics:[["5×","Expanded analysis area"],["−12h/yr","Saved recurring work"],["SAR + Optical","Sentinel-1 / Sentinel-2"]],
 scenes:[
 {fig:"REMOTE SENSING",title:"레이더와 광학 관측의 보완 관계",desc:"레이더(SAR)는 구름 영향에 상대적으로 강하고, 광학영상은 가시적 표면 특징을 제공합니다. 서로 다른 관측을 분석 도구와 현장 판단에 연결합니다.",points:["Satellite acquisition & time-series preprocessing","Change cues across multiple modalities","Visual review by field manager"],diagram:"blue-sensors",variants:[["sar","Sentinel-1 · SAR"],["optical","Sentinel-2 · optical"]]},
 {fig:"DECISION VIEW",title:"탐지한 변화가 곧 관리 대상은 아닙니다",desc:"공단 관리 구역 내 자연물과 별도로 김 양식장 같은 관리 외 활동을 구분해야 했습니다. 시각화된 구역은 실제 지도가 아닌 운영 판단 흐름의 개념도입니다.",points:["Differentiate conservation targets from external threats","Present management region and threat layer separately","Support verification, not autonomous enforcement"],diagram:"blue-decisions"}
 ]},
"bioai":{
 layout:"stack",eyebrow:"BIO-AI · EVIDENCE-ONLY PAGE",headline:"대회 수상 사실과 확인되지 않은 세부 방법을 분리",summary:"현재 확보한 자료에는 제3위 수상과 참여 맥락만 확인됩니다. 모델 아키텍처를 임의로 만들어 넣지 않고, 자료가 보강되기 전까지 결과 중심으로 표시합니다.",
 source:"Public portfolio: 2025 Bio-AI Convergence Competition",url:"",
 metrics:[["2025","Competition year"],["3rd","Verified placement"],["Pending","Methodology materials"]],
 scenes:[
 {fig:"PROJECT FACTS",title:"확인된 연구·프로젝트 사실",desc:"바이오·AI 융합 문제를 다루는 경진대회에서 3위를 기록했습니다. 실험데이터, 모델 구조, 원본 포스터를 확보하면 이 영역을 기술적인 case study로 확장할 수 있습니다.",points:["Verified: 3rd place","Not verified: dataset, preprocessing, model, evaluation protocol","No fabricated framework figures"],diagram:"bioai-facts"}
 ]}
};
function diagram(name,variant){
 switch(name){
 case "star-geometry": return wrap(
 S(34,30,"EUCLIDEAN · semantic nearest","svtitle")+S(396,30,"HYPERBOLIC · hierarchy intuition","svtitle")
 +'<rect x="20" y="52" width="330" height="300" rx="22" class="svcard"/><circle cx="546" cy="202" r="146" fill="none" stroke="#8eabc7" stroke-width="2"/><circle cx="546" cy="202" r="100" fill="none" stroke="#cedde9" stroke-dasharray="5 6"/>'
 +L(185,105,95,198)+L(185,105,257,190)+L(95,198,160,283)+L(257,190,277,275)
 +L(546,193,473,140)+L(546,193,622,140)+L(473,140,424,94)+L(473,140,460,91)+L(622,140,615,91)+L(622,140,670,95)
 +C(185,105,23,"Q")+C(95,198,22,"A")+C(257,190,22,"B")+C(160,283,20,"C",palettes.orange)+C(277,275,20,"D",palettes.mint)
 +C(546,193,19,"Q")+C(473,140,15,"A",palettes.mint)+C(622,140,15,"B",palettes.mint)+C(424,94,12,"C",palettes.orange)+C(460,91,12,"D",palettes.purple)+C(615,91,12,"E",palettes.blue)+C(670,95,12,"F",palettes.blue)
 +P(variant==="semantic"?"M140 280 Q194 247 248 205":"M546 193 Q492 113 424 94",palettes.orange,4)
 +S(45,338,variant==="semantic"?"blue = embedding proximity; orange = wrong hop":"same meaning ≠ same structural role","svsmall")
 );
 case "star-method":return variant==="score"?boxes(["Semantic Ssem","Structure Sstruct","Spearman ρ","Gate g(ρ)","Final score"],["Retriever rank","Lorentz distance","Rank agreement","Query-level","α Ssem + (1−α)g Sstruct"]):boxes(["Filtered triples","Q-graph / C-subgraphs","Features + tangent","Lorentz HypMP","Fréchet mean"],["Question triples","Rooted graph sets","Semantics + depth/radial","Single layer","Hyperbolic centroid"]);
 case "star-ablation":return bar(["−StructFeats","−Gating","−HypMP"],[5.47,3.26,2.53],6);
 case "gref-case":return wrap(
 S(28,29,"Which film's director was born first?","svtitle")
 +R(30,60,310,81,"Poola Rangadu","svcard","Directed by Adurthi Subba Rao")
 +R(380,60,310,81,"Paganini Horror","svcard","Directed by Luigi Cozzi")
 +L(175,141,175,177)+L(535,141,535,177)
 +R(54,177,266,74,"Adurthi Subba Rao · 1912","svgood","16 Dec 1912")
 +R(405,177,266,74,"Luigi Cozzi · 1947","svgood","7 Sep 1947")
 +P("M320 220 L403 220",palettes.mint,3)+S(360,211,"<", "svtitle","middle")
 +(variant==="broad"?R(140,283,441,53,"Also retrieved: unrelated film/person facts","svnoise","Other directors, remakes, genre descriptions"):R(184,284,363,53,"1912 < 1947 → Poola Rangadu","svgood","Minimal answer-bearing comparison"))
 );
 case "gref-pipeline":return variant==="seed"?boxes(["Document anchor","Chunk","Sentence","Lex·dense·anchor","Top-K seeds"],["Document view","Chunk view","Sentence view","Fusion scores","Kₛ = 4"]):boxes(["Seed anchor","Source sentence","Mentioned anchor","Target sentence","Bundle"],["Document root","Within document","Cross-document link","Answer candidate","Marginal coverage"]);
 case "gref-result":return wrap(S(30,49,"Controlled common-prompt evaluation · paper reported values","svtitle")
 +R(35,95,295,195,"KG2RAG · reference","svcard","Context tokens: reference = 100%")
 +R(389,95,295,195,"GRef-RAG · refined","svgood","Average context: 32.2% of reference")
 +'<rect x="62" y="185" width="220" height="22" rx="11" fill="#b4c5d7"/><rect x="418" y="185" width="71" height="22" rx="11" fill="#48a893"/>'
 +S(66,256,"relative token footprint", "svsmall")+S(418,256,"−67.8% tokens", "svtitle")
 +S(418,323,"Macro F1 +1.77 points", "svtitle"));
 case "mot-agents":return boxes(["Shared context","Agent 1 · source","KV translation","Agent 2 · target"],["Documents + dialogue","Prefill source KV","Model-specific mapping","Replayed continuation"]);
 case "mot-landscape":return wrap(S(35,46,"F1 vs peak GPU memory · qualitative landscape (not data coordinates)","svtitle")
 +P("M74 80 L74 317 L666 317",palettes.ink,3)+S(32,94,"F1 ↑","svsmall")+S(458,346,"Peak memory →","svsmall")
 +'<rect x="130" y="91" width="210" height="125" rx="24" fill="#e4f5ed" opacity=".95"/><rect x="425" y="187" width="199" height="112" rx="24" fill="#fbeedb"/>'
 +C(217,145,22,"MoT",palettes.mint)+C(526,253,21,"Ref",palettes.orange)
 +S(124,238,"Maintained QA quality","svtext")+S(438,174,"Larger memory","svtext")
 +S(125,277,"10-agent setting · qualitative reading","svsmall"));
 case "mot-errors":return wrap(S(28,43,"Translation channel position","svtitle")
 +P("M72 80 L72 305 L661 305",palettes.ink,2)
 +P("M96 128 Q220 289 351 288 Q484 291 635 124",palettes.purple,5)
 +C(127,168,12,"",palettes.orange)+C(612,158,12,"",palettes.orange)
 +S(107,89,variant==="early"?"EARLY: propagation shift":"EARLY: propagation shift","svtext")
 +S(473,85,variant==="late"?"LATE: correction deficit":"LATE: correction deficit","svtext")
 +S(268,275,"lower-loss region","svsmall")
 +S(214,342,"Schematic U-shape · no experimental point estimates","svsmall")
 );
 case "mot-framework":return variant==="replay"?
 boxes(["Translated KV","Context replay","Correction loss","Prompt prefill","Completion"],["Target space","Restore trajectory","Align with native","Target prompt","Generated response"])
 :boxes(["Source KV","Token-level gate","Top-K translators","Mixed KV","Target replay"],["Context prefill","Per-token scores","Weighted experts","Target cache","Correction Loss"]);
 case "mot-analysis":return boxes(["Loss ablation","Expert mixture","Agent scaling"],["Context correction","Translator architecture","Working-set behavior"]);
 case "ram-risk":return wrap(S(28,43,"Direct exposure can miss network-mediated risk","svtitle")
 +C(153,115,30,"High",palettes.orange)+C(306,124,30,"High",palettes.orange)+C(246,252,32,"Low",palettes.blue)
 +L(175,136,224,230)+L(285,151,263,226)+L(178,118,277,120)
 +R(402,98,267,89,"Direct exposure only","svcard","Low node looks safe")
 +R(402,213,267,87,"Relation-aware view","svgood","Low node connected to high cluster")
 +S(38,343,"Schematic occupations / no individually attributed risk","svsmall"));
 case "ram-layers":{let layers=["Abilities","Activities","Context","Knowledge","Skills"];return wrap(S(29,39,"MONET · layer selection: "+variant,"svtitle")
 +layers.map((n,i)=>{let y=62+i*55;return '<rect x="32" y="'+y+'" width="184" height="43" rx="12" class="'+(n===variant?"svgood":"svmuted")+'"/>'+S(50,y+26,n,"svtext")+L(270,y+22,355,y+22,n!==variant)+L(355,y+22,440,y+22,n!==variant)+C(270,y+22,11,"",n===variant?palettes.mint:palettes.blue)+C(440,y+22,11,"",n===variant?palettes.mint:palettes.blue)}).join("")
 +R(475,109,202,136,"606 occupations","svcard","≈52K undirected edges")
 +S(483,272,"Layer-specific graph signals","svsmall")); }
 case "ram-method":return boxes(["MONET layers","Relation GNNs","Node-level attention","Weighted fusion","Risk detection"],["A/A/C/K/S","Separate encoders","Relation-wise scoring","Node embedding","High-risk screening"]);
 case "ram-result":return wrap(S(35,49,"Relation attention reported in manuscript","svtitle")
 +'<rect x="53" y="112" width="580" height="42" rx="13" fill="#d6e4f1"/><rect x="53" y="112" width="550" height="42" rx="13" fill="#48a893"/>'
 +S(63,140,"Abilities + Knowledge · ≈94.8% combined","svtext")
 +R(51,202,281,90,"Macro F1","svcard","≈ +3 points reported in abstract")
 +R(365,202,297,90,"Interpretation","svgood","Attention ≠ causal effect")
 +S(63,331,"Remaining relation layers still contribute independent encodings","svsmall"));
 case "steel-workflow":{let d=variant==="input"?["PDF / tables","Text extraction","Structured fields","Terminology map"]:variant==="retrieval"?["Summary index","Embeddings","Evidence match","Original page"]:["Requirement","LLM comparison","XLSX draft","Human review"];return boxes(d,["01 / Source","02 / Transform","03 / Verify","04 / Deliver"]);}
 case "steel-evidence":return wrap(S(32,42,"Document-linked evidence · illustrative data, not a client record","svtitle")
 +R(30,85,300,207,"Source specification","svcard","Page / table / cell trace")
 +R(380,85,310,207,"Review item","svgood","Claim + citation + decision")
 +S(55,174,"[Material] Grade requirement", "svtext")+S(55,202,"[Tolerance] Source table", "svtext")
 +P("M331 187 L378 187",palettes.blue,4)
 +S(405,175,"Matched clause → source", "svtext")+S(405,209,"Reviewer validates", "svtext"));
 case "scienceon-portfolios":return wrap(S(28,43,"Multi-Portfolio Retrieval (paper Fig. 1)","svtitle")
 +R(20,97,185,85,"LLM keywords","svcard","Primary 5 / Expanded 3")
 +["Q","S","F","G"].map((n,i)=>{let y=52+i*70;return '<rect x="274" y="'+y+'" width="155" height="53" rx="13" class="'+(variant===n?"svgood":"svmuted")+'"/>'+S(293,y+32,n+" portfolio","svtext")+L(205,143,274,y+26,true)+L(429,y+26,513,183,true)}).join("")
 +R(515,146,175,90,"Merge + rerank","svgood","Top docs")
 );
 case "scienceon-citations":return wrap(S(28,44,"CiteG · source-grounded answer reconstruction","svtitle")
 +R(24,82,276,203,"Retrieved documents","svcard","Source [1] · Source [2]")
 +R(362,82,331,203,"Answer sentences","svgood","Sentence A [1] · Sentence B [2]")
 +L(307,184,356,184)
 +S(44,178,"Doc 1: method / outcome","svtext")+S(44,209,"Doc 2: comparison","svtext")
 +S(379,178,"A sentence → [1]","svtext")+S(379,209,"B sentence → [2]","svtext")
 +S(37,325,"Demonstration sentences; source attribution is verified per sentence","svsmall"));
 case "alibaba-data":return wrap(S(28,42,"Multilingual relevance data · input example only","svtitle")
 +R(27,92,309,191,variant==="noisy"?"Raw / inconsistent":"Normalized records","svcard",variant==="noisy"?"Language ambiguity / noisy labels":"Language and QC–QI tags")
 +R(389,92,297,191,"Training pair","svgood","Query + product + task")
 +S(53,184,variant==="noisy"?"Mixed-language string":"Language: tagged", "svtext")
 +S(53,216,variant==="noisy"?"Missing category":"Task: QC or QI","svtext")
 +L(337,183,386,183)
 +S(409,180,"eCeLLM + LoRA","svtext")+S(409,214,"Relevance prediction","svtext"));
 case "alibaba-model":return boxes(["Language tagging","Quality refinement","LoRA fine-tuning","QC / QI scores"],["Input context","Cleaned labels","Multilingual model","Relevance output"]);
 case "blue-sensors":return wrap(S(25,39,variant==="sar"?"Sentinel-1 / SAR: cloud-resistant sensing":"Sentinel-2 / optical: surface appearance","svtitle")
 +'<rect x="45" y="82" width="280" height="220" rx="20" fill="#b6e6ee"/>'+
 Array.from({length:20},(_,i)=>{let x=55+(i%5)*52,y=92+Math.floor(i/5)*50;let op=variant==="sar"?0.13+(i%4)*.13:0.2+(i%3)*.18;return '<rect x="'+x+'" y="'+y+'" width="43" height="42" rx="6" fill="'+(variant==="sar"?"#1c7185":"#40896b")+'" opacity="'+op+'"/>'}).join("")
 +R(379,108,291,81,"GEE processing","svcard","Time-series preprocessing")
 +R(379,216,291,82,"Reviewable change layers","svgood","Field verification")
 +P("M325 191 L376 191",palettes.blue,4)
 +S(53,334,"Conceptual raster only — not actual geolocated observations","svsmall"));
 case "blue-decisions":return boxes(["Satellite change","Conservation target","External activity","Management view"],["Observed signal","Natural habitat","e.g. seaweed farm","Separate action layers"]);
 case "bioai-facts":return wrap(S(32,49,"Evidence status · Bio-AI Convergence Competition","svtitle")
 +R(44,105,279,176,"Verified","svgood","2025 · Third place")
 +R(382,105,289,176,"Not yet documented","svnoise","Dataset / model / results")
 +S(66,237,"Award + participation","svtext")
 +S(407,237,"Need original slides","svtext")
 +S(50,329,"The site does not present invented experimental methodology","svsmall"));
 default:return boxes(["Problem","Method","Outcome"]);
 }
}
function makePage(id,c){
 let selected=0,variant=c.scenes[0].variants?.[0]?.[0]||"";
 const root=document.querySelector('[data-story-atlas="'+id+'"]');
 if(!root)return;
 const tabs=c.scenes.map((s,i)=>'<button type="button" role="tab" id="story-tab-'+id+'-'+i+'" aria-controls="story-panel-'+id+'" aria-selected="'+(i===0)+'" data-scene="'+i+'" tabindex="'+(i===0?0:-1)+'"><span class="story-num">'+s.fig+'</span>'+esc(s.title)+'</button>').join("");
 const metrics=c.metrics.map(m=>'<div class="story-metric"><strong>'+esc(m[0])+'</strong><span>'+esc(m[1])+'</span></div>').join("");
 root.innerHTML='<div class="story-shell story-shell--'+c.layout+'"><div class="story-storyboard" role="tablist" aria-label="Figure navigation">'+tabs+'</div><div class="story-progress"><span></span></div><div class="story-content" role="tabpanel" id="story-panel-'+id+'" aria-labelledby="story-tab-'+id+'-0"><div class="story-art"><div class="story-secondary"></div><div class="story-svg-frame"><div class="story-drawing"></div><span class="story-watermark">REDRAWN · NOT TO SCALE</span></div></div><div class="story-text" aria-live="polite"></div></div><div class="story-metrics">'+metrics+'</div><div class="story-source">'+esc(c.source)+(c.url?' · <a target="_blank" rel="noopener noreferrer" href="'+esc(c.url)+'">Original publication ↗</a>':"")+'</div></div>';
 const show=(i,v)=>{
 selected=i;
 const scene=c.scenes[i];variant=v??scene.variants?.[0]?.[0]??"";
 [...root.querySelectorAll('[data-scene]')].forEach((b,j)=>{b.setAttribute("aria-selected",j===i?"true":"false");b.tabIndex=j===i?0:-1;});
 root.querySelector(".story-progress span").style.width=((i+1)/c.scenes.length*100)+"%";
 root.querySelector(".story-secondary").innerHTML=scene.variants?scene.variants.map(([key,label])=>'<button type="button" data-variant="'+esc(key)+'" aria-pressed="'+(variant===key)+'">'+esc(label)+'</button>').join(""):"";
 root.querySelector(".story-drawing").innerHTML=diagram(scene.diagram,variant);
 root.querySelector(".story-text").innerHTML='<div class="story-figure-label">'+esc(scene.fig)+' · RECONSTRUCTED</div><p class="story-kicker">'+esc(c.eyebrow)+'</p><h3>'+esc(scene.title)+'</h3><p>'+esc(scene.desc)+'</p><div class="story-points">'+scene.points.map(p=>'<div class="story-point">'+esc(p)+'</div>').join("")+'</div><p class="story-footnote">This is a site-native explanatory reconstruction, not a reproduction of original plotted coordinates or experimental traces.</p>';
 root.querySelector('#story-panel-'+id).setAttribute('aria-labelledby','story-tab-'+id+'-'+i);
 };
 root.addEventListener("click",e=>{const t=e.target.closest('[data-scene]');if(t&&root.contains(t))show(Number(t.dataset.scene));const v=e.target.closest('[data-variant]');if(v&&root.contains(v))show(selected,v.dataset.variant)});
 root.addEventListener("keydown",e=>{const t=e.target.closest('[data-scene]');if(!t)return;let i=Number(t.dataset.scene);if(e.key==="ArrowRight")i=(i+1)%c.scenes.length;else if(e.key==="ArrowLeft")i=(i-1+c.scenes.length)%c.scenes.length;else if(e.key==="Home")i=0;else if(e.key==="End")i=c.scenes.length-1;else return;e.preventDefault();show(i);root.querySelector('[data-scene="'+i+'"]').focus()});
 show(0);
}
function initialize(){document.querySelectorAll("[data-story-atlas]").forEach(el=>{let c=SCENES[el.dataset.storyAtlas];if(c)makePage(el.dataset.storyAtlas,c)})}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initialize);else initialize();
})();
