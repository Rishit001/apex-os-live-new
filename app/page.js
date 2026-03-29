"use client";





import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────────────────────────────────────
const makeCSS = (accent) => {
  // Convert hex to rgb for rgba() usage
  const hex = accent.replace('#','');
  const r = parseInt(hex.substring(0,2),16);
  const g = parseInt(hex.substring(2,4),16);
  const b = parseInt(hex.substring(4,6),16);
  const a1 = `rgba(${r},${g},${b},0.1)`;
  const a2 = `rgba(${r},${g},${b},0.22)`;
  const a3 = `rgba(${r},${g},${b},0.4)`;
  return `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#05070D;--s1:#090C14;--s2:#0F1220;--s3:#161928;--s4:#1C2033;
  --b1:#1E2235;--b2:#262A40;--t1:#E8EAF2;--t2:#7B82A0;--t3:#3D4260;
  --a:${accent};--a1:${a1};--a2:${a2};--a3:${a3};
  --green:#00E676;--red:#FF3B3B;--amber:#FF9800;--cyan:#00E5FF;--purple:#B388FF;
  --sidebar:236px;--topbar:44px;--r:6px;
  --fd:'Syne',sans-serif;--fm:'DM Mono',monospace;--fb:'Instrument Sans',sans-serif;
}
body{font-family:var(--fb);background:var(--bg);color:var(--t1);min-height:100vh;overflow-x:hidden}
body::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;
  background-image:linear-gradient(var(--b1) 1px,transparent 1px),linear-gradient(90deg,var(--b1) 1px,transparent 1px);
  background-size:44px 44px;opacity:.15}
::-webkit-scrollbar{width:3px;height:3px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--b2);border-radius:2px}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes ticker{from{transform:translateX(100vw)}to{transform:translateX(-100%)}}
@keyframes notifIn{0%{opacity:0;transform:translateX(110%)}10%{opacity:1;transform:translateX(0)}85%{opacity:1}100%{opacity:0;transform:translateX(110%)}}
@keyframes glow{0%,100%{box-shadow:0 0 8px var(--a2)}50%{box-shadow:0 0 24px var(--a2),0 0 48px var(--a1)}}
.fu{animation:fadeUp .32s cubic-bezier(.16,1,.3,1) both}
.fi{animation:fadeIn .22s ease both}
.pulse{animation:pulse 2s ease-in-out infinite}
.card{background:var(--s1);border:1px solid var(--b1);border-radius:var(--r);position:relative;overflow:hidden}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--b2),transparent)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:8px 16px;border-radius:var(--r);font-family:var(--fd);font-size:12px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;cursor:pointer;border:none;transition:all .14s;user-select:none}
.btn-a{background:var(--a);color:#060500}
.btn-a:hover{filter:brightness(1.12)}
.btn-a:disabled{opacity:.4;cursor:not-allowed}
.btn-g{background:var(--s3);color:var(--t2);border:1px solid var(--b2)}
.btn-g:hover{background:var(--s4);color:var(--t1);border-color:var(--t3)}
.btn-g:disabled{opacity:.4;cursor:not-allowed}
.input{width:100%;padding:9px 12px;background:var(--s2);border:1px solid var(--b1);border-radius:var(--r);color:var(--t1);font-family:var(--fb);font-size:13px;outline:none;transition:border-color .14s}
.input::placeholder{color:var(--t3)}
.input:focus{border-color:var(--a)}
select.input{cursor:pointer;appearance:none}
textarea.input{resize:vertical;min-height:72px;line-height:1.6}
.tag{display:inline-flex;align-items:center;padding:2px 7px;border-radius:3px;font-family:var(--fm);font-size:10px;background:var(--s3);color:var(--t3);border:1px solid var(--b1)}
.tg{background:var(--a1);color:var(--a);border-color:var(--a2)}
.tc{background:rgba(0,229,255,.1);color:#00E5FF;border-color:rgba(0,229,255,.25)}
.tgreen{background:rgba(0,230,118,.1);color:#00E676;border-color:rgba(0,230,118,.2)}
.tred{background:rgba(255,59,59,.1);color:#FF3B3B;border-color:rgba(255,59,59,.2)}
.tamb{background:rgba(255,152,0,.1);color:#FF9800;border-color:rgba(255,152,0,.2)}
.tpur{background:rgba(179,136,255,.1);color:#B388FF;border-color:rgba(179,136,255,.2)}
.live{width:7px;height:7px;border-radius:50%;background:var(--green);box-shadow:0 0 7px var(--green);animation:pulse 2s infinite;flex-shrink:0}
.stat{font-family:var(--fd);font-size:26px;font-weight:800;letter-spacing:-.02em;line-height:1}
.sh{font-family:var(--fm);font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--t3)}
.kcard{background:var(--s2);border:1px solid var(--b1);border-radius:var(--r);padding:12px;transition:border-color .14s}
.kcard:hover{border-color:var(--b2)}
.notif{position:fixed;top:56px;right:16px;z-index:9999;background:var(--s2);border:1px solid var(--b2);border-left:3px solid var(--a);border-radius:var(--r);padding:12px 16px;min-width:270px;animation:notifIn 4s ease forwards;box-shadow:0 8px 32px rgba(0,0,0,.5)}
.xpt{height:3px;background:var(--s3);border-radius:2px;overflow:hidden}
.xpf{height:100%;border-radius:2px;transition:width 1s cubic-bezier(.16,1,.3,1)}
`;
};

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_CONFIG = {
  brandName: "RAWGROWTH",
  tagline: "AI Operating System",
  accentColor: "#E8B84B",
  agents: {
    APEX:   { name:"APEX",   role:"Commander / COO",    icon:"◈", color:"#E8B84B" },
    ORACLE: { name:"ORACLE", role:"Research & Intel",   icon:"◉", color:"#B388FF" },
    PULSE:  { name:"PULSE",  role:"Content Director",   icon:"◎", color:"#FF9800" },
    CIPHER: { name:"CIPHER", role:"Sales & Revenue",    icon:"◆", color:"#FF3B3B" },
    FORGE:  { name:"FORGE",  role:"Developer",          icon:"⬡", color:"#00E5FF" },
    VAULT:  { name:"VAULT",  role:"Finance & Security", icon:"▣", color:"#00E676" },
    ECHO:   { name:"ECHO",   role:"Client Success",     icon:"◇", color:"#FF6D00" },
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// AGENT SYSTEM PROMPTS
// ─────────────────────────────────────────────────────────────────────────────
const getSysPrompt = (agentId, cfg) => {
  const a = cfg.agents[agentId];
  const brand = cfg.brandName;
  const prompts = {
    APEX:   `You are ${a.name}, the Commander and COO of ${brand}'s AI operating system. You orchestrate all agents, execute strategy, and turn vision into action. Think in systems. Speak decisively. Structure responses with clear headers and numbered steps. Be direct and action-oriented.`,
    ORACLE: `You are ${a.name}, the Research & Intelligence agent for ${brand}. You analyze markets, competitors, content trends, and surface actionable intel. Speak in data. Flag speculation. Use bullet points and specific numbers.`,
    PULSE:  `You are ${a.name}, the Content Director for ${brand}. You write Instagram Reels scripts, YouTube scripts, hooks, captions. Write in the founder's raw, authentic voice — real talk, no fluff. Format scripts as: HOOK | BODY | CTA. Give 3 variations for Reels.`,
    CIPHER: `You are ${a.name}, the Sales & Revenue agent for ${brand}. You handle sales copy, VSLs, DM sequences, objection handling, CRM strategy. Your copy converts. Be direct, benefit-driven, psychologically sharp.`,
    FORGE:  `You are ${a.name}, the Developer agent for ${brand}. You build n8n workflows, APIs, Supabase databases, automations. Speak in code. Give actual steps, pseudocode, or real code blocks. Be technical and precise.`,
    VAULT:  `You are ${a.name}, the Finance & Security agent for ${brand}. Track costs, optimize budgets, forecast revenue. Think in ROI. Quantify everything. Use tables for financial data.`,
    ECHO:   `You are ${a.name}, the Client Success agent for ${brand}. Handle onboarding, community management, client health, retention. Be proactive and solutions-focused. Create templates and sequences that make clients love you.`,
  };
  return prompts[agentId] || prompts.APEX;
};

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT DATA
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_TASKS = [
  { id:"t1", title:"Weekly Competitor Scrape",        agent:"ORACLE", status:"in_progress", priority:"high",   created:"2026-03-01", desc:"Scrape top 10 competitor IG & YT for hooks and content patterns." },
  { id:"t2", title:"Token Cost Tracking Setup",       agent:"VAULT",  status:"in_progress", priority:"medium", created:"2026-03-01", desc:"Implement daily token cost tracking across all agents." },
  { id:"t3", title:"Discord Client Onboarding Flow",  agent:"ECHO",   status:"in_progress", priority:"high",   created:"2026-03-01", desc:"Build automated onboarding sequence for new clients." },
  { id:"t4", title:"Supabase Agent Memory Layer",     agent:"FORGE",  status:"in_progress", priority:"high",   created:"2026-03-01", desc:"Migrate agent memory to Supabase for cross-session persistence." },
  { id:"t5", title:"Nola Party Barges — Sales Copy",  agent:"CIPHER", status:"completed",   priority:"high",   created:"2026-02-19", desc:"Full 7-page sales copy rewrite." },
  { id:"t6", title:"Q2 Content Strategy Document",    agent:"PULSE",  status:"backlog",     priority:"medium", created:"2026-03-02", desc:"Full Q2 strategy: pillars, formats, 90-day calendar." },
  { id:"t7", title:"Sales Call Analysis — Feb Batch", agent:"ORACLE", status:"backlog",     priority:"medium", created:"2026-03-02", desc:"Analyze Feb calls for objection patterns and close rate leaks." },
];
const DEFAULT_SOPS = [
  { id:"s1", title:"Content Creation Pipeline",     agent:"PULSE",  cat:"content",    sections:["Overview","Research (5-10 min)","Hook Writing","Script Draft","Production","Publish"] },
  { id:"s2", title:"Sales Follow-Up Sequence",      agent:"CIPHER", cat:"sales",      sections:["Lead Stages","Day 1","Day 3","Day 7","Day 14","Final"] },
  { id:"s3", title:"Competitor Scraping Protocol",  agent:"ORACLE", cat:"research",   sections:["Setup","YouTube Scraping","Instagram Scraping","Analysis","Weekly Report"] },
  { id:"s4", title:"Client Onboarding (4-Month)",   agent:"ECHO",   cat:"clients",    sections:["Day 1 Setup","Kick-off Call","Discord Access","Week 1","30-Day Review","Monthly"] },
  { id:"s5", title:"Quiz Funnel Build",             agent:"FORGE",  cat:"dev",        sections:["Tech Stack","File Structure","Pages & Flow","Integration","Go-Live"] },
  { id:"s6", title:"Objection → Content Pipeline", agent:"PULSE",  cat:"content",    sections:["Concept","Objection Library","Template","Hook Formula","Distribution"] },
  { id:"s7", title:"Weekly Report Generation",      agent:"APEX",   cat:"operations", sections:["Data Collection","Agent Summaries","KPI Review","Wins","Next Week Plan"] },
  { id:"s8", title:"Client Win → Case Study",       agent:"PULSE",  cat:"content",    sections:["Trigger Criteria","Interview Template","Story Structure","Formats","Distribution"] },
];
const DEFAULT_SKILLS = [
  { id:"sk1", agent:"FORGE",  title:"Dashboard Development",    desc:"Build and maintain the operating system dashboard.", tags:["react","supabase","api","deploy"], runs:4 },
  { id:"sk2", agent:"FORGE",  title:"Workflow Automation",      desc:"n8n workflows, webhooks, API integrations.",         tags:["n8n","webhooks","automation"],      runs:2 },
  { id:"sk3", agent:"ECHO",   title:"Client Onboarding",        desc:"4-month install process execution.",                 tags:["onboarding","discord","support"],   runs:7 },
  { id:"sk4", agent:"CIPHER", title:"DM Sequences",             desc:"Personalized DM follow-up campaigns.",               tags:["dms","follow-up","sales"],          runs:12 },
  { id:"sk5", agent:"CIPHER", title:"Objection Handling",       desc:"Word-for-word objection response library.",          tags:["objections","scripts","closing"],   runs:9 },
  { id:"sk6", agent:"CIPHER", title:"VSL & Sales Copy",         desc:"Video sales letters and landing page copy.",         tags:["vsl","copywriting","landing"],      runs:5 },
  { id:"sk7", agent:"ORACLE", title:"Competitor Analysis",      desc:"Deep competitor intel and content benchmarking.",    tags:["research","scraping","benchmarks"], runs:8 },
  { id:"sk8", agent:"PULSE",  title:"Reel Script Generator",    desc:"Instagram Reels: hook, body, CTA — 3 variations.",   tags:["reels","hooks","instagram"],        runs:23 },
  { id:"sk9", agent:"PULSE",  title:"YouTube Script Writing",   desc:"Full YouTube scripts with narrative structure.",     tags:["youtube","scripts","narrative"],    runs:11 },
  { id:"sk10",agent:"VAULT",  title:"Cost Optimization Report", desc:"Token usage analysis and cost reduction strategies.", tags:["costs","tokens","ROI"],             runs:3 },
  { id:"sk11",agent:"APEX",   title:"Strategic Planning",       desc:"90-day strategic plans and OKR frameworks.",         tags:["strategy","okr","planning"],        runs:6 },
];

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE
// ─────────────────────────────────────────────────────────────────────────────
async function sGet(key, fallback) {
  try { const r = await window.storage?.get(key); if (r?.value) return JSON.parse(r.value); } catch {}
  return fallback;
}
async function sSet(key, val) { try { await window.storage?.set(key, JSON.stringify(val)); } catch {} }

// ─────────────────────────────────────────────────────────────────────────────
// API
// ─────────────────────────────────────────────────────────────────────────────
  async function claude(system, messages, apiKey) {
  if (!apiKey) throw new Error("No API key — click the banner at the top to add your OpenRouter API key.");
  
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ system, messages, apiKey })
  });
  
  const d = await res.json();
  if (!res.ok) throw new Error(`API ${res.status}: ${d?.error || 'Unknown error'}`);
  return d.reply || "";
}


