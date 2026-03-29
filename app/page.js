"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────────────────────────────────────
const makeCSS = (accent) => {
  const hex = accent.replace('#','');
  const r = parseInt(hex.substring(0,2),16);
  const g = parseInt(hex.substring(2,4),16);
  const b = parseInt(hex.substring(4,6),16);
  return `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#05070D;--s1:#090C14;--s2:#0F1220;--s3:#161928;--s4:#1C2033;
  --b1:#1E2235;--b2:#262A40;--t1:#E8EAF2;--t2:#7B82A0;--t3:#3D4260;
  --a:${accent};--a1:rgba(${r},${g},${b},0.1);--a2:rgba(${r},${g},${b},0.22);--a3:rgba(${r},${g},${b},0.4);
  --green:#00E676;--red:#FF3B3B;--amber:#FF9800;--cyan:#00E5FF;--purple:#B388FF;
  --sidebar:236px;--topbar:44px;--r:6px;
  --fd:'Syne',sans-serif;--fm:'DM Mono',monospace;--fb:'Instrument Sans',sans-serif;
}
body{font-family:var(--fb);background:var(--bg);color:var(--t1);min-height:100vh;overflow-x:hidden}
body::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(var(--b1) 1px,transparent 1px),linear-gradient(90deg,var(--b1) 1px,transparent 1px);background-size:44px 44px;opacity:.15}
::-webkit-scrollbar{width:3px;height:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--b2);border-radius:2px}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes ticker{from{transform:translateX(100vw)}to{transform:translateX(-100%)}}
@keyframes notifIn{0%{opacity:0;transform:translateX(110%)}10%{opacity:1;transform:translateX(0)}85%{opacity:1}100%{opacity:0;transform:translateX(110%)}}
.fu{animation:fadeUp .32s cubic-bezier(.16,1,.3,1) both} .fi{animation:fadeIn .22s ease both} .pulse{animation:pulse 2s ease-in-out infinite}
.card{background:var(--s1);border:1px solid var(--b1);border-radius:var(--r);position:relative;overflow:hidden}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--b2),transparent)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:8px 16px;border-radius:var(--r);font-family:var(--fd);font-size:12px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;cursor:pointer;border:none;transition:all .14s;user-select:none}
.btn-a{background:var(--a);color:#060500} .btn-a:hover{filter:brightness(1.12)} .btn-a:disabled{opacity:.4;cursor:not-allowed}
.btn-g{background:var(--s3);color:var(--t2);border:1px solid var(--b2)} .btn-g:hover{background:var(--s4);color:var(--t1);border-color:var(--t3)} .btn-g:disabled{opacity:.4;cursor:not-allowed}
.input{width:100%;padding:9px 12px;background:var(--s2);border:1px solid var(--b1);border-radius:var(--r);color:var(--t1);font-family:var(--fb);font-size:13px;outline:none;transition:border-color .14s}
.input::placeholder{color:var(--t3)} .input:focus{border-color:var(--a)} select.input{cursor:pointer;appearance:none} textarea.input{resize:vertical;min-height:72px;line-height:1.6}
.tag{display:inline-flex;align-items:center;padding:2px 7px;border-radius:3px;font-family:var(--fm);font-size:10px;background:var(--s3);color:var(--t3);border:1px solid var(--b1)}
.tg{background:var(--a1);color:var(--a);border-color:var(--a2)} .tc{background:rgba(0,229,255,.1);color:#00E5FF;border-color:rgba(0,229,255,.25)} .tgreen{background:rgba(0,230,118,.1);color:#00E676;border-color:rgba(0,230,118,.2)} .tred{background:rgba(255,59,59,.1);color:#FF3B3B;border-color:rgba(255,59,59,.2)} .tamb{background:rgba(255,152,0,.1);color:#FF9800;border-color:rgba(255,152,0,.2)} .tpur{background:rgba(179,136,255,.1);color:#B388FF;border-color:rgba(179,136,255,.2)}
.live{width:7px;height:7px;border-radius:50%;background:var(--green);box-shadow:0 0 7px var(--green);animation:pulse 2s infinite;flex-shrink:0}
.stat{font-family:var(--fd);font-size:26px;font-weight:800;letter-spacing:-.02em;line-height:1}
.sh{font-family:var(--fm);font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--t3)}
.kcard{background:var(--s2);border:1px solid var(--b1);border-radius:var(--r);padding:12px;transition:border-color .14s} .kcard:hover{border-color:var(--b2)}
.notif{position:fixed;top:56px;right:16px;z-index:9999;background:var(--s2);border:1px solid var(--b2);border-left:3px solid var(--a);border-radius:var(--r);padding:12px 16px;min-width:270px;animation:notifIn 4s ease forwards;box-shadow:0 8px 32px rgba(0,0,0,.5)}
.xpt{height:3px;background:var(--s3);border-radius:2px;overflow:hidden} .xpf{height:100%;border-radius:2px;transition:width 1s cubic-bezier(.16,1,.3,1)}
`;
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA & CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_CONFIG = {
  brandName: "RAWGROWTH", tagline: "AI Operating System", accentColor: "#E8B84B",
  agents: {
    APEX: { name:"APEX", role:"Commander / COO", icon:"◈", color:"#E8B84B" },
    ORACLE: { name:"ORACLE", role:"Research & Intel", icon:"◉", color:"#B388FF" },
    PULSE: { name:"PULSE", role:"Content Director", icon:"◎", color:"#FF9800" },
    CIPHER: { name:"CIPHER", role:"Sales & Revenue", icon:"◆", color:"#FF3B3B" },
    FORGE: { name:"FORGE", role:"Developer", icon:"⬡", color:"#00E5FF" },
    VAULT: { name:"VAULT", role:"Finance & Security", icon:"▣", color:"#00E676" },
    ECHO: { name:"ECHO", role:"Client Success", icon:"◇", color:"#FF6D00" },
  }
};

const getSysPrompt = (agentId, cfg) => {
  const a = cfg.agents[agentId]; const brand = cfg.brandName;
  const prompts = {
    APEX: `You are ${a.name}, Commander of ${brand}. Orchestrate agents, execute strategy. Think in systems. Numbered steps. Action-oriented.`,
    ORACLE: `You are ${a.name}, Research agent for ${brand}. Analyze markets/competitors. Speak in data. Use bullet points.`,
    PULSE: `You are ${a.name}, Content Director for ${brand}. Write raw, authentic scripts. Format: HOOK | BODY | CTA.`,
    CIPHER: `You are ${a.name}, Sales agent for ${brand}. Handle DM sequences, objection handling, CRM strategy. Copy must convert.`,
    FORGE: `You are ${a.name}, Developer agent for ${brand}. Build workflows, APIs. Speak in code and exact steps.`,
    VAULT: `You are ${a.name}, Finance agent for ${brand}. Track costs, ROI. Quantify everything.`,
    ECHO: `You are ${a.name}, Client Success agent for ${brand}. Handle onboarding. Solutions-focused.`
  }; return prompts[agentId] || prompts.APEX;
};

const DEFAULT_TASKS = [
  { id:"t1", title:"Weekly Competitor Scrape", agent:"ORACLE", status:"in_progress", priority:"high", created:"2026-03-01", desc:"Scrape top 10 competitor IG & YT for hooks and content patterns." },
  { id:"t2", title:"Token Cost Tracking Setup", agent:"VAULT", status:"in_progress", priority:"medium", created:"2026-03-01", desc:"Implement daily token cost tracking across all agents." },
  { id:"t3", title:"Discord Client Onboarding Flow", agent:"ECHO", status:"in_progress", priority:"high", created:"2026-03-01", desc:"Build automated onboarding sequence for new clients." },
  { id:"t4", title:"Supabase Agent Memory Layer", agent:"FORGE", status:"in_progress", priority:"high", created:"2026-03-01", desc:"Migrate agent memory to Supabase for cross-session persistence." },
  { id:"t5", title:"Nola Party Barges — Sales Copy", agent:"CIPHER", status:"completed", priority:"high", created:"2026-02-19", desc:"Full 7-page sales copy rewrite." },
  { id:"t6", title:"Q2 Content Strategy Document", agent:"PULSE", status:"backlog", priority:"medium", created:"2026-03-02", desc:"Full Q2 strategy: pillars, formats, 90-day calendar." },
  { id:"t7", title:"Sales Call Analysis — Feb Batch", agent:"ORACLE", status:"backlog", priority:"medium", created:"2026-03-02", desc:"Analyze Feb calls for objection patterns and close rate leaks." },
];
const DEFAULT_SOPS = [
  { id:"s1", title:"Content Creation Pipeline", agent:"PULSE", cat:"content", sections:["Overview","Research (5-10 min)","Hook Writing","Script Draft","Production","Publish"] },
  { id:"s2", title:"Sales Follow-Up Sequence", agent:"CIPHER", cat:"sales", sections:["Lead Stages","Day 1","Day 3","Day 7","Day 14","Final"] },
];
const DEFAULT_SKILLS = [
  { id:"sk1", agent:"FORGE", title:"Dashboard Development", desc:"Build and maintain the OS dashboard.", tags:["react","supabase","api","deploy"], runs:4 },
  { id:"sk8", agent:"PULSE", title:"Reel Script Generator", desc:"Instagram Reels: hook, body, CTA.", tags:["reels","hooks","instagram"], runs:23 },
];

// ─────────────────────────────────────────────────────────────────────────────
// NATIVE BROWSER STORAGE (Replaces Sandbox Storage)
// ─────────────────────────────────────────────────────────────────────────────
async function sGet(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try { const r = localStorage.getItem(key); if (r) return JSON.parse(r); } catch (e) {}
  return fallback;
}
async function sSet(key, val) {
  if (typeof window === "undefined") return;
  try { if (val === null || val === undefined) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
}

// ─────────────────────────────────────────────────────────────────────────────
// BACKEND API CONNECTION (Routes to /api/chat)
// ─────────────────────────────────────────────────────────────────────────────
async function callAI(system, messages, apiKey) {
  if (!apiKey) throw new Error("API key is missing! Please add it in the banner above.");
  
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system, messages, apiKey })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || `API Error: ${res.status}`);
  return data.reply || "";
}

