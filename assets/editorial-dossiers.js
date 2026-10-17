
(() => {
 "use strict";
 const dict=window.PORTFOLIO_DOSSIERS||{};
 const language=()=>document.documentElement.dataset.language==="en"?1:0;
 const pick=item=>Array.isArray(item)?(item[language()]??item[0]):item;
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const rich=s=>esc(s).replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>");
 const trans={reading:["읽기 순서","Reading order"],contribution:["나의 참여와 성과의 범위","My contributions and attribution"],sources:["원문 Figure·슬라이드 확인","Original figures and slides"],jump:["인터랙티브 Figure 탐색하기","Explore interactive figures"],note:["실측·보고 수치와 설명용 개념도를 구분했습니다.","Reported/observed values are kept separate from illustrative figures."],paper:["논문 원문 보기","Open public paper"],private:["심사 중 원고 또는 내부 발표자료입니다. 비공개 문서·고객 규격서 원본은 게시하지 않았습니다.","Manuscript or internal presentation only. No unpublished private slides or customer records are reproduced."],kind:{case:["실제 사례","REAL CASE"],method:["방법과 선택","DESIGN CHOICES"],comparison:["관점 비교","TRADE-OFFS"],results:["실험 근거","OBSERVED RESULTS"]}};
 const facts=items=>'<div class="dossier-facts">'+(items||[]).map(([k,v,e,w])=>'<div class="dossier-fact"><span>'+esc(language()?e:k)+'</span><strong>'+esc(language()?w:v)+'</strong></div>').join("")+'</div>';
 const chart=(data,note)=>{
  const max=Math.max(...data.bars.map(v=>Number(v[1])))||1;
  return '<div class="dossier-chart" role="group" aria-label="'+esc(data.unit)+'"><div class="dossier-chart-unit">'+esc(data.unit)+'</div>'+
   data.bars.map(([k,v])=>'<div class="dossier-chart-row"><span>'+esc(k)+'</span><div class="dossier-chart-track"><div class="dossier-chart-fill" style="width:'+(100*Number(v)/max).toFixed(2)+'%"></div></div><strong>'+esc(v)+'</strong></div>').join("")+
   '<p class="dossier-chart-foot">'+esc(pick(note))+'</p></div>';
 };
 const chapter=(part,i)=>{
  const type=part.kind||"case";
  return '<article class="dossier-chapter dossier-chapter--'+type+'" id="dossier-chapter-'+(i+1)+'">'+
   '<div class="dossier-chapter-copy"><div class="dossier-index"><span>'+String(i+1).padStart(2,"0")+'</span><small>'+esc(pick(trans.kind[type]))+'</small></div>'+
   '<h3>'+esc(pick(part.title))+'</h3><p>'+rich(pick(part.body))+'</p><span class="dossier-cite">'+esc(part.ref)+'</span></div>'+
   '<div class="dossier-chapter-media">'+(part.chart?chart(part.chart,part.foot):facts(part.items))+'</div></article>';
 };
 function render(id){
  const d=dict[id],root=document.querySelector('[data-editorial-dossier="'+id+'"]');if(!d||!root)return;
  root.innerHTML='<div class="dossier-shell shell">'+
    '<header class="dossier-cover"><p class="dossier-eyebrow">'+esc(pick(d.tag))+' <span>· SOURCE-BASED DEEP DIVE</span></p>'+
    '<h2>'+esc(pick(d.title))+'</h2><p class="dossier-lede">'+rich(pick(d.lead))+'</p>'+
    '<blockquote>'+rich(pick(d.insight))+'</blockquote>'+
    '<div class="dossier-kpis">'+d.kpis.map(([num,label])=>'<div><strong>'+esc(num)+'</strong><span>'+esc(label)+'</span></div>').join("")+'</div><a class="dossier-figure-jump" href="#interactive-lab">'+esc(pick(trans.jump))+' ↗</a></header>'+
    '<div class="dossier-body"><aside class="dossier-sidebar"><div class="dossier-sticky"><b>'+esc(pick(trans.reading))+'</b><nav aria-label="Evidence chapters">'+d.sections.map((s,i)=>'<a href="#dossier-chapter-'+(i+1)+'"><span>'+String(i+1).padStart(2,"0")+'</span>'+esc(pick(s.title))+'</a>').join("")+'<a href="#dossier-source-notes">'+esc(pick(trans.sources))+'</a></nav></div></aside>'+
    '<div class="dossier-content">'+d.sections.map(chapter).join("")+
     '<section class="dossier-role"><span>'+esc(pick(trans.contribution))+'</span><p>'+esc(pick(d.role))+'</p></section>'+
     '<section class="dossier-sources" id="dossier-source-notes"><h3>'+esc(pick(trans.sources))+'</h3><p>'+esc(pick(trans.note))+'</p>'+
      '<div class="dossier-refs">'+d.refs.map(([fig,detail])=>{
        const pub=String(d.source||"");const publicPdf=pub.includes("arxiv.org")?pub.replace("/abs/","/pdf/"):null;
        const pageMatch=fig.match(/(?:pp?\.\s*)(\d+)/i),page=pageMatch?Number(pageMatch[1]):null;
        const refLabel=publicPdf&&page?'<a href="'+esc(publicPdf.split("#")[0]+"#page="+page)+'" target="_blank" rel="noopener noreferrer" aria-label="'+esc(fig+" · open original paper page")+'">'+esc(fig)+' ↗</a>':esc(fig);
        return '<div><strong>'+refLabel+'</strong><span>'+esc(detail)+'</span></div>';
      }).join("")+'</div>'+
      (d.source?'<a href="'+esc(d.source)+'" target="_blank" rel="noopener noreferrer" class="dossier-source-link">'+esc(pick(trans.paper))+' ↗</a>':'<p class="dossier-source-private">'+esc(pick(trans.private))+'</p>')+
     '</section></div></div></div>';
 }
 function renderAll(){document.querySelectorAll("[data-editorial-dossier]").forEach(el=>render(el.dataset.editorialDossier));}
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",renderAll);else renderAll();
 document.addEventListener("portfolio-language-change",renderAll);
})();
