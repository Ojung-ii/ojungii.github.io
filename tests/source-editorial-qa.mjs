
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
const routes=["research/star","research/gref-rag","research/mot","research/ram-gnn","research/mpr-citeg",
"projects/steel-rag","projects/blue-carbon","projects/scienceon-mpr-citeg","projects/alibaba-search","projects/bioai"];
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
const problems=[],screens=[];
await fs.mkdir("editorial-previews",{recursive:true});
for(const route of routes){
 for(const width of [1440,390]){
 const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
 const errs=[];page.on("pageerror",e=>errs.push(e.message));
 await page.addInitScript(width===390?(()=>{localStorage.setItem("ojungii-language","en");localStorage.setItem("ojungii-theme","dark")}):(()=>{localStorage.setItem("ojungii-language","ko");localStorage.setItem("ojungii-theme","light")}));
 try {
  const res=await page.goto("http://127.0.0.1:8123/"+route+"/",{waitUntil:"domcontentloaded",timeout:22000});
  assert.equal(res?.status(),200,route+" HTTP 200");
  await page.locator(".dossier-cover h2").waitFor({state:"visible",timeout:15000});
  const x=await page.evaluate(()=>{
   const root=document.querySelector(".editorial-dossier"),lab=document.querySelector(".story-atlas");
   const chapterCount=root.querySelectorAll(".dossier-chapter").length;
   const heading=root.querySelector(".dossier-cover h2");
   const para=root.querySelector(".dossier-chapter-copy p");
   const lead=root.querySelector(".dossier-lede");
   const role=root.querySelector(".dossier-role");
   const refs=root.querySelectorAll(".dossier-refs>div").length;
   const positions={editorial:root.getBoundingClientRect().top+window.scrollY,interactive:lab.getBoundingClientRect().top+window.scrollY};
   return {chapterCount,hasRole:!!role?.textContent.trim(),refs,title:heading.textContent,
    minHeading:parseFloat(getComputedStyle(heading).fontSize),
    minPara:parseFloat(getComputedStyle(para).fontSize),
    minLead:parseFloat(getComputedStyle(lead).fontSize),
    width:document.documentElement.scrollWidth,vw:document.documentElement.clientWidth,positions,metrics:root.querySelectorAll(".dossier-kpis>div").length,
    chart:root.querySelectorAll(".dossier-chart").length,source:root.querySelectorAll(".dossier-source-link,.dossier-source-private").length};
  });
  assert.ok(x.positions.editorial<x.positions.interactive,route+" evidence must precede decorative figures");
  assert.ok(x.chapterCount>=3,route+" at least three specific evidence chapters");
  assert.ok(x.refs>=2,route+" original figure crosswalk");
  assert.ok(x.hasRole,route+" ownership attribution");
  assert.ok(x.minHeading>=28,route+" readable heading");
  assert.ok(x.minPara>=16,route+" readable body copy");
  assert.ok(x.minLead>=17,route+" readable lead");
  assert.ok(x.metrics===3,route+" 3 scan metrics");
  assert.ok(x.source===1,route+" explicit provenance status");
  assert.ok(x.width<=x.vw+4,route+" no sitewide overflow");
  assert.deepEqual(errs,[],route+" JS errors");
  const text=(await page.locator(".editorial-dossier").innerText()).replace(/\s+/g," ");
  const must={
   "research/star":["Spearman","Iguodala","52.80"],
   "research/gref-rag":["Adurthi","1912","Local Refinement"],
   "research/mot":["57.6","0.42","Top-K"],
   "research/ram-gnn":["606","Abilities","Knowledge"],
   "research/mpr-citeg":["NLLB-200","270","50","10"],
   "projects/scienceon-mpr-citeg":["NLLB-200","270","50","10"],
   "projects/steel-rag":["2023","2024","Priority","Integrated"],
   "projects/blue-carbon":["RVI","NDVI","FAI"],
   "projects/alibaba-search":["QC","QI","0.8819"],
   "projects/bioai":["109","0.92","RFECV","SHAP"]
  }[route];
  for(const keyword of must)assert.ok(text.includes(keyword),route+" source detail missing: "+keyword);
  await page.locator(".dossier-cover").scrollIntoViewIfNeeded();
  const target=path.join("editorial-previews",route.replaceAll("/","-")+"-"+width+".png");
  await page.screenshot({path:target,animations:"disabled"});screens.push(target);
  console.log("PASS EDITORIAL",route,width,"chapters",x.chapterCount,"refs",x.refs,"font",x.minPara,"horizontal",x.width+"/"+x.vw);
 }catch(e){problems.push(route+" "+width+": "+String(e));console.error("FAIL EDITORIAL",route,width,String(e))}
 await page.close();
 }
}
await browser.close();
assert.deepEqual(problems,[],problems.join("\n"));
console.log("PASS: 10 source-grounded case studies × two viewports, no clipping/errors, 20 screenshots.");
