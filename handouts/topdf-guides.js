const {chromium}=require('playwright');
const NAMES={en:'Orbit-Performance-Athlete-Quick-Guide',ja:'Orbit-Performance-Athlete-Quick-Guide-JA',pt:'Orbit-Performance-Guia-Rapido-PT-BR'};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:816,height:1056}});
for(const L of ['en','ja','pt']){await p.goto('file://'+__dirname+'/guide-'+L+'.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1500);
const over=await p.evaluate(()=>[...document.querySelectorAll('.pg')].map((s,i)=>{const r=s.getBoundingClientRect(),foot=s.querySelector('.foot').getBoundingClientRect();const bad=[...s.querySelectorAll('.body *')].filter(e=>{const b=e.getBoundingClientRect();return b.height&&(b.bottom>foot.top-4||b.right>r.right+1)});return bad.length?`p${i+1}: +${(Math.max(...bad.map(e=>e.getBoundingClientRect().bottom))-foot.top).toFixed(0)}px`:null}).filter(Boolean));
console.log(L,'overflow:',over.length?over.join(' | '):'none');
await p.pdf({path:__dirname+'/'+NAMES[L]+'.pdf',width:'8.5in',height:'11in',printBackground:true,preferCSSPageSize:true});
for(let i=0;i<2;i++){const y=await p.evaluate(i=>document.querySelectorAll('.pg')[i].getBoundingClientRect().top+scrollY,i);await p.screenshot({path:__dirname+`/gd-${L}-${i+1}.png`,clip:{x:0,y,width:816,height:1056},fullPage:true})}}
await b.close()})();
