import assert from "node:assert/strict";
import fs from "node:fs/promises";
import {chromium} from "playwright";
const origin="http://127.0.0.1:8123";
const papers=["star","gref-rag","mot","ram-gnn","mpr-citeg"];
const projects=["steel-rag","blue-carbon","scienceon-mpr-citeg","alibaba-search","bioai"];
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
const fail=[];
async function check(route,width,fn){
 const page=await browser.newPage({viewport:{width,height:900}});
 const errors=[];page.on("pageerror",error=>errors.push(error.message));
 try{
 const res=await page.goto(origin+route,{waitUntil:"domcontentloaded"});
 assert.equal(res?.status(),200,route+" HTTP");
 await fn(page);
 const {width:scroll,viewport}=await page.evaluate(()=>({width:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
 assert.ok(scroll<=viewport+5,route+" horizontal overflow "+scroll+"/"+viewport);
 assert.deepEqual(errors,[],route+" JS errors");
 console.log("PASS EXPERT QA",route,width);
 }catch(e){fail.push(route+" "+width+": "+String(e));console.error("FAIL",route,width,String(e))}
 await page.close();
}
for(const width of [1440,390]){
 await check("/",width,async p=>{
  await p.locator("#start-here .career-path").first().waitFor();
  assert.equal(await p.locator("#start-here .career-path").count(),3);
  assert.ok((await p.locator("#start-here .career-path").first().getAttribute("href"))==="/research/star/");
  await p.locator('[data-cms-featured-research="home"] .card-proof').first().waitFor();
  assert.equal(await p.locator('[data-cms-featured-research="home"] .work-card').first().getAttribute("href"),"/research/star/");
  assert.ok(await p.locator("[data-portfolio-network]").count()>0,"original network preserved");
 });
 await check("/research/",width,async p=>{
  await p.locator("#research-guide .index-quick-links").waitFor();
  await p.locator('[data-cms-featured-research="research"] .card-proof').first().waitFor();
  assert.equal(await p.locator('[data-cms-featured-research="research"] .work-card').first().getAttribute("href"),"/research/star/");
  assert.ok(await p.locator("[data-cms-publications]").count()>0);
 });
 await check("/projects/",width,async p=>{
  await p.locator("#project-guide .index-quick-links").waitFor();
  await p.locator('[data-cms-projects="all"] .card-proof').first().waitFor();
  assert.equal(await p.locator('[data-cms-projects="all"] .project-card').first().getAttribute("href"),"/projects/steel-rag/");
  assert.ok(await p.locator('[data-filter="competition"]').count()===1);
 });
 await check("/about/",width,async p=>{
  assert.equal(await p.locator("#at-a-glance .snapshot-grid article").count(),3);
  assert.ok(await p.locator("#journey").count()>0,"original full timeline preserved");
  assert.ok(await p.locator("#at-a-glance a[href='mailto:ojh7839@o.cnu.ac.kr']").count()>0);
 });
 for(const id of papers.concat(projects)){
  const route=(papers.includes(id)?"/research/":"/projects/")+id+"/";
  await check(route,width,async p=>{
   await p.locator(".dossier-decision-item").first().waitFor();
   assert.equal(await p.locator(".dossier-decision-item").count(),3,route+" quick role/proof/decision");
   assert.ok((await p.locator(".dossier-decision-item").first().innerText()).length>=28);
   assert.ok(await p.locator(".dossier-sources").count()===1,"provenance retained");
   assert.ok(await p.locator("[data-story-atlas] .story-storyboard").count()===1,"original figure explorer retained");
   const tabs=p.locator('[data-story-atlas] [role="tab"]');
   assert.ok(await tabs.count()>=2);
   await tabs.nth(1).click();
   assert.equal(await p.locator('[data-story-atlas] [role="tabpanel"]').getAttribute("aria-labelledby"),"story-tab-"+id+"-1","tabpanel label follows active tab");
   assert.equal(await p.locator('[data-story-atlas] [role="tab"][aria-selected="true"]').count(),1);
   if(width===390)assert.ok(await p.locator(".dossier-mobile-toc").isVisible(),"mobile chapter nav remains available");
   if(id==="scienceon-mpr-citeg"){const text=await p.locator(".editorial-dossier").innerText();assert.ok(text.includes("KISTI")&&text.includes("2"),"competition result visible");}
   if(id==="mpr-citeg"){const text=await p.locator(".editorial-dossier").innerText();assert.ok(text.includes("NLLB-200"),"research paper detail remains");}
   if(id==="star")assert.ok(await p.locator(".dossier-related-link[href='/research/gref-rag/']").count()===1);
  });
 }
}
for(const id of papers.concat(projects)){
 const route=(papers.includes(id)?"/research/":"/projects/")+id+"/";
 const raw=await fs.readFile((papers.includes(id)?"research/":"projects/")+id+"/index.html","utf8");
 assert.ok(raw.includes('data-dossier-static'),route+" static, accessible summary");
 assert.ok(!raw.includes("원문에 근거한 상세 분석을 불러오고 있습니다."),route+" should not show only loading text");
}
const noJS=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:800}});
const noPage=await noJS.newPage();await noPage.goto(origin+"/research/star/");
assert.ok((await noPage.locator("[data-dossier-static]").innerText()).includes("52.80"),"static research evidence without JS");
await noPage.goto(origin+"/projects/steel-rag/");
assert.ok((await noPage.locator("[data-dossier-static]").innerText()).includes("Excel"),"static project evidence without JS");
await noJS.close();await browser.close();
assert.deepEqual(fail,[],fail.join("\n"));
console.log("PASS: 14 pages at 2 widths, 10 dossier contribution records, dynamic Figure ARIA, no-JS evidence.");