// ─────────────────────────────────────────────────────────────────────────────
// SMALL COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function Avatar({ id, size=32, dot=false, level=false, cfg }) {
  const a = cfg?.agents?.[id];
  const LV_MAP = {APEX:12, ORACLE:9, PULSE:11, CIPHER:10, FORGE:13, VAULT:8, ECHO:7};
  if (!a) return null;
  return (
    <div style={{position:"relative",display:"inline-flex",flexShrink:0}}>
      <div style={{
        width:size, height:size, borderRadius:"50%",
        background:`${a.color}18`, border:`2px solid ${a.color}50`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:size*.38, fontFamily:"var(--fd)", fontWeight:800, color:a.color,
        boxShadow:`0 0 ${size*.25}px ${a.color}20`,
      }}>{a.icon}</div>
      {dot && <div style={{position:"absolute",bottom:0,right:0,width:9,height:9,borderRadius:"50%",background:"var(--green)",border:"2px solid var(--bg)",boxShadow:"0 0 6px var(--green)"}}/>}
      {level && <div style={{position:"absolute",top:-4,right:-4,background:a.color,color:"#05070D",fontSize:8,fontFamily:"var(--fm)",fontWeight:700,padding:"1px 4px",borderRadius:3,lineHeight:1.4}}>L{LV_MAP[id]??9}</div>}
    </div>
  );
}

function Spin({color="var(--a)"}) {
  return <div style={{width:14,height:14,border:`2px solid ${color}30`,borderTopColor:color,borderRadius:"50%",animation:"spin .7s linear infinite"}}/>;
}

function Notif({msg, onClose}) {
  useEffect(()=>{ const t=setTimeout(onClose,4000); return ()=>clearTimeout(t); },[]);
  return (
    <div className="notif">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
        <div>
          <div style={{fontSize:10,fontFamily:"var(--fm)",color:"var(--a)",letterSpacing:".1em",marginBottom:3}}>APEX OS</div>
          <div style={{fontSize:13}}>{msg}</div>
        </div>
        <button onClick={onClose} style={{background:"none",border:"none",color:"var(--t3)",cursor:"pointer",fontSize:16,lineHeight:1}}>×</button>
      </div>
    </div>
  );
}

function SH({children, right}) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
      <span className="sh">{children}</span>
      {right}
    </div>
  );
}

function XPBar({id, cfg}) {
  const XP_MAP = {APEX:78, ORACLE:55, PULSE:92, CIPHER:67, FORGE:44, VAULT:30, ECHO:61};
  const LV_MAP = {APEX:12, ORACLE:9,  PULSE:11, CIPHER:10, FORGE:13, VAULT:8,  ECHO:7};
  const xp = XP_MAP[id] ?? 50;
  const lv = LV_MAP[id] ?? 9;
  const a = cfg?.agents?.[id];
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
        <span style={{fontSize:9,fontFamily:"var(--fm)",color:"var(--t3)"}}>LV {lv}</span>
        <span style={{fontSize:9,fontFamily:"var(--fm)",color:a?.color}}>{xp}%</span>
      </div>
      <div className="xpt"><div className="xpf" style={{width:`${xp}%`,background:`linear-gradient(90deg,${a?.color}70,${a?.color})`}}/></div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ONBOARDING
// ─────────────────────────────────────────────────────────────────────────────
function Onboarding({onComplete}) {
  const [step, setStep] = useState(0);
  const [cfg, setCfg] = useState({ brandName:"", tagline:"AI Operating System", accentColor:"#E8B84B" });

  const colors = ["#E8B84B","#00E5FF","#00E676","#B388FF","#FF6D00","#FF3B3B","#FF9800"];

  const steps = [
    {
      icon:"⌬", title:"Welcome to APEX OS",
      body:"Your autonomous AI executive team. 7 agents running 24/7 — strategy, content, sales, dev, finance, and client success. All in one command center.",
      content: null,
      next:"Let's Set It Up →"
    },
    {
      icon:"◈", title:"Brand Your OS",
      body:"Make it yours. Enter your brand name to white-label the entire system.",
      content: (
        <div style={{marginTop:20,display:"flex",flexDirection:"column",gap:14}}>
          <div>
            <label style={{fontSize:11,fontFamily:"var(--fm)",color:"var(--t3)",letterSpacing:".1em",display:"block",marginBottom:6}}>BRAND NAME</label>
            <input className="input" placeholder="e.g. RAWGROWTH, NEXUS, EMPIRE..." value={cfg.brandName} onChange={e=>setCfg(p=>({...p,brandName:e.target.value}))} style={{fontSize:15}} autoFocus/>
          </div>
          <div>
            <label style={{fontSize:11,fontFamily:"var(--fm)",color:"var(--t3)",letterSpacing:".1em",display:"block",marginBottom:6}}>TAGLINE (optional)</label>
            <input className="input" placeholder="e.g. AI Operating System" value={cfg.tagline} onChange={e=>setCfg(p=>({...p,tagline:e.target.value}))}/>
          </div>
          <div>
            <label style={{fontSize:11,fontFamily:"var(--fm)",color:"var(--t3)",letterSpacing:".1em",display:"block",marginBottom:8}}>ACCENT COLOR</label>
            <div style={{display:"flex",gap:8}}>
              {colors.map(c=>(
                <div key={c} onClick={()=>setCfg(p=>({...p,accentColor:c}))} style={{
                  width:28,height:28,borderRadius:"50%",background:c,cursor:"pointer",
                  border:`2px solid ${cfg.accentColor===c?"white":"transparent"}`,
                  boxShadow:cfg.accentColor===c?`0 0 12px ${c}`:undefined,
                  transition:"all .15s"
                }}/>
              ))}
            </div>
          </div>
        </div>
      ),
      next:"Continue →"
    },
    {
      icon:"◎", title:"Meet Your Team",
      body:"7 specialized AI agents. Each one is a C-suite exec. Each one executes on command.",
      content: (
        <div style={{marginTop:20,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {Object.entries(DEFAULT_CONFIG.agents).map(([id,a])=>(
            <div key={id} style={{padding:"10px 12px",background:"var(--s2)",border:`1px solid ${a.color}30`,borderRadius:"var(--r)",borderLeft:`3px solid ${a.color}`}}>
              <div style={{fontSize:14,marginBottom:2}}>{a.icon} <span style={{fontFamily:"var(--fd)",fontWeight:700,fontSize:12,color:a.color}}>{a.name}</span></div>
              <div style={{fontSize:11,color:"var(--t2)"}}>{a.role}</div>
            </div>
          ))}
        </div>
      ),
      next:"Launch APEX OS →"
    }
  ];

  const s = steps[step];
  const canNext = step !== 1 || cfg.brandName.trim().length > 0;

  const handleNext = () => {
    if (step < steps.length - 1) { setStep(p=>p+1); }
    else { onComplete({...DEFAULT_CONFIG, brandName:cfg.brandName||"MY BRAND", tagline:cfg.tagline, accentColor:cfg.accentColor}); }
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20,position:"relative",zIndex:1}}>
      <div style={{width:"100%",maxWidth:520}}>
        {/* Steps indicator */}
        <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:32}}>
          {steps.map((_,i)=>(
            <div key={i} style={{width:i===step?24:8,height:4,borderRadius:2,background:i<=step?"var(--a)":"var(--b2)",transition:"all .3s"}}/>
          ))}
        </div>

        <div className="card fu" style={{padding:32}}>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{fontSize:48,marginBottom:12,filter:"drop-shadow(0 0 20px var(--a))"}}>{s.icon}</div>
            <h2 style={{fontFamily:"var(--fd)",fontSize:22,fontWeight:800,letterSpacing:"-.01em",marginBottom:8}}>{s.title}</h2>
            <p style={{color:"var(--t2)",fontSize:14,lineHeight:1.6}}>{s.body}</p>
          </div>
          {s.content}
          <button className="btn btn-a fu" onClick={handleNext} disabled={!canNext}
            style={{width:"100%",justifyContent:"center",padding:"12px",marginTop:24,fontSize:13}}>
            {s.next}
          </button>
          {step > 0 && <button onClick={()=>setStep(p=>p-1)} style={{width:"100%",background:"none",border:"none",color:"var(--t3)",cursor:"pointer",fontSize:12,fontFamily:"var(--fm)",marginTop:10,padding:"6px"}}>← Back</button>}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOPBAR
