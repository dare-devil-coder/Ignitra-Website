import { load } from 'cheerio';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const origin='https://www.ignitra.co.in';
const dir='docs/legacy-source';
await mkdir(dir,{recursive:true});
const html=await readFile('output/ignitra-source.html','utf8');
await writeFile(`${dir}/index.html`,html);
const $=load(html);
const urls=[...new Set($('script[src],link[rel=stylesheet]').map((_,e)=>$(e).attr('src')||$(e).attr('href')).get())];
const manifest=[];
for(const url of urls){const r=await fetch(new URL(url,origin));const b=Buffer.from(await r.arrayBuffer());const file=url.split('/').at(-1);await writeFile(`${dir}/${file}`,b);manifest.push({url:new URL(url,origin).href,file,bytes:b.length,sha256:createHash('sha256').update(b).digest('hex')});}
await writeFile(`${dir}/manifest.json`,JSON.stringify(manifest,null,2));
$('script,style,noscript').remove();
await writeFile('output/legacy-readable.html',$.html().replace(/></g,'>\n<'));
const summary={title:$('title').text(),sections:$('main > section').map((_,e)=>({id:$(e).attr('id'),text:$(e).text()})).get(),assets:[...new Set($('img').map((_,e)=>{const u=new URL($(e).attr('src'),origin);return u.searchParams.get('url')||u.pathname}).get())],links:$('a').map((_,e)=>({text:$(e).text(),href:$(e).attr('href'),target:$(e).attr('target')})).get(),forms:$('form').length};
await writeFile('output/source-summary.json',JSON.stringify(summary,null,2));console.log(JSON.stringify(summary,null,2));
