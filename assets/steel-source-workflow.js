/* Recreated from 2023 slides 9–10/20 and 2024 slides 5/10–21. No confidential source screenshot published. */
(() => {
 "use strict";
 const root=document.getElementById("steel-source-workflow");if(!root)return;
 const pair=(ko,en)=>({ko,en}),lang=()=>document.documentElement.dataset.language==="en"?"en":"ko";
 const phases={
  before:[
   {title:pair("수주 검토 요청","Review request"),sub:pair("고객 inquiry 접수","Receive inquiry"),body:pair("고객 inquiry와 수주 규격 검토 요청을 접수합니다. 기존 검토 프로세스의 출발점입니다.","Receive customer inquiry and request to review order specifications.")},
   {title:pair("고객 사양서 검토","Customer-spec review"),sub:pair("확인 → 추출 → Excel 입력","Read → extract → enter Excel"),body:pair("2023년 Human Process는 강종명·검사 항목·참조 규격·화학 성분비 확인, 필요한 내용 추출, Excel 검토서 입력으로 제시됩니다. 이 반복 작업이 자동화의 직접 대상입니다.","The 2023 Human Process shows specification reading (steel grade, tests, standards, chemical composition), extracting requirements and entering them in an Excel review form.")},
   {title:pair("생산 가능성 검토","Feasibility check"),sub:pair("생산 가능 여부 판단","Assess feasibility"),body:pair("고객 요청사항과 추출된 규격을 기준으로 생산 가능성을 검토합니다. 검색 시스템이 생산 승인 자체를 자동으로 결정하지는 않습니다.","Assess manufacturing feasibility against customer requirements. RAG does not automatically approve production.")},
   {title:pair("수주 검토서 작성","Review form"),sub:pair("작성 및 승인","Prepare and approve"),body:pair("검토 내용을 정리해 수주 검토서를 작성하고 승인합니다. 기존 프로세스에서 사람이 직접 문서를 대조하고 내용을 옮기는 지점이 주요 병목이었습니다.","Prepare the final order review and approval record. Manual searching, comparison and transcription were key bottlenecks.")}
  ],
  after:[
   {title:pair("문서 삽입","Load files"),sub:pair("documents 폴더","documents folder"),body:pair("분석하려는 PDF·이미지 파일을 documents 폴더에 넣습니다. 자료 슬라이드 11.","Place PDFs and images in documents. Source slide 11.")},
   {title:pair("main.py 실행","Run main.py"),sub:pair("실행","Launch"),body:pair("사용자가 main.py를 실행해 절차를 시작합니다. 자료 슬라이드 12.","The operator starts main.py. Source slide 12.")},
   {title:pair("Parsing 여부","Choose parsing"),sub:pair("1: Parsing / 0: Quit","1: Parsing / 0: Quit"),body:pair("문서 구조화 단계에서 Unstructured.io를 활용해 Text·Table·OCR를 처리하고 요약·원문 연결을 구성합니다. 실제 선택 화면은 슬라이드 13에 있습니다.","Unstructured.io processes text, tables and OCR while linked summaries preserve source context. See slide 13.")},
   {title:pair("문서 우선순위","Set priority"),sub:pair("숫자가 작을수록 상위","Lower number = higher priority"),body:pair("문서별 우선순위를 지정해 복수 규격서를 검토합니다. 자료 슬라이드 14.","Specify source-document priority for multi-document review. Source slide 14.")},
   {title:pair("강종 선택","Steel-grade filter"),sub:pair("입력 또는 Enter","Optional input"),body:pair("강종명을 입력하거나 Enter로 건너뜁니다. 자료 슬라이드 15.","Enter a steel grade, or skip with Enter. Source slide 15.")},
   {title:pair("Excel 버전","Choose Excel export"),sub:pair("Priority / Integrated","Priority / Integrated"),body:pair("Priority는 우선 문서 요구사항을, Integrated는 다중 문서 요구를 통합한 결과를 출력합니다. 자료 슬라이드 16.","Priority favors the top-ranked document; Integrated combines requirements across source documents. Source slide 16.")},
   {title:pair("검색 및 생성","Search and export"),sub:pair("검색 → Excel 생성","Retrieve → workbook"),body:pair("RAG 검색과 Context Learning 결과를 Excel로 출력해 담당자가 원문 근거와 대조합니다. 성공/실패 데모는 슬라이드 18–20, 후속 정성 검증 필요성은 슬라이드 21에 나옵니다.","Export RAG search and context-learning results to Excel for source review. Slides 18–20 include positive and failed examples; field QA remains pending on slide 21.")}
  ]
 };
 let phase="before",selected=1;
 const escape=s=>String(s??"").replace(/[&<>"']/g,k=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[k]));
 const display=field=>field[lang()];
 function render(){
  const entries=phases[phase],chosen=entries[selected],l=lang();
  const sectionTitle=root.closest(".steel-source-story")?.querySelector("[data-steel-main-title]");
  if(sectionTitle)sectionTitle.textContent=l==="ko"?(phase==="before"?"2023 · 수주검토의 기존 업무 과정":"2024 · 사용자 중심의 검토 자동화"):(phase==="before"?"2023 · Original manual review workflow":"2024 · Operator-assisted review workflow");
  root.querySelectorAll("[data-steel-phase]").forEach(el=>{const selectedTab=el.dataset.steelPhase===phase;el.setAttribute("aria-selected",String(selectedTab));el.tabIndex=selectedTab?0:-1;el.classList.toggle("is-active",selectedTab)});
  root.querySelector("[data-steel-flow]").innerHTML=entries.map((entry,i)=>'<li><button type="button" class="steel-workflow-step'+(i===selected?" is-active":"")+'" data-steel-step="'+i+'" aria-pressed="'+(i===selected)+'"><span class="steel-workflow-index">'+String(i+1).padStart(2,"0")+'</span><strong>'+escape(display(entry.title))+'</strong><span>'+escape(display(entry.sub))+'</span></button></li>').join("");
  root.querySelector("[data-steel-detail]").innerHTML='<div class="steel-detail-meta">'+(l==="ko"?(phase==="before"?"2023 · 기존 업무":"2024 · 개선된 사용자 흐름"):(phase==="before"?"2023 · Original process":"2024 · Operator workflow"))+' · '+(selected+1)+'/'+entries.length+'</div><h3>'+escape(display(chosen.title))+'</h3><p>'+escape(display(chosen.body))+'</p>';
  root.querySelector("[data-steel-hint]").textContent=l==="ko"?"단계를 선택하면 실제 업무와 시스템의 처리 범위를 확인할 수 있습니다.":"Select a step to examine the original work and the automated workflow.";
  root.querySelector("[data-steel-source]").textContent=l==="ko"?(phase==="before"?"원본 근거 · 2023 중간발표 슬라이드 9·10·20. 사내 문서·고객 데이터는 게시하지 않고 프로세스만 재구성했습니다.":"원본 근거 · 2024.05.10 미팅자료 슬라이드 5·10–21. 구현 기능과 현장 평가 완료 여부를 구분합니다."):(phase==="before"?"Source: 2023 interim slides 9, 10, 20. Original internal documents not republished.":"Source: 2024 May meeting slides 5, 10–21. Field validation is distinct from implementation.");
 }
 root.addEventListener("click",e=>{const tab=e.target.closest("[data-steel-phase]");if(tab){phase=tab.dataset.steelPhase;selected=phase==="before"?1:0;render();return}const step=e.target.closest("[data-steel-step]");if(step){selected=Number(step.dataset.steelStep);render();}});
 root.addEventListener("keydown",e=>{if(!e.target.matches("[data-steel-phase]")||!["ArrowLeft","ArrowRight"].includes(e.key))return;e.preventDefault();phase=phase==="before"?"after":"before";selected=phase==="before"?1:0;render();root.querySelector('[data-steel-phase="'+phase+'"]').focus()});
 document.addEventListener("portfolio-language-change",render);render();
})();
