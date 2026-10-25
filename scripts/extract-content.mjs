import {chromium} from 'playwright';
import {writeFile,mkdir,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const outputDir=process.argv[2]||'content';await mkdir(outputDir,{recursive:true});if(await readFile(outputDir+'/legacy-snapshot.json').then(()=>true,()=>false))throw new Error('Output snapshot already exists; source recapture requires a new evidence directory.');
const root='https://www.ignitra.co.in';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
await page.addInitScript(()=>{sessionStorage.setItem('ignitra-intro','1');localStorage.setItem('ignitra-theme','dark')});
await page.goto(root,{waitUntil:'networkidle'});await page.waitForTimeout(1500);
const sections=[['skip','body > a[data-skip-link]'],['navigation','body > header'],['hero','main > section:first-child'],...['problem','difference','services','engine','why','start','cta'].map(id=>[id,`#${id}`]),['footer','body > footer'],['mobile-actions','body > div:has(> a[data-consult])'],['intro','[data-curtain]'],['consultation','dialog']];
// Read-only content extraction. Flat records preserve content order, never legacy DOM layout/classes.
const collect = (rootElement) => {
 const normal=s=>s.replace(/\s+/g,' ').trim();
 const shown=e=>{for(let a=e;a;a=a.parentElement){const s=getComputedStyle(a);if(s.display==='none'||s.visibility==='hidden'||Number(s.opacity)===0||a.hidden)return false;}return true;};
 const rendered=e=>{const tr=getComputedStyle(e).textTransform;const t=normal(e.textContent||'');return tr==='uppercase'?t.toUpperCase():tr==='lowercase'?t.toLowerCase():t;};
 const attrs=e=>Object.fromEntries([...e.attributes].filter(a=>['aria-label','title','alt','href','target','rel','name','type','placeholder','required','minlength','maxlength','pattern','autocomplete','inputmode','role'].includes(a.name)).map(a=>[a.name,a.value]));
 const records=[];
 const visit=e=>{
  if(e.nodeType===3){if(normal(e.textContent))records.push({kind:'text',text:normal(e.textContent),displayText:(()=>{const t=getComputedStyle(e.parentElement).textTransform;return t==='uppercase'?normal(e.textContent).toUpperCase():t==='lowercase'?normal(e.textContent).toLowerCase():normal(e.textContent)})(),visible:shown(e.parentElement)});return;}
  if(e.nodeType!==1||['SCRIPT','STYLE','NOSCRIPT','CANVAS','NEXT-ROUTE-ANNOUNCER'].includes(e.tagName))return;
  const tag=e.tagName.toLowerCase();
  if(['a','img','button','input','textarea'].includes(tag)||/^h[1-6]$/.test(tag)){
   records.push({kind:tag,text:tag==='img'||tag==='input'?'':normal(e.textContent),displayText:tag==='img'||tag==='input'?'':rendered(e),attributes:attrs(e),...(tag==='img'?{source:(()=>{const u=new URL(e.getAttribute('src'),location.href);return u.searchParams.get('url')||u.pathname})(),width:e.naturalWidth,height:e.naturalHeight}:{}),...(tag==='a'?{images:[...e.querySelectorAll('img')].map(x=>({alt:x.getAttribute('alt'),source:(()=>{const u=new URL(x.getAttribute('src'),location.href);return u.searchParams.get('url')||u.pathname})(),visible:shown(x)}))}:{}),visible:shown(e)});return;
  }
  for(const c of e.childNodes)visit(c);
 };
 visit(rootElement);return records;
};
const snapshots=[];let contentSections;
for(const width of [375,1440])for(const theme of ['dark','light']){
 await page.setViewportSize({width,height:1000});await page.evaluate(t=>{document.documentElement.dataset.theme=t;localStorage.setItem('ignitra-theme',t)},theme);
 await page.waitForTimeout(350);
 for(let y=0;y<await page.evaluate(()=>document.body.scrollHeight);y+=550){await page.evaluate(y=>window.scrollTo(0,y),y);await page.waitForTimeout(120);}
 await page.waitForTimeout(1500);
 for(const heading of await page.locator('main h1,main h2,main h3').all()){await heading.scrollIntoViewIfNeeded();await page.waitForTimeout(180);}
 await page.waitForTimeout(1000);await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(500);
 const hiddenHeadings=await page.locator('main h1,main h2,main h3').evaluateAll(es=>es.filter(e=>{for(let a=e;a;a=a.parentElement){const s=getComputedStyle(a);if(s.display==='none'||s.visibility==='hidden'||Number(s.opacity)===0)return true}return false}).map(e=>e.textContent));
 if(hiddenHeadings.length)throw new Error('Incomplete source capture: '+JSON.stringify(hiddenHeadings));
 const result=[];
 for(const [id,selector] of sections){const loc=page.locator(selector);if(await loc.count()!==1){console.log('SKIP selector',id,await loc.count());continue;} const items=await loc.evaluate(collect);result.push({id,items});}
 if(!contentSections)contentSections=result.map(s=>({id:s.id,items:s.items.map((item,i)=>({...item,id:`${s.id}-${String(i+1).padStart(3,'0')}`,profiles:{}}))}));
 for(const section of result){const target=contentSections.find(s=>s.id===section.id);for(let i=0;i<section.items.length;i++){target.items[i].profiles[`${width}-${theme}`]=section.items[i].visible;}}
 snapshots.push({width,theme,sections:result.map(s=>({id:s.id,text:s.items.filter(x=>x.visible).map(x=>x.displayText).filter(Boolean).join(' '),links:s.items.filter(x=>x.kind==='a'&&x.visible).map(x=>({text:x.displayText,href:x.attributes.href,target:x.attributes.target||null})),images:s.items.flatMap(x=>x.kind==='img'&&x.visible?[x.attributes.alt??null]:x.kind==='a'&&x.visible?(x.images||[]).filter(y=>y.visible).map(y=>y.alt):[])}))});
}
await page.setViewportSize({width:1440,height:1000});
const head=await page.evaluate(()=>({title:document.title,lang:document.documentElement.lang,meta:[...document.head.querySelectorAll('meta')].filter(e=>e.name!=='next-size-adjust').map(e=>Object.fromEntries([...e.attributes].map(a=>[a.name,a.value]))),links:[...document.head.querySelectorAll('link[rel=canonical],link[rel=manifest],link[rel=icon],link[rel=apple-touch-icon]')].map(e=>Object.fromEntries([...e.attributes].map(a=>[a.name,a.value]))),structuredData:[...document.querySelectorAll('script[type="application/ld+json"]')].map(e=>JSON.parse(e.textContent))}));
const states=[];
await page.getByRole('link',{name:'Book a Consultation',exact:true}).first().click();
states.push({name:'consultation-open',items:await page.locator('dialog').evaluate(collect)});
await page.getByRole('combobox').click();states.push({name:'consultation-options',items:await page.locator('dialog').evaluate(collect)});
await page.keyboard.press('Escape');await page.getByRole('button',{name:'Close',exact:true}).click();
for(let i=0;i<7;i++){await page.locator('#difference [role=button]').nth(i).click({force:true});states.push({name:`loop-${i+1}`,items:await page.locator('#difference').evaluate(collect)});}
await page.setViewportSize({width:375,height:1000});await page.getByRole('button',{name:'Open menu',exact:true}).click();
states.push({name:'mobile-menu',items:await page.locator('#mobile-menu').evaluate(collect)});
const content={schemaVersion:1,source:{url:root,capturedAt:new Date().toISOString(),scope:'One public route; exact copy, metadata and observed state inventory. Legacy code is not imported.'},pages:[{route:'/',head,sections:contentSections}],states,clientMessages:{serviceRequired:'Please choose an option.',sending:'Sending…',thanks:'Thank you',thanksSeparator:', ',thanksEnd:'.',success:"Your request has reached our team. We'll be in touch shortly to set up your consultation.",done:'Done'},backend:{type:'next-server-action',name:'submitConsultation',observedActionId:'6049c1ee9c657a91b25e7d112c2419ecc73b3bfd5b',status:'Private server implementation and server-generated validation messages unavailable from public site. No live submission was made.'}};
const json=JSON.stringify(content,null,2)+'\n';await writeFile(outputDir+'/site-content.json',json);
const snapshot={schemaVersion:1,source:root,capturedAt:new Date().toISOString(),normalization:'Collapse whitespace only; preserve source CSS letter case in displayText. Default reduced-motion repeat-visit profile. Additional interactive states stored independently.',profiles:snapshots,states,head};
await writeFile(outputDir+'/legacy-snapshot.json',JSON.stringify(snapshot,null,2)+'\n');
await writeFile(outputDir+'/allowed-diffs.json',JSON.stringify({themeToggleAccessibleLabels:['Switch to light theme','Switch to dark theme'],technicalAttributes:['class','style','data-content-id','data-content-section','aria-pressed'],contentDifferences:[]},null,2)+'\n');
await writeFile(outputDir+'/lock.sha256',createHash('sha256').update(await readFile(outputDir+'/legacy-snapshot.json')).digest('hex')+'\n');
console.log('CONTENT',contentSections.map(s=>[s.id,s.items.length]),'STATES',states.map(s=>s.name));
await browser.close();
