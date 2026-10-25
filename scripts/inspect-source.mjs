import {readFile,readdir,writeFile} from 'node:fs/promises';
const dir='docs/legacy-source';
for(const f of await readdir(dir)){
 if(!/\.(js|css)$/.test(f)) continue;const s=await readFile(`${dir}/${f}`,'utf8');
 const pats=f.endsWith('css')?[/@font-face\{[^}]+\}/g]:[/.{0,150}(?:fetch\(|formspree|web3forms|\/api\/|\.glb|\.gltf|Fuel|Captured|Please enter|Thank you|Your name|CylinderGeometry|LatheGeometry).{0,240}/g];
 for(const p of pats){const matches=[...s.matchAll(p)].map(x=>x[0]);if(matches.length) console.log(f,JSON.stringify(matches));}
}
