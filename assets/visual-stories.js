
(() => {
"use strict";
const $=(s,c=document)=>c.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const palettes={ink:"#193351",blue:"#3f7dba",mint:"#48a893",orange:"#d19a4b",purple:"#9875d3",pale:"#edf2f8"};
const S=(x,y,value,klass="svtext",anchor="start")=>'<text x="'+x+'" y="'+y+'" text-anchor="'+anchor+'" class="'+klass+'">'+esc(value)+'</text>';
const splitSVGText=(value,capacity)=>{const words=String(value).split(/\s+/);let line="",rows=[];for(const word of words){if(line&&line.length+word.length+1>capacity){rows.push(line);line=word}else line+=(line?" ":"")+word}if(line)rows.push(line);return rows.flatMap(row=>row.length>capacity?[row.slice(0,Math.max(4,capacity-1))+"…"]: [row]);};
const R=(x,y,w,h,label,kind="svcard",sub="")=>{
 const titleLines=splitSVGText(label,Math.max(10,Math.floor((w-26)/7.5))).slice(0,2);
 const subLines=sub?splitSVGText(sub,Math.max(10,Math.floor((w-26)/6))).slice(0,1):[];
 const title=titleLines.map((part,i)=>S(x+13,y+23+i*17,part,"svtext")).join("");
 const detail=subLines.map(part=>S(x+13,y+h-15,part,"svsmall")).join("");
 return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="17" class="'+kind+'"/>'+title+detail;
};
const C=(x,y,r,label,fill=palettes.blue)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+fill+'" stroke="#fff" stroke-width="3"/>'+S(x,y+4,label,"svlight","middle");
const L=(x,y,x2,y2,dash=false)=>'<path d="M'+x+' '+y+' L'+x2+' '+y2+'" class="'+(dash?"svdash":"svline")+'"/>';
const P=(d,col=palettes.blue,w=3)=>'<path d="'+d+'" fill="none" stroke="'+col+'" stroke-width="'+w+'" stroke-linecap="round" stroke-linejoin="round"/>';
const wrap=(content)=>'<svg viewBox="0 0 720 380" role="img" aria-label="Interactive research figure reconstruction" xmlns="http://www.w3.org/2000/svg"><rect width="720" height="380" rx="18" fill="transparent"/>'+content+'</svg>';
const boxes=(items,sub=[])=>wrap(items.map((item,i)=>{let x=27+i*(666/items.length);let w=640/items.length-12;return R(x,125,w,94,item,i%2?"svgood":"svcard",sub[i]||"")+(i?L(x-18,170,x-2,170):"")}).join("")+S(38,75,"ARCHITECTURE · selected logical stages","svtitle"));
const bar=(names,values,scale=0)=>{const max=scale||Math.max(...values);return wrap(S(30,46,"Observed ablation F1 decreases (HotpotQA)","svtitle")+names.map((n,i)=>{let y=90+i*85,w=Math.round(values[i]/max*410);return S(30,y+12,n,"svtext")+'<rect x="220" y="'+(y-12)+'" width="420" height="28" rx="9" class="svmuted"/><rect x="220" y="'+(y-12)+'" width="'+w+'" height="28" rx="9" fill="'+palettes.blue+'"/>'+S(220+w+12,y+8,"−"+values[i].toFixed(2)+" F1","svsmall")}).join(""));}
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
Object.assign(SCENES, {"steel-rag":{"layout":"columns","eyebrow":"INDUSTRIAL CASE STUDY · 2023 → 2024","headline":"PoC에서 다국어·다중문서 업무 자동화로","summary":"2023년 10월 중간발표와 2024년 5월 고도화 미팅 자료를 구분해, 기술 선택부터 업무 기능 확장까지의 실제 진행 과정을 재구성했습니다.","source":"SeAH Besteel internal midterm slides (2023-10-11) + enhancement meeting slides (2024-05-10)","url":"","metrics":[["2023→2024","PoC → expanded document workflow"],["3 languages","English · Korean · Japanese"],["2 Excel views","Priority / Integrated"]],"scenes":[{"fig":"2023 · PROBLEM","title":"처음 문제는 수주규격서의 다양성이었습니다","desc":"2023년 발표는 100종 이상의 검사 항목, 다양한 언어와 용어, 고객별 서식 및 강종의 복잡성 때문에 사람이 수주규격서를 검토하는 과정에서 휴먼 에러가 발생할 수 있음을 강조했습니다. 이에 입력–LLM–결과 초안으로 이어지는 2단계 업무 자동화를 목표로 삼았습니다.","points":["검토 항목·강종·동의어·표 서식의 다양성","수작업 확인·참조·양식 작성의 반복","초기 PoC의 목적: 원문에서 규격 항목을 추출해 검토용 초안 제공"],"diagram":"steel-early-source"},{"fig":"2023 · POC","title":"Streamlit–Chroma–LLM 기반 초기 PoC","desc":"중간발표의 프로세스 맵은 Streamlit 웹 UI와 Chroma 벡터 DB, ChatGPT 기반 질의를 보여줍니다. 테이블 구조 보존이 어렵다는 문제를 발견해 표 탐지·구조 인식·HTML 변환을 별도 개선 과제로 다뤘으며, 검토 항목과 프롬프트를 수정할 수 있도록 했습니다.","points":["Streamlit UI → document embedding / Chroma → retrieval + ChatGPT","Table detection / recognition and structured representation","검토 항목·동의어·질문지 편집 가능; 초기 계획과 구현 기능은 구분"],"diagram":"steel-early"},{"fig":"2024 · PIPELINE","title":"추가 고도화: 텍스트·표·OCR에서 출처 연결까지","desc":"2024년 자료의 전체 프로세스는 Unstructured.io로 텍스트/표/OCR을 분리하고, GPT-3.5 Turbo로 text/table summary를 생성한 다음 요약과 원문을 각각 벡터 저장소와 연결하는 구조입니다. 검색 단계는 요구 항목을 문서 근거와 연결하며 Excel로 산출합니다.","points":["Unstructured.io → Text / Table / OCR","GPT-3.5 Turbo → Text Summary / Table Summary","Vector Embedding / Store → Context Learning (RAG) → Excel Export"],"diagram":"steel-upgrade-pipeline"},{"fig":"2024 · WORKFLOW","title":"고도화의 핵심: 문서 우선순위·강종·출력 방식","desc":"실제 사용자 흐름은 documents 폴더에 파일 넣기 → main.py 실행 → Parsing 선택 → 문서별 우선순위 지정 → 강종 선택(옵션) → 출력 버전 선택 → 검색 및 Excel 생성입니다. Priority 버전은 우선순위 문서를 우선 반영하고 Integrated 버전은 문서 근거를 통합합니다.","points":["영어·한국어·일본어 인식 테스트 완료","다중 문서 우선순위 및 강종 선택 기능 구현","Priority version / Integrated version Excel 생성"],"diagram":"steel-two-outputs","variants":[["priority","Priority Excel"],["integrated","Integrated Excel"]]},{"fig":"2024 · LIMITS","title":"구현 완료와 남은 검증을 구분","desc":"2024년 미팅 자료는 다국어·다중 문서·강종 선택·Excel 기능을 구현 완료로 기재했습니다. 반면 수기·저화질 문서의 OCR에는 한계가 있었으며, 세아 연구원의 정성적 평가와 성능·비용 개선 검토는 후속 과제로 명시됐습니다. 최신의 최종 성능 수치는 별도 포트폴리오 보고값으로 구분합니다.","points":["구현 완료: 다국어, 다중 문서, 강종 필터, Excel 두 버전","명시적 한계: 수기 및 저해상도 스캔","미팅 당시 남은 과제: 정성 평가 및 비용/정확도 고도화"],"diagram":"steel-maturity"}]},"blue-carbon":{"layout":"split","eyebrow":"GEO AI · SARI-BASED COASTAL SURVEILLANCE","headline":"태안해안국립공원의 변화탐지를 관리 화면으로","summary":"2023년 SBS 발표자료의 실제 Streamlit·Google Earth Engine·geemap 구조와 Sentinel 기반 변화탐지, 조류 양식장/식생 사례를 반영했습니다.","source":"2023-11-29 SBS (SAR Blue-carbon Surveillance Service) presentation, slides 12–26","url":"","metrics":[["Sentinel-1","SAR observation"],["Streamlit + GEE","Interactive analysis"],["Taen","National park case study"]],"scenes":[{"fig":"SLIDES 12–17","title":"관리해야 할 공간이 넓고, 감시 인력은 제한적","desc":"발표자료는 태안해안국립공원(약 388㎢)과 한정된 현장 조사 인력이라는 조건을 문제로 정의합니다. 이를 보완하기 위해 Streamlit 웹 UI, geemap 지도, Google Earth Engine, 원격탐사 분석 모델을 연결해 접근성이 높은 감시 도구를 설계했습니다.","points":["태안해안국립공원 약 388㎢(발표자료 기준)","Web(UI) ↔ GEE / geemap ↔ analysis model","현장 직원이 타임랩스·변화탐지를 단계적으로 선택"],"diagram":"blue-architecture"},{"fig":"SLIDES 18–21","title":"시간별 변화를 확인한 뒤 변화 위치를 표시","desc":"타임랩스는 위성, 관측 기간, 주기를 고르는 방식입니다. 발표에는 Sentinel-1 후방산란 기반 시계열 분포와 Percentile Point Function을 활용한 변화탐지, 2022년 6월 22일과 7월 4일의 시계열 변화 위치 사례가 포함됩니다.","points":["Select region / sensor / dates","Backscatter distribution → percentile-based change signal","Detection points require visual and field verification"],"diagram":"blue-timeline","variants":[["time","Time-lapse"],["change","Change locations"]]},{"fig":"SLIDES 22–23","title":"식생·해조류는 서로 다른 지표로 분석","desc":"실제 슬라이드는 레이더 식생지수 RVI, 광학영상의 NDVI, 해조류 부유 지표 FAI를 비교합니다. Sentinel-1과 Sentinel-2 영상 및 GEE 계산 결과를 함께 살펴 해조류/식생 변화 단서를 얻도록 구성했습니다.","points":["RVI: Radar Vegetation Index","NDVI: Normalized Difference Vegetation Index","FAI: Floating Algae Index"],"diagram":"blue-indices","variants":[["rvi","RVI"],["ndvi","NDVI"],["fai","FAI"]]},{"fig":"SLIDES 24–26","title":"식생지수 변화와 조류 양식장 변화를 별도로 확인","desc":"발표에는 2020년 6월~2021년 6월 식생지수 지도 비교와 2020년 6월~11월 남해 장좌도 김 양식장 변화 사례가 제시됩니다. 실제 지도를 그대로 공개하는 대신 관측 화면의 before/after 비교 기능과 관리 대상 구분의 의미를 재구성했습니다.","points":["Vegetation-index map before/after comparison","Aquaculture-field monitoring as a distinct use case","Conservation target and external activity should not be conflated"],"diagram":"blue-before-after","variants":[["vegetation","Vegetation"],["aquaculture","Aquaculture"]]}]},"bioai":{"layout":"stack","eyebrow":"BIO AI · TWO CHEMICAL-PROPERTY TASKS","headline":"하나의 대회, 두 가지 분자 예측 문제","summary":"35장 결과 발표자료의 Problem 1(혼합 향기 분류)과 Problem 2(간세포 청소율 회귀)를 분리했습니다. 실제 feature 설계, 모델 비교, 해석 결과를 그대로 근거로 삼습니다.","source":"2025 Bio-AI Convergence Competition · DILAB result report, slides 4–33","url":"","metrics":[["109","Odor labels · multilabel"],["0.92 F1","Final odor blend model"],["2 tasks","Blend classification / hepatic clearance"]],"scenes":[{"fig":"PROBLEM 1","title":"두 분자의 혼합 향기, 단일 분자 예측으로는 부족","desc":"첫 과제는 SMILES 두 개로 이루어진 화합물 쌍으로 109개의 향 특성을 다중 라벨로 예측합니다. 발표자료는 약 3,500개 분자와 16만 분자 쌍을 기술하며, 결측/변환 오류를 정리하고 두 분자의 입력 순서를 바꾸는 augmentation으로 교환 대칭성을 학습합니다.","points":["Input: SMILES_A + SMILES_B → 109 odor labels","Approx. 3,500 compounds / 160,000 molecular pairs","Canonicalization + swap augmentation"],"diagram":"bio-mixture","variants":[["input","SMILES pair"],["molecules","Molecular graphs"]]},{"fig":"P1 · FRAMEWORK","title":"GAT 원자 임베딩과 화학 descriptor를 융합","desc":"원자와 결합의 구조적 신호는 GAT로 학습합니다. 별도 graph-level branch에서는 Morgan fingerprint, 물리화학적 descriptor, SMARTS 작용기 패턴을 Residual MLP(GEGLU 포함)로 처리하고 두 분자 표현을 융합합니다.","points":["Node/edge GAT learns local interaction","Morgan FP + physicochemical properties + SMARTS motifs","Residual MLP and fused multilabel prediction"],"diagram":"bio-fusion"},{"fig":"P1 · RESULTS","title":"혼합 향기 실험: 단일 그래프보다 융합 모델","desc":"동일 발표의 Modeling Strategies 슬라이드에서 GCN→GAT와 최종 융합 모델의 성능을 보고합니다. GCN/GAT의 비교(슬라이드 11)와 최종 모델(슬라이드 13)은 서로 다른 실험 단계이므로 하나의 단순한 튜닝 곡선으로 취급하지 않습니다.","points":["GCN: F1 0.55 / Jaccard 0.46 (slide 11)","GAT: F1 0.77 / Jaccard 0.62 (slide 11)","Final GAT + residual MLP: F1 0.92 / Jaccard 0.90 (slide 13)"],"diagram":"bio-odor-scores"},{"fig":"PROBLEM 2","title":"약물 화합물의 in-vitro 간세포 청소율을 회귀","desc":"두 번째 과제는 단일 약물의 SMILES에서 간세포 청소율이라는 연속값을 예측합니다. 발표자료는 전체 약 1,020개 화합물, 학습용 약 970개를 명시하며, SMILES를 RDKit descriptor/fingerprint로 바꿔 학습 가능한 형태로 설계합니다.","points":["Input: drug SMILES → continuous clearance value","Approx. 1,020 compounds (970 training in slides)","Chemistry descriptors + fingerprints + SMARTS"],"diagram":"bio-clearance"},{"fig":"P2 · MODELING","title":"적은 데이터에서는 특성 선택과 비교 검증이 중요","desc":"도메인 descriptor, RFECV 특징 선택, SMARTS 전문가 패턴을 구성하고 Chemprop, TopoReg_QSAR, Transformer-CNN, GAT·GIN·GraphSAGE·SchNet, RF·XGBoost·LightGBM을 비교했습니다. 발표는 절대오차, 순위상관, 안정성이 모델마다 달랐음을 설명합니다.","points":["Descriptor selection: correlation filtering → F-score → RFECV","Hybrid GAT was described as a stable GNN configuration","TopoReg_QSAR lowest RMSE; Chemprop highest Spearman in the stated comparison"],"diagram":"bio-model-zoo","variants":[["features","Features"],["models","Model comparisons"]]},{"fig":"P2 · INTERPRET","title":"예측을 화학적 변수로 해석하는 XAI","desc":"슬라이드 22–23은 Top-5 feature importance와 SHAP/force plot 해석을 제공합니다. MolLogP와 BCUT2D 등 물리화학적 descriptor가 예측에 상당한 영향을 미쳤다고 보고하지만, 화학적 인과관계를 입증한다는 의미는 아닙니다.","points":["MolLogP importance 0.057965","BCUT2D_CHGHI 0.043030 · fp_64 0.035662","SHAP for local/global model explanation"],"diagram":"bio-feature-importance"}]},"mot":{"layout":"columns","eyebrow":"LLM SYSTEMS · ARXIV V2 · OCT 2026","headline":"동일 문맥을 다른 LLM의 KV 공간으로 번역","summary":"최신 arXiv v2의 이종 모델 설정, 14개 본문 Figure 구성, 5단계 MoT/Context Correction Pipeline과 multi-agent·CAG 결과를 기준으로 다시 정리했습니다.","source":"MoT arXiv:2607.28979v2 (3 Oct 2026), Figures 1–14 and Tables 1–2","url":"https://arxiv.org/abs/2607.28979","metrics":[["57.6%","Cross-family average accuracy"],["0.42","Cross-family extractive F1"],["Llama·Gemma·Qwen","3B–4B heterogeneous LLMs"]],"scenes":[{"fig":"FIGS 1–2","title":"이종 에이전트가 대화의 기억을 공유하려면","desc":"v2는 Llama-3.2 3B와 Qwen-3 4B를 번갈아 사용하는 10-agent 토론을 사례로, 기존 모델의 KV cache를 다른 아키텍처로 번역해 재활용하는 방식을 보여줍니다. Figure 2의 축은 Accuracy (%)와 KV Memory (GiB / 1k tokens)입니다.","points":["Heterogeneous source/target cache spaces","10-agent alternating Llama/Qwen discussion","KV-memory scaling is separated from output accuracy"],"diagram":"mot-v2-agents"},{"fig":"FIGS 3–7","title":"번역 층의 위치가 만드는 두 오류","desc":"채널을 낮은 층에 두면 번역 오차가 남은 층에 전파되고, 높은 층에서는 correction 기회가 부족해집니다. 논문은 U형 validation loss, last-state shift, correction deficit과 KV similarity를 별도 그림으로 분석합니다.","points":["Early injection: propagation error","Late injection: correction-deficit error","Competing dynamics motivate translation + correction"],"diagram":"mot-v2-errors","variants":[["early","Propagation"],["late","Correction deficit"]]},{"fig":"FIGURE 8","title":"MoT 핵심: Token-level translator routing과 Context Correction","desc":"Figure 8은 Source Context Prefill, KV Translation (Mixture-of-Translators), Target Context Replay, Prompt Prefill, Completion Output의 다섯 단계를 연결합니다. Top-K expert mixture는 token마다 다른 변환기를 선택하며 Context Correction Loss는 replay trajectory를 native target과 정렬합니다.","points":["Context prefill → MoT translation → target replay","Token-level Top-K translators, not one universal projection","Context Correction Loss aligns replayed and native target states"],"diagram":"mot-v2-framework","variants":[["experts","Translator gating"],["replay","Context replay"]]},{"fig":"FIGS 9–12","title":"모델 패밀리 사이의 성능과 교정 효과","desc":"v2는 Llama-3.2(3B), Gemma-3(4B), Qwen-3(4B) 간 이종 번역에서 평균 Accuracy 57.6%, F1 0.42를 보고합니다. 이는 native target 대비 95.0% 및 120.6% 수준이며, 각각의 가장 강한 baseline 대비 약 1.5배·3.5배입니다.","points":["Accuracy 57.6% · F1 0.42 (heterogeneous averages)","Native-recovery: 95.0% accuracy / 120.6% F1","Ablations cover expert mixture and Context Correction Loss"],"diagram":"mot-v2-results"},{"fig":"FIGS 13–14","title":"에이전트 수 증가와 긴 문맥의 cache-augmented generation","desc":"Figure 13은 2–16 agent 확장 상황의 memory behavior를, Figure 14는 긴 컨텍스트를 cache에 저장하고 재사용할 때의 F1 및 TTFT 관련 trade-off를 검증합니다. 측정 지점을 임의로 만들지 않고, 두 시나리오를 나눠 보여줍니다.","points":["2–16 agent scaling diagnostic","Long-context CAG: quality and cache reuse","Time-to-first-token and KV memory are distinct efficiency metrics"],"diagram":"mot-v2-scaling","variants":[["agents","Agent scaling"],["cag","Long-context CAG"]]}]}});

/* Figure completeness audit: supplementary studies shown as guided reading, not fabricated replots. */
SCENES["gref-rag"].scenes.push({
 fig:"MATCHED BUDGET",title:"동일 토큰 예산에서도 evidence selection이 중요한가?",
 desc:"후속 비교 실험에서는 KG2RAG와 GRef-RAG에 동일한 context budget을 적용해 retrieval 구조의 영향을 분리했습니다. 네 QA 데이터셋의 complete-bundle packing macro ΔF1을 기준으로, 512/1024/2048 토큰 모두 양의 차이가 보고됐습니다.",
 points:["512 tokens: +0.05025 absolute F1 vs KG2RAG","1024 tokens: +0.03909 absolute F1","2048 tokens: +0.02847 absolute F1"],
 diagram:"gref-budget"
});
SCENES["mot"].scenes.push(
 {fig:"APPENDIX 15–22",title:"레이어 유사도·오차 교정 분석을 더 자세히",
 desc:"부록 Figure 15–22는 모델 간 layer mapping, MMLU-Redux 분야별 성능, shift/correction 개선, validation loss와 F1의 관계를 분석합니다. 개별 도표 좌표를 복제하는 대신 실험 질문을 탐색합니다.",
 points:["Layer similarity and source–target mapping","Validation loss, error propagation, last-state shift","Per-domain MMLU-Redux results"],diagram:"mot-extra-mapping"},
 {fig:"APPENDIX 23–29",title:"채널 매핑·번역 비율·모델 패밀리 확장",
 desc:"부록 Figure 23–29는 terminal/depth-ratio mapping, translation-channel ratio, full attention, GPT-2·Qwen2.5·OPT 모델 패밀리의 용량 확장 분석을 담습니다. Qwen2.5는 이 보조 분석의 모델이며 v2 주요 이종 실험 설정과 혼동하지 않습니다.",
 points:["Terminal vs depth-ratio mapping","Channel ratio and attention design","Model family and capacity scaling"],diagram:"mot-extra-capacity"},
 {fig:"APPENDIX 30–32",title:"Retain / Free와 source-guided selection의 선택",
 desc:"부록 Figure 30–32는 에이전트별 cache 관리 전략(Retain/Free), Top-S source-guided 선택과 long-context 성능·TTFT를 비교합니다. 효율 지표의 의미를 분리해 읽도록 구성했습니다.",
 points:["Retain and Free cache management","Top-S source-guided selection","Long-context F1 and time to first token"],diagram:"mot-extra-cache"}
);
SCENES["mpr-citeg"]={
 ...SCENES["scienceon-mpr-citeg"],layout:"split",
 eyebrow:"RESEARCH · RETRIEVAL AND CITATION",
 headline:"과학 논문 검색에서 다양성과 출처 추적을 동시에",
 summary:"MPR과 CiteG를 방법론 관점에서 분해하고, 문장 단위 인용 근거를 직접 탐색합니다.",
 scenes:[{
 fig:"PROBLEM",title:"다양한 후보와 정확한 출처는 다른 목표",
 desc:"Scientific RAG에서는 검색 포트폴리오 하나가 놓친 문서를 회수할 수 있어야 하면서도, 최종 생성된 문장마다 어느 자료를 근거로 했는지 확인할 수 있어야 합니다.",
 points:["Multiple Boolean query portfolios for recall diversity","Rerank before conditioning the generator","Sentence-level citation grounding"],diagram:"mpr-problem"
 },...SCENES["scienceon-mpr-citeg"].scenes]
};

function diagram(name,variant){
 switch(name){
 case "gref-budget":return wrap(S(32,45,"POST-REVIEW MATCHED-BUDGET COMPARISON · MACRO ΔF1","svtitle")+
 [["512",.05025],["1024",.03909],["2048",.02847]].map((x,i)=>{let y=105+i*78,w=Math.round(x[1]/.055*405);return S(35,y+8,x[0]+" tokens","svtext")+
 '<rect x="186" y="'+(y-13)+'" width="412" height="29" rx="10" fill="#dbe6f1"/>'+
 '<rect x="186" y="'+(y-13)+'" width="'+w+'" height="29" rx="10" fill="#45a28d"/>'+
 S(186+w+12,y+7,"+"+x[1].toFixed(5),"svsmall")}).join("")+
 S(35,361,"Author-supplied follow-up comparison · same context budget for both methods","svsmall"));
 case "mot-extra-mapping":return boxes(["Layer mapping","Domain QA","Shift / correction","Loss & F1"],["Figure 15","Figure 16","Figures 17–18","Figures 19–22"]);
 case "mot-extra-capacity":return boxes(["Layer alignment","Channel ratio","Full attention","Model scaling"],["Figure 23","Figure 24","Figure 25","Figures 26–29"]);
 case "mot-extra-cache":return boxes(["Retain vs Free","Source-guided Top-S","Long-context CAG"],["Figure 30","Figure 31","Figure 32"]);
 case "mpr-problem":return boxes(["Scientific query","Query diversity","Candidate reranking","Source-conditioned QA","Citation checking"],["Evidence need","Q/S/F/G portfolios","Relevant papers","Sentence generation","Claim grounding"]);

 case "steel-early-source":return wrap(S(34,41,"2023 · MANUAL REVIEW PROBLEM","svtitle")
  +R(28,88,208,176,"Client specifications","svcard","Multilingual PDFs / tables")
  +R(265,88,208,176,"Manual extraction","svnoise","Codes, references, synonyms")
  +R(503,88,185,176,"Human error risk","svnoise","Repeated copy and checks")
  +L(237,173,263,173)+L(474,173,501,173)+S(46,304,"Early PoC: streamline information extraction and draft production","svsmall"));
 case "steel-early":return wrap(S(36,46,"OCT 2023 · FIRST POC ARCHITECTURE","svtitle")
  +R(24,93,151,102,"Streamlit","svcard","Customer document UI")
  +R(199,93,148,102,"Chroma","svcard","Vector search")
  +R(373,93,148,102,"ChatGPT","svgood","Question / extraction")
  +R(548,93,145,102,"Review draft","svgood","Editable check items")
  +L(176,142,197,142)+L(348,142,371,142)+L(523,142,546,142)
  +R(185,238,356,84,"Table handling improvement","svnoise","Table detection → structure → HTML")
  +S(38,347,"Project concept and demonstrated changes come from 2023 midterm slides","svsmall"));
 case "steel-upgrade-pipeline":return wrap(S(24,43,"MAY 2024 · MULTIMODAL DOCUMENT INDEXING","svtitle")
  +R(28,86,158,193,"Documents","svcard","PDF + table + OCR")
  +R(223,86,193,193,"Unstructured.io","svcard","Text / Table / OCR")
  +R(454,86,225,193,"GPT-3.5 Turbo","svgood","Text / Table summary")
  +L(187,183,221,183)+L(417,183,452,183)
  +R(230,296,235,63,"Embeddings + vector store","svmuted","")
  +S(36,345,"Summaries are linked to originals for retrieval and inspection","svsmall"));
 case "steel-two-outputs":return wrap(S(25,43,"DOCUMENT PRIORITY AND EXCEL OUTPUT","svtitle")
  +R(28,81,260,106,"Doc A (rank 1)","svcard","Matched specification clause")
  +R(28,211,260,106,"Doc B (rank 2)","svcard","Additional requirements")
  +P("M288 160 L357 190",palettes.blue,3)+P("M288 264 L357 206",palettes.mint,3)
  +R(368,118,303,168,variant==="priority"?"Priority Excel":"Integrated Excel","svgood",variant==="priority"?"Choose preferred document":"Combine valid evidence")
  +S(393,224,variant==="priority"?"Priority A → fallback B":"Rows from A + B","svtext")
  +S(45,347,"Both output modes are implemented, per 2024 meeting slide 4","svsmall"));
 case "steel-maturity":return wrap(S(35,42,"MAY 2024 · FUNCTION STATUS","svtitle")
  +R(30,84,306,238,"Implemented","svgood","EN/KR/JP · Multi-document")
  +S(52,185,"Steel grade selection","svtext")+S(52,225,"Two Excel versions","svtext")
  +R(383,84,305,238,"Follow-up / limitations","svnoise","Low-resolution / handwriting")
  +S(404,185,"Qualitative field review","svtext")+S(404,225,"Accuracy and cost tuning","svtext")
  +S(39,345,"2024 meeting outcomes ≠ independently verified final evaluation numbers","svsmall"));
 case "blue-architecture":return wrap(S(28,43,"TAEAN NATIONAL PARK · GEE WEB SERVICE","svtitle")
  +R(25,103,175,108,"Field user","svcard","≈388 km² park")
  +R(229,103,175,108,"Streamlit","svgood","Time-lapse / change")
  +R(432,103,252,108,"Google Earth Engine","svgood","geemap + imagery / model")
  +L(201,158,227,158)+L(406,158,430,158)
  +R(229,248,250,72,"Map + data layers","svmuted","Field verification")
  +S(31,358,"Area and architecture follow SBS slides 13–17","svsmall"));
 case "blue-timeline":return wrap(S(27,42,"TIME SERIES · SATELLITE OBSERVATION","svtitle")
  +P("M53 212 L665 212",palettes.blue,4)
  +[0,1,2,3,4,5,6].map((i)=>C(75+i*90,212,9,"",i===4?palettes.orange:palettes.blue)).join("")
  +R(variant==="time"?52:372,90,297,77,variant==="time"?"Select sensor and time span":"Inspect detected change","svgood",variant==="time"?"Sentinel-1 / Sentinel-2":"Before and after verification")
  +S(49,288,"2022-06-22","svtext")+S(537,288,"2022-07-04","svtext")
  +S(53,347,"Schematic date illustration based on the source case slide 21","svsmall"));
 case "blue-indices":return wrap(S(30,46,"REMOTE SENSING INDEX SELECTOR","svtitle")
  +["RVI","NDVI","FAI"].map((key,i)=>{let x=27+i*225;return R(x,95,206,185,key,key.toLowerCase()===variant?"svgood":"svmuted",i===0?"Radar vegetation":i===1?"Optical vegetation":"Floating algae")}).join("")
  +S(54,248,"Sentinel-1 / SAR","svsmall")+S(277,248,"Sentinel-2 / optical","svsmall")+S(501,248,"Algae signals","svsmall")
  +S(35,341,"Index maps are not original pixel observations","svsmall"));
 case "blue-before-after":return wrap(S(29,43,variant==="aquaculture"?"AQUACULTURE CHANGE · 2020 JUN → NOV":"VEGETATION CHANGE · 2020 JUN → 2021 JUN","svtitle")
  +[0,1].map(i=>{let x=49+i*330;return '<rect x="'+x+'" y="86" width="284" height="205" rx="20" fill="'+(variant==="aquaculture"?"#d1f1dc":"#b5ece2")+'"/>'+
  Array.from({length:14},(_,j)=>'<rect x="'+(x+9+(j%7)*38)+'" y="'+(98+Math.floor(j/7)*80)+'" width="26" height="'+(i?53:39)+'" rx="6" fill="#358b79" opacity="'+(0.18+(j%4)*.14)+'"/>').join("")
  +S(x+17,321,i?"After":"Before","svtitle")}).join("")
  +S(40,359,"Illustrative comparison · authentic maps retained in source presentation","svsmall"));
 case "bio-mixture":return wrap(S(28,40,"MULTILABEL ODOR PREDICTION","svtitle")
  +R(21,101,265,152,"SMILES A + SMILES B","svcard",variant==="input"?"Pair of canonical strings":"Two molecular graphs")
  +R(335,101,358,152,"109 odor properties","svgood","fruity · floral · green · ...")
  +L(287,177,333,177)+C(97,311,17,"A")+C(171,311,17,"B",palettes.mint)
  +S(212,315,"Exchange/swap augmentation","svsmall")
  +S(28,355,"Approx. 3,500 compounds; 160,000 pairs (slides 8–13)","svsmall"));
 case "bio-fusion":return wrap(S(30,42,"HYBRID MOLECULAR REPRESENTATION","svtitle")
  +R(25,83,309,79,"GAT atom/bond encoder","svcard","Node + edge structure")
  +R(25,216,309,79,"Residual MLP + GEGLU","svcard","Morgan FP · descriptors · SMARTS")
  +P("M335 127 L412 176",palettes.blue,3)+P("M335 256 L412 193",palettes.mint,3)
  +R(425,131,259,128,"Fusion classifier","svgood","109 multi-label outputs")
  +S(38,346,"Symmetric molecule-pair swap augmentation","svsmall"));
 case "bio-odor-scores":return wrap(S(26,43,"PROBLEM 1 · EXPERIMENT RESULTS FROM SLIDES 11 AND 13","svtitle")
  +[["GCN",.55,.46],["GAT",.77,.62],["Final fusion",.92,.90]].map((q,i)=>{let y=96+i*84;return S(33,y,q[0],"svtext")
  +'<rect x="192" y="'+(y-21)+'" width="'+(q[1]*340)+'" height="21" rx="8" fill="#3f7dba"/><rect x="192" y="'+(y+6)+'" width="'+(q[2]*340)+'" height="16" rx="8" fill="#48a893"/>'
  +S(545,y-4,"F1 "+q[1].toFixed(2),"svsmall")+S(545,y+22,"J "+q[2].toFixed(2),"svsmall")}).join("")
  +S(25,358,"Blue: F1 · Green: Jaccard; stages used reported experiment setups","svsmall"));
 case "bio-clearance":return wrap(S(26,44,"PROBLEM 2 · HEPATOCYTE CLEARANCE REGRESSION","svtitle")
  +R(29,91,201,169,"Drug SMILES","svcard","Molecular string")
  +R(260,91,201,169,"Chemistry features","svcard","ADME + RFECV + SMARTS")
  +R(491,91,197,169,"Regressor","svgood","Continuous clearance")
  +L(231,175,258,175)+L(462,175,489,175)
  +S(28,329,"1,020 total compounds; 970 model-training compounds in slides","svsmall"));
 case "bio-model-zoo":return variant==="features"?boxes(["Descriptors","Correlation / F-score","RFECV","SMARTS patterns","Selected features"],["MolWt / LogP","Remove redundancy","Cross-validation","Functional motifs","Regression input"]):boxes(["Chemprop","TopoReg QSAR","Hybrid GAT","RF / XGB / LGBM"],["D-MPNN","RMSE leader","Stable GNN","Interpretable ensembles"]);
 case "bio-feature-importance":return wrap(S(27,46,"PROBLEM 2 · TOP FIVE FEATURE IMPORTANCE (SLIDE 22)","svtitle")
  +[["MolLogP",.057965],["BCUT2D_CHGHI",.043030],["fp_64",.035662],["BCUT2D_MWLOW",.035508],["TPSA",.035478]].map((q,i)=>{let y=92+i*52;return S(29,y,q[0],"svtext")+'<rect x="202" y="'+(y-18)+'" width="'+(q[1]/.06*364)+'" height="23" rx="8" fill="'+(i===2?"#d19a4b":"#3f7dba")+'"/>'+S(585,y,q[1].toFixed(6),"svsmall")}).join("")
  +S(32,364,"Reported feature-importance values, not SHAP effect sizes","svsmall"));
 case "mot-v2-agents":return wrap(S(27,43,"V2 · HETEROGENEOUS AGENT COMMUNICATION","svtitle")
  +R(26,98,188,154,"Agent 1","svcard","Llama-3.2 (3B)")
  +R(276,121,171,110,"MoT","svgood","KV translation")
  +R(510,98,179,154,"Agent 2","svcard","Qwen-3 (4B)")
  +L(214,176,274,176)+L(449,176,508,176)
  +S(42,330,"10-agent alternating-model setting; Memory: GiB / 1k tokens","svsmall"));
 case "mot-v2-errors":return wrap(S(27,43,"COMPETING CHANNEL-PLACEMENT ERRORS","svtitle")
  +P("M61 90 L61 314 L661 314",palettes.ink,2)
  +P("M98 121 Q352 368 636 120",palettes.purple,5)
  +R(96,85,207,65,"Early translation","svnoise","Propagation shift")
  +R(411,85,210,65,"Late translation","svnoise","Correction deficit")
  +S(200,352,"Qualitative U-shaped loss, not the plotted raw data","svsmall"));
 case "mot-v2-framework":return variant==="replay"?
 boxes(["Translated cache","Target replay","Context Correction","Prompt prefill","Completion"],["KV target space","Reconstruct context","Align native states","Condition target","Generate reply"])
 :boxes(["Context prefill","Token router","Top-K experts","Mixture KV","Context replay"],["Source KV","Per-token gate","Multiple transforms","Weighted output","Correction loss"]);
 case "mot-v2-results":return wrap(S(29,43,"HETEROGENEOUS MODEL TRANSLATION · V2 MAIN RESULTS","svtitle")
  +R(27,91,309,190,"57.6% Accuracy","svgood","Average over cross-family settings")
  +R(380,91,309,190,"0.42 F1","svgood","Average extractive QA")
  +S(51,194,"95.0% native recovery","svtext")+S(404,194,"120.6% native recovery","svtext")
  +S(52,247,"1.5× best-baseline accuracy","svsmall")+S(404,247,"3.5× best-baseline F1","svsmall")
  +S(37,350,"Models: Llama-3.2 3B · Gemma-3 4B · Qwen-3 4B","svsmall"));
 case "mot-v2-scaling":return wrap(S(30,44,variant==="agents"?"FIGURE 13 · AGENT SCALABILITY":"FIGURE 14 · LONG-CONTEXT CAG","svtitle")
  +R(28,93,291,206,variant==="agents"?"2 → 16 agents":"Long context cache","svcard",variant==="agents"?"Reused translated states":"Storage reuse / budget")
  +R(389,93,301,206,variant==="agents"?"Memory scaling":"Quality + TTFT","svgood",variant==="agents"?"Working-set behavior":"Time-to-first-token")
  +L(320,190,387,190)
  +S(40,349,"Schematic evaluation categories; no fabricated numeric coordinates","svsmall"));

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
const EN_SCENES = {"star":[{"title":"Why use hyperbolic geometry?","desc":"Semantic proximity in Euclidean embeddings does not guarantee hierarchical relevance. The Poincaré disk shown here is an intuition aid; StAR actually computes structural distance in the Lorentz model.","points":["Negative curvature offers room for branching hierarchies.","The disk illustration is not the computational manifold.","Compare query and candidate structure, not text similarity alone."]},{"title":"From Q-graphs to structural scores","desc":"The retriever supplies filtered triples and node salience. StAR constructs rooted query and candidate subgraphs, fuses semantic embeddings with depth and radial-distance features, then applies a single hyperbolic message-passing layer.","points":["Semantic and structural node features are fused.","Lorentz exp/log maps and Fréchet centroids summarize structure.","Spearman rank agreement controls query-level structural weighting."]},{"title":"Which component contributes most?","desc":"Reported HotpotQA F1 ablations show the largest drop when explicit structural features are removed. The displayed bars represent reported differences, not simulated predictions.","points":["Without structural features: −5.47 F1.","Without adaptive gating: −3.26 F1.","Without hyperbolic message passing: −2.53 F1."]}],"gref-rag":[{"title":"Which film has the earlier-born director?","desc":"The paper's actual example compares Poola Rangadu, directed by Adurthi Subba Rao (born 1912), and Paganini Horror, directed by Luigi Cozzi (born 1947). Broad retrieval includes distractors; refined context retains the comparison evidence.","points":["Poola Rangadu → Adurthi Subba Rao → 1912.","Paganini Horror → Luigi Cozzi → 1947.","1912 is earlier, so the first film's director was born first."]},{"title":"Two phases: retrieve, then refine","desc":"Document-anchor, chunk and sentence views produce heterogeneous candidates. Lexical, dense and anchor scores select seeds; graph-constrained refinement builds valid paths and selects high-marginal-coverage bundles.","points":["Fuse heterogeneous candidate signals.","Follow source sentence to mentioned anchor and target sentence.","Order and deduplicate answer-supporting bundles."]},{"title":"Coverage and quality are different","desc":"Figure 3 examines the relation between retrieval coverage, F1 and context tokens. This conceptual comparison shows only reported macro results, not invented plot coordinates.","points":["Source-level retrieval coverage does not guarantee answer quality.","All methods share the generation and evaluation protocol.","Evidence density is more important than sheer volume."]}],"mot":[{"title":"KV memory reuse between agents","desc":"One agent's cached representation of shared documents and dialogue cannot simply be copied into another model. MoT translates source-model KV states and replays them on the target side.","points":["Source KV is model-specific.","Cache translation enables context replay on a different model.","Multi-agent systems avoid redundant context prefill."]},{"title":"Ten-agent F1 versus GPU memory","desc":"The manuscript reports that MoT maintains answer quality while reducing peak memory by more than 1 GiB in its ten-agent study. The schematic depicts the qualitative trade-off, not exact figure coordinates.","points":["Lower memory with comparable QA performance.","Free and retain variants are evaluated.","Consult original Figure 2 for numeric plot locations."]},{"title":"Why both early and late injection can fail","desc":"An early translation error can propagate through many upper layers; later translation leaves too little depth for correction. The paper reports a U-shaped loss trend as the translation window moves.","points":["Early placement risks propagated translation shift.","Late placement risks correction deficit.","Translation location and explicit correction both matter."]},{"title":"The complete MoT pipeline","desc":"Figure 5 combines context prefill, KV translation, target context replay, prompt prefill and completion. Token-level Top-K routing combines translator experts; Context Correction Loss aligns replay with the native trajectory.","points":["Context prefill → translation → replay.","Prompt prefill → completion.","Mixture routing and correction address different errors."]},{"title":"Ablations and agent scaling","desc":"Figure 6 separates correction-loss ablations, translator architecture comparisons and multi-agent scaling. No unverified numeric bars are introduced here.","points":["Loss component ablations.","Translator mixture architecture tests.","Scaling with the number of agents."]}],"ram-gnn":[{"title":"Risks hidden by direct AI exposure","desc":"A job may show modest direct AI exposure yet be connected to clusters of highly exposed occupations. The manuscript models such network-mediated vulnerability as a relation-aware screening problem.","points":["Direct and relational exposure are not identical.","MONET captures heterogeneous occupational ties.","Screening signals are not individual causal predictions."]},{"title":"MONET's five occupational relation layers","desc":"Abilities, Activities, Context, Knowledge and Skills provide different views of occupational relatedness. Select a layer to highlight one relationship type without collapsing them into a single graph.","points":["606 occupation nodes.","Five independently constructed graphs.","A flattened graph obscures relation distinctions."]},{"title":"Relation encoders and node-level attention","desc":"Separate graph encoders process each occupational relation. Node-specific relation attention combines those representations for occupation-level high-risk detection.","points":["Relation-specific message passing.","A separate attention scorer for each relation.","Weighted fusion supports downstream screening."]},{"title":"Results and interpretation","desc":"The manuscript reports around three macro-F1 points of improvement and concentrated attention on Abilities and Knowledge. Attention weights are model interpretation signals, not evidence of a causal risk pathway.","points":["Approx. +3 macro-F1 points in the manuscript summary.","Abilities and Knowledge account for roughly 94.8% of attention.","Other relation layers can still carry information."]}],"steel-rag":[{"title":"From PDF to review output","desc":"This figure summarizes the published project workflow rather than proprietary client documents. The essential design is traceability from a generated comparison back to the original source.","points":["Parse document text and tables.","Preserve summary-to-original references.","Retrieve, compare, export and review."]},{"title":"Evidence verification in industrial RAG","desc":"The review workflow connects generated comparison statements to underlying specification pages and table cells. All displayed document examples are illustrative.","points":["Inspect the original source for every retrieved item.","Normalize industrial terms and table structures.","Keep the reviewer in the decision loop."]}],"scienceon-mpr-citeg":[{"title":"Q, S, F and G retrieval portfolios","desc":"Qwen2.5-14B extracts five primary keywords and three expanded keywords. Different Boolean query portfolios retrieve complementary results before aggregation and reranking.","points":["Q: query expansion; S: synonym robustness.","F: primary focus; G: broader combinations.","Merge and rerank candidate scientific documents."]},{"title":"Ground each sentence in a document","desc":"The document-conditioned answer is followed by sentence-level citation grounding. The demonstration source labels are illustrations of the mechanism, not copied ScienceON results.","points":["Generate from retrieved evidence.","Associate each answer sentence with a source.","Return explicitly attributed answers."]}],"alibaba-search":[{"title":"Data quality precedes multilingual relevance","desc":"Query–product pairs require language and task context. Quality refinement, language tags and QC/QI annotations form the inputs to relevance training. The displayed pair is synthetic.","points":["Reduce noisy labels and input inconsistencies.","Attach language and task information.","Train multilingual matching objectives."]},{"title":"Task-aware LLM fine-tuning","desc":"The portfolio reports an e-commerce LLM family and LoRA-based adaptation. Internal model settings and unpublished per-language results are intentionally excluded.","points":["Multilingual query–product encoding.","LoRA-based adaptation.","QC/QI relevance scoring."]}],"blue-carbon":[{"title":"SAR and optical observations complement each other","desc":"Radar can retain useful sensing under cloud cover; optical data provide visual surface features. Time-series analysis in Google Earth Engine feeds layers for field verification.","points":["Satellite ingestion and temporal preprocessing.","Cross-modal change cues.","Human review of detected signals."]},{"title":"A detected change is not automatically a managed object","desc":"The management policy distinguishes natural conservation targets from external activities such as seaweed farms. The site shows this as a decision flow, not a real map.","points":["Separate protected habitat from external threats.","Present multiple management layers.","Use findings to support, not replace, field judgement."]}],"bioai":[{"title":"What is verified and what remains missing","desc":"The portfolio verifies third place in a 2025 Bio-AI competition. Dataset, method, model and evaluation details cannot yet be confirmed from source materials.","points":["Verified: third-place result.","Missing: original presentation, dataset and model details.","No invented experimental architecture."]}]};
Object.assign(EN_SCENES, {"steel-rag":[{"title":"The initial challenge was specification diversity","desc":"The October 2023 presentation described over 100 inspection items, multilingual terminology and inconsistent customer document layouts. The initial two-stage automation sought to reduce repetitive manual reviews.","points":["Different steel grades and inspection terminology","Repeated manual copying and references","Initial goal: generate review drafts from customer documents"]},{"title":"The original Streamlit–Chroma–ChatGPT proof of concept","desc":"The 2023 process map showed a Streamlit interface, Chroma retrieval and LLM-based review. Table structure recognition and editable checklist prompts were identified as key implementation issues.","points":["Streamlit → vector search → LLM","Separate PDF table structure conversion","Editable checklist and term definitions"]},{"title":"2024 upgrade: processing text, tables and OCR","desc":"The May 2024 meeting materials describe Unstructured.io document parsing, GPT-3.5 Turbo summaries, embedding stores and evidence-grounded context learning.","points":["Split Text / Table / OCR","Summarize text and tables separately","Index evidence and generate Excel output"]},{"title":"Document priority, steel type and Excel export modes","desc":"The upgraded workflow accepts multiple documents, selects parsing and document priorities, optionally filters steel grades, and exports either priority-aware or integrated Excel.","points":["English, Korean and Japanese processing tested","Multi-document and steel-type selection implemented","Priority / Integrated Excel output modes"]},{"title":"Separate demonstrated features from pending validation","desc":"The May meeting notes document functional completion but acknowledge lower-quality scanned and handwritten data limitations and request further field evaluation.","points":["Implemented: multilingual, documents, steel-grade, Excel","Limitations: handwritten and low-quality scans","Pending: expert review and performance/cost tuning"]}],"blue-carbon":[{"title":"Large coastal management area, limited inspection capacity","desc":"The November 2023 presentation targets Taeanhaean National Park (approximately 388 km²) and connects Streamlit, geemap, Google Earth Engine and sensing models to field management.","points":["About 388 km² in the source presentation","Streamlit ↔ GEE / geemap ↔ analysis model","Time-lapse and change inspection workflows"]},{"title":"Observe time series and mark changing locations","desc":"Users choose satellites, dates and time intervals. The presentation demonstrates Sentinel-1 backscatter, percentile-based detection and June 22–July 4, 2022 comparisons.","points":["Select region, sensor and time window","Compare backscatter distributions","Inspect detection points before acting"]},{"title":"Distinct radar and optical indices","desc":"Slides 22–23 distinguish the Radar Vegetation Index (RVI), Normalized Difference Vegetation Index (NDVI) and Floating Algae Index (FAI).","points":["RVI for radar vegetation","NDVI for optical vegetation","FAI for floating algae"]},{"title":"Vegetation and aquaculture are distinct monitoring cases","desc":"The presentation compares vegetation-index maps over June 2020–June 2021 and seaweed-farm observations over June–November 2020. These are distinct analysis needs.","points":["Vegetation index before-and-after maps","Seaweed-farm monitoring example","Separate conservation targets and external activities"]}],"bioai":[{"title":"Two molecular inputs, 109 odor labels","desc":"The first task predicts multilabel odor properties from a pair of SMILES strings. The team reports around 3,500 molecules and 160,000 molecule pairs and uses molecule-swap augmentation.","points":["SMILES pair → 109 labels","~3,500 molecules and ~160,000 pairs","Normalization and symmetric swap augmentation"]},{"title":"Fuse atomic interactions with chemistry descriptors","desc":"A GAT branch learns atom and bond signals; a residual MLP uses Morgan fingerprints, physicochemical descriptors and SMARTS motifs. They are fused for multilabel predictions.","points":["GAT for local atomic structure","Residual MLP with global chemistry descriptors","Multilabel prediction from combined features"]},{"title":"Odor blend results from the slides","desc":"Slide 11 compares GCN (F1 .55) with GAT (.77), while slide 13 reports the final GAT + residual MLP model at F1 .92 and Jaccard .90. Results correspond to distinct experiment stages.","points":["GCN F1 .55 / Jaccard .46","GAT F1 .77 / Jaccard .62","Final fusion F1 .92 / Jaccard .90"]},{"title":"Predict in-vitro hepatocyte clearance","desc":"The second task predicts a continuous hepatocyte-clearance value from drug SMILES. The slides describe ~1,020 compounds including 970 training compounds.","points":["Drug SMILES → numeric regression target","Molecular descriptors / fingerprints","Drug-specific substructure patterns"]},{"title":"Cross-validate feature sets and model families","desc":"The team compared chemistry descriptors and RFECV-selected features with Chemprop, TopoReg_QSAR, GNNs and ensemble models. Reported comparisons distinguish error, ranking and stability.","points":["Correlation and F-score filtering then RFECV","Stable performance with Hybrid GAT","Lowest RMSE: TopoReg_QSAR; highest rank correlation: Chemprop"]},{"title":"Interpret descriptor importance","desc":"Slide 22 lists MolLogP, BCUT2D and fingerprint features among the highest ranked; the team also examined SHAP explanations. Such feature importance is not causal evidence.","points":["MolLogP: 0.057965","BCUT2D_CHGHI: 0.043030","SHAP / force plots for interpretation"]}],"mot":[{"title":"Reuse memory between different LLM agents","desc":"The new arXiv v2 tests alternating Llama-3.2 3B and Qwen-3 4B agents, evaluating translated KV caches, answer accuracy and KV memory per 1k tokens.","points":["Cross-model KV incompatibility","Ten-agent alternating discussion","KV memory and accuracy measured separately"]},{"title":"Early propagation versus late correction deficit","desc":"Channel placement produces two competing errors. Figures 3–7 analyze U-shaped validation loss, propagation shifts, correction deficit and layer-wise similarity.","points":["Early-layer propagation error","Late-layer correction deficit","Complementary translation and correction needed"]},{"title":"The five stages in Figure 8","desc":"Context prefill, token-level Top-K translator routing, context replay, prompt prefill and generation are supervised by Context Correction Loss.","points":["Source context prefill and translation","Per-token mixture of translators","Replay alignment to native target trajectory"]},{"title":"Updated heterogeneous-model results","desc":"The v2 manuscript reports 57.6% average accuracy and 0.42 F1 across Llama-3.2, Gemma-3 and Qwen-3 translation settings, recovering 95.0% and 120.6% of native target performance.","points":["Accuracy 57.6%, extractive F1 0.42","95.0% / 120.6% native target recovery","1.5× / 3.5× strongest baseline"]},{"title":"Agent-count and long-context scalability","desc":"Figure 13 evaluates varying agent counts (2–16), while Figure 14 evaluates long-context cache-augmented generation, including quality, memory reuse and time to first token.","points":["Multi-agent memory scaling","Long-context cache reuse","TTFT and quality trade-offs"]}]});

EN_SCENES["gref-rag"].push({title:"Does the advantage remain under the same token budget?",
 desc:"Post-review experiments fix the context budget for KG2RAG and GRef-RAG and compare complete-bundle packing on four QA datasets. All three measured macro F1 differences remain positive.",
 points:["512 tokens: +0.05025 absolute F1 vs KG2RAG","1024 tokens: +0.03909 absolute F1","2048 tokens: +0.02847 absolute F1"]});
EN_SCENES["mot"].push(
 {title:"Layer mapping and correction diagnostics",
 desc:"Appendix Figures 15–22 analyze layer similarity, MMLU-Redux categories, shift/correction improvements, validation loss and F1. This guided overview does not replot unverified coordinates.",
 points:["Layer similarity and source–target mapping","Validation and propagated error analyses","MMLU-Redux categories"]},
 {title:"Channel mapping, attention and scaling",
 desc:"Appendix Figures 23–29 evaluate terminal vs depth-ratio mapping, translation channel ratios, full attention and GPT-2/Qwen2.5/OPT family scaling. These appendix experiments are separate from the v2 main cross-family setup.",
 points:["Layer pairing schemes","Translation ratio and attention choices","Model-family capacity scaling"]},
 {title:"Cache management and source guidance",
 desc:"Appendix Figures 30–32 compare Retain/Free cache strategies, source-guided Top-S selection, and long-context QA quality/TTFT.",
 points:["Retain versus Free","Source-guided Top-S","Long-context quality and time to first token"]}
);
EN_SCENES["mpr-citeg"]=[
 {title:"Retrieval diversity and traceable citation are two objectives",
 desc:"Scientific retrieval needs complementary query portfolios to improve candidate coverage, but the final generated claims must also map to inspected source documents.",
 points:["Q/S/F/G candidate diversity","Reranking of retrieved documents","Citation grounding at sentence level"]},
 ...EN_SCENES["scienceon-mpr-citeg"]
];

const TAB_HEADLINES = {"star":{"ko":["하이퍼볼릭 직관","구조 인식 재랭킹","핵심 소거 실험"],"en":["Hyperbolic geometry","Structure-aware ranking","Ablation results"]},"gref-rag":{"ko":["실제 질의 사례","검색·정제 파이프라인","정확도·효율 결과","동일 예산 비교"],"en":["Question example","Retrieve and refine","Quality vs efficiency","Matched token budget"]},"mot":{"ko":["에이전트 간 공유","번역 위치별 오류","KV 번역 구조","이종 모델 성능","시스템 확장성","층 매핑·교정","채널·모델 비교","캐시 재사용 전략"],"en":["Multi-agent memory","Translation placement","KV transfer pipeline","Cross-model results","System scalability","Layer mapping","Channel and models","Cache strategies"]},"ram-gnn":{"ko":["관계 기반 위험","5개 관계 레이어","GNN과 어텐션","결과·해석"],"en":["Network-mediated risk","Five relation layers","GNN and attention","Results and meaning"]},"mpr-citeg":{"ko":["핵심 연구 문제","Q·S·F·G 검색","문장별 인용"],"en":["Research problem","Q·S·F·G retrieval","Sentence citations"]},"scienceon-mpr-citeg":{"ko":["Q·S·F·G 검색","문장별 근거 연결"],"en":["Q·S·F·G retrieval","Citation grounding"]},"steel-rag":{"ko":["초기 문제 정의","2023년 PoC","2024년 검색 개선","업무 기능 고도화","한계·검증"],"en":["The original problem","2023 proof of concept","2024 retrieval upgrade","Business workflow","Limits and validation"]},"blue-carbon":{"ko":["현장 관리 문제","위성 시계열","식생·해조류 지표","변화 전후 비교"],"en":["Field monitoring","Satellite time series","Vegetation indices","Before and after"]},"alibaba-search":{"ko":["데이터 정제","다국어 모델 학습"],"en":["Data refinement","Multilingual training"]},"bioai":{"ko":["혼합 향기 문제","GAT·화학 피처","향기 모델 성능","청소율 예측","회귀 모델 비교","해석 가능성"],"en":["Odor prediction","GAT + chemistry","Odor model results","Clearance prediction","Regression models","Interpretability"]}};
const shortTabLabel=(id,i,fallback,english)=>{
 const set=TAB_HEADLINES[id]; return set?.[english?"en":"ko"]?.[i]||fallback;
};
const figLabel=(fig)=>String(fig).replace(/^PAPER\s+/i,"").replace(/^FIGURE\s+/i,"FIG. ").replace(/^FIGURES\s+/i,"FIGS. ");
function makePage(id,c){
 const english=document.documentElement.dataset.language==="en";
 const loc=(i,k,fallback)=>english?(EN_SCENES[id]?.[i]?.[k]??fallback):fallback;
 let selected=0,variant=c.scenes[0].variants?.[0]?.[0]||"";
 const root=document.querySelector('[data-story-atlas="'+id+'"]');
 if(!root)return;
 const tabs=c.scenes.map((scene,i)=>{
  const fullTitle=loc(i,"title",scene.title),shortTitle=shortTabLabel(id,i,fullTitle,english);
  return '<button type="button" role="tab" id="story-tab-'+id+'-'+i+'" aria-controls="story-panel-'+id+'" aria-selected="'+(i===0)+'" data-scene="'+i+'" tabindex="'+(i===0?0:-1)+'" aria-label="'+esc(scene.fig+' — '+fullTitle)+'" title="'+esc(fullTitle)+'"><span class="story-tab-meta">'+esc(figLabel(scene.fig))+'</span><span class="story-tab-title">'+esc(shortTitle)+'</span><span class="story-tab-index">'+String(i+1).padStart(2,"0")+' / '+String(c.scenes.length).padStart(2,"0")+'</span></button>';
 }).join("");
 const metrics=c.metrics.map(m=>'<div class="story-metric"><strong>'+esc(m[0])+'</strong><span>'+esc(m[1])+'</span></div>').join("");
 root.innerHTML='<div class="story-shell story-shell--'+c.layout+'"><div class="story-storyboard'+(c.scenes.length>4?" is-many":"")+'" data-count="'+c.scenes.length+'" role="tablist" aria-label="Figure navigation">'+tabs+'</div><div class="story-progress"><span></span></div><div class="story-content" role="tabpanel" id="story-panel-'+id+'" aria-labelledby="story-tab-'+id+'-0"><div class="story-art"><div class="story-secondary"></div><p class="story-pan-hint" aria-hidden="true">↔ 좌우로 보기 · Swipe horizontally</p><div class="story-svg-frame"><div class="story-drawing"></div><span class="story-watermark">REDRAWN · NOT TO SCALE</span></div></div><div class="story-text" aria-live="polite"></div></div><div class="story-metrics">'+metrics+'</div><div class="story-source">'+esc(c.source)+(c.url?' · <a target="_blank" rel="noopener noreferrer" href="'+esc(c.url)+'">Original publication ↗</a>':"")+'</div></div>';
 const show=(i,v)=>{
 selected=i;
 const scene=c.scenes[i];variant=v??scene.variants?.[0]?.[0]??"";
 [...root.querySelectorAll('[data-scene]')].forEach((b,j)=>{b.setAttribute("aria-selected",j===i?"true":"false");b.tabIndex=j===i?0:-1;});
 root.querySelector(".story-progress span").style.width=((i+1)/c.scenes.length*100)+"%";
 root.querySelector(".story-secondary").innerHTML=scene.variants?scene.variants.map(([key,label])=>'<button type="button" data-variant="'+esc(key)+'" aria-pressed="'+(variant===key)+'">'+esc(label)+'</button>').join(""):"";
 root.querySelector(".story-drawing").innerHTML=diagram(scene.diagram,variant);
 const figureCanvas=root.querySelector(".story-svg-frame"); if(figureCanvas)figureCanvas.scrollLeft=0;
 root.querySelector(".story-text").innerHTML='<div class="story-figure-label">'+esc(scene.fig)+' · RECONSTRUCTED</div><p class="story-kicker">'+esc(c.eyebrow)+'</p><h3>'+esc(scene.title)+'</h3><p>'+esc(scene.desc)+'</p><div class="story-points">'+loc(i,'points',scene.points).map(p=>'<div class="story-point">'+esc(p)+'</div>').join("")+'</div><p class="story-footnote">This is a site-native explanatory reconstruction, not a reproduction of original plotted coordinates or experimental traces.</p>';
 root.querySelector('#story-panel-'+id).setAttribute('aria-labelledby','story-tab-'+id+'-'+i);
 };
 root.addEventListener("click",e=>{const t=e.target.closest('[data-scene]');if(t&&root.contains(t))show(Number(t.dataset.scene));const v=e.target.closest('[data-variant]');if(v&&root.contains(v))show(selected,v.dataset.variant)});
 root.addEventListener("keydown",e=>{const t=e.target.closest('[data-scene]');if(!t)return;let i=Number(t.dataset.scene);if(e.key==="ArrowRight")i=(i+1)%c.scenes.length;else if(e.key==="ArrowLeft")i=(i-1+c.scenes.length)%c.scenes.length;else if(e.key==="Home")i=0;else if(e.key==="End")i=c.scenes.length-1;else return;e.preventDefault();show(i);root.querySelector('[data-scene="'+i+'"]').focus()});
 show(0);
}
function initialize(){document.querySelectorAll("[data-story-atlas]").forEach(el=>{let c=SCENES[el.dataset.storyAtlas];if(c)makePage(el.dataset.storyAtlas,c)})}
document.addEventListener("portfolio-language-change",()=>{document.querySelectorAll("[data-story-atlas]").forEach(el=>{const fresh=el.cloneNode(false);el.replaceWith(fresh)});initialize()});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initialize);else initialize();
})();