// ─────────────────────────────────────────────────────────────────────────────
// SMALL COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function Avatar({ id, size=32, dot=false, level=false, cfg }) {
  const a = cfg?.agents?.[id]; const LV_MAP = {APEX:12, ORACLE:9, PULSE:11, CIPHER:10, FORGE:13, VAULT:8, ECHO:7};
  if (!a) return null;
  return (
    <div style={{position:"relative",display:"inline-flex",flexShrink:0}}>
      <div style={{ width:size, height:size, borderRadius:"50%", background:`${a.color}18`, border:`2px solid ${a.color}50`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*.38, fontFamily:"var(--fd)", fontWeight:800, color:a.color, boxShadow:`0 0 ${size*.25}px ${a.color}20`, }}>{a.icon}</div>
      {dot && <div style={{position:"absolute",bottom:0,right:0,width:9,height:9,borderRadius:"50%",background:"var(--green)",border:"2px solid var(--bg)",boxShadow:"0 0 6px var(--green)"}}/>}
      {level && <div style={{position:"absolute",top:-4,right:-4,background:a.color,color:"#05070D",fontSize:8,fontFamily:"var(--fm)",fontWeight:700,padding:"1px 4px",borderRadius:3,lineHeight:1.4}}>L{LV_MAP[id]??9}</div>}
    </div>
  );
}

function Spin({color="var(--a)"}) { return <div style={{width:14,height:14,border:`2px solid ${color}30`,borderTopColor:color,borderRadius:"50%",animation:"spin .7s linear infinite"}}/>; }

function Notif({msg, onClose}) {
  useEffect(()=>{ const t=setTimeout(onClose,4000); return ()=>clearTimeout(t); },[]);
  return (
    <div className="notif">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
        <div><div style={{fontSize:10,fontFamily:"var(--fm)",color:"var(--a)",letterSpacing:".1em",marginBottom:3}}>APEX OS</div><div style={{fontSize:13}}>{msg}</div></div>
        <button onClick={onClose} style={{background:"none",border:"none",color:"var(--t3)",cursor:"pointer",fontSize:16,lineHeight:1}}>×</button>
      </div>
    </div>
  );
}

function SH({children, right}) { return <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><span className="sh">{children}</span>{right}</div>; }

function XPBar({id, cfg}) {
  const XP_MAP = {APEX:78, ORACLE:55, PULSE:92, CIPHER:67, FORGE:44, VAULT:30, ECHO:61}; const LV_MAP = {APEX:12, ORACLE:9, PULSE:11, CIPHER:10, FORGE:13, VAULT:8, ECHO:7};
  const xp = XP_MAP[id] ?? 50; const lv = LV_MAP[id] ?? 9; const a = cfg?.agents?.[id];
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:9,fontFamily:"var(--fm)",color:"var(--t3)"}}>LV {lv}</span><span style={{fontSize:9,fontFamily:"var(--fm)",color:a?.color}}>{xp}%</span></div>
      <div className="xpt"><div className="xpf" style={{width:`${xp}%`,background:`linear-gradient(90deg,${a?.color}70,${a?.color})`}}/></div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// API KEY BANNER (Unlocked for all key types)
