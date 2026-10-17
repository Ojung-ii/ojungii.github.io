
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const routes=[
  "research/star","research/gref-rag","research/mot","research/ram-gnn","research/mpr-citeg",
  "projects/steel-rag","projects/blue-carbon","projects/scienceon-mpr-citeg","projects/alibaba-search","projects/bioai"
];
const browser=await chromium.launch({headless:true,args:["--disable-dev-shm-usage","--no-sandbox"]});
await fs.mkdir("design-previews",{recursive:true});
const issues=[];
for(const route of routes){
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
  const errs=[];
  page.on("pageerror",e=>errs.push(e.message));
  const res=await page.goto("http://127.0.0.1:8123/"+route+"/",{waitUntil:"domcontentloaded"});
  assert.equal(res?.status(),200,route+" must be served");
  const shell=page.locator("[data-story-atlas] .story-shell");
  await shell.waitFor({state:"visible",timeout:12000});
  const controls=page.locator("[data-story-atlas] .story-storyboard button[data-scene]");
  const figureCount=await controls.count();
  assert.ok(figureCount>=2,route+" must have multiple paper figures");
  assert.ok(await page.locator("[data-story-atlas] svg").count()>0,route+" must render SVGs");
  assert.equal(await page.locator("[data-story-atlas] .story-player").count(),1,route+" must have figure player");
  // Controls must show a newly selected step and update the visual.
  await page.locator("[data-step='1']").first().click();
  assert.equal(await page.locator('[data-scene="1"]').first().getAttribute("aria-selected"),"true",route+" next control");
  await page.locator("[data-step='-1']").first().click();
  assert.equal(await page.locator('[data-scene="0"]').first().getAttribute("aria-selected"),"true",route+" previous control");
  // Demos are intentionally contextual: if present, they need a real response to click.
  const interactive=page.locator("[data-story-atlas] .story-demo [data-choice]").first();
  if(await interactive.count()){
    await interactive.click();
    assert.equal(await interactive.getAttribute("aria-pressed"),"true",route+" choice");
  }
  // KO / EN and light / dark are existing portfolio controls and must survive initialization.
  await page.locator("#language-toggle").click();
  assert.equal(await page.locator("html").getAttribute("data-language"),"en",route+" language switch");
  await page.locator("[data-story-atlas] .story-shell").waitFor();
  assert.ok((await page.locator("[data-story-atlas] .story-text h3").innerText()).length>5);
  await page.locator("#theme-toggle").click();
  assert.equal(await page.locator("html").getAttribute("data-theme"),"dark",route+" theme switch");
  await page.locator("[data-story-atlas]").scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join("design-previews",route.replaceAll("/","-")+"-"+width+".png"),animations:"disabled"});
  const dimensions=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth}));
  if(dimensions.scrollWidth>dimensions.viewport+5)issues.push(route+" "+width+" horizontal overflow: "+JSON.stringify(dimensions));
  if(errs.length)issues.push(route+" "+width+" JS errors: "+errs.join(" | "));
  console.log("PASS",route,width,"figures",figureCount,"scroll",JSON.stringify(dimensions));
  await page.close();
 }
}
await browser.close();
assert.deepEqual(issues,[],"Site visual/runtime issues:\n"+issues.join("\n"));
console.log("PASS all 10 pages at desktop/mobile with language, theme, and figure controls.");
