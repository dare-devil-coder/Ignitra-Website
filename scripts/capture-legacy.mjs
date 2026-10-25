import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
const dir='docs/legacy-screenshots'; await mkdir(dir,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const requests=[]; const errors=[];
page.on('request',r=>requests.push({url:r.url(),method:r.method(),type:r.resourceType()}));page.on('pageerror',e=>errors.push(e.message));
await page.goto('https://www.ignitra.co.in/',{waitUntil:'networkidle'});
await page.waitForTimeout(2200);
await writeFile('output/live-initial.html',await page.content());
await writeFile('output/live-buttons.json',JSON.stringify(await page.locator('button').evaluateAll(es=>es.map(e=>({text:e.textContent,aria:e.getAttribute('aria-label'),role:e.getAttribute('role'),visible:!!(e.offsetWidth||e.offsetHeight)}))),null,2));
for(const width of [375,768,1440,1920]){
 await page.setViewportSize({width,height:1000});await page.goto('https://www.ignitra.co.in/',{waitUntil:'networkidle'});
 await page.waitForTimeout(2200);
 for(let y=0;y<await page.evaluate(()=>document.body.scrollHeight);y+=700){await page.evaluate(y=>window.scrollTo(0,y),y);await page.waitForTimeout(180);}
 await page.waitForTimeout(1000);await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(500);
 await page.screenshot({path:`${dir}/${width}.png`,fullPage:true});
 await writeFile(`output/live-${width}.html`,await page.content());
}
await page.setViewportSize({width:1440,height:1000});
await page.getByRole('link',{name:'Book a Consultation',exact:true}).first().click();await page.waitForTimeout(500);
await writeFile('output/consultation.html',await page.content());
await page.screenshot({path:`${dir}/consultation-1440.png`});
console.log('DIALOG',await page.locator('[role=dialog]').innerText().catch(()=>page.locator('form').innerText()));
console.log('FORMS',await page.locator('form').evaluateAll(es=>es.map(e=>({action:e.getAttribute('action'),method:e.getAttribute('method'),fields:[...e.querySelectorAll('input,textarea,select,button')].map(x=>({tag:x.tagName,name:x.name,type:x.type,text:x.textContent,placeholder:x.getAttribute('placeholder'),required:x.required}))}))));
await writeFile('output/legacy-network.json',JSON.stringify({requests,errors},null,2));
await browser.close();
