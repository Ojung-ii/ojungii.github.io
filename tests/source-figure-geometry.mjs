import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "playwright";
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
const errors=[];
await fs.mkdir("source-figure-previews",{recursive:true});
for(const width of [1440,768,390]){
 for(const theme of ["light","dark"]){
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
  page.on("pageerror",error=>errors.push("JS "+width+" "+theme+": "+error.message));
  await page.addInitScript((theme)=>{localStorage.setItem("ojungii-theme",theme);localStorage.setItem("ojungii-language","ko")},theme);
  try{
   await page.goto("http://127.0.0.1:8123/projects/steel-rag/",{waitUntil:"domcontentloaded"});
   await page.locator("#steel-source-workflow [data-steel-flow] button").first().waitFor();
   assert.equal(await page.locator("#steel-source-workflow [data-steel-flow] button").count(),4);
   assert.ok((await page.locator("#steel-source-workflow [data-steel-detail]").innerText()).includes("Human Process"));
   await page.locator("[data-steel-phase='after']").click();
   assert.equal(await page.locator("#steel-source-workflow [data-steel-flow] button").count(),7);
   await page.locator("[data-steel-step='5']").click();
   assert.ok((await page.locator("[data-steel-detail]").innerText()).includes("Priority"));
   assert.equal(await page.locator("[data-steel-phase='after']").getAttribute("aria-selected"),"true");
   if(width!==768)await page.locator(".steel-source-story").screenshot({path:"source-figure-previews/steel-2024-"+width+"-"+theme+".png",animations:"disabled"});
   await page.locator("[data-steel-phase='before']").click();
   if(width!==768)await page.locator(".steel-source-story").screenshot({path:"source-figure-previews/steel-2023-"+width+"-"+theme+".png",animations:"disabled"});
   let o=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,inner:document.documentElement.clientWidth}));
   assert.ok(o.scroll<=o.inner+4,"Steel page horizontal overflow "+o.scroll+"/"+o.inner);
   console.log("PASS STEEL",width,theme);
   await page.goto("http://127.0.0.1:8123/research/star/",{waitUntil:"domcontentloaded"});
   await page.locator("[data-lorentz-canvas] circle").first().waitFor();
   const initial=await page.locator("[data-lorentz-expansion]").textContent();
   const initialNodes=await page.locator("[data-lorentz-canvas] circle").count();
   await page.locator("[data-depth]").evaluate(el=>{el.value="6";el.dispatchEvent(new Event("input",{bubbles:true}))});
   const moreNodes=await page.locator("[data-lorentz-canvas] circle").count();
   assert.ok(moreNodes>initialNodes,"Deeper hierarchy should add nodes");
   const deeper=await page.locator("[data-lorentz-expansion]").textContent();
   assert.notEqual(deeper,initial,"Circumference ratio must change with depth");
   assert.equal(await page.locator("[data-lorentz-curvature-label]").textContent(),"K = −1.0 ("+"모든 깊이에서 일정"+")");
   await page.locator("[data-curvature]").evaluate(el=>{el.value="1.6";el.dispatchEvent(new Event("input",{bubbles:true}))});
   assert.ok((await page.locator("[data-lorentz-curvature-label]").textContent()).includes("−1.6"));
   if(width!==768)await page.locator(".lorentz-explorer").screenshot({path:"source-figure-previews/star-lorentz-"+width+"-"+theme+".png",animations:"disabled"});
   await page.locator("[data-lorentz-reset]").click();
   assert.equal(await page.locator("[data-depth]").inputValue(),"4");
   assert.equal(Number(await page.locator("[data-curvature]").inputValue()),1.0);
   o=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,inner:document.documentElement.clientWidth}));
   assert.ok(o.scroll<=o.inner+4,"StAR horizontal overflow "+o.scroll+"/"+o.inner);
   console.log("PASS LORENTZ",width,theme);
  }catch(error){errors.push(width+" "+theme+" "+String(error))}
  await page.close();
 }
}
await browser.close();
assert.deepEqual(errors,[],errors.join("\n"));
console.log("PASS: Steel source workflows + StAR hyperbolic 3D at 3 viewports / 2 themes");