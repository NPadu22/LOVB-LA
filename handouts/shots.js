const {chromium}=require('playwright');
const OUT=__dirname+'/img/';
(async()=>{const fs=require('fs');fs.mkdirSync(OUT,{recursive:true});
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:375,height:812},colorScheme:'dark',deviceScaleFactor:2});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+require('path').resolve(__dirname,'..','LA Orbit Nutrition.html').replace(/ /g,'%20')+'');
await p.evaluate(()=>{const iso=d=>{const x=new Date();x.setDate(x.getDate()-d);return x.getFullYear()+"-"+String(x.getMonth()+1).padStart(2,"0")+"-"+String(x.getDate()).padStart(2,"0")};
 const r={sleepH:"8",sleepQ:4,sore:2,energy:4,mood:4,stress:2,note:""};const days={};
 for(const d of [3,2,1])days[iso(d)]={training:["Practice"],water:5,entries:[{id:"a"+d,occ:"Lunch",time:"12:00",what:"Rice bowl",notes:"From meal plan"}],prehab:[],ready:r,habits:{recover:true,sleep:true}};
 days[iso(0)]={training:["Practice"],water:4,entries:[{id:"t",occ:"Breakfast",time:"07:30",what:"Breakfast burrito",notes:"From meal plan"}],prehab:[],ready:r,habits:{}};
 localStorage.setItem('orb_journal',JSON.stringify({days}));localStorage.setItem('orb_patches',JSON.stringify(["firstlight","liftoff","fullorbit","galley"]));
 localStorage.setItem('orb_edu',JSON.stringify({weight:'',unit:'lb',numbers:false,goals:['Hydration'],stage:'none',cycle:'regular',learned:['c-fuel','a-when'],sweat:null,setup:true}));
 localStorage.setItem('orb_rems',JSON.stringify([{id:'r1',title:'Treatment with Emma',date:iso(0),time:'15:00',repeat:'none',note:'Right ankle'},{id:'r2',title:'Ankle prehab',date:iso(0),time:'14:30',repeat:'daily',note:'Before practice'}]));
 localStorage.setItem('orb_prefs',JSON.stringify({scheme:'space',bg:'stars',large:false}));
 localStorage.setItem('orb_installed','true');localStorage.setItem('orb_profile',JSON.stringify({name:'Jordan Lee',first:'Jordan',last:'Lee',sex:'female',welcomed:true,consentAt:'2026-11-26T10:00:00Z',position:'Outside hitter',num:'9',allergies:['Peanut'],other:'',ack:true,area:'sealbeach'}))});
await p.reload();await p.waitForTimeout(900);await p.evaluate(()=>document.fonts.ready);
// suppress install sheet / stamps / toasts for clean captures
await p.addStyleTag({content:'.ins-back,.pstamp,.toast{display:none!important}'});
const shot=async(name,fn,y=0)=>{await p.evaluate(fn);await p.waitForTimeout(450);await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(250);await p.screenshot({path:OUT+name+'.png'})};
await shot('home',()=>{tab='home';render()});
await shot('home2',()=>{tab='home';render()},640);
await shot('fuel',()=>{tab='fuel';fuelSeg='plan';render()});
await shot('road',()=>{tab='fuel';fuelSeg='road';render()});
await shot('learn',()=>{tab='learn';learnLesson=null;learnTab='path';render()});
await shot('me',()=>{tab='me';render()});
await shot('journal',()=>{tab='journal';render()});
await shot('checkin',()=>{tab='ready';rDraft=null;render()});
// Training room: empty state (as of today)
await shot('at-empty',()=>{tab='at';render()});
// Training room with sample announcements + sample program (illustrative)
await p.evaluate(()=>{const t=isoToday();CONFIG.atSheetCSV='x';SHEET.at={rows:[{when:t,tag:'Prehab',t:'New lower-leg block starts Monday',d:'Three days, pre- and post-practice. Find it under Your programs.'},{when:jShift(t,-1),tag:'Road trip',t:'Pack your bands for Houston',d:'Keep doing Day 1 and Day 2 on the road. Ask me for a hotel version.'}],fetched:''};
 
 CONFIG.programsSheetCSV='';AT_PROGRAMS.push({id:'lower-leg-block',name:'Lower-leg block',who:'Everyone',when:'Weeks 1–4',note:'',ex:[{n:'Single-leg balance',dose:'3 x 30 s each',cue:'Soft knee, eyes up',day:'Day 1',phase:'Pre-practice'},{n:'Ankle hops',dose:'2 x 20',cue:'Quick feet',day:'Day 1',phase:'Pre-practice'},{n:'Landing check',dose:'Every block jump',cue:'Land soft',day:'Day 1',phase:'Practice'},{n:'Calf raises',dose:'2 x 15',cue:'Slow down, 3 s',day:'Day 1',phase:'Post-practice'},{n:'Lateral band walks',dose:'2 x 10 m',cue:'',day:'Day 2',phase:'Pre-practice'},{n:'Wall sit',dose:'3 x 45 s',cue:'',day:'Day 3',phase:'Post-practice'}]});});
await shot('at-full',()=>{tab='at';render()});
await shot('at-full2',()=>{tab='at';render()},700);
await p.evaluate(()=>{CONFIG.liftsSheetCSV='x';SHEET.lift={rows:[{s:'Lift 1',who:'Everyone',block:'Preseason · Weeks 1-4',o:'A1',n:'Trap bar deadlift',sets:'4',reps:'5',int:'RPE 7',rest:'2-3 min',cue:'Brace',video:'',track:true,show:'yes'},{s:'Lift 1',who:'Everyone',block:'',o:'A2',n:'Box jump',sets:'4',reps:'3',int:'Max intent',rest:'',cue:'',video:'',track:false,show:'yes'},{s:'Lift 2',who:'Everyone',block:'',o:'A1',n:'Landmine press',sets:'4',reps:'6 each',int:'',rest:'',cue:'',video:'',track:true,show:'yes'},{s:'Conditioning',who:'Everyone',block:'',o:'1',n:'Bike sprints',sets:'8',reps:'15 s on / 45 s off',int:'',rest:'',cue:'',video:'',track:false,show:'yes'}]};scSel=null});
await p.evaluate(()=>{tab='sc';render()});await p.waitForTimeout(1200);await p.screenshot({path:OUT+'sc.png'});
await shot('lesson',()=>{tab='learn';learnLesson='a-concussion';render()});
console.log('errors:',errs.join(';')||'none');await b.close()})();
