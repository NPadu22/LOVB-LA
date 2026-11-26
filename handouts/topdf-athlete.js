const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});
await p.goto('file://'+__dirname+'/athlete.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1500);
const over=await p.evaluate(()=>[...document.querySelectorAll('.s')].map((s,i)=>{const r=s.getBoundingClientRect();const bad=[...s.querySelectorAll('*')].filter(e=>{const b=e.getBoundingClientRect();return b.width&&(b.bottom>r.bottom+1||b.right>r.right+1)&&!e.closest('.big')&&!e.classList.contains('big')});return bad.length?`slide ${i+1}: ${bad.slice(0,3).map(e=>e.tagName+'.'+e.className).join(',')}`:null}).filter(Boolean));
console.log('overflow:',over.length?over.join(' | '):'none');
await p.pdf({path:__dirname+'/Orbit-Performance-Athlete-Guide.pdf',width:'1280px',height:'720px',printBackground:true,preferCSSPageSize:true});
for(let i=0;i<14;i++){await p.evaluate(i=>document.querySelectorAll('.s')[i].scrollIntoView(),i);await p.screenshot({path:__dirname+`/ath-${String(i+1).padStart(2,'0')}.png`,clip:{x:0,y:await p.evaluate(i=>document.querySelectorAll('.s')[i].getBoundingClientRect().top+scrollY,i),width:1280,height:720},fullPage:true})}
await b.close()})();