// ─────────────────────────────────────────────────────────────────────────────
function TopBar({cfg, liveCount}) {
  const [t,setT] = useState(new Date());
  useEffect(()=>{ const i=setInterval(()=>setT(new Date()),1000); return ()=>clearInterval(i); },[]);
  const ticks = [`${cfg.brandName} // ${cfg.tagline.toUpperCase()}`, "ALL AGENTS ONLINE", "7 AGENTS — 24/7 OPERATION", "AUTONOMOUS EXECUTIVE TEAM ACTIVE", "MISSION: BUILD. SELL. SCALE."];
  return (
    <div style={{
      position:"fixed", top:0, left:"var(--sidebar)", right:0,
      height:"var(--topbar)", zIndex:200,
      background:"#0C0F1C",
      borderBottom:"1px solid #252840",
      borderLeft:"1px solid #252840",
      boxShadow:"0 2px 20px rgba(0,0,0,0.6)",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 16px", overflow:"hidden",
    }}>
      {/* Accent top line */}
      <div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:`linear-gradient(90deg,${cfg.accentColor},transparent 55%)`}}/>
      {/* Ticker */}
      <div style={{flex:1,overflow:"hidden",maskImage:"linear-gradient(90deg,transparent,black 3%,black 97%,transparent)"}}>
        <div style={{display:"flex",gap:48,animation:"ticker 28s linear infinite",whiteSpace:"nowrap",width:"max-content"}}>
          {[...ticks,...ticks].map((tick,i)=>(
            <span key={i} style={{fontSize:10,fontFamily:"var(--fm)",color:"#7B82A0",letterSpacing:".1em"}}>
              <span style={{color:cfg.accentColor,marginRight:10}}>▸</span>{tick}
            </span>
          ))}
        </div>
      </div>
      {/* Right panel */}
      <div style={{display:"flex",alignItems:"center",gap:16,flexShrink:0,marginLeft:16,paddingLeft:16,borderLeft:"1px solid #252840"}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <div className="live"/>
          <span style={{fontSize:10,fontFamily:"var(--fm)",color:"#00E676",fontWeight:500,letterSpacing:".04em"}}>{liveCount}/7 LIVE</span>
        </div>
        <span style={{fontSize:11,fontFamily:"var(--fm)",color:"#B0B8D0",fontWeight:500,letterSpacing:".05em"}}>{t.toLocaleTimeString("en-US",{hour12:false})}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
const NAV = [
  {sec:"COMMAND",   items:[{id:"dashboard",label:"War Room"},{id:"chat",label:"Chat"},{id:"agents",label:"Agents"}]},
  {sec:"CONTENT",   items:[{id:"instagram",label:"Instagram"},{id:"youtube",label:"YouTube"},{id:"pipeline",label:"Pipeline"},{id:"tracker",label:"Tracker"}]},
  {sec:"REVENUE",   items:[{id:"taskboard",label:"Task Board"},{id:"saleshub",label:"Sales Hub"},{id:"funnel",label:"Funnel"},{id:"calls",label:"Calls"}]},
  {sec:"INTEL",     items:[{id:"skills",label:"Skills"},{id:"sops",label:"SOPs"},{id:"orgchart",label:"Org Chart"},{id:"report",label:"Weekly Report"}]},
  {sec:"SYSTEM",    items:[{id:"settings",label:"Settings"}]},
];

function Sidebar({active, setActive, tasks, cfg}) {
  const agents = Object.values(cfg.agents);
  return (
    <div style={{position:"fixed",left:0,top:0,bottom:0,width:"var(--sidebar)",zIndex:201,background:"#090C14",borderRight:"1px solid #1E2235",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      {/* Logo zone — same height as topbar, always visible */}
      <div style={{
        height:"var(--topbar)", flexShrink:0,
        padding:"0 14px",
        borderBottom:"1px solid #252840",
        background:"#0B0E1A",
        display:"flex", alignItems:"center", gap:10,
        boxShadow:"0 2px 20px rgba(0,0,0,0.6)",
      }}>
        {/* Accent top line matching topbar */}
        <div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:`linear-gradient(90deg,${cfg.accentColor},transparent 80%)`}}/>
        <div style={{
          width:30, height:30, borderRadius:6, flexShrink:0,
          background:cfg.accentColor,
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:`0 0 14px ${cfg.accentColor}60`,
        }}>
          <span style={{fontFamily:"var(--fd)",fontSize:14,fontWeight:900,color:"#05070D"}}>⌬</span>
        </div>
        <div style={{overflow:"hidden",flex:1}}>
          <div style={{fontFamily:"var(--fd)",fontSize:13,fontWeight:800,letterSpacing:".01em",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",color:"#E8EAF2"}}>{cfg.brandName}</div>
          <div style={{fontSize:8,fontFamily:"var(--fm)",color:"#3D4260",letterSpacing:".12em",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{cfg.tagline.toUpperCase()} v3</div>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"8px 0"}}>
        {NAV.map(g=>(
          <div key={g.sec} style={{marginBottom:4}}>
            <div style={{padding:"7px 14px 3px",fontSize:9,fontFamily:"var(--fm)",color:"var(--t3)",letterSpacing:".14em"}}>{g.sec}</div>
            {g.items.map(item=>{
              const on = active===item.id;
              return (
                <button key={item.id} onClick={()=>setActive(item.id)} style={{
                  width:"100%",textAlign:"left",padding:"7px 14px",
                  background:on?"var(--a1)":"transparent",
                  color:on?"var(--a)":"var(--t2)",
                  border:"none",borderLeft:`2px solid ${on?"var(--a)":"transparent"}`,
                  cursor:"pointer",fontSize:12,fontFamily:"var(--fb)",fontWeight:on?600:400,
                  transition:"all .12s",
                }}>{item.label}</button>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{borderTop:"1px solid var(--b1)",padding:"8px 0",flexShrink:0}}>
        <div style={{padding:"3px 14px 5px",fontSize:9,fontFamily:"var(--fm)",color:"var(--t3)",letterSpacing:".14em"}}>AGENTS</div>
        {agents.map(a=>{
          const t = tasks?.find(x=>x.agent===Object.keys(cfg.agents).find(k=>cfg.agents[k]===a)&&x.status==="in_progress");
          return (
            <div key={a.name} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 14px"}}>
              <div style={{width:18,height:18,borderRadius:"50%",background:`${a.color}18`,border:`1.5px solid ${a.color}50`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:a.color,flexShrink:0}}>{a.icon}</div>
              <div style={{overflow:"hidden",flex:1}}>
                <div style={{fontSize:11,fontWeight:600,color:"var(--t1)",fontFamily:"var(--fd)"}}>{a.name}</div>
                <div style={{fontSize:9,color:"var(--t3)",fontFamily:"var(--fm)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t?t.title.substring(0,20)+"...":"Standby"}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────────────────────────────────────
function Settings({cfg, setCfg, notify}) {
  const [form, setForm] = useState(cfg);
  const colors = ["#E8B84B","#00E5FF","#00E676","#B388FF","#FF6D00","#FF3B3B","#FF9800","#EC4899"];
  const save = () => { setCfg(form); sSet("apex_cfg", form); notify("Settings saved!"); };
  const reset = () => { setForm(DEFAULT_CONFIG); setCfg(DEFAULT_CONFIG); sSet("apex_cfg", DEFAULT_CONFIG); notify("Reset to defaults."); };

  return (
    <div className="fu">
      <div style={{marginBottom:24}}>
        <h1 style={{fontFamily:"var(--fd)",fontSize:26,fontWeight:800,letterSpacing:"-.02em",marginBottom:4}}>Settings</h1>
        <p style={{color:"var(--t2)",fontSize:13}}>White-label your OS, configure agents, customize the experience.</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div className="card" style={{padding:20}}>
          <div style={{fontSize:13,fontWeight:600,fontFamily:"var(--fd)",marginBottom:14}}>Brand Identity</div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div>
              <label style={{fontSize:10,fontFamily:"var(--fm)",color:"var(--t3)",letterSpacing:".1em",display:"block",marginBottom:5}}>BRAND NAME</label>
              <input className="input" value={form.brandName} onChange={e=>setForm(p=>({...p,brandName:e.target.value}))} placeholder="Your brand name"/>
            </div>
            <div>
              <label style={{fontSize:10,fontFamily:"var(--fm)",color:"var(--t3)",letterSpacing:".1em",display:"block",marginBottom:5}}>TAGLINE</label>
              <input className="input" value={form.tagline} onChange={e=>setForm(p=>({...p,tagline:e.target.value}))} placeholder="AI Operating System"/>
            </div>
            <div>
              <label style={{fontSize:10,fontFamily:"var(--fm)",color:"var(--t3)",letterSpacing:".1em",display:"block",marginBottom:8}}>ACCENT COLOR</label>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {colors.map(c=>(
                  <div key={c} onClick={()=>setForm(p=>({...p,accentColor:c}))} style={{
                    width:28,height:28,borderRadius:"50%",background:c,cursor:"pointer",
                    border:`2px solid ${form.accentColor===c?"white":"transparent"}`,
                    boxShadow:form.accentColor===c?`0 0 10px ${c}`:undefined,transition:"all .14s"
                  }}/>
                ))}
                <input type="color" value={form.accentColor} onChange={e=>setForm(p=>({...p,accentColor:e.target.value}))}
                  style={{width:28,height:28,borderRadius:"50%",border:"none",background:"none",cursor:"pointer",padding:0}}/>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{padding:20}}>
          <div style={{fontSize:13,fontWeight:600,fontFamily:"var(--fd)",marginBottom:14}}>Agent Names</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {Object.entries(form.agents).map(([id,a])=>(
              <div key={id} style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:20,height:20,borderRadius:"50%",background:`${a.color}18`,border:`1.5px solid ${a.color}50`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:a.color,flexShrink:0}}>{a.icon}</div>
                <input className="input" value={a.name} onChange={e=>setForm(p=>({...p,agents:{...p.agents,[id]:{...a,name:e.target.value}}}))} style={{flex:1,fontSize:12,padding:"6px 10px"}}/>
                <span style={{fontSize:10,color:"var(--t3)",fontFamily:"var(--fm)",width:120,flexShrink:0}}>{a.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{padding:20,marginBottom:16}}>
        <div style={{fontSize:13,fontWeight:600,fontFamily:"var(--fd)",marginBottom:14}}>Known Limitations & Workarounds</div>
        {[
          {limit:"Content Tracker stats are static",fix:"Connect Instagram Graph API + YouTube Data API v3 for live data. FORGE can generate the integration code.",status:"amber"},
          {limit:"Agent memory resets between browser sessions",fix:"Currently mitigated with storage persistence. Full fix: Supabase vector memory layer. FORGE can build this.",status:"amber"},
          {limit:"Agents can't communicate with each other",fix:"True multi-agent orchestration requires a backend relay. Workaround: Use APEX chat to manually chain tasks.",status:"red"},
          {limit:"No real competitor scraping",fix:"ORACLE generates analysis based on your input. Real scraping needs Apify or ScrapingBee integration.",status:"red"},
          {limit:"Sales metrics are placeholders",fix:"Connect your CRM (GHL, HubSpot) via FORGE's API integration workflow for live pipeline data.",status:"amber"},
        ].map((item,i)=>(
          <div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:i<4?"1px solid var(--b1)":undefined,alignItems:"flex-start"}}>
            <span className={`tag ${item.status==="red"?"tred":"tamb"}`} style={{flexShrink:0,marginTop:2}}>{item.status==="red"?"KNOWN":"PARTIAL"}</span>
            <div>
              <div style={{fontSize:12,fontWeight:600,marginBottom:3}}>{item.limit}</div>
              <div style={{fontSize:12,color:"var(--t2)"}}>Fix: {item.fix}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:10}}>
        <button className="btn btn-a" onClick={save} style={{padding:"10px 24px"}}>SAVE SETTINGS</button>
        <button className="btn btn-g" onClick={reset}>Reset to Defaults</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
function Dashboard({tasks, setActive, cfg}) {
  const bl = tasks.filter(t=>t.status==="backlog");
  const ip = tasks.filter(t=>t.status==="in_progress");
  const dn = tasks.filter(t=>t.status==="completed");
  const agents = Object.entries(cfg.agents);

  return (
    <div className="fu">
      <div style={{marginBottom:22}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
          <h1 style={{fontFamily:"var(--fd)",fontSize:26,fontWeight:800,letterSpacing:"-.02em"}}>War Room</h1>
          <span className="tag tg">COMMAND CENTER</span>
        </div>
        <p style={{color:"var(--t2)",fontSize:13}}>{cfg.brandName} — autonomous executive team, operating 24/7.</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:18}}>
        {[
          {l:"AGENTS LIVE",v:"7/7",c:"var(--green)"},
          {l:"IN PROGRESS",v:ip.length,c:"var(--amber)"},
          {l:"COMPLETED",v:dn.length,c:"var(--cyan)"},
          {l:"BACKLOG",v:bl.length,c:"var(--t2)"},
        ].map(s=>(
          <div key={s.l} className="card" style={{padding:"14px 16px"}}>
            <div className="stat" style={{color:s.c,marginBottom:3}}>{s.v}</div>
            <div style={{fontSize:9,fontFamily:"var(--fm)",color:"var(--t3)",letterSpacing:".1em"}}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{marginBottom:18}}>
        <SH>TEAM — LIVE AGENTS</SH>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:8}}>
          {agents.map(([id,a])=>{
            const t = tasks.find(x=>x.agent===id&&x.status==="in_progress");
            return (
              <div key={id} className="card fu" style={{padding:"12px 8px",borderTop:`2px solid ${a.color}`,textAlign:"center",cursor:"pointer",transition:"transform .14s"}}
                onClick={()=>setActive("chat")}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                onMouseLeave={e=>e.currentTarget.style.transform=""}>
                <div style={{display:"flex",justifyContent:"center",marginBottom:7}}>
                  <Avatar id={id} size={32} dot level cfg={cfg}/>
                </div>
                <div style={{fontSize:11,fontFamily:"var(--fd)",fontWeight:700,color:"var(--t1)",marginBottom:1}}>{a.name}</div>
                <div style={{fontSize:9,color:a.color,fontFamily:"var(--fm)",marginBottom:7}}>{a.role.split("/")[0].trim()}</div>
                <XPBar id={id} cfg={cfg}/>
                <div style={{marginTop:7,fontSize:9,color:"var(--t3)",fontFamily:"var(--fm)",lineHeight:1.3}}>{t?t.title.substring(0,20)+"...":"Standby"}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <SH>OPERATIONS BOARD</SH>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          {[
            {k:"backlog",l:"BACKLOG",ac:"var(--t3)",items:bl},
            {k:"in_progress",l:"IN PROGRESS",ac:"var(--amber)",items:ip},
            {k:"completed",l:"COMPLETED",ac:"var(--green)",items:dn},
          ].map(col=>(
            <div key={col.k} className="card">
              <div style={{padding:"9px 12px",borderBottom:"1px solid var(--b1)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:9,fontFamily:"var(--fm)",color:col.ac,letterSpacing:".1em"}}>{col.l}</span>
                <span style={{fontFamily:"var(--fd)",fontSize:12,fontWeight:800,color:col.ac}}>{col.items.length}</span>
              </div>
              <div style={{padding:8,display:"flex",flexDirection:"column",gap:7,minHeight:120}}>
                {col.items.length===0&&<div style={{textAlign:"center",color:"var(--t3)",fontSize:11,padding:"18px 0",fontFamily:"var(--fm)"}}>— empty —</div>}
                {col.items.map(task=>(
                  <div key={task.id} className="kcard" style={{borderLeft:`3px solid ${cfg.agents[task.agent]?.color||"#fff"}`}}>
                    <div style={{fontSize:12,fontWeight:600,marginBottom:5,lineHeight:1.3}}>{task.title}</div>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <span style={{fontSize:10,fontFamily:"var(--fm)",color:cfg.agents[task.agent]?.color,fontWeight:600}}>{task.agent}</span>
                      <span className={`tag ${task.priority==="high"?"tred":task.priority==="medium"?"tamb":""}`}>{task.priority}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAT — full persistent memory per agent
// ─────────────────────────────────────────────────────────────────────────────
function Chat({cfg, notify, apiKey}) {
  const [sel, setSel] = useState("APEX");
  const [sessions, setSess] = useState({});
  const [input, setInput] = useState("");
  const [loading, setLoad] = useState(false);
  const [err, setErr] = useState("");
  const bottomRef = useRef(null);
  const loaded = useRef(false);

  useEffect(()=>{ sGet("chat_v3",{}).then(s=>{setSess(s);loaded.current=true;}); },[]);
  useEffect(()=>{ if(loaded.current) sSet("chat_v3",sessions); },[sessions]);
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[sessions,loading,sel]);

  const msgs = sessions[sel]||[];
  const a = cfg.agents[sel];

  const send = async()=>{
    if(!input.trim()||loading) return;
    const um = {role:"user",content:input};
    const nm = [...msgs,um];
    setSess(p=>({...p,[sel]:nm}));
    setInput(""); setErr(""); setLoad(true);
    try {
      const sys = getSysPrompt(sel,cfg);
      const reply = await claude(sys, nm.map(m=>({role:m.role,content:m.content})), apiKey);
      setSess(p=>({...p,[sel]:[...nm,{role:"assistant",content:reply}]}));
    } catch(e) { setErr(e.message); }
    setLoad(false);
  };

  return (
    <div className="fu" style={{height:"calc(100vh - var(--topbar) - 40px)",display:"flex",gap:12}}>
      <div className="card" style={{width:196,flexShrink:0,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"10px 12px 6px"}}><span className="sh">AGENTS</span></div>
        <div style={{flex:1,overflowY:"auto"}}>
          {Object.entries(cfg.agents).map(([id,a])=>{
            const on = sel===id;
            const has = (sessions[id]?.length||0)>0;
            return (
              <button key={id} onClick={()=>setSel(id)} style={{
                width:"100%",textAlign:"left",padding:"9px 12px",
                background:on?`${a.color}12`:"transparent",
                border:"none",borderLeft:`2px solid ${on?a.color:"transparent"}`,
                cursor:"pointer",fontFamily:"var(--fb)",transition:"all .12s",
                display:"flex",alignItems:"center",gap:9,
              }}>
                <Avatar id={id} size={26} dot cfg={cfg}/>
                <div style={{flex:1,overflow:"hidden"}}>
                  <div style={{fontSize:11,fontWeight:600,color:on?a.color:"var(--t1)",fontFamily:"var(--fd)"}}>{a.name}</div>
                  <div style={{fontSize:9,color:"var(--t3)",fontFamily:"var(--fm)"}}>{a.role.split("/")[0].trim()}</div>
                </div>
                {has&&<div style={{width:5,height:5,borderRadius:"50%",background:a.color,flexShrink:0,boxShadow:`0 0 5px ${a.color}`}}/>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="card" style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"11px 16px",borderBottom:"1px solid var(--b1)",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <Avatar id={sel} size={36} dot level cfg={cfg}/>
          <div style={{flex:1}}>
            <div style={{fontFamily:"var(--fd)",fontWeight:700,fontSize:14}}>{a.name}
              <span style={{marginLeft:8,fontSize:9,fontFamily:"var(--fm)",color:a.color,padding:"1px 5px",background:`${a.color}18`,borderRadius:3}}>LIVE</span>
            </div>
            <div style={{fontSize:11,color:"var(--t2)"}}>{a.role}</div>
          </div>
          {msgs.length>0&&<button className="btn btn-g" onClick={()=>setSess(p=>({...p,[sel]:[]}))} style={{fontSize:10,padding:"4px 9px"}}>Clear</button>}
        </div>

        <div style={{flex:1,overflowY:"auto",padding:16}}>
          {msgs.length===0&&(
            <div style={{textAlign:"center",paddingTop:50}} className="fi">
              <div style={{fontSize:42,marginBottom:10,filter:`drop-shadow(0 0 14px ${a.color})`}}>{a.icon}</div>
              <div style={{fontFamily:"var(--fd)",fontSize:17,fontWeight:700,marginBottom:6}}>{a.name} ready.</div>
              <div style={{fontSize:13,color:"var(--t2)",maxWidth:320,margin:"0 auto",lineHeight:1.6}}>{getSysPrompt(sel,cfg).substring(0,120)}...</div>
            </div>
          )}
          {msgs.map((m,i)=>(
            <div key={i} className="fi" style={{display:"flex",gap:9,marginBottom:12,justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
              {m.role==="assistant"&&<Avatar id={sel} size={26} cfg={cfg}/>}
              <div style={{maxWidth:"70%",padding:"10px 14px",
                background:m.role==="user"?a.color:"var(--s2)",
                color:m.role==="user"?"#060500":"var(--t1)",
                borderRadius:m.role==="user"?"12px 12px 4px 12px":"12px 12px 12px 4px",
                border:m.role==="assistant"?"1px solid var(--b1)":undefined,
                fontSize:13,lineHeight:1.7,whiteSpace:"pre-wrap",fontFamily:"var(--fb)"}}>
                {m.content}
              </div>
            </div>
          ))}
          {loading&&(
            <div style={{display:"flex",gap:9,marginBottom:12}}>
              <Avatar id={sel} size={26} cfg={cfg}/>
              <div style={{padding:"12px 14px",background:"var(--s2)",border:"1px solid var(--b1)",borderRadius:"12px 12px 12px 4px",display:"flex",gap:4,alignItems:"center"}}>
                {[0,1,2].map(i=><div key={i} style={{width:5,height:5,borderRadius:"50%",background:a.color,animation:`pulse 1s ease ${i*.2}s infinite`}}/>)}
              </div>
            </div>
          )}
          {err&&<div style={{textAlign:"center",color:"var(--red)",fontSize:11,padding:"8px 12px",background:"rgba(255,59,59,.1)",borderRadius:5,marginBottom:8,fontFamily:"var(--fm)"}}>⚠ {err}</div>}
          <div ref={bottomRef}/>
        </div>

        <div style={{padding:"11px 14px",borderTop:"1px solid var(--b1)",display:"flex",gap:8,flexShrink:0}}>
          <input className="input" value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
            placeholder={`Message ${a.name}...`} style={{flex:1}}/>
          <button className="btn btn-a" onClick={send} disabled={loading||!input.trim()}>
            {loading?<Spin color="#060500"/>:"SEND →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AGENTS VIEW
// ─────────────────────────────────────────────────────────────────────────────
function Agents({cfg}) {
  return (
    <div className="fu">
      <div style={{marginBottom:22}}>
        <h1 style={{fontFamily:"var(--fd)",fontSize:26,fontWeight:800,letterSpacing:"-.02em",marginBottom:4}}>Agent Roster</h1>
        <p style={{color:"var(--t2)",fontSize:13}}>7 autonomous AI executives. Specialized. Relentless. Always online.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:12}}>
        {Object.entries(cfg.agents).map(([id,a],idx)=>(
          <div key={id} className="card fu" style={{padding:16,borderTop:`3px solid ${a.color}`,animationDelay:`${idx*.06}s`,transition:"transform .14s"}}
            onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
            onMouseLeave={e=>e.currentTarget.style.transform=""}>
            <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:12}}>
              <Avatar id={id} size={44} dot level cfg={cfg}/>
              <div>
                <div style={{fontFamily:"var(--fd)",fontSize:16,fontWeight:800,letterSpacing:"-.01em"}}>{a.name}</div>
                <div style={{fontSize:11,color:a.color,fontFamily:"var(--fm)"}}>{a.role}</div>
              </div>
              <span className="tag tgreen" style={{marginLeft:"auto"}}>ONLINE</span>
            </div>
            <div style={{marginBottom:10}}><XPBar id={id} cfg={cfg}/></div>
            <p style={{fontSize:12,color:"var(--t2)",lineHeight:1.6}}>{getSysPrompt(id,cfg).substring(0,110)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT GENERATOR
// ─────────────────────────────────────────────────────────────────────────────
function ContentGen({platform, notify, cfg, apiKey}) {
  const [topic, setTopic] = useState("");
  const [angle, setAngle] = useState("personal story");
  const [output, setOutput] = useState("");
  const [loading, setLoad] = useState(false);
  const [err, setErr] = useState("");
  const [hist, setHist] = useState([]);

  useEffect(()=>{ sGet(`cgen_${platform}`,[]).then(setHist); },[platform]);

  const angles = ["personal story","education/value","controversy","behind the scenes","results/proof","hot take","contrarian"];

  const gen = async()=>{
    if(!topic.trim()||loading) return;
    setLoad(true); setErr(""); setOutput("");
    const p = platform==="instagram"
      ?`Generate 3 high-converting Instagram Reel scripts for topic: "${topic}" with angle: "${angle}".\n\nFor EACH:\n**VARIATION [N]**\n[HOOK — first 3 seconds]\n[BODY — 30-60 sec]\n[CTA]\n[CAPTION + hashtags]\n\nRaw, authentic voice.`
      :`Write a complete YouTube script for: "${topic}" (angle: "${angle}").\n\n**3 TITLE OPTIONS**\n**THUMBNAIL CONCEPT**\n**HOOK (0-30s)**\n**INTRO (30-90s)**\n**MAIN CONTENT** (with timestamps)\n**PATTERN INTERRUPTS**\n**OUTRO + CTA**`;
    try {
      const r = await claude(getSysPrompt("PULSE",cfg),[{role:"user",content:p}], apiKey);
      setOutput(r);
      const e = {topic,angle,date:new Date().toLocaleDateString(),result:r};
      const nh = [e,...hist.slice(0,9)];
      setHist(nh); sSet(`cgen_${platform}`,nh);
      notify(`${platform==="instagram"?"Reel scripts":"YouTube script"} generated by ${cfg.agents.PULSE.name}!`);
    } catch(e){setErr(e.message);}
    setLoad(false);
  };

  return (
    <div className="fu">
      <div style={{marginBottom:22}}>
        <h1 style={{fontFamily:"var(--fd)",fontSize:26,fontWeight:800,letterSpacing:"-.02em",marginBottom:4}}>
          {platform==="instagram"?"Instagram Scripts":"YouTube Scripts"}
        </h1>
        <p style={{color:"var(--t2)",fontSize:13}}>Powered by {cfg.agents.PULSE.name} — writes in your authentic voice.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:12,marginBottom:12}}>
        <div className="card" style={{padding:16}}>
          <label style={{fontSize:10,fontFamily:"var(--fm)",color:"var(--t3)",letterSpacing:".1em",display:"block",marginBottom:5}}>TOPIC / IDEA</label>
          <textarea className="input" value={topic} onChange={e=>setTopic(e.target.value)}
            placeholder={platform==="instagram"?"e.g. How I replaced my entire team with AI agents":"e.g. The $0 to $30k blueprint nobody shows you"}
            style={{marginBottom:12,height:88}}/>
          <label style={{fontSize:10,fontFamily:"var(--fm)",color:"var(--t3)",letterSpacing:".1em",display:"block",marginBottom:7}}>CONTENT ANGLE</label>
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:14}}>
            {angles.map(an=>(
              <button key={an} onClick={()=>setAngle(an)} style={{
                padding:"4px 11px",borderRadius:4,fontSize:11,fontFamily:"var(--fb)",
                background:angle===an?"var(--a1)":"var(--s3)",
                color:angle===an?"var(--a)":"var(--t2)",
                border:`1px solid ${angle===an?"var(--a2)":"var(--b1)"}`,
                cursor:"pointer",transition:"all .12s",
              }}>{an}</button>
            ))}
          </div>
          <button className="btn btn-a" onClick={gen} disabled={loading||!topic.trim()} style={{width:"100%",justifyContent:"center",padding:"10px"}}>
            {loading?<><Spin color="#060500"/>WRITING...</>:`⚡ GENERATE ${platform==="instagram"?"REEL SCRIPTS":"YOUTUBE SCRIPT"}`}
          </button>
          {err&&<div style={{color:"var(--red)",fontSize:11,marginTop:8,fontFamily:"var(--fm)"}}>⚠ {err}</div>}
        </div>
        <div className="card" style={{padding:14}}>
          <SH>HISTORY <span className="tag" style={{marginLeft:4}}>{hist.length}</span></SH>
          {hist.length===0?<div style={{color:"var(--t3)",fontSize:11,fontFamily:"var(--fm)",textAlign:"center",padding:"18px 0"}}>No history yet.</div>:(
            <div style={{display:"flex",flexDirection:"column",gap:5,maxHeight:280,overflowY:"auto"}}>
              {hist.map((h,i)=>(
                <div key={i} onClick={()=>setOutput(h.result)} style={{padding:"7px 9px",background:"var(--s2)",borderRadius:4,cursor:"pointer",border:"1px solid var(--b1)"}}>
                  <div style={{fontSize:12,fontWeight:500,marginBottom:2,lineHeight:1.3}}>{h.topic}</div>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    <span style={{fontSize:9,color:"var(--t3)",fontFamily:"var(--fm)"}}>{h.angle}</span>
                    <span style={{fontSize:9,color:"var(--t3)",fontFamily:"var(--fm)"}}>{h.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {output&&(
        <div className="card" style={{padding:16,borderLeft:`3px solid ${cfg.agents.PULSE.color}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <Avatar id="PULSE" size={24} cfg={cfg}/>
              <span style={{fontFamily:"var(--fd)",fontSize:12,fontWeight:700,color:cfg.agents.PULSE.color}}>{cfg.agents.PULSE.name} OUTPUT</span>
            </div>
            <button className="btn btn-g" onClick={()=>navigator.clipboard?.writeText(output)} style={{fontSize:10,padding:"4px 10px"}}>COPY ALL</button>
          </div>
          <pre style={{fontSize:13,lineHeight:1.8,whiteSpace:"pre-wrap",color:"var(--t1)",fontFamily:"var(--fb)"}}>{output}</pre>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TASK BOARD — persistent
// ─────────────────────────────────────────────────────────────────────────────
function TaskBoard({tasks, setTasks, notify, cfg}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({title:"",agent:"APEX",priority:"medium",desc:""});

  const add=()=>{
    if(!form.title.trim()) return;
    const t={...form,id:`t${Date.now()}`,status:"backlog",created:new Date().toISOString().split("T")[0]};
    setTasks(p=>[...p,t]); setForm({title:"",agent:"APEX",priority:"medium",desc:""}); setOpen(false);
    notify(`Task "${form.title}" added.`);
  };
  const move=(id,st)=>setTasks(p=>p.map(t=>t.id===id?{...t,status:st}:t));
  const del=(id)=>setTasks(p=>p.filter(t=>t.id!==id));

  const cols=[
    {k:"backlog",l:"BACKLOG",ac:"var(--t3)",items:tasks.filter(t=>t.status==="backlog")},
    {k:"in_progress",l:"IN PROGRESS",ac:"var(--amber)",items:tasks.filter(t=>t.status==="in_progress")},
    {k:"completed",l:"COMPLETED",ac:"var(--green)",items:tasks.filter(t=>t.status==="completed")},
  ];

  return (
    <div className="fu">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div>
          <h1 style={{fontFamily:"var(--fd)",fontSize:26,fontWeight:800,letterSpacing:"-.02em",marginBottom:4}}>Task Board</h1>
          <p style={{color:"var(--t2)",fontSize:13}}>{tasks.length} tasks across all agents.</p>
        </div>
        <button className="btn btn-a" onClick={()=>setOpen(p=>!p)}>+ NEW TASK</button>
      </div>

      {open&&(
        <div className="card fi" style={{padding:16,marginBottom:14,borderTop:"2px solid var(--a)"}}>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:10,marginBottom:8}}>
            <input className="input" placeholder="Task title *" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))}/>
            <select className="input" value={form.agent} onChange={e=>setForm(p=>({...p,agent:e.target.value}))}>
              {Object.entries(cfg.agents).map(([id,a])=><option key={id} value={id}>{a.name} — {a.role}</option>)}
            </select>
            <select className="input" value={form.priority} onChange={e=>setForm(p=>({...p,priority:e.target.value}))}>
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
            </select>
          </div>
          <textarea className="input" placeholder="Description..." value={form.desc} onChange={e=>setForm(p=>({...p,desc:e.target.value}))} style={{marginBottom:10,height:58}}/>
          <div style={{display:"flex",gap:8}}>
            <button className="btn btn-a" onClick={add}>CREATE</button>
            <button className="btn btn-g" onClick={()=>setOpen(false)}>CANCEL</button>
          </div>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        {cols.map(col=>(
          <div key={col.k} className="card">
            <div style={{padding:"9px 12px",borderBottom:"1px solid var(--b1)",display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize:9,fontFamily:"var(--fm)",color:col.ac,letterSpacing:".1em"}}>{col.l}</span>
              <span style={{fontFamily:"var(--fd)",fontSize:12,fontWeight:800,color:col.ac}}>{col.items.length}</span>
            </div>
            <div style={{padding:8,display:"flex",flexDirection:"column",gap:7,minHeight:160}}>
              {col.items.length===0&&<div style={{textAlign:"center",color:"var(--t3)",fontSize:10,padding:"20px 0",fontFamily:"var(--fm)"}}>— empty —</div>}
              {col.items.map(task=>(
                <div key={task.id} className="kcard" style={{borderLeft:`3px solid ${cfg.agents[task.agent]?.color||"#fff"}`}}>
                  <div style={{fontSize:12,fontWeight:600,marginBottom:5,lineHeight:1.3}}>{task.title}</div>
                  {task.desc&&<div style={{fontSize:11,color:"var(--t2)",marginBottom:6,lineHeight:1.4}}>{task.desc}</div>}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                    <span style={{fontSize:9,fontFamily:"var(--fm)",color:cfg.agents[task.agent]?.color,fontWeight:600}}>{cfg.agents[task.agent]?.name||task.agent}</span>
                    <span className={`tag ${task.priority==="high"?"tred":task.priority==="medium"?"tamb":""}`}>{task.priority}</span>
                  </div>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                    {col.k!=="backlog"&&<button className="btn btn-g" onClick={()=>move(task.id,"backlog")} style={{fontSize:9,padding:"2px 7px",borderRadius:3}}>← BL</button>}
                    {col.k!=="in_progress"&&<button className="btn btn-g" onClick={()=>move(task.id,"in_progress")} style={{fontSize:9,padding:"2px 7px",borderRadius:3,color:"var(--amber)",borderColor:"rgba(255,152,0,.2)"}}>▶ WIP</button>}
                    {col.k!=="completed"&&<button className="btn btn-g" onClick={()=>move(task.id,"completed")} style={{fontSize:9,padding:"2px 7px",borderRadius:3,color:"var(--green)",borderColor:"rgba(0,230,118,.2)"}}>✓ DONE</button>}
                    <button className="btn btn-g" onClick={()=>del(task.id)} style={{fontSize:9,padding:"2px 7px",borderRadius:3,color:"var(--red)",borderColor:"rgba(255,59,59,.2)"}}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SALES HUB
// ─────────────────────────────────────────────────────────────────────────────
function SalesHub({notify, cfg, apiKey}) {
  const [topic, setTopic] = useState("");
  const [type, setType] = useState("dm");
  const [output, setOutput] = useState("");
  const [loading, setLoad] = useState(false);
  const [err, setErr] = useState("");

  const types=[
    {k:"dm",l:"DM Sequence"},{k:"vsl",l:"VSL Script"},{k:"objection",l:"Objections"},
    {k:"email",l:"Email Sequence"},{k:"offer",l:"Offer Builder"}
  ];
  const prompts={
    dm:`Write a 5-part DM follow-up sequence for: "${topic}". Day 1, Day 3, Day 7, Day 14, Day 30. Under 80 words each. Vary: casual → value → offer → urgency → final.`,
    vsl:`Write a complete VSL for: "${topic}". HOOK | PROBLEM | STORY | SOLUTION | PROOF | OFFER | GUARANTEE | CTA. Stage directions included.`,
    objection:`Handle the 7 most common objections for "${topic}": Too expensive / Need to think / Wrong time / Tried before / Need to ask partner / DIY / How do I know it works. Word-for-word responses.`,
    email:`7-email sequence for "${topic}". Subject + preview for each. Spread over 21 days. Mix: value, story, social proof, offer. One goal per email.`,
    offer:`Build an irresistible offer for: "${topic}". Core promise, deliverables, price stack, guarantee, scarcity, one-liner. Make it undeniable.`,
  };

  const gen=async()=>{
    if(!topic.trim()||loading) return;
    setLoad(true); setErr(""); setOutput("");
    try {
      const r = await claude(getSysPrompt("CIPHER",cfg),[{role:"user",content:prompts[type]}], apiKey);
      setOutput(r); notify(`${cfg.agents.CIPHER.name} generated your ${type}!`);
    } catch(e){setErr(e.message);}
    setLoad(false);
  };

  return (
    <div className="fu">
      <div style={{marginBottom:22}}>
        <h1 style={{fontFamily:"var(--fd)",fontSize:26,fontWeight:800,letterSpacing:"-.02em",marginBottom:4}}>Sales Hub</h1>
        <p style={{color:"var(--t2)",fontSize:13}}>Powered by {cfg.agents.CIPHER.name} — Sales & Revenue.</p>
      </div>
      <div className="card" style={{padding:16,marginBottom:12}}>
        <div style={{display:"flex",gap:5,marginBottom:12,flexWrap:"wrap"}}>
          {types.map(t=>(
            <button key={t.k} onClick={()=>setType(t.k)} style={{
              padding:"5px 13px",borderRadius:4,fontSize:11,fontFamily:"var(--fb)",fontWeight:500,
              background:type===t.k?"rgba(255,59,59,.12)":"var(--s3)",
              color:type===t.k?"var(--red)":"var(--t2)",
              border:`1px solid ${type===t.k?"rgba(255,59,59,.3)":"var(--b1)"}`,
              cursor:"pointer",transition:"all .12s",
            }}>{t.l}</button>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}>
          <input className="input" placeholder="Product / offer / context..." value={topic} onChange={e=>setTopic(e.target.value)} style={{flex:1}} onKeyDown={e=>e.key==="Enter"&&gen()}/>
          <button className="btn btn-a" onClick={gen} disabled={loading||!topic.trim()}>
            {loading?<><Spin color="#060500"/>WRITING</>:"GENERATE →"}
          </button>
        </div>
        {err&&<div style={{color:"var(--red)",fontSize:11,marginTop:8,fontFamily:"var(--fm)"}}>⚠ {err}</div>}
      </div>
      {output&&(
        <div className="card" style={{padding:16,borderLeft:`3px solid ${cfg.agents.CIPHER.color}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <Avatar id="CIPHER" size={24} cfg={cfg}/>
              <span style={{fontFamily:"var(--fd)",fontSize:12,fontWeight:700,color:cfg.agents.CIPHER.color}}>{cfg.agents.CIPHER.name} OUTPUT</span>
            </div>
            <button className="btn btn-g" onClick={()=>navigator.clipboard?.writeText(output)} style={{fontSize:10,padding:"4px 10px"}}>COPY</button>
          </div>
          <pre style={{fontSize:13,lineHeight:1.8,whiteSpace:"pre-wrap",color:"var(--t1)",fontFamily:"var(--fb)"}}>{output}</pre>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FUNNEL
// ─────────────────────────────────────────────────────────────────────────────
function Funnel({notify, cfg, apiKey}) {
  const [offer, setOffer] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoad] = useState(false);
  const [err, setErr] = useState("");

  const build=async()=>{
    if(!offer.trim()||loading) return;
    setLoad(true); setErr(""); setOutput("");
    try {
      const r=await claude(getSysPrompt("CIPHER",cfg),[{role:"user",content:`Design a complete high-converting funnel for: "${offer}".\n\n## FUNNEL ARCHITECTURE\n## LEAD MAGNET\n## LANDING PAGE STRUCTURE\n## EMAIL SEQUENCE (7 emails with subject lines)\n## OFFER STACK (upsells/downsells)\n## TRAFFIC STRATEGY\n## 90-DAY REVENUE PROJECTION (3 scenarios)\n\nMake it executable from day one.`}], apiKey);
      setOutput(r); notify("Funnel architected by "+cfg.agents.CIPHER.name+"!");
    } catch(e){setErr(e.message);}
    setLoad(false);
  };

  const stages=[
    {l:"TRAFFIC",c:"#B388FF",d:"Organic + paid"},
    {l:"LEADS",c:"#3B82F6",d:"Email capture"},
    {l:"PROSPECTS",c:"var(--amber)",d:"Qualified leads"},
    {l:"CALLS",c:"var(--cyan)",d:"Booked sessions"},
    {l:"CLIENTS",c:"var(--green)",d:"Closed deals"},
    {l:"REVENUE",c:"var(--a)",d:"Monthly recurring"},
  ];

  return (
    <div className="fu">
      <div style={{marginBottom:22}}>
        <h1 style={{fontFamily:"var(--fd)",fontSize:26,fontWeight:800,letterSpacing:"-.02em",marginBottom:4}}>Funnel Builder</h1>
        <p style={{color:"var(--t2)",fontSize:13}}>AI-architected revenue funnels. Powered by {cfg.agents.CIPHER.name}.</p>
      </div>
      <div className="card" style={{padding:16,marginBottom:12}}>
        <SH>FUNNEL STAGES</SH>
        <div style={{display:"flex",gap:5,alignItems:"center",overflowX:"auto",paddingBottom:4}}>
          {stages.map((s,i)=>(
            <div key={s.l} style={{display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
              <div style={{textAlign:"center",padding:"10px 14px",background:`${s.c}12`,border:`1px solid ${s.c}30`,borderRadius:5,minWidth:90}}>
                <div style={{fontSize:11,fontFamily:"var(--fd)",fontWeight:700,color:s.c,letterSpacing:".04em"}}>{s.l}</div>
                <div style={{fontSize:9,color:"var(--t3)",marginTop:3}}>{s.d}</div>
              </div>
              {i<stages.length-1&&<div style={{color:"var(--t3)",fontSize:14}}>→</div>}
            </div>
          ))}
        </div>
      </div>
      <div className="card" style={{padding:16,marginBottom:12}}>
        <div style={{display:"flex",gap:8}}>
          <input className="input" placeholder="Describe your offer... e.g. $5K/mo AI systems for 6-figure creators" value={offer} onChange={e=>setOffer(e.target.value)} style={{flex:1}} onKeyDown={e=>e.key==="Enter"&&build()}/>
          <button className="btn btn-a" onClick={build} disabled={loading||!offer.trim()}>
            {loading?<><Spin color="#060500"/>BUILDING</>:"BUILD →"}
          </button>
        </div>
        {err&&<div style={{color:"var(--red)",fontSize:11,marginTop:8,fontFamily:"var(--fm)"}}>⚠ {err}</div>}
      </div>
      {output&&(
        <div className="card" style={{padding:16,borderLeft:"3px solid var(--a)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <span style={{fontFamily:"var(--fd)",fontSize:12,fontWeight:700,color:"var(--a)"}}>FUNNEL ARCHITECTURE</span>
            <button className="btn btn-g" onClick={()=>navigator.clipboard?.writeText(output)} style={{fontSize:10,padding:"4px 10px"}}>COPY</button>
          </div>
          <pre style={{fontSize:13,lineHeight:1.8,whiteSpace:"pre-wrap",color:"var(--t1)",fontFamily:"var(--fb)"}}>{output}</pre>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CALLS
// ─────────────────────────────────────────────────────────────────────────────
function Calls({notify, cfg, apiKey}) {
  const [sel, setSel] = useState(null);
  const [analyses, setAn] = useState({});
  const [loading, setLoad] = useState(null);
  const [custom, setCust] = useState("");
  const [showCust, setShowCust] = useState(false);

  const calls=[
    {id:1,name:"Chad Larson — Client Call",date:"Feb 29",outcome:"closed",ctx:"Aligned on marketing strategy and AI app development. Enrolled at $4K/mo."},
    {id:2,name:"Impromptu Zoom — Prospects",date:"Feb 22",outcome:"follow-up",ctx:"AI-driven affiliate management collaboration. Budget $3-5K range. Needs nurturing."},
    {id:3,name:"Meeting — AI Consultant",date:"Feb 18",outcome:"closed",ctx:"Client comms and automation. $10K package. Accepted. Starts next week."},
    {id:4,name:"Da Edgar — Discovery",date:"Feb 15",outcome:"follow-up",ctx:"Solo product launch. Interested but wants case studies. Send by Friday."},
    {id:5,name:"Tom Pennington — Strategy",date:"Feb 12",outcome:"no-close",ctx:"Business coaching. Great rapport, budget mismatch. Add to 90-day nurture."},
  ];

  const analyze=async(call)=>{
    setSel(call);
    if(analyses[call.id]) return;
    setLoad(call.id);
    try {
      const r=await claude(getSysPrompt("ORACLE",cfg),[{role:"user",content:`Analyze this sales call for ${cfg.brandName}:\nCall: ${call.name}\nOutcome: ${call.outcome}\nContext: ${call.ctx}\n\n## BUYING SIGNALS\n## OBJECTIONS RAISED\n## WHAT WENT WELL\n## WHAT TO IMPROVE\n## NEXT ACTION (specific + timeline)\n## FOLLOW-UP MESSAGE TEMPLATE`}], apiKey);
      setAn(p=>({...p,[call.id]:r})); notify("Call analyzed!");
    } catch(e){setAn(p=>({...p,[call.id]:"Error: "+e.message}));}
    setLoad(null);
  };

  const oc={closed:{cls:"tgreen",l:"CLOSED"},"follow-up":{cls:"tamb",l:"FOLLOW-UP"},"no-close":{cls:"tred",l:"NO-CLOSE"}};

  return (
    <div className="fu">
      <div style={{marginBottom:22}}>
        <h1 style={{fontFamily:"var(--fd)",fontSize:26,fontWeight:800,letterSpacing:"-.02em",marginBottom:4}}>Sales Calls</h1>
        <p style={{color:"var(--t2)",fontSize:13}}>{cfg.agents.ORACLE.name} intelligence on every call.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:12}}>
        <div style={{display:"flex",flexDirection:"column",gap:7}}>
          {calls.map(c=>(
            <div key={c.id} className="card" onClick={()=>analyze(c)} style={{padding:12,cursor:"pointer",borderTop:sel?.id===c.id?"2px solid var(--purple)":undefined}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <div style={{fontSize:12,fontWeight:600,flex:1,lineHeight:1.3}}>{c.name}</div>
                <span className={`tag ${oc[c.outcome]?.cls}`} style={{marginLeft:6,flexShrink:0}}>{oc[c.outcome]?.l}</span>
              </div>
              <div style={{fontSize:11,color:"var(--t2)",marginBottom:5,lineHeight:1.4}}>{c.ctx.substring(0,65)}...</div>
              <div style={{fontSize:9,color:"var(--t3)",fontFamily:"var(--fm)"}}>{c.date}</div>
            </div>
          ))}
          <button className="btn btn-g" onClick={()=>setShowCust(p=>!p)} style={{fontSize:11,justifyContent:"center"}}>+ CUSTOM TRANSCRIPT</button>
          {showCust&&(
            <div className="card fi" style={{padding:10}}>
              <textarea className="input" placeholder="Paste transcript or summary..." value={custom} onChange={e=>setCust(e.target.value)} style={{height:80,marginBottom:8}}/>
              <button className="btn btn-a" style={{width:"100%",justifyContent:"center",fontSize:11}} onClick={async()=>{
                if(!custom.trim()) return; setLoad("c");
                try {
                  const r=await claude(getSysPrompt("ORACLE",cfg),[{role:"user",content:`Analyze this call transcript:\n\n${custom}\n\n## BUYING SIGNALS\n## OBJECTIONS\n## WINS\n## IMPROVEMENTS\n## NEXT ACTION`}], apiKey);
                  setSel({id:"c",name:"Custom Transcript",date:"Today",outcome:"analyzed",ctx:custom});
                  setAn(p=>({...p,c:r})); notify("Analyzed!");
                } catch(e){}
                setLoad(null);
              }} disabled={loading==="c"}>{loading==="c"?<><Spin color="#060500"/>ANALYZING</>:"ANALYZE →"}</button>
            </div>
          )}
        </div>
        <div className="card" style={{padding:18}}>
          {!sel?<div style={{textAlign:"center",padding:"50px 20px",color:"var(--t3)"}}>
            <div style={{fontSize:36,marginBottom:10,filter:`drop-shadow(0 0 12px ${cfg.agents.ORACLE.color})`}}>{cfg.agents.ORACLE.icon}</div>
            <div style={{fontFamily:"var(--fd)",fontSize:15,fontWeight:700,marginBottom:5}}>{cfg.agents.ORACLE.name}</div>
            <div style={{fontSize:12}}>Select a call for intelligence briefing.</div>
          </div>:loading===sel.id?<div style={{textAlign:"center",padding:"50px 20px"}}>
            <div style={{display:"flex",justifyContent:"center",gap:7,marginBottom:14}}>
              {[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:cfg.agents.ORACLE.color,animation:`pulse 1s ease ${i*.2}s infinite`}}/>)}
            </div>
            <div style={{fontSize:13,color:cfg.agents.ORACLE.color,fontFamily:"var(--fm)"}}>ORACLE analyzing...</div>
          </div>:(
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,paddingBottom:12,borderBottom:"1px solid var(--b1)"}}>
                <div>
                  <div style={{fontFamily:"var(--fd)",fontSize:15,fontWeight:700}}>{sel.name}</div>
                  <div style={{fontSize:11,color:"var(--t2)"}}>{sel.date}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:7}}>
                  <Avatar id="ORACLE" size={24} cfg={cfg}/>
                  <span style={{fontSize:10,fontFamily:"var(--fm)",color:cfg.agents.ORACLE.color}}>{cfg.agents.ORACLE.name}</span>
                </div>
              </div>
              <pre style={{fontSize:13,lineHeight:1.8,whiteSpace:"pre-wrap",color:"var(--t1)",fontFamily:"var(--fb)"}}>{analyses[sel.id]}</pre>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKILLS
// ─────────────────────────────────────────────────────────────────────────────
function Skills({skills, setSkills, notify, cfg, apiKey}) {
  const [outs, setOuts] = useState({});
  const [loading, setLoad] = useState(null);

  const run=async(sk)=>{
    setLoad(sk.id);
    try {
      const r=await claude(getSysPrompt(sk.agent,cfg),[{role:"user",content:`Execute the "${sk.title}" skill.\n${sk.desc}\n\nProvide complete step-by-step execution output. Be thorough and actionable.`}], apiKey);
      setOuts(p=>({...p,[sk.id]:r}));
      setSkills(p=>{const u=p.map(s=>s.id===sk.id?{...s,runs:s.runs+1}:s); sSet("apex_skills_v3",u); return u;});
      notify(`Skill "${sk.title}" executed!`);
    } catch(e){setOuts(p=>({...p,[sk.id]:"Error: "+e.message}));}
    setLoad(null);
  };

  const grouped=Object.keys(cfg.agents).reduce((acc,id)=>{acc[id]=skills.filter(s=>s.agent===id);return acc;},{});

  return (
    <div className="fu">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div>
          <h1 style={{fontFamily:"var(--fd)",fontSize:26,fontWeight:800,letterSpacing:"-.02em",marginBottom:4}}>Skills</h1>
          <p style={{color:"var(--t2)",fontSize:13}}>Agent capabilities — run and track execution.</p>
        </div>
        <div style={{display:"flex",gap:10}}>
          <div className="card" style={{padding:"9px 16px",textAlign:"center"}}>
            <div style={{fontFamily:"var(--fd)",fontSize:18,fontWeight:800}}>{skills.length}</div>
            <div style={{fontSize:8,fontFamily:"var(--fm)",color:"var(--t3)"}}>SKILLS</div>
          </div>
          <div className="card" style={{padding:"9px 16px",textAlign:"center"}}>
            <div style={{fontFamily:"var(--fd)",fontSize:18,fontWeight:800,color:"var(--a)"}}>{skills.reduce((a,s)=>a+s.runs,0)}</div>
            <div style={{fontSize:8,fontFamily:"var(--fm)",color:"var(--t3)"}}>RUNS</div>
          </div>
        </div>
      </div>
      {Object.entries(cfg.agents).map(([id,a])=>{
        const agSkills=grouped[id];
        if(!agSkills?.length) return null;
        return (
          <div key={id} style={{marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:9}}>
              <Avatar id={id} size={22} level cfg={cfg}/>
              <span style={{fontFamily:"var(--fd)",fontWeight:700,fontSize:13}}>{a.name}</span>
              <span className="tag" style={{marginLeft:2}}>{agSkills.length}</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:9}}>
              {agSkills.map(sk=>(
                <div key={sk.id} className="card" style={{padding:13}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <div style={{fontSize:13,fontWeight:700,fontFamily:"var(--fd)",lineHeight:1.2}}>{sk.title}</div>
                    <span style={{fontFamily:"var(--fm)",fontSize:10,color:"var(--a)"}}>{sk.runs}×</span>
                  </div>
                  <p style={{fontSize:11,color:"var(--t2)",marginBottom:9,lineHeight:1.5}}>{sk.desc}</p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:9}}>
                    {sk.tags.map(t=><span key={t} className="tag">{t}</span>)}
                  </div>
                  <button className="btn btn-g" onClick={()=>run(sk)} disabled={loading===sk.id} style={{width:"100%",justifyContent:"center",fontSize:10}}>
                    {loading===sk.id?<><Spin/>RUNNING</>:"▷ RUN SKILL"}
                  </button>
                  {outs[sk.id]&&(
                    <div style={{marginTop:9,padding:"9px 11px",background:"var(--s2)",borderRadius:4,border:"1px solid var(--b1)",maxHeight:160,overflowY:"auto"}}>
                      <div style={{fontSize:8,fontFamily:"var(--fm)",color:a.color,marginBottom:5,letterSpacing:".1em"}}>OUTPUT</div>
                      <pre style={{fontSize:11,lineHeight:1.6,whiteSpace:"pre-wrap",color:"var(--t2)",fontFamily:"var(--fb)"}}>{outs[sk.id]}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SOPs
// ─────────────────────────────────────────────────────────────────────────────
function SOPs({sops, notify, cfg, apiKey}) {
  const [expanded, setExp] = useState(null);
  const [content, setCont] = useState({});
  const [loading, setLoad] = useState(null);

  const expand=async(sop)=>{
    if(expanded===sop.id){setExp(null);return;}
    setExp(sop.id);
    if(content[sop.id]) return;
    setLoad(sop.id);
    try {
      const r=await claude(getSysPrompt(sop.agent,cfg),[{role:"user",content:`Write the complete SOP for: "${sop.title}".\nSections: ${sop.sections.join(", ")}.\n\nFor each section: numbered steps, specific actions, decision points, time estimates.\nMake it so clear a new team member can execute it on day one.`}], apiKey);
      setCont(p=>({...p,[sop.id]:r})); notify(`SOP "${sop.title}" generated!`);
    } catch(e){setCont(p=>({...p,[sop.id]:"Error: "+e.message}));}
    setLoad(null);
  };

  const catCls={content:"tamb",sales:"tred",research:"tpur",clients:"tg",dev:"tc",operations:"tgreen"};

  return (
    <div className="fu">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div>
          <h1 style={{fontFamily:"var(--fd)",fontSize:26,fontWeight:800,letterSpacing:"-.02em",marginBottom:4}}>SOPs</h1>
          <p style={{color:"var(--t2)",fontSize:13}}>Click any SOP to generate the full document with {cfg.agents.APEX.name}.</p>
        </div>
        <span className="tag tgreen">{sops.length} ACTIVE</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:10}}>
        {sops.map((sop,idx)=>{
          const a=cfg.agents[sop.agent];
          const isOpen=expanded===sop.id;
          return (
            <div key={sop.id} className="card fu" style={{padding:14,cursor:"pointer",animationDelay:`${idx*.05}s`,borderTop:isOpen?`2px solid ${a?.color}`:undefined}} onClick={()=>expand(sop)}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{fontSize:13,fontWeight:700,fontFamily:"var(--fd)",lineHeight:1.2,flex:1}}>{sop.title}</div>
                <div style={{display:"flex",gap:4,marginLeft:7,flexShrink:0}}>
                  <span className={`tag ${catCls[sop.cat]||""}`}>{sop.cat}</span>
                  <span className="tag tgreen">active</span>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                <Avatar id={sop.agent} size={16} cfg={cfg}/>
                <span style={{fontSize:10,fontFamily:"var(--fm)",color:a?.color}}>{a?.name}</span>
              </div>
              <div style={{fontSize:10,color:"var(--t3)",lineHeight:1.5,marginBottom:8}}>
                {sop.sections.slice(0,3).map((s,i)=>`${i+1}. ${s}`).join("  ·  ")}{sop.sections.length>3&&`  +${sop.sections.length-3} more`}
              </div>
              <div style={{fontSize:10,fontFamily:"var(--fm)",color:isOpen?a?.color:"var(--t3)",textAlign:"right"}}>
                {isOpen?"▲ COLLAPSE":"▼ GENERATE FULL SOP"}
              </div>
              {isOpen&&(
                <div className="fi" onClick={e=>e.stopPropagation()} style={{marginTop:12,paddingTop:12,borderTop:"1px solid var(--b1)"}}>
                  {loading===sop.id?(
                    <div style={{display:"flex",gap:7,alignItems:"center",padding:"10px 0"}}>
                      <Spin color={a?.color}/><span style={{fontSize:12,color:"var(--t2)",fontFamily:"var(--fm)"}}>Generating SOP...</span>
                    </div>
                  ):(
                    <>
                      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:8}}>
                        <button className="btn btn-g" onClick={()=>navigator.clipboard?.writeText(content[sop.id]||"")} style={{fontSize:10,padding:"3px 9px"}}>COPY</button>
                      </div>
                      <pre style={{fontSize:12,lineHeight:1.7,whiteSpace:"pre-wrap",color:"var(--t1)",fontFamily:"var(--fb)",maxHeight:380,overflowY:"auto"}}>{content[sop.id]}</pre>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WEEKLY REPORT
// ─────────────────────────────────────────────────────────────────────────────
function Report({tasks, notify, cfg, apiKey}) {
  const [report, setReport] = useState("");
  const [loading, setLoad] = useState(false);
  const [err, setErr] = useState("");
  const [saved, setSaved] = useState([]);

  useEffect(()=>{ sGet("apex_reports",[]).then(setSaved); },[]);

  const gen=async()=>{
    setLoad(true); setErr(""); setReport("");
    const ctx=`Tasks Completed: ${tasks.filter(t=>t.status==="completed").map(t=>t.title).join(", ")||"None"}\nIn Progress: ${tasks.filter(t=>t.status==="in_progress").map(t=>`${t.title} (${t.agent})`).join(", ")}\nBacklog: ${tasks.filter(t=>t.status==="backlog").map(t=>t.title).join(", ")}\nDate: ${new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}`;
    try {
      const r=await claude(getSysPrompt("APEX",cfg),[{role:"user",content:`Generate a Forbes-quality weekly executive report for ${cfg.brandName}:\n${ctx}\n\n## EXECUTIVE SUMMARY\n## AGENT PERFORMANCE REVIEW\n## KEY WINS\n## BLOCKERS & RISKS\n## REVENUE PIPELINE\n## CONTENT PERFORMANCE\n## NEXT WEEK PRIORITIES\n## 30-60-90 DAY OUTLOOK\n\nBe direct, specific, action-oriented.`}], apiKey);
      setReport(r);
      const e={date:new Date().toLocaleDateString(),report:r};
      const ns=[e,...saved.slice(0,4)]; setSaved(ns); sSet("apex_reports",ns);
      notify("Executive report generated and saved!");
    } catch(e){setErr(e.message);}
    setLoad(false);
  };

  return (
    <div className="fu">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div>
          <h1 style={{fontFamily:"var(--fd)",fontSize:26,fontWeight:800,letterSpacing:"-.02em",marginBottom:4}}>Weekly Report</h1>
          <p style={{color:"var(--t2)",fontSize:13}}>{cfg.agents.APEX.name} compiles your executive briefing.</p>
        </div>
        <button className="btn btn-a" onClick={gen} disabled={loading}>
          {loading?<><Spin color="#060500"/>COMPILING</>:"⚡ GENERATE REPORT"}
        </button>
      </div>

      {saved.length>0&&(
        <div style={{marginBottom:12}}>
          <SH>SAVED REPORTS</SH>
          <div style={{display:"flex",gap:7}}>
            {saved.map((s,i)=>(
              <button key={i} className="btn btn-g" onClick={()=>setReport(s.report)} style={{fontSize:10}}>{s.date}</button>
            ))}
          </div>
        </div>
      )}

      {!report&&!loading&&(
        <div className="card" style={{padding:"50px 20px",textAlign:"center"}}>
          <div style={{fontSize:44,marginBottom:10,filter:"drop-shadow(0 0 18px var(--a))"}}>◈</div>
          <div style={{fontFamily:"var(--fd)",fontSize:18,fontWeight:800,marginBottom:7}}>Weekly Executive Briefing</div>
          <div style={{color:"var(--t2)",fontSize:13,maxWidth:380,margin:"0 auto 22px",lineHeight:1.6}}>{cfg.agents.APEX.name} will compile all agent activity and business metrics into a comprehensive weekly report.</div>
          <button className="btn btn-a" onClick={gen}>GENERATE THIS WEEK'S REPORT →</button>
        </div>
      )}
      {loading&&(
        <div className="card" style={{padding:"50px 20px",textAlign:"center"}}>
          <div style={{display:"flex",justifyContent:"center",gap:7,marginBottom:14}}>
            {[0,1,2,3,4].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:"var(--a)",animation:`pulse 1s ease ${i*.12}s infinite`}}/>)}
          </div>
          <div style={{fontFamily:"var(--fd)",fontSize:14,color:"var(--a)"}}>{cfg.agents.APEX.name} compiling report...</div>
        </div>
      )}
      {err&&<div style={{color:"var(--red)",fontFamily:"var(--fm)",fontSize:11,padding:10,background:"rgba(255,59,59,.1)",borderRadius:5,marginBottom:12}}>⚠ {err}</div>}
      {report&&(
        <div className="card" style={{padding:22,borderTop:"3px solid var(--a)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,paddingBottom:14,borderBottom:"1px solid var(--b1)"}}>
            <div style={{display:"flex",alignItems:"center",gap:11}}>
              <Avatar id="APEX" size={38} dot level cfg={cfg}/>
              <div>
                <div style={{fontFamily:"var(--fd)",fontWeight:800,fontSize:14}}>{cfg.agents.APEX.name} — WEEKLY REPORT</div>
                <div style={{fontSize:11,color:"var(--t2)"}}>{new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
              </div>
            </div>
            <div style={{display:"flex",gap:7}}>
              <button className="btn btn-g" onClick={()=>navigator.clipboard?.writeText(report)} style={{fontSize:10,padding:"4px 10px"}}>COPY</button>
              <button className="btn btn-a" onClick={gen} style={{fontSize:10,padding:"4px 10px"}}>REGEN</button>
            </div>
          </div>
          <pre style={{fontSize:13,lineHeight:1.9,whiteSpace:"pre-wrap",color:"var(--t1)",fontFamily:"var(--fb)"}}>{report}</pre>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ORG CHART
// ─────────────────────────────────────────────────────────────────────────────
function OrgChart({cfg}) {
  const agents = Object.entries(cfg.agents);
  const [apex, ...reports] = agents;

  return (
    <div className="fu">
      <div style={{marginBottom:22}}>
        <h1 style={{fontFamily:"var(--fd)",fontSize:26,fontWeight:800,letterSpacing:"-.02em",marginBottom:4}}>Org Chart</h1>
        <p style={{color:"var(--t2)",fontSize:13}}>Your AI executive team. One mission: build, sell, scale.</p>
      </div>
      <div style={{display:"flex",justifyContent:"center",marginBottom:22}}>
        <div className="card" style={{padding:"18px 28px",textAlign:"center",borderTop:`3px solid ${apex[1].color}`,boxShadow:`0 0 28px ${apex[1].color}15`,width:200}}>
          <Avatar id={apex[0]} size={50} dot level cfg={cfg}/>
          <div style={{fontFamily:"var(--fd)",fontSize:16,fontWeight:800,marginTop:9}}>{apex[1].name}</div>
          <div style={{fontSize:11,color:apex[1].color,fontFamily:"var(--fm)",marginBottom:7}}>{apex[1].role}</div>
          <span className="tag tg">COMMANDER</span>
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"center",height:18}}>
        <div style={{width:2,background:`linear-gradient(var(--a),var(--b2))`}}/>
      </div>
      <div style={{width:"88%",margin:"0 auto",height:1,background:`linear-gradient(90deg,transparent,var(--b2),transparent)`}}/>
      <div style={{display:"grid",gridTemplateColumns:`repeat(${reports.length},1fr)`,gap:10,marginTop:20}}>
        {reports.map(([id,a],i)=>(
          <div key={id} className="card fu" style={{padding:"14px 10px",textAlign:"center",borderTop:`2px solid ${a.color}`,animationDelay:`${i*.07}s`}}>
            <Avatar id={id} size={36} dot level cfg={cfg}/>
            <div style={{fontFamily:"var(--fd)",fontSize:13,fontWeight:800,marginTop:8,marginBottom:2}}>{a.name}</div>
            <div style={{fontSize:9,color:a.color,fontFamily:"var(--fm)",marginBottom:7}}>{a.role}</div>
            <div style={{marginBottom:7}}><XPBar id={id} cfg={cfg}/></div>
            <div style={{fontSize:10,color:"var(--t2)",lineHeight:1.4}}>{getSysPrompt(id,cfg).substring(0,70)}...</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT TRACKER
// ─────────────────────────────────────────────────────────────────────────────
function Tracker() {
  const stats=[{l:"TOTAL PIECES",v:32},{l:"PUBLISHED",v:16,h:true},{l:"IN PRODUCTION",v:13},{l:"IDEAS",v:12}];
  const top=[{t:"POV: your mom's reaction...",v:2100},{t:"The Content System I use...",v:1100},{t:"Bro this is a SCAM 🤡",v:1000},{t:"I shut down my $20k/m...",v:600},{t:"The exact offer I charge...",v:500}];
  const mx=Math.max(...top.map(t=>t.v));
  return (
    <div className="fu">
      <div style={{marginBottom:22}}>
        <h1 style={{fontFamily:"var(--fd)",fontSize:26,fontWeight:800,letterSpacing:"-.02em",marginBottom:4}}>Content Tracker</h1>
        <p style={{color:"var(--t2)",fontSize:13}}>Connect Instagram Graph API + YouTube Data API for live stats.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
        {stats.map(s=>(
          <div key={s.l} className="card" style={{padding:"13px 15px",borderTop:s.h?"2px solid var(--cyan)":undefined}}>
            <div className="stat" style={{color:s.h?"var(--cyan)":"var(--t1)",marginBottom:3}}>{s.v}</div>
            <div style={{fontSize:8,fontFamily:"var(--fm)",color:"var(--t3)",letterSpacing:".1em"}}>{s.l}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{padding:16,marginBottom:14}}>
        <SH>TOP PERFORMING CONTENT <span className="tag tamb" style={{marginLeft:4}}>DEMO DATA</span></SH>
        <div style={{display:"flex",alignItems:"flex-end",gap:10,height:120,marginBottom:10}}>
          {top.map((c,i)=>(
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <div style={{fontSize:10,fontFamily:"var(--fm)",color:"var(--t2)",marginBottom:3}}>{c.v.toLocaleString()}</div>
              <div style={{width:"100%",background:"var(--cyan)",height:`${(c.v/mx)*90}px`,borderRadius:"4px 4px 0 0",opacity:.75,minHeight:4}}/>
              <div style={{fontSize:9,fontFamily:"var(--fm)",color:"var(--t3)",textAlign:"center",lineHeight:1.3}}>{c.t.substring(0,16)}...</div>
            </div>
          ))}
        </div>
      </div>
      <div className="card" style={{padding:14}}>
        <div style={{fontSize:12,color:"var(--t2)",lineHeight:1.6}}>
          <span style={{color:"var(--a)",fontWeight:600}}>To enable live data:</span> Ask {" "}
          <span style={{color:"var(--cyan)"}}>FORGE</span> to generate the Instagram Graph API + YouTube Data API integration. Requires a Meta Developer App and Google Cloud Console project. FORGE can write the complete code.
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PIPELINE
// ─────────────────────────────────────────────────────────────────────────────
function Pipeline() {
  const stages=[
    {l:"IDEAS",c:"var(--purple)",n:12,items:["How I replaced my team with AI","My $30k/mo stack revealed","The system nobody shows you","Why most content falls flat","Competitor breakdown LIVE"]},
    {l:"RESEARCH",c:"#3B82F6",n:4,items:["AI in business 2026","Hook pattern analysis","Competitor deep dive","Algorithm shift report"]},
    {l:"SCRIPTING",c:"var(--amber)",n:3,items:["APEX OS reveal reel","Sales system breakdown","Day in the life: AI CEO"]},
    {l:"PRODUCTION",c:"var(--red)",n:2,items:["$0 to $10K blueprint","My biggest L story"]},
    {l:"REVIEW",c:"var(--cyan)",n:1,items:["AI replaces employees — hot take"]},
    {l:"PUBLISHED",c:"var(--green)",n:16,items:["POV: your mom's reaction...","This is FREE sauce","The world is ending...","$30K at 19 — no degree","My AI team breakdown"]},
  ];
  return (
    <div className="fu">
      <div style={{marginBottom:22}}>
        <h1 style={{fontFamily:"var(--fd)",fontSize:26,fontWeight:800,letterSpacing:"-.02em",marginBottom:4}}>Content Pipeline</h1>
        <p style={{color:"var(--t2)",fontSize:13}}>Every piece of content tracked from idea to published.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:9}}>
        {stages.map(s=>(
          <div key={s.l} className="card" style={{overflow:"hidden"}}>
            <div style={{padding:"9px 10px",background:`${s.c}12`,borderBottom:"1px solid var(--b1)"}}>
              <div style={{fontFamily:"var(--fd)",fontSize:9,fontWeight:700,color:s.c,letterSpacing:".1em",marginBottom:2}}>{s.l}</div>
              <div style={{fontFamily:"var(--fd)",fontSize:20,fontWeight:900,lineHeight:1}}>{s.n}</div>
            </div>
            <div style={{padding:"7px 7px",display:"flex",flexDirection:"column",gap:4}}>
              {s.items.map((item,i)=>(
                <div key={i} style={{fontSize:10,padding:"4px 7px",background:"var(--s2)",borderRadius:3,lineHeight:1.3,borderLeft:`2px solid ${s.c}`,color:"var(--t2)"}}>{item}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// API KEY BANNER
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// API KEY BANNER
// ─────────────────────────────────────────────────────────────────────────────
function ApiKeyBanner({apiKey, setApiKey}) {
  const [show, setShow] = useState(false);
  const [input, setInput] = useState("");

  const save = () => {
    const k = input.trim();
    if (!k.startsWith("gsk_")) { alert("Key should start with gsk_"); return; }
    setApiKey(k);
    sSet("apex_apikey", k);
    setShow(false);
    setInput("");
  };

  if (apiKey) return (
    <div style={{position:"fixed",top:"var(--topbar)",left:"var(--sidebar)",right:0,zIndex:900,
      background:"rgba(0,230,118,.08)",borderBottom:"1px solid rgba(0,230,118,.2)",
      padding:"5px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <span style={{fontSize:11,fontFamily:"var(--fm)",color:"var(--green)"}}>✓ API KEY ACTIVE — agents are live</span>
      <button onClick={()=>{setApiKey("");sSet("apex_apikey","");}} style={{fontSize:10,fontFamily:"var(--fm)",background:"none",border:"none",color:"var(--t3)",cursor:"pointer"}}>REMOVE KEY</button>
    </div>
  );

  return (
    <>
      <div style={{position:"fixed",top:"var(--topbar)",left:"var(--sidebar)",right:0,zIndex:900,
        background:"rgba(232,184,75,.1)",borderBottom:"1px solid rgba(232,184,75,.3)",
        padding:"7px 18px",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}
        onClick={()=>setShow(true)}>
        <span style={{fontSize:11,fontFamily:"var(--fm)",color:"var(--a)"}}>⚠ NO API KEY — agents offline. Click to add your Groq API key.</span>
        <button className="btn btn-a" style={{fontSize:10,padding:"3px 10px"}} onClick={e=>{e.stopPropagation();setShow(true);}}>ADD KEY →</button>
      </div>
      {show && (
        <div style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,.7)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShow(false)}>
          <div className="card" style={{padding:28,width:440,maxWidth:"90vw"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontFamily:"var(--fd)",fontSize:18,fontWeight:800,marginBottom:6}}>Add Groq API Key</div>
            <p style={{fontSize:13,color:"var(--t2)",lineHeight:1.6,marginBottom:16}}>
              Key stays securely in your browser only. Powered by ultra-fast Groq LPUs.
            </p>
            <input className="input" placeholder="gsk_..." value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&save()}
              style={{marginBottom:12,fontFamily:"var(--fm)",fontSize:12}}/>
            <div style={{display:"flex",gap:8}}>
              <button className="btn btn-a" onClick={save} style={{flex:1,justifyContent:"center"}}>SAVE & ACTIVATE</button>
              <button className="btn btn-g" onClick={()=>setShow(false)}>CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default function App() {
  const [cfg, setCfg]         = useState(DEFAULT_CONFIG);
  const [onboarded, setOnb]   = useState(false);
  const [active, setActive]   = useState("dashboard");
  const [tasks, setTasks]     = useState(DEFAULT_TASKS);
  const [sops]                = useState(DEFAULT_SOPS);
  const [skills, setSkills]   = useState(DEFAULT_SKILLS);
  const [notif, setNotif]     = useState(null);
  const [apiKey, setApiKey]   = useState("");
  const loaded = useRef(false);

  // Boot: load config + check onboarding
  useEffect(()=>{
    Promise.all([
      sGet("apex_cfg", DEFAULT_CONFIG),
      sGet("apex_onboarded", false),
      sGet("apex_tasks_v3", DEFAULT_TASKS),
      sGet("apex_skills_v3", DEFAULT_SKILLS),
      sGet("apex_apikey", ""),
    ]).then(([c, ob, t, sk, k])=>{
      setCfg(c || DEFAULT_CONFIG);
      setOnb(ob || false);
      setTasks(t || DEFAULT_TASKS);
      setSkills(sk || DEFAULT_SKILLS);
      setApiKey(k || "");
      loaded.current = true;
    }).catch(()=>{
      setCfg(DEFAULT_CONFIG);
      setOnb(false);
      loaded.current = true;
    });
  },[]);

  // Persist
  useEffect(()=>{ if(loaded.current){ sSet("apex_tasks_v3",tasks); }},[tasks]);
  useEffect(()=>{ if(loaded.current){ sSet("apex_skills_v3",skills); }},[skills]);
  useEffect(()=>{ if(cfg&&loaded.current){ sSet("apex_cfg",cfg); }},[cfg]);

  const notify = useCallback((msg)=>{ setNotif(null); setTimeout(()=>setNotif(msg),40); },[]);

  const completeOnboarding = (newCfg) => {
    setCfg(newCfg); sSet("apex_cfg",newCfg);
    setOnb(true); sSet("apex_onboarded",true);
  };

  // Onboarding
  if(!onboarded) {
    return (
      <>
        <style>{makeCSS(DEFAULT_CONFIG.accentColor)}</style>
        <Onboarding onComplete={completeOnboarding}/>
      </>
    );
  }

  const ak = apiKey;
  const renderView = () => {
    const p = {cfg, notify, tasks, setTasks, apiKey:ak};
    switch(active) {
      case "dashboard": return <Dashboard {...p} setActive={setActive}/>;
      case "chat":      return <Chat cfg={cfg} notify={notify} apiKey={ak}/>;
      case "agents":    return <Agents cfg={cfg}/>;
      case "instagram": return <ContentGen platform="instagram" cfg={cfg} notify={notify} apiKey={ak}/>;
      case "youtube":   return <ContentGen platform="youtube" cfg={cfg} notify={notify} apiKey={ak}/>;
      case "pipeline":  return <Pipeline/>;
      case "tracker":   return <Tracker/>;
      case "taskboard": return <TaskBoard {...p}/>;
      case "report":    return <Report tasks={tasks} cfg={cfg} notify={notify} apiKey={ak}/>;
      case "saleshub":  return <SalesHub cfg={cfg} notify={notify} apiKey={ak}/>;
      case "funnel":    return <Funnel cfg={cfg} notify={notify} apiKey={ak}/>;
      case "calls":     return <Calls cfg={cfg} notify={notify} apiKey={ak}/>;
      case "skills":    return <Skills skills={skills} setSkills={setSkills} cfg={cfg} notify={notify} apiKey={ak}/>;
      case "sops":      return <SOPs sops={sops} cfg={cfg} notify={notify} apiKey={ak}/>;
      case "orgchart":  return <OrgChart cfg={cfg}/>;
      case "settings":  return <Settings cfg={cfg} setCfg={setCfg} notify={notify}/>;
      default:          return <Dashboard {...p} setActive={setActive}/>;
    }
  };

  const bannerHeight = "28px";

  return (
    <>
      <style>{makeCSS(cfg.accentColor)}</style>
      <TopBar cfg={cfg} liveCount={7}/>
      <ApiKeyBanner apiKey={apiKey} setApiKey={setApiKey}/>
      <Sidebar active={active} setActive={setActive} tasks={tasks} cfg={cfg}/>
      <main style={{marginLeft:"var(--sidebar)",marginTop:`calc(var(--topbar) + ${bannerHeight})`,minHeight:`calc(100vh - var(--topbar) - ${bannerHeight})`,padding:"24px 26px 40px",position:"relative",zIndex:1}}>
        {renderView()}
      </main>
      {notif && <Notif key={notif+Date.now()} msg={notif} onClose={()=>setNotif(null)}/>}
    </>
  );
}
