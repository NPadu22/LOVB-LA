// Renders the Orbit Performance app icon at the sizes Pages needs.
// Usage: node scripts/render-icons.js   (writes icon-180/192/512.png to the repo root)
const {chromium}=require('playwright');
const path=require('path');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
 <defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B132B"/><stop offset=".62" stop-color="#1D2B52"/><stop offset="1" stop-color="#FF5E1A"/></linearGradient>
 <path id="top" d="M18 50a32 32 0 0 1 64 0"/><path id="bot" d="M11.5 50a38.5 38.5 0 0 0 77 0"/></defs>
 <rect width="100" height="100" fill="#0B132B"/>
 <circle cx="50" cy="50" r="48" fill="#FFFFFF"/><circle cx="50" cy="50" r="44.5" fill="url(#pg)"/>
 <circle cx="50" cy="50" r="46.3" fill="none" stroke="#0B132B" stroke-width="1.4" stroke-dasharray="2.2 1.6"/>
 <g fill="#fff" opacity=".8"><circle cx="30" cy="40" r=".9"/><circle cx="70" cy="34" r=".7"/><circle cx="64" cy="46" r=".6"/><circle cx="36" cy="30" r=".6"/></g>
 <circle cx="50" cy="57" r="11" fill="#FFFFFF"/><path d="M39.5 54.2c5.5 .9 12-1 16.5-6.4M45 67.1c0-7.3 4.6-12.8 11.9-15.6M50.5 46c-2.8 5.5-1.8 12.8 3.7 21" stroke="#0B132B" stroke-width="1.2" fill="none"/>
 <ellipse cx="50" cy="57" rx="26" ry="7.4" fill="none" stroke="#FFC857" stroke-width="1.5" transform="rotate(-18 50 57)"/>
 <circle cx="72.7" cy="48.6" r="2.4" fill="#FFC857"/>
 <text font-family="Archivo,'Arial Black',Arial,sans-serif" font-stretch="125%" font-size="9" font-weight="800" fill="#FFFFFF" letter-spacing="1.6"><textPath href="#top" startOffset="50%" text-anchor="middle">LA ORBIT</textPath></text>
 <text font-family="Archivo,'Arial Black',Arial,sans-serif" font-stretch="125%" font-size="7.2" font-weight="800" fill="#FFFFFF" letter-spacing="1.2"><textPath href="#bot" startOffset="50%" text-anchor="middle">PERFORMANCE</textPath></text>
</svg>`;
(async()=>{
  const b=await chromium.launch();
  for(const n of [180,192,512]){
    const p=await b.newPage({viewport:{width:n,height:n}});
    await p.setContent(`<!doctype html><html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&display=swap"><style>html,body{margin:0;width:${n}px;height:${n}px}</style></head><body>${svg}</body></html>`);
    await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(800);
    await p.screenshot({path:path.join(__dirname,'..',`icon-${n}.png`)});
    await p.close();
  }
  await b.close();
})();
