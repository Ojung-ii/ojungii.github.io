import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const routes = ["/","/research/","/projects/","/about/","/projects/view/?id=steel-rag","/projects/view/",
  "/research/star/","/research/gref-rag/","/research/mot/","/research/ram-gnn/","/research/mpr-citeg/",
  "/projects/steel-rag/","/projects/blue-carbon/","/projects/scienceon-mpr-citeg/",
  "/projects/alibaba-search/","/projects/bioai/","/404.html"];
const browser=await chromium.launch({headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
const errors=[],warnings=[];
await fs.mkdir("sitewide-previews",{recursive:true});
for(const route of routes){
 for(const width of [1440,768,390]){
  const lang=width===390?"en":"ko",theme=width===390?"dark":"light";
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
  page.on("pageerror",err=>errors.push(route+" "+width+": JS "+err.message));
  await page.addInitScript(({lang,theme})=>{
    try{localStorage.setItem("ojungii-language",lang);localStorage.setItem("ojungii-theme",theme)}catch{}
  },{lang,theme});
  const response=await page.goto("http://127.0.0.1:8123"+route,{waitUntil:"domcontentloaded",timeout:20000});
  if(response?.status()!==200){errors.push(route+" "+width+": HTTP "+response?.status());await page.close();continue;}
  const detail=(route.startsWith("/research/")&&route!=="/research/")||(route.startsWith("/projects/")&&route!=="/projects/"&&!route.startsWith("/projects/view/"));
  if(route==="/projects/view/?id=steel-rag")await page.locator("main .case-hero").first().waitFor({state:"visible",timeout:12000});
  if(route==="/projects/view/")await page.locator("main .notice").first().waitFor({state:"visible",timeout:12000});
  if(detail){
    try{await page.locator(".story-tab-title").first().waitFor({state:"visible",timeout:10000})}
    catch(e){errors.push(route+" "+width+": figure tabs missing: "+String(e));await page.close();continue;}
  }
  const audit=await page.evaluate(()=>{
    const hard=[],soft=[];
    const vw=document.documentElement.clientWidth,scroll=document.documentElement.scrollWidth;
    if(scroll>vw+4)hard.push("page width overflow: "+scroll+" > "+vw);
    const visible=(el)=>{const c=getComputedStyle(el),r=el.getBoundingClientRect();return c.display!=="none"&&c.visibility!=="hidden"&&r.width>1&&r.height>1};
    const label=el=>el.tagName.toLowerCase()+"."+String(el.className?.baseVal??el.className??"").trim().replace(/\s+/g,".").slice(0,65);
    const targetSelectors="h1,h2,h3,h4,.publication h3,.work-card h3,.bento-card h3,.thesis-card h3,.case-body p,.paper-prose-card p,.story-metric strong,.tag,.filter-button,.case-fact strong,.story-demo button";
    const elements=[...document.querySelectorAll(targetSelectors)].filter(visible);
    for(const el of elements){
      const c=getComputedStyle(el),r=el.getBoundingClientRect(),fs=parseFloat(c.fontSize),txt=(el.textContent||"").trim();
      if(!txt)continue;
      if(["H1","H2","H3","H4"].includes(el.tagName)&&fs<14)soft.push(label(el)+" unusually small heading "+fs);
      if(el.scrollWidth>el.clientWidth+7&&!el.closest(".story-storyboard"))soft.push(label(el)+" text wider than box by "+Math.round(el.scrollWidth-el.clientWidth)+"px "+txt.slice(0,34));
      if(/hidden|clip/.test(c.overflowX)&&el.scrollWidth>el.clientWidth+7)hard.push(label(el)+" visibly clipped text: "+txt.slice(0,35));
      if(r.width<20&&txt.length>2)soft.push(label(el)+" tiny container width "+Math.round(r.width));
    }
    for(const tab of document.querySelectorAll(".story-storyboard [data-scene]")){
      const meta=tab.querySelector(".story-tab-meta"),title=tab.querySelector(".story-tab-title"),count=tab.querySelector(".story-tab-index");
      if(!meta||!title||!count){hard.push("tab missing separated title/meta/counter");continue;}
      const r=tab.getBoundingClientRect(),m=meta.getBoundingClientRect(),t=title.getBoundingClientRect(),k=count.getBoundingClientRect();
      if(m.bottom>t.top-2)hard.push("figure tab label overlaps title "+title.textContent);
      if(t.bottom>k.top-1)hard.push("figure tab title overlaps index "+title.textContent);
      for(const item of [m,t,k]){
        if(item.left<r.left-3||item.right>r.right+3)hard.push("figure tab child exceeds card width "+title.textContent);
      }
      if(tab.scrollWidth>tab.clientWidth+3)hard.push("figure tab clipped horizontally "+title.textContent);
      if(parseFloat(getComputedStyle(title).fontSize)<14)hard.push("figure tab title below 14px "+title.textContent);
      if(r.width<180)hard.push("figure tab too narrow "+Math.round(r.width)+"px "+title.textContent);
    }
    const svgTexts=[...document.querySelectorAll(".story-svg-frame svg text")];
    for(const t of svgTexts){
      try{const svg=t.ownerSVGElement, box=t.getBBox(),v=svg.viewBox.baseVal;
        if(box.width>0&&(box.x+box.width>v.width+12||box.x<-12))soft.push("SVG text outside viewBox: "+t.textContent.slice(0,48));
      }catch{}
    }
    return {hard:hard.slice(0,30),soft:soft.slice(0,18),vw,scroll,headings:document.querySelectorAll("h1,h2,h3").length,tabs:document.querySelectorAll(".story-storyboard [data-scene]").length,svgOverflowCount:soft.filter(x=>x.includes("SVG")).length};
  });
  if(audit.hard.length)errors.push(...audit.hard.map(x=>route+" "+width+": "+x));
  if(audit.soft.length)warnings.push(...audit.soft.map(x=>route+" "+width+": "+x));
  if([1440,390].includes(width)){
    if(detail&&width===390){
      await page.evaluate(()=>{const el=document.querySelector(".story-storyboard");if(el){document.documentElement.style.scrollBehavior="auto";window.scrollTo(0,window.scrollY+el.getBoundingClientRect().top-110)}});await page.waitForTimeout(140);
      await page.screenshot({path:path.join("sitewide-previews",route.split("/").filter(Boolean).join("-")+"-tabs-390.png"),animations:"disabled",timeout:15000});
    }
    if(detail){await page.locator("[data-story-atlas]").scrollIntoViewIfNeeded();}
    const dest=path.join("sitewide-previews",(route==="/"?"home":route.replace(/^\/|\/$/g,"").replaceAll("/","-").replace(/[?=]/g,"-"))+"-"+width+".png");
    await page.screenshot({path:dest,animations:"disabled",timeout:15000});
  }
  console.log("QA",route,width,lang,theme,"tabs="+audit.tabs,"hard="+audit.hard.length,"warnings="+audit.soft.length,"horizontal="+audit.scroll+"/"+audit.vw);
  await page.close();
 }
}
await browser.close();
console.log("READABILITY_WARNINGS",JSON.stringify(warnings.slice(0,45)));
console.log("READABILITY_ERRORS",JSON.stringify(errors.slice(0,45)));
assert.deepEqual(errors,[],"Site-wide UI failures, including overflowing or overlapping figure labels");
console.log("PASS: 17 public route variants × 3 widths, 2 languages, 2 themes; 34 screenshot proofs.");
