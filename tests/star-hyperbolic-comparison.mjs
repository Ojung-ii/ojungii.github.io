import assert from "node:assert/strict";
import fs from "node:fs/promises";
import {chromium} from "playwright";
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
const errors=[];
await fs.mkdir("source-figure-previews",{recursive:true});
for(const width of [1440,768,390]){
 for(const language of ["ko","en"]){
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
  page.on("pageerror",err=>errors.push(width+" "+language+" script: "+err.message));
  try{
   await page.addInitScript(lang=>{localStorage.setItem("ojungii-language",lang)},language);
   const response=await page.goto("http://127.0.0.1:8123/research/star/",{waitUntil:"domcontentloaded",timeout:15000});
   assert.equal(response.status(),200);
   const root=page.locator('[data-story-atlas="star"]');
   await root.locator("[data-star-comparison]").waitFor({state:"visible",timeout:12000});
   const snapshot=async()=>{
    const res=await root.evaluate(el=>{
      const demo=el.querySelector(".story-demo"),count=Number(demo?.querySelector("[data-count]")?.textContent);
      const compare=demo?.querySelector("[data-star-comparison]");
      const cards=compare?.querySelectorAll(".story-star-space");
      const meters=compare?.querySelectorAll(".story-star-meter");
      const active=Number(demo?.querySelector("[data-value]")?.textContent);
      const ratio=parseFloat(compare?.querySelector(".story-star-evidence-heading strong")?.textContent||"");
      const msg=compare?.querySelector(".story-star-caveat")?.textContent||"";
      return {count,active,ratio,cards:cards?.length||0,meters:meters?.length||0,
        diagrams:compare?.querySelectorAll("svg").length||0,
        label:demo?.querySelector(".story-demo-header strong")?.textContent||"",
        msg,width:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth,
        textMin:getComputedStyle(compare?.querySelector(".story-star-evidence-heading>span")).fontSize};
    });
    assert.ok(res.width<=res.viewport+4,"horizontal page overflow: "+JSON.stringify(res));
    assert.equal(res.cards,2,"Euclidean and hyperbolic diagrams are both present");
    assert.equal(res.meters,2,"both measured circumferences visibly compared");
    assert.equal(res.diagrams,2);
    assert.ok(parseFloat(res.textMin)>=14,"comparison must be readable");
    assert.ok(res.msg.includes(language==="ko"?"Lorentz":"Lorentz"));
    return res;
   };
   let state=await snapshot();
   assert.equal(state.active,4,"starts at depth 4");
   assert.equal(state.count,16,"four levels have 16 leaves");
   assert.ok(state.ratio>1.9,"hyperbolic circumference exceeds Euclidean at depth 4");
   const range=root.locator(".story-demo input[data-range]");
   await range.evaluate(el=>{el.value="6";el.dispatchEvent(new Event("input",{bubbles:true}))});
   state=await snapshot();
   assert.equal(state.active,6);
   assert.equal(state.count,64);
   assert.equal(await root.locator(".story-storyboard [data-scene]").count(),3,"depth slider must not destroy research figure tabs");
   assert.equal(await root.locator(".story-demo [data-count]").textContent(),"64","only the leaf counter updates");
   const correct=Math.sinh(.56*6)/(.56*6);
   assert.ok(Math.abs(state.ratio-correct)<.015,"analytic sinh(r)/r circumference must match");
   assert.ok(state.ratio>4,"must visibly explain space growth, not merely grow a tree");
   await root.locator(".story-demo").screenshot({path:"source-figure-previews/star-why-hyperbolic-"+width+"-"+language+".png",animations:"disabled",timeout:12000});
   const outer=await page.locator("#star-lorentz-explorer").count();
   assert.equal(outer,1,"Lorentz 3D explainer remains available separately");
   console.log("PASS STAR COMPARISON",width,language,"depth",state.active,"leaves",state.count,"ratio",state.ratio);
  }catch(e){errors.push(width+" "+language+": "+String(e));console.error("FAIL STAR COMPARISON",width,language,e.message)}
  await page.close();
 }
}
await browser.close();
assert.deepEqual(errors,[],errors.join("\n"));
console.log("PASS StAR hyperbolic-vs-Euclidean comparison and mobile evidence charts.");