// ─────────────────────────────────────────────────────────────────────────────
function ApiKeyBanner({apiKey, setApiKey}) {
  const [show, setShow] = useState(false);
  const [input, setInput] = useState("");

  const save = () => {
    const k = input.trim();
    if (k.length < 10) { alert("Please enter a valid API key."); return; } 
    setApiKey(k); sSet("apex_apikey", k); setShow(false); setInput("");
  };

  if (apiKey) return (
    <div style={{position:"fixed",top:"var(--topbar)",left:"var(--sidebar)",right:0,zIndex:900,background:"rgba(0,230,118,.08)",borderBottom:"1px solid rgba(0,230,118,.2)",padding:"5px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <span style={{fontSize:11,fontFamily:"var(--fm)",color:"var(--green)"}}>✓ API KEY ACTIVE — agents are live</span>
      <button onClick={()=>{setApiKey("");sSet("apex_apikey","");}} style={{fontSize:10,fontFamily:"var(--fm)",background:"none",border:"none",color:"var(--t3)",cursor:"pointer"}}>REMOVE KEY</button>
    </div>
  );

  return (
    <>
      <div style={{position:"fixed",top:"var(--topbar)",left:"var(--sidebar)",right:0,zIndex:900,background:"rgba(232,184,75,.1)",borderBottom:"1px solid rgba(232,184,75,.3)",padding:"7px 18px",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>setShow(true)}>
        <span style={{fontSize:11,fontFamily:"var(--fm)",color:"var(--a)"}}>⚠ NO API KEY — agents offline. Click to add your API key.</span>
        <button className="btn btn-a" style={{fontSize:10,padding:"3px 10px"}} onClick={e=>{e.stopPropagation();setShow(true);}}>ADD KEY →</button>
      </div>
      {show && (
        <div style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,.7)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShow(false)}>
          <div className="card" style={{padding:28,width:440,maxWidth:"90vw"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontFamily:"var(--fd)",fontSize:18,fontWeight:800,marginBottom:6}}>Add API Key</div>
            <p style={{fontSize:13,color:"var(--t2)",lineHeight:1.6,marginBottom:16}}>Key stays securely in your browser only. Make sure your route.js file supports the key type (Groq, Gemini, OpenRouter, OpenAI, Anthropic).</p>
            <input className="input" placeholder="Paste API Key here..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&save()} style={{marginBottom:12,fontFamily:"var(--fm)",fontSize:12}}/>
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

// ─────────────────────────────────────────────────────────────────────────────
// ONBOARDING
// ─────────────────────────────────────────────────────────────────────────────
function Onboarding({onComplete}) {
  const [step, setStep] = useState(0);
  const [cfg, setCfg] = useState({ brandName:"", tagline:"AI Operating System", accentColor:"#E8B84B" });
  const colors = ["#E8B84B","#00E5FF","#00E676","#B388FF","#FF6D00","#FF3B3B","#FF9800"];
  const steps = [
    { icon:"⌬", title:"Welcome to APEX OS", body:"Your autonomous AI executive team. 7 agents running 24/7.", content: null, next:"Let's Set It Up →" },
    { icon:"◈", title:"Brand Your OS", body:"Enter your brand name to white-label the entire system.", content: (
        <div style={{marginTop:20,display:"flex",flexDirection:"column",gap:14}}>
          <div><label style={{fontSize:11,fontFamily:"var(--fm)",color:"var(--t3)",letterSpacing:".1em",display:"block",marginBottom:6}}>BRAND NAME</label><input className="input" placeholder="e.g. RAWGROWTH" value={cfg.brandName} onChange={e=>setCfg(p=>({...p,brandName:e.target.value}))} autoFocus/></div>
          <div><label style={{fontSize:11,fontFamily:"var(--fm)",color:"var(--t3)",letterSpacing:".1em",display:"block",marginBottom:6}}>TAGLINE</label><input className="input" value={cfg.tagline} onChange={e=>setCfg(p=>({...p,tagline:e.target.value}))}/></div>
          <div><label style={{fontSize:11,fontFamily:"var(--fm)",color:"var(--t3)",letterSpacing:".1em",display:"block",marginBottom:8}}>ACCENT COLOR</label>
            <div style={{display:"flex",gap:8}}>{colors.map(c=>(<div key={c} onClick={()=>setCfg(p=>({...p,accentColor:c}))} style={{width:28,height:28,borderRadius:"50%",background:c,cursor:"pointer",border:`2px solid ${cfg.accentColor===c?"white":"transparent"}`,boxShadow:cfg.accentColor===c?`0 0 12px ${c}`:undefined}}/>))}</div>
          </div>
        </div>
      ), next:"Continue →" },
    { icon:"◎", title:"Meet Your Team", body:"7 specialized AI agents. Each one executes on command.", content: (
        <div style={{marginTop:20,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {Object.entries(DEFAULT_CONFIG.agents).map(([id,a])=>(<div key={id} style={{padding:"10px 12px",background:"var(--s2)",border:`1px solid ${a.color}30`,borderRadius:"var(--r)",borderLeft:`3px solid ${a.color}`}}><div style={{fontSize:14,marginBottom:2}}>{a.icon} <span style={{fontFamily:"var(--fd)",fontWeight:700,fontSize:12,color:a.color}}>{a.name}</span></div><div style={{fontSize:11,color:"var(--t2)"}}>{a.role}</div></div>))}
        </div>
      ), next:"Launch APEX OS →" }
  ];

  const s = steps[step]; const canNext = step !== 1 || cfg.brandName.trim().length > 0;
  const handleNext = () => { if (step < steps.length - 1) { setStep(p=>p+1); } else { onComplete({...DEFAULT_CONFIG, brandName:cfg.brandName||"MY BRAND", tagline:cfg.tagline, accentColor:cfg.accentColor}); } };

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20,position:"relative",zIndex:1}}>
      <div style={{width:"100%",maxWidth:520}}>
        <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:32}}>{steps.map((_,i)=>(<div key={i} style={{width:i===step?24:8,height:4,borderRadius:2,background:i<=step?"var(--a)":"var(--b2)",transition:"all .3s"}}/>))}</div>
        <div className="card fu" style={{padding:32}}>
          <div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:48,marginBottom:12,filter:"drop-shadow(0 0 20px var(--a))"}}>{s.icon}</div><h2 style={{fontFamily:"var(--fd)",fontSize:22,fontWeight:800,marginBottom:8}}>{s.title}</h2><p style={{color:"var(--t2)",fontSize:14,lineHeight:1.6}}>{s.body}</p></div>
          {s.content}
          <button className="btn btn-a fu" onClick={handleNext} disabled={!canNext} style={{width:"100%",justifyContent:"center",padding:"12px",marginTop:24}}>{s.next}</button>
          {step > 0 && <button onClick={()=>setStep(p=>p-1)} style={{width:"100%",background:"none",border:"none",color:"var(--t3)",cursor:"pointer",fontSize:12,fontFamily:"var(--fm)",marginTop:10,padding:"6px"}}>← Back</button>}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UI SHELL (Topbar, Sidebar)
// ─────────────────────────────────────────────────────────────────────────────
function TopBar({cfg}) {
  const [t,setT] = useState(new Date()); useEffect(()=>{ const i=setInterval(()=>setT(new Date()),1000); return ()=>clearInterval(i); },[]);
  const ticks = [`${cfg.brandName} // ${cfg.tagline.toUpperCase()}`, "ALL AGENTS ONLINE", "7 AGENTS — 24/7 OPERATION", "AUTONOMOUS EXECUTIVE TEAM ACTIVE"];
  return (
    <div style={{position:"fixed", top:0, left:"var(--sidebar)", right:0, height:"var(--topbar)", zIndex:200, background:"#0C0F1C", borderBottom:"1px solid #252840", borderLeft:"1px solid #252840", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 16px", overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:`linear-gradient(90deg,${cfg.accentColor},transparent 55%)`}}/>
      <div style={{flex:1,overflow:"hidden",maskImage:"linear-gradient(90deg,transparent,black 3%,black 97%,transparent)"}}>
        <div style={{display:"flex",gap:48,animation:"ticker 28s linear infinite",whiteSpace:"nowrap",width:"max-content"}}>{[...ticks,...ticks].map((tick,i)=>(<span key={i} style={{fontSize:10,fontFamily:"var(--fm)",color:"#7B82A0",letterSpacing:".1em"}}><span style={{color:cfg.accentColor,marginRight:10}}>▸</span>{tick}</span>))}</div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:16,flexShrink:0,marginLeft:16,paddingLeft:16,borderLeft:"1px solid #252840"}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}><div className="live"/><span style={{fontSize:10,fontFamily:"var(--fm)",color:"#00E676",fontWeight:500,letterSpacing:".04em"}}>7/7 LIVE</span></div>
        <span style={{fontSize:11,fontFamily:"var(--fm)",color:"#B0B8D0",fontWeight:500,letterSpacing:".05em"}}>{t.toLocaleTimeString("en-US",{hour12:false})}</span>
      </div>
    </div>
  );
}

const NAV = [
  {sec:"COMMAND", items:[{id:"dashboard",label:"War Room"},{id:"chat",label:"Chat"},{id:"agents",label:"Agents"}]},
  {sec:"CONTENT", items:[{id:"instagram",label:"Instagram"},{id:"youtube",label:"YouTube"},{id:"pipeline",label:"Pipeline"}]},
  {sec:"REVENUE", items:[{id:"taskboard",label:"Task Board"},{id:"saleshub",label:"Sales Hub"},{id:"funnel",label:"Funnel"},{id:"calls",label:"Calls"}]},
  {sec:"INTEL",   items:[{id:"skills",label:"Skills"},{id:"sops",label:"SOPs"},{id:"orgchart",label:"Org Chart"},{id:"report",label:"Weekly Report"}]},
  {sec:"SYSTEM",  items:[{id:"settings",label:"Settings"}]},
];

function Sidebar({active, setActive, tasks, cfg}) {
  const agents = Object.values(cfg.agents);
  return (
    <div style={{position:"fixed",left:0,top:0,bottom:0,width:"var(--sidebar)",zIndex:201,background:"#090C14",borderRight:"1px solid #1E2235",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{height:"var(--topbar)", flexShrink:0, padding:"0 14px", borderBottom:"1px solid #252840", background:"#0B0E1A", display:"flex", alignItems:"center", gap:10}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:`linear-gradient(90deg,${cfg.accentColor},transparent 80%)`}}/>
        <div style={{width:30, height:30, borderRadius:6, flexShrink:0, background:cfg.accentColor, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 0 14px ${cfg.accentColor}60`}}><span style={{fontFamily:"var(--fd)",fontSize:14,fontWeight:900,color:"#05070D"}}>⌬</span></div>
        <div style={{overflow:"hidden",flex:1}}><div style={{fontFamily:"var(--fd)",fontSize:13,fontWeight:800,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",color:"#E8EAF2"}}>{cfg.brandName}</div><div style={{fontSize:8,fontFamily:"var(--fm)",color:"#3D4260",letterSpacing:".12em",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{cfg.tagline.toUpperCase()}</div></div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"8px 0"}}>
        {NAV.map(g=>(
          <div key={g.sec} style={{marginBottom:4}}>
            <div style={{padding:"7px 14px 3px",fontSize:9,fontFamily:"var(--fm)",color:"var(--t3)",letterSpacing:".14em"}}>{g.sec}</div>
            {g.items.map(item=>{ const on = active===item.id; return (<button key={item.id} onClick={()=>setActive(item.id)} style={{ width:"100%",textAlign:"left",padding:"7px 14px", background:on?"var(--a1)":"transparent", color:on?"var(--a)":"var(--t2)", border:"none",borderLeft:`2px solid ${on?"var(--a)":"transparent"}`, cursor:"pointer",fontSize:12,fontFamily:"var(--fb)",fontWeight:on?600:400, transition:"all .12s", }}>{item.label}</button>); })}
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
// CORE VIEWS
// ─────────────────────────────────────────────────────────────────────────────
function Dashboard({tasks, setActive, setChatAgent, cfg}) {
  const bl = tasks.filter(t=>t.status==="backlog"); const ip = tasks.filter(t=>t.status==="in_progress"); const dn = tasks.filter(t=>t.status==="completed");
  return (
    <div className="fu">
      <div style={{marginBottom:22}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}><h1 style={{fontFamily:"var(--fd)",fontSize:26,fontWeight:800,letterSpacing:"-.02em"}}>War Room</h1><span className="tag tg">COMMAND CENTER</span></div>
        <p style={{color:"var(--t2)",fontSize:13}}>{cfg.brandName} — autonomous executive team, operating 24/7.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:18}}>
        {[{l:"AGENTS LIVE",v:"7/7",c:"var(--green)"}, {l:"IN PROGRESS",v:ip.length,c:"var(--amber)"}, {l:"COMPLETED",v:dn.length,c:"var(--cyan)"}, {l:"BACKLOG",v:bl.length,c:"var(--t2)"}].map(s=>(
          <div key={s.l} className="card" style={{padding:"14px 16px"}}><div className="stat" style={{color:s.c,marginBottom:3}}>{s.v}</div><div style={{fontSize:9,fontFamily:"var(--fm)",color:"var(--t3)",letterSpacing:".1em"}}>{s.l}</div></div>
        ))}
      </div>
      <div style={{marginBottom:18}}>
        <SH>TEAM — LIVE AGENTS</SH>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:8}}>
          {Object.entries(cfg.agents).map(([id,a])=>{
            const t = tasks.find(x=>x.agent===id&&x.status==="in_progress");
            return (
              <div key={id} className="card fu" style={{padding:"12px 8px",borderTop:`2px solid ${a.color}`,textAlign:"center",cursor:"pointer",transition:"transform .14s"}} onClick={()=>{ setChatAgent(id); setActive("chat"); }} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform=""}>
                <div style={{display:"flex",justifyContent:"center",marginBottom:7}}><Avatar id={id} size={32} dot level cfg={cfg}/></div>
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
          {[{k:"backlog",l:"BACKLOG",ac:"var(--t3)",items:bl}, {k:"in_progress",l:"IN PROGRESS",ac:"var(--amber)",items:ip}, {k:"completed",l:"COMPLETED",ac:"var(--green)",items:dn}].map(col=>(
            <div key={col.k} className="card">
              <div style={{padding:"9px 12px",borderBottom:"1px solid var(--b1)",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:9,fontFamily:"var(--fm)",color:col.ac,letterSpacing:".1em"}}>{col.l}</span><span style={{fontFamily:"var(--fd)",fontSize:12,fontWeight:800,color:col.ac}}>{col.items.length}</span></div>
              <div style={{padding:8,display:"flex",flexDirection:"column",gap:7,minHeight:120}}>
                {col.items.length===0&&<div style={{textAlign:"center",color:"var(--t3)",fontSize:11,padding:"18px 0",fontFamily:"var(--fm)"}}>— empty —</div>}
                {col.items.map(task=>(
                  <div key={task.id} className="kcard" style={{borderLeft:`3px solid ${cfg.agents[task.agent]?.color||"#fff"}`}}>
                    <div style={{fontSize:12,fontWeight:600,marginBottom:5,lineHeight:1.3}}>{task.title}</div>
                    <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:10,fontFamily:"var(--fm)",color:cfg.agents[task.agent]?.color,fontWeight:600}}>{task.agent}</span><span className={`tag ${task.priority==="high"?"tred":task.priority==="medium"?"tamb":""}`}>{task.priority}</span></div>
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

const AGENT_STARTERS = { APEX: ["Build me a 90-day action plan","Audit my current business model"], ORACLE: ["Analyze the top 5 competitors"], PULSE: ["Generate a YouTube script"], CIPHER: ["Write a 5-part DM sequence"], FORGE: ["Design a Supabase schema"], VAULT: ["Analyze my token spend"], ECHO: ["Write a client onboarding sequence"] };

function Chat({cfg, notify, initialAgent, apiKey}) {
  const [sel, setSel] = useState(initialAgent||"APEX");
  const [sessions, setSess] = useState({});
  const [input, setInput] = useState("");
  const [loading, setLoad] = useState(false);
  const [err, setErr] = useState("");
  const bottomRef = useRef(null);
  const loaded = useRef(false);

  useEffect(()=>{ sGet("chat_v3",{}).then(s=>{setSess(s);loaded.current=true;}); },[]);
  useEffect(()=>{ if(loaded.current) sSet("chat_v3",sessions); },[sessions]);
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[sessions,loading,sel]);

  const msgs = sessions[sel]||[]; const a = cfg.agents[sel];

  const send = async()=>{
    if(!input.trim()||loading) return;
    const um = {role:"user",content:input}; const nm = [...msgs,um];
    setSess(p=>({...p,[sel]:nm})); setInput(""); setErr(""); setLoad(true);
    try {
      const sys = getSysPrompt(sel,cfg);
      const reply = await callAI(sys, nm.map(m=>({role:m.role,content:m.content})), apiKey);
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
            const on = sel===id; const has = (sessions[id]?.length||0)>0;
            return (
              <button key={id} onClick={()=>setSel(id)} style={{ width:"100%",textAlign:"left",padding:"9px 12px", background:on?`${a.color}12`:"transparent", border:"none",borderLeft:`2px solid ${on?a.color:"transparent"}`, cursor:"pointer",fontFamily:"var(--fb)",transition:"all .12s", display:"flex",alignItems:"center",gap:9 }}>
                <Avatar id={id} size={26} dot cfg={cfg}/>
                <div style={{flex:1,overflow:"hidden"}}><div style={{fontSize:11,fontWeight:600,color:on?a.color:"var(--t1)",fontFamily:"var(--fd)"}}>{a.name}</div><div style={{fontSize:9,color:"var(--t3)",fontFamily:"var(--fm)"}}>{a.role.split("/")[0].trim()}</div></div>
                {has&&<div style={{width:5,height:5,borderRadius:"50%",background:a.color,flexShrink:0,boxShadow:`0 0 5px ${a.color}`}}/>}
              </button>
            );
          })}
        </div>
      </div>
      <div className="card" style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"11px 16px",borderBottom:"1px solid var(--b1)",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <Avatar id={sel} size={36} dot level cfg={cfg}/>
          <div style={{flex:1}}><div style={{fontFamily:"var(--fd)",fontWeight:700,fontSize:14}}>{a.name}</div><div style={{fontSize:11,color:"var(--t2)"}}>{a.role}</div></div>
          {msgs.length>0&&<button className="btn btn-g" onClick={()=>setSess(p=>({...p,[sel]:[]}))} style={{fontSize:10,padding:"4px 9px"}}>Clear</button>}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:16}}>
          {msgs.length===0&&(
            <div style={{paddingTop:36,maxWidth:440,margin:"0 auto"}} className="fi">
              <div style={{textAlign:"center",marginBottom:22}}><div style={{fontSize:38,marginBottom:10,filter:`drop-shadow(0 0 14px ${a.color})`}}>{a.icon}</div><div style={{fontFamily:"var(--fd)",fontSize:17,fontWeight:700,marginBottom:4}}>{a.name} ready.</div></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                {(AGENT_STARTERS[sel]||[]).map((s,i)=>(
                  <button key={i} onClick={()=>setInput(s)} style={{ textAlign:"left",padding:"10px 12px",background:"var(--s2)", border:"1px solid var(--b1)",borderRadius:"var(--r)", color:"var(--t2)",fontSize:11,fontFamily:"var(--fb)",cursor:"pointer" }}>{s}</button>
                ))}
              </div>
            </div>
          )}
          {msgs.map((m,i)=>(
            <div key={i} className="fi" style={{display:"flex",gap:9,marginBottom:12,justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
              {m.role==="assistant"&&<Avatar id={sel} size={26} cfg={cfg}/>}
              <div style={{maxWidth:"70%",padding:"10px 14px",background:m.role==="user"?a.color:"var(--s2)",color:m.role==="user"?"#060500":"var(--t1)",borderRadius:m.role==="user"?"12px 12px 4px 12px":"12px 12px 12px 4px",border:m.role==="assistant"?"1px solid var(--b1)":undefined,fontSize:13,lineHeight:1.7,whiteSpace:"pre-wrap",fontFamily:"var(--fb)"}}>{m.content}</div>
            </div>
          ))}
          {loading&&(
            <div style={{display:"flex",gap:9,marginBottom:12}}><Avatar id={sel} size={26} cfg={cfg}/><div style={{padding:"12px 14px",background:"var(--s2)",border:"1px solid var(--b1)",borderRadius:"12px 12px 12px 4px",display:"flex",gap:4,alignItems:"center"}}>{[0,1,2].map(i=><div key={i} style={{width:5,height:5,borderRadius:"50%",background:a.color,animation:`pulse 1s ease ${i*.2}s infinite`}}/>)}</div></div>
          )}
          {err&&<div style={{textAlign:"center",color:"var(--red)",fontSize:11,padding:"8px 12px",background:"rgba(255,59,59,.1)",borderRadius:5,marginBottom:8}}>⚠ {err}</div>}
          <div ref={bottomRef}/>
        </div>
        <div style={{padding:"11px 14px",borderTop:"1px solid var(--b1)",display:"flex",gap:8,flexShrink:0}}>
          <input className="input" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()} placeholder={`Message ${a.name}...`} style={{flex:1}}/>
          <button className="btn btn-a" onClick={send} disabled={loading||!input.trim()}>{loading?<Spin color="#060500"/>:"SEND →"}</button>
        </div>
      </div>
    </div>
  );
}

function Agents({cfg, setActive, setChatAgent}) {
  return (
    <div className="fu">
      <div style={{marginBottom:22}}><h1 style={{fontFamily:"var(--fd)",fontSize:26,fontWeight:800,marginBottom:4}}>Agent Roster</h1><p style={{color:"var(--t2)",fontSize:13}}>7 autonomous AI executives. Click any agent to open their chat.</p></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:12}}>
        {Object.entries(cfg.agents).map(([id,a])=>(
          <div key={id} className="card fu" onClick={()=>{ setChatAgent(id); setActive("chat"); }} style={{padding:16,borderTop:`3px solid ${a.color}`,cursor:"pointer"}}>
            <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:12}}><Avatar id={id} size={44} dot level cfg={cfg}/><div style={{flex:1}}><div style={{fontFamily:"var(--fd)",fontSize:16,fontWeight:800}}>{a.name}</div><div style={{fontSize:11,color:a.color,fontFamily:"var(--fm)"}}>{a.role}</div></div></div>
            <div style={{marginBottom:10}}><XPBar id={id} cfg={cfg}/></div>
            <p style={{fontSize:12,color:"var(--t2)",lineHeight:1.6,marginBottom:10}}>{getSysPrompt(id,cfg).substring(0,110)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContentGen({platform, notify, cfg, apiKey}) {
  const [topic, setTopic] = useState(""); const [angle, setAngle] = useState("personal story");
  const [output, setOutput] = useState(""); const [loading, setLoad] = useState(false);
  const [err, setErr] = useState(""); const [hist, setHist] = useState([]);
  useEffect(()=>{ sGet(`cgen_${platform}`,[]).then(setHist); },[platform]);

  const gen = async()=>{
    if(!topic.trim()||loading) return; setLoad(true); setErr(""); setOutput("");
    const p = platform==="instagram" ? `Generate 3 Reel scripts for: "${topic}" with angle: "${angle}".` : `Write a YouTube script for: "${topic}" (angle: "${angle}").`;
    try {
      const r = await callAI(getSysPrompt("PULSE",cfg),[{role:"user",content:p}], apiKey);
      setOutput(r); const nh = [{topic,angle,date:new Date().toLocaleDateString(),result:r},...hist.slice(0,9)];
      setHist(nh); sSet(`cgen_${platform}`,nh); notify(`Generated by ${cfg.agents.PULSE.name}!`);
    } catch(e){setErr(e.message);} setLoad(false);
  };

  return (
    <div className="fu">
      <div style={{marginBottom:22}}><h1 style={{fontFamily:"var(--fd)",fontSize:26,fontWeight:800,marginBottom:4}}>{platform==="instagram"?"Instagram Scripts":"YouTube Scripts"}</h1></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:12,marginBottom:12}}>
        <div className="card" style={{padding:16}}>
          <textarea className="input" value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Topic..." style={{marginBottom:12,height:88}}/>
          <button className="btn btn-a" onClick={gen} disabled={loading||!topic.trim()} style={{width:"100%"}}>{loading?<Spin color="#060500"/>:"GENERATE"}</button>
          {err&&<div style={{color:"var(--red)",fontSize:11,marginTop:8}}>⚠ {err}</div>}
        </div>
        <div className="card" style={{padding:14}}><SH>HISTORY</SH>
          {hist.map((h,i)=>(<div key={i} onClick={()=>setOutput(h.result)} style={{padding:"7px 9px",background:"var(--s2)",borderRadius:4,cursor:"pointer",marginBottom:4,border:"1px solid var(--b1)"}}><div style={{fontSize:12}}>{h.topic}</div></div>))}
        </div>
      </div>
      {output&&<div className="card" style={{padding:16}}><pre style={{fontSize:13,whiteSpace:"pre-wrap"}}>{output}</pre></div>}
    </div>
  );
}

function TaskBoard({tasks, setTasks, notify, cfg}) {
  const [open, setOpen] = useState(false); const [form, setForm] = useState({title:"",agent:"APEX",priority:"medium",desc:"",due:""});
  const add=()=>{ if(!form.title.trim()) return; setTasks(p=>[...p,{...form,id:`t${Date.now()}`,status:"backlog"}]); setForm({title:"",agent:"APEX",priority:"medium",desc:"",due:""}); setOpen(false); notify(`Task added.`); };
  const move=(id,st)=>setTasks(p=>p.map(t=>t.id===id?{...t,status:st}:t)); const del=(id)=>setTasks(p=>p.filter(t=>t.id!==id));

  return (
    <div className="fu">
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:22}}><h1 style={{fontFamily:"var(--fd)",fontSize:26,fontWeight:800}}>Task Board</h1><button className="btn btn-a" onClick={()=>setOpen(p=>!p)}>+ NEW TASK</button></div>
      {open&&(
        <div className="card fi" style={{padding:16,marginBottom:14}}><input className="input" placeholder="Title" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))}/><button className="btn btn-a" onClick={add} style={{marginTop:10}}>CREATE</button></div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        {[{k:"backlog",l:"BACKLOG",ac:"var(--t3)"}, {k:"in_progress",l:"IN PROGRESS",ac:"var(--amber)"}, {k:"completed",l:"COMPLETED",ac:"var(--green)"}].map(col=>(
          <div key={col.k} className="card"><div style={{padding:"9px 12px",borderBottom:"1px solid var(--b1)"}}><span style={{fontSize:9,color:col.ac}}>{col.l}</span></div>
            <div style={{padding:8,display:"flex",flexDirection:"column",gap:7}}>
              {tasks.filter(t=>t.status===col.k).map(task=>(
                <div key={task.id} className="kcard" style={{borderLeft:`3px solid ${cfg.agents[task.agent]?.color||"#fff"}`}}>
                  <div style={{fontSize:12,fontWeight:600,marginBottom:5}}>{task.title}</div>
                  <div style={{display:"flex",gap:4}}>
                    {col.k!=="backlog"&&<button className="btn btn-g" onClick={()=>move(task.id,"backlog")} style={{fontSize:9,padding:"2px 7px"}}>← BL</button>}
                    {col.k!=="in_progress"&&<button className="btn btn-g" onClick={()=>move(task.id,"in_progress")} style={{fontSize:9,padding:"2px 7px"}}>▶ WIP</button>}
                    {col.k!=="completed"&&<button className="btn btn-g" onClick={()=>move(task.id,"completed")} style={{fontSize:9,padding:"2px 7px"}}>✓ DONE</button>}
                    <button className="btn btn-g" onClick={()=>del(task.id)} style={{fontSize:9,padding:"2px 7px"}}>✕</button>
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

function SalesHub({notify, cfg, apiKey}) {
  const [topic, setTopic] = useState(""); const [type, setType] = useState("dm");
  const [output, setOutput] = useState(""); const [loading, setLoad] = useState(false);
  const gen = async() => {
    if(!topic.trim()||loading) return; setLoad(true); setOutput("");
    try { const r = await callAI(getSysPrompt("CIPHER",cfg),[{role:"user",content:`Generate ${type} for: ${topic}`}], apiKey); setOutput(r); notify("Generated!"); } catch(e){} setLoad(false);
  };
  return (
    <div className="fu">
      <div style={{marginBottom:22}}><h1 style={{fontFamily:"var(--fd)",fontSize:26,fontWeight:800}}>Sales Hub</h1></div>
      <div className="card" style={{padding:16,marginBottom:12}}>
        <div style={{display:"flex",gap:8}}><input className="input" placeholder="Product / offer..." value={topic} onChange={e=>setTopic(e.target.value)} style={{flex:1}}/><button className="btn btn-a" onClick={gen} disabled={loading||!topic.trim()}>{loading?<Spin color="#060500"/>:"GENERATE"}</button></div>
      </div>
      {output&&<div className="card" style={{padding:16}}><pre style={{fontSize:13,whiteSpace:"pre-wrap"}}>{output}</pre></div>}
    </div>
  );
}

function Funnel({notify, cfg, apiKey}) {
  const [offer, setOffer] = useState(""); const [output, setOutput] = useState(""); const [loading, setLoad] = useState(false);
  const build = async() => {
    if(!offer.trim()||loading) return; setLoad(true); setOutput("");
    try { const r = await callAI(getSysPrompt("CIPHER",cfg),[{role:"user",content:`Design a funnel for: ${offer}`}], apiKey); setOutput(r); notify("Funnel architected!"); } catch(e){} setLoad(false);
  };
  return (
    <div className="fu">
      <div style={{marginBottom:22}}><h1 style={{fontFamily:"var(--fd)",fontSize:26,fontWeight:800}}>Funnel Builder</h1></div>
      <div className="card" style={{padding:16,marginBottom:12}}><div style={{display:"flex",gap:8}}><input className="input" placeholder="Offer..." value={offer} onChange={e=>setOffer(e.target.value)} style={{flex:1}}/><button className="btn btn-a" onClick={build} disabled={loading||!offer.trim()}>{loading?<Spin color="#060500"/>:"BUILD"}</button></div></div>
      {output&&<div className="card" style={{padding:16}}><pre style={{fontSize:13,whiteSpace:"pre-wrap"}}>{output}</pre></div>}
    </div>
  );
}

function Report({tasks, notify, cfg, apiKey}) {
  const [report, setReport] = useState(""); const [loading, setLoad] = useState(false);
  const gen = async() => {
    setLoad(true); setReport("");
    try { const r = await callAI(getSysPrompt("APEX",cfg),[{role:"user",content:`Generate weekly report based on ${tasks.length} tasks.`}], apiKey); setReport(r); } catch(e){} setLoad(false);
  };
  return (
    <div className="fu"><div style={{marginBottom:22}}><h1 style={{fontFamily:"var(--fd)",fontSize:26,fontWeight:800}}>Weekly Report</h1></div>
      <div className="card" style={{padding:16}}><button className="btn btn-a" onClick={gen}>{loading?<Spin/>:"GENERATE"}</button></div>
      {report&&<div className="card" style={{padding:16,marginTop:10}}><pre style={{fontSize:13,whiteSpace:"pre-wrap"}}>{report}</pre></div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PIPELINE 
// ─────────────────────────────────────────────────────────────────────────────
const STAGE_DEFS = [{l:"IDEAS",c:"var(--purple)"},{l:"RESEARCH",c:"#3B82F6"},{l:"SCRIPTING",c:"var(--amber)"},{l:"PRODUCTION",c:"var(--red)"},{l:"REVIEW",c:"var(--cyan)"},{l:"PUBLISHED",c:"var(--green)"}];
function Pipeline() {
  const [items, setItems] = useState([{id:"p1", title:"How I replaced my team with AI", stage:"IDEAS"},{id:"p2", title:"My $30k/mo stack revealed", stage:"IDEAS"}]);
  const moveItem = (id, newStage) => setItems(p=>p.map(x=>x.id===id?{...x,stage:newStage}:x));
  return (
    <div className="fu"><div style={{marginBottom:22}}><h1 style={{fontFamily:"var(--fd)",fontSize:26,fontWeight:800}}>Content Pipeline</h1></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:9}}>
        {STAGE_DEFS.map(s=>{
          const stageItems = items.filter(x=>x.stage===s.l);
          return (
            <div key={s.l} className="card">
              <div style={{padding:"9px 10px",background:`${s.c}12`,borderBottom:"1px solid var(--b1)"}}><div style={{fontFamily:"var(--fd)",fontSize:9,fontWeight:700,color:s.c}}>{s.l}</div></div>
              <div style={{padding:"7px",display:"flex",flexDirection:"column",gap:4,minHeight:100}}>
                {stageItems.map(item=>( <div key={item.id} style={{fontSize:10,padding:"5px 7px",background:"var(--s2)",borderRadius:3,borderLeft:`2px solid ${s.c}`}}>{item.title}</div> ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Settings() { return <div className="fu"><h1 style={{fontFamily:"var(--fd)",fontSize:26,fontWeight:800}}>Settings</h1><button className="btn btn-a" onClick={()=>{localStorage.clear(); window.location.reload();}}>RESET EVERYTHING</button></div>; }
function Calls() { return <div className="fu"><h1 style={{fontFamily:"var(--fd)",fontSize:26,fontWeight:800}}>Calls Hub</h1><p style={{color:"var(--t2)"}}>Feature available in Pro build.</p></div>; }
function Skills() { return <div className="fu"><h1 style={{fontFamily:"var(--fd)",fontSize:26,fontWeight:800}}>Skills Library</h1><p style={{color:"var(--t2)"}}>Feature available in Pro build.</p></div>; }
function SOPs() { return <div className="fu"><h1 style={{fontFamily:"var(--fd)",fontSize:26,fontWeight:800}}>SOP Generator</h1><p style={{color:"var(--t2)"}}>Feature available in Pro build.</p></div>; }
function OrgChart() { return <div className="fu"><h1 style={{fontFamily:"var(--fd)",fontSize:26,fontWeight:800}}>Org Chart</h1><p style={{color:"var(--t2)"}}>Feature available in Pro build.</p></div>; }

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [cfg, setCfg]         = useState(DEFAULT_CONFIG);
  const [onboarded, setOnb]   = useState(false);
  const [active, setActive]   = useState("dashboard");
  const [tasks, setTasks]     = useState(DEFAULT_TASKS);
  const [chatAgent, setChatAgent] = useState("APEX");
  const [notif, setNotif]     = useState(null);
  const [apiKey, setApiKey]   = useState("");
  const loaded = useRef(false);

  useEffect(()=>{
    Promise.all([ sGet("apex_cfg", DEFAULT_CONFIG), sGet("apex_onboarded", false), sGet("apex_tasks_v3", DEFAULT_TASKS), sGet("apex_apikey", "") ])
    .then(([c, ob, t, ak])=>{
      setCfg(c || DEFAULT_CONFIG); setOnb(ob || false); setTasks(t || DEFAULT_TASKS); setApiKey(ak || "");
      loaded.current = true;
    }).catch(()=>{ setCfg(DEFAULT_CONFIG); setOnb(false); loaded.current = true; });
  },[]);

  useEffect(()=>{ if(loaded.current){ sSet("apex_tasks_v3",tasks); sSet("apex_cfg",cfg); }},[tasks, cfg]);

  const notify = useCallback((msg)=>{ setNotif(null); setTimeout(()=>setNotif(msg),40); },[]);
  const completeOnboarding = (newCfg) => { setCfg(newCfg); sSet("apex_cfg",newCfg); setOnb(true); sSet("apex_onboarded",true); };

  if(!onboarded) {
    return <><style>{makeCSS(DEFAULT_CONFIG.accentColor)}</style><Onboarding onComplete={completeOnboarding}/></>;
  }

  const renderView = () => {
    const p = {cfg, notify, tasks, setTasks};
    switch(active) {
      case "dashboard": return <Dashboard {...p} setActive={setActive} setChatAgent={setChatAgent}/>;
      case "chat":      return <Chat cfg={cfg} notify={notify} initialAgent={chatAgent} apiKey={apiKey}/>;
      case "agents":    return <Agents cfg={cfg} setActive={setActive} setChatAgent={setChatAgent}/>;
      case "instagram": return <ContentGen platform="instagram" cfg={cfg} notify={notify} apiKey={apiKey}/>;
      case "youtube":   return <ContentGen platform="youtube" cfg={cfg} notify={notify} apiKey={apiKey}/>;
      case "pipeline":  return <Pipeline/>;
      case "taskboard": return <TaskBoard {...p}/>;
      case "report":    return <Report tasks={tasks} cfg={cfg} notify={notify} apiKey={apiKey}/>;
      case "saleshub":  return <SalesHub cfg={cfg} notify={notify} apiKey={apiKey}/>;
      case "funnel":    return <Funnel cfg={cfg} notify={notify} apiKey={apiKey}/>;
      case "calls":     return <Calls cfg={cfg} notify={notify}/>;
      case "skills":    return <Skills cfg={cfg} notify={notify}/>;
      case "sops":      return <SOPs cfg={cfg} notify={notify}/>;
      case "orgchart":  return <OrgChart cfg={cfg} setActive={setActive} setChatAgent={setChatAgent} tasks={tasks}/>;
      case "settings":  return <Settings cfg={cfg} setCfg={setCfg} notify={notify}/>;
      default:          return <Dashboard {...p} setActive={setActive}/>;
    }
  };

  return (
    <>
      <style>{makeCSS(cfg.accentColor)}</style>
      <ApiKeyBanner apiKey={apiKey} setApiKey={setApiKey}/>
      <TopBar cfg={cfg} liveCount={7}/>
      <Sidebar active={active} setActive={setActive} tasks={tasks} cfg={cfg}/>
      <main style={{marginLeft:"var(--sidebar)",marginTop:apiKey?"var(--topbar)":"80px",minHeight:"calc(100vh - var(--topbar))",padding:"24px 26px 40px",position:"relative",zIndex:1}}>
        {renderView()}
      </main>
      {notif && <Notif key={notif+Date.now()} msg={notif} onClose={()=>setNotif(null)}/>}
    </>
  );
}