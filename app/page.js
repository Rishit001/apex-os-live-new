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

const DEFAULT_CONFIG = {
  brandName: "RAWGROWTH", tagline: "AI Operating System", accentColor: "#E8B84B",
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

const getSysPrompt = (agentId, cfg) => {
  const a = cfg.agents[agentId]; const brand = cfg.brandName;
  const prompts = {
    APEX:   `You are ${a.name}, the Commander and COO of ${brand}'s AI operating system. You orchestrate all agents, execute strategy, and turn vision into action. Think in systems. Speak decisively. Structure responses with clear headers and numbered steps. Be direct and action-oriented.`,
    ORACLE: `You are ${a.name}, the Research & Intelligence agent for ${brand}. You analyze markets, competitors, content trends, and surface actionable intel. Speak in data. Flag speculation. Use bullet points and specific numbers.`,
    PULSE:  `You are ${a.name}, the Content Director for ${brand}. You write Instagram Reels scripts, YouTube scripts, hooks, captions. Write in the founder's raw, authentic voice — real talk, no fluff. Format scripts as: HOOK | BODY | CTA. Give 3 variations for Reels.`,
    CIPHER: `You are ${a.name}, the Sales & Revenue agent for ${brand}. You handle sales copy, VSLs, DM sequences, objection handling, CRM strategy. Your copy converts. Be direct, benefit-driven, psychologically sharp.`,
    FORGE:  `You are ${a.name}, the Developer agent for ${brand}. You build n8n workflows, APIs, Supabase databases, automations. Speak in code. Give actual steps, pseudocode, or real code blocks. Be technical and precise.`,
    VAULT:  `You are ${a.name}, the Finance & Security agent for ${brand}. Track costs, optimize budgets, forecast revenue. Think in ROI. Quantify everything. Use tables for financial data.`,
    ECHO:   `You are ${a.name}, the Client Success agent for ${brand}. Handle onboarding, community management, client health, retention. Be proactive and solutions-focused. Create templates and sequences that make clients love you.`,
  }; return prompts[agentId] || prompts.APEX;
};

const DEFAULT_TASKS = [
  { id:"t1", title:"Weekly Competitor Scrape", agent:"ORACLE", status:"in_progress", priority:"high", created:"2026-03-01", desc:"Scrape top 10 competitor IG & YT for hooks and content patterns." },
  { id:"t2", title:"Token Cost Tracking Setup", agent:"VAULT", status:"in_progress", priority:"medium", created:"2026-03-01", desc:"Implement daily token cost tracking across all agents." },
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
// NATIVE STORAGE (Replaces Sandbox Storage)
// ─────────────────────────────────────────────────────────────────────────────
async function sGet(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const r = localStorage.getItem(key);
    if (r) return JSON.parse(r);
  } catch (e) {}
  return fallback;
}
async function sSet(key, val) {
  if (typeof window === "undefined") return;
  try {
    if (val === null || val === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(val));
    }
  } catch (e) {}
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
      <div style={{ width:size, height:size, borderRadius:"50%", background:\`\${a.color}18\`, border:\`2px solid \${a.color}50\`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*.38, fontFamily:"var(--fd)", fontWeight:800, color:a.color, boxShadow:\`0 0 \${size*.25}px \${a.color}20\`, }}>{a.icon}</div>
      {dot && <div style={{position:"absolute",bottom:0,right:0,width:9,height:9,borderRadius:"50%",background:"var(--green)",border:"2px solid var(--bg)",boxShadow:"0 0 6px var(--green)"}}/>}
      {level && <div style={{position:"absolute",top:-4,right:-4,background:a.color,color:"#05070D",fontSize:8,fontFamily:"var(--fm)",fontWeight:700,padding:"1px 4px",borderRadius:3,lineHeight:1.4}}>L{LV_MAP[id]??9}</div>}
    </div>
  );
}

function Spin({color="var(--a)"}) { return <div style={{width:14,height:14,border:\`2px solid \${color}30\`,borderTopColor:color,borderRadius:"50%",animation:"spin .7s linear infinite"}}/>; }

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
      <div className="xpt"><div className="xpf" style={{width:\`\${xp}%\`,background:\`linear-gradient(90deg,\${a?.color}70,\${a?.color})\`}}/></div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// API KEY BANNER
// ─────────────────────────────────────────────────────────────────────────────
function ApiKeyBanner({apiKey, setApiKey}) {
  const [show, setShow] = useState(false);
  const [input, setInput] = useState("");

  const save = () => {
    const k = input.trim();
    if (!k.startsWith("gsk_")) { alert("Groq key should start with gsk_"); return; }
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
        <span style={{fontSize:11,fontFamily:"var(--fm)",color:"var(--a)"}}>⚠ NO API KEY — agents offline. Click to add your Groq API key.</span>
        <button className="btn btn-a" style={{fontSize:10,padding:"3px 10px"}} onClick={e=>{e.stopPropagation();setShow(true);}}>ADD KEY →</button>
      </div>
      {show && (
        <div style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,.7)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShow(false)}>
          <div className="card" style={{padding:28,width:440,maxWidth:"90vw"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontFamily:"var(--fd)",fontSize:18,fontWeight:800,marginBottom:6}}>Add Groq API Key</div>
            <p style={{fontSize:13,color:"var(--t2)",lineHeight:1.6,marginBottom:16}}>Key stays securely in your browser only. Powered by ultra-fast Groq LPUs.</p>
            <input className="input" placeholder="gsk_..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&save()} style={{marginBottom:12,fontFamily:"var(--fm)",fontSize:12}}/>
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
// CHAT
// ─────────────────────────────────────────────────────────────────────────────
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
              <button key={id} onClick={()=>setSel(id)} style={{ width:"100%",textAlign:"left",padding:"9px 12px", background:on?\`\${a.color}12\`:"transparent", border:"none",borderLeft:\`2px solid \${on?a.color:"transparent"}\`, cursor:"pointer",fontFamily:"var(--fb)",transition:"all .12s", display:"flex",alignItems:"center",gap:9 }}>
                <Avatar id={id} size={26} dot cfg={cfg}/>
                <div style={{flex:1,overflow:"hidden"}}><div style={{fontSize:11,fontWeight:600,color:on?a.color:"var(--t1)",fontFamily:"var(--fd)"}}>{a.name}</div><div style={{fontSize:9,color:"var(--t3)",fontFamily:"var(--fm)"}}>{a.role.split("/")[0].trim()}</div></div>
                {has&&<div style={{width:5,height:5,borderRadius:"50%",background:a.color,flexShrink:0,boxShadow:\`0 0 5px \${a.color}\`}}/>}
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
              <div style={{textAlign:"center",marginBottom:22}}><div style={{fontSize:38,marginBottom:10,filter:\`drop-shadow(0 0 14px \${a.color})\`}}>{a.icon}</div><div style={{fontFamily:"var(--fd)",fontSize:17,fontWeight:700,marginBottom:4}}>{a.name} ready.</div></div>
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
            <div style={{display:"flex",gap:9,marginBottom:12}}><Avatar id={sel} size={26} cfg={cfg}/><div style={{padding:"12px 14px",background:"var(--s2)",border:"1px solid var(--b1)",borderRadius:"12px 12px 12px 4px",display:"flex",gap:4,alignItems:"center"}}>{[0,1,2].map(i=><div key={i} style={{width:5,height:5,borderRadius:"50%",background:a.color,animation:\`pulse 1s ease \${i*.2}s infinite\`}}/>)}</div></div>
          )}
          {err&&<div style={{textAlign:"center",color:"var(--red)",fontSize:11,padding:"8px 12px",background:"rgba(255,59,59,.1)",borderRadius:5,marginBottom:8}}>⚠ {err}</div>}
          <div ref={bottomRef}/>
        </div>
        <div style={{padding:"11px 14px",borderTop:"1px solid var(--b1)",display:"flex",gap:8,flexShrink:0}}>
          <input className="input" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()} placeholder={\`Message \${a.name}...\`} style={{flex:1}}/>
          <button className="btn btn-a" onClick={send} disabled={loading||!input.trim()}>{loading?<Spin color="#060500"/>:"SEND →"}</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT GENERATOR
// ─────────────────────────────────────────────────────────────────────────────
function ContentGen({platform, notify, cfg, apiKey}) {
  const [topic, setTopic] = useState(""); const [angle, setAngle] = useState("personal story");
  const [output, setOutput] = useState(""); const [loading, setLoad] = useState(false);
  const [err, setErr] = useState(""); const [hist, setHist] = useState([]);

  useEffect(()=>{ sGet(\`cgen_\${platform}\`,[]).then(setHist); },[platform]);

  const gen = async()=>{
    if(!topic.trim()||loading) return; setLoad(true); setErr(""); setOutput("");
    const p = platform==="instagram" ? \`Generate 3 high-converting Reel scripts for topic: "\${topic}" with angle: "\${angle}".\` : \`Write a YouTube script for: "\${topic}" (angle: "\${angle}").\`;
    try {
      const r = await callAI(getSysPrompt("PULSE",cfg),[{role:"user",content:p}], apiKey);
      setOutput(r); const nh = [{topic,angle,date:new Date().toLocaleDateString(),result:r},...hist.slice(0,9)];
      setHist(nh); sSet(\`cgen_\${platform}\`,nh); notify(\`Generated by \${cfg.agents.PULSE.name}!\`);
    } catch(e){setErr(e.message);} setLoad(false);
  };

  return (
    <div className="fu">
      <div style={{marginBottom:22}}><h1 style={{fontFamily:"var(--fd)",fontSize:26,fontWeight:800,marginBottom:4}}>Generator</h1></div>
      <div className="card" style={{padding:16,marginBottom:12}}>
        <input className="input" value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Topic..." style={{marginBottom:12}}/>
        <button className="btn btn-a" onClick={gen} disabled={loading||!topic.trim()}>{loading?<Spin/>:"GENERATE"}</button>
        {err&&<div style={{color:"var(--red)",fontSize:11,marginTop:8}}>⚠ {err}</div>}
      </div>
      {output&&<div className="card" style={{padding:16}}><pre style={{fontSize:13,whiteSpace:"pre-wrap"}}>{output}</pre></div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP (Combines everything and manages global states)
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [cfg, setCfg]         = useState(DEFAULT_CONFIG);
  const [onboarded, setOnb]   = useState(true); // Default to true so it skips onboarding for now
  const [active, setActive]   = useState("dashboard");
  const [tasks, setTasks]     = useState(DEFAULT_TASKS);
  const [apiKey, setApiKey]   = useState("");
  const [chatAgent, setChatAgent] = useState("APEX");
  const [notif, setNotif]     = useState(null);
  const loaded = useRef(false);

  useEffect(()=>{
    Promise.all([
      sGet("apex_cfg", DEFAULT_CONFIG), sGet("apex_tasks_v3", DEFAULT_TASKS), sGet("apex_apikey", "")
    ]).then(([c, t, k])=>{
      setCfg(c || DEFAULT_CONFIG); setTasks(t || DEFAULT_TASKS); setApiKey(k || "");
      loaded.current = true;
    });
  },[]);

  useEffect(()=>{ if(loaded.current){ sSet("apex_tasks_v3",tasks); sSet("apex_cfg",cfg); }},[tasks, cfg]);

  const notify = useCallback((msg)=>{ setNotif(null); setTimeout(()=>setNotif(msg),40); },[]);

  const renderView = () => {
    switch(active) {
      case "chat":      return <Chat cfg={cfg} notify={notify} initialAgent={chatAgent} apiKey={apiKey}/>;
      case "instagram": return <ContentGen platform="instagram" cfg={cfg} notify={notify} apiKey={apiKey}/>;
      case "youtube":   return <ContentGen platform="youtube" cfg={cfg} notify={notify} apiKey={apiKey}/>;
      // You can implement the rest of your views (SalesHub, Dashboard, etc.) down here...
      default:          return <Chat cfg={cfg} notify={notify} initialAgent="APEX" apiKey={apiKey}/>;
    }
  };

  return (
    <>
      <style>{makeCSS(cfg.accentColor)}</style>
      <ApiKeyBanner apiKey={apiKey} setApiKey={setApiKey}/>
      <div style={{position:"fixed", top:apiKey?40:0, left:"var(--sidebar)", right:0, height:"var(--topbar)", background:"#0C0F1C", borderBottom:"1px solid #252840", zIndex:200}}/>
      
      {/* Sidebar simplified for brevity */}
      <div style={{position:"fixed",left:0,top:0,bottom:0,width:"var(--sidebar)",background:"#090C14",borderRight:"1px solid #1E2235",zIndex:201}}>
         <div style={{padding:20, color:"white", fontFamily:"var(--fd)", fontWeight:800}}>RAWGROWTH OS</div>
         <button onClick={()=>setActive("chat")} style={{background:"none",border:"none",color:"white",cursor:"pointer",display:"block",padding:"10px 20px"}}>Chat</button>
         <button onClick={()=>setActive("instagram")} style={{background:"none",border:"none",color:"white",cursor:"pointer",display:"block",padding:"10px 20px"}}>IG Scripts</button>
      </div>

      <main style={{marginLeft:"var(--sidebar)",marginTop:"var(--topbar)",paddingTop:apiKey?50:20, minHeight:"100vh",padding:"24px",position:"relative",zIndex:1}}>
        {renderView()}
      </main>
      {notif && <Notif key={notif+Date.now()} msg={notif} onClose={()=>setNotif(null)}/>}
    </>
  );
}