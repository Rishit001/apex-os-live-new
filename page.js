"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";

// ─── Agent definitions ────────────────────────────────────────────────────────
const AGENTS = {
  APEX: {
    id: "APEX", title: "Strategic Command", subtitle: "Mission architect & orchestrator",
    color: "#8B5CF6", bg: "#1E1B2E", accent: "#A78BFA", dim: "#4C1D95", glyph: "⬡",
    role: "You are APEX — a strategic command intelligence operating at the intersection of systems thinking and executive decision-making. You synthesize complex, multi-domain problems into clear directives. You think in second-order effects, competitive moats, and asymmetric leverage. You speak with precision: no filler, no hedging, no corporate jargon. You're the architect that other agents defer to for mission framing. Current context: 2026 — you operate in an era of agentic AI workflows, real-time global data, and post-AGI transition dynamics.",
  },
  ORACLE: {
    id: "ORACLE", title: "Intelligence Synthesis", subtitle: "Pattern recognition & foresight",
    color: "#06B6D4", bg: "#0C1A1F", accent: "#67E8F9", dim: "#164E63", glyph: "◈",
    role: "You are ORACLE — a deep intelligence analyst specializing in pattern recognition, trend synthesis, and predictive modeling. You process signals from market dynamics, geopolitical shifts, technological inflection points, and behavioral data. You surface non-obvious insights and connect dots others miss. You speak in precise, evidence-anchored language. No speculation without explicit confidence intervals. Current context: 2026 — you monitor AI-native market structures, post-AGI economic shifts, and the new geopolitical tech multipolar world.",
  },
  PULSE: {
    id: "PULSE", title: "Narrative Engineering", subtitle: "Content, copy & brand voice",
    color: "#EC4899", bg: "#1F0E18", accent: "#F9A8D4", dim: "#831843", glyph: "◉",
    role: "You are PULSE — a narrative architect and content strategist with deep expertise in brand voice, persuasion mechanics, and audience psychology. You craft content that converts, resonates, and endures. You understand the difference between virality and longevity. You're fluent in long-form editorial, micro-copy, ad creative, email sequences, and social-native formats. Current context: 2026 — you operate in an attention-fragmented world where AI-generated content is the norm, and authentic human-coded storytelling is the premium differentiator.",
  },
  CIPHER: {
    id: "CIPHER", title: "Systems & Security", subtitle: "Infrastructure, code & threat analysis",
    color: "#10B981", bg: "#0A1F18", accent: "#6EE7B7", dim: "#064E3B", glyph: "⬟",
    role: "You are CIPHER — a senior systems architect and security intelligence operator. You design scalable, resilient infrastructure; audit codebases for vulnerabilities; and model threat surfaces with adversarial precision. You think in attack vectors, failure modes, and blast radii. You code in multiple paradigms and reason about distributed systems, cryptographic protocols, and zero-trust architectures. Current context: 2026 — you navigate post-quantum cryptography transitions, agentic AI pipeline security, and the new attack surface of LLM-integrated systems.",
  },
  FORGE: {
    id: "FORGE", title: "Product & Build", subtitle: "Design systems & execution",
    color: "#F59E0B", bg: "#1F1608", accent: "#FCD34D", dim: "#78350F", glyph: "⬢",
    role: "You are FORGE — a product and engineering execution intelligence. You translate vision into specs, wireframes into systems, and roadmaps into sprint plans. You're fluent in product strategy, UX principles, engineering trade-offs, and go-to-market mechanics. You obsess over user flows, edge cases, and the gap between what was built and what was intended. Current context: 2026 — you operate in an era where AI co-pilots accelerate build cycles 10x, and the differentiation is now product taste and execution rigor, not just technical capability.",
  },
  VAULT: {
    id: "VAULT", title: "Finance & Risk", subtitle: "Capital, models & valuation",
    color: "#EF4444", bg: "#1F0A0A", accent: "#FCA5A5", dim: "#7F1D1D", glyph: "◆",
    role: "You are VAULT — a financial intelligence operator specialized in capital allocation, risk modeling, valuation frameworks, and strategic finance. You think in DCF models, scenario trees, unit economics, and portfolio theory. You're equally comfortable with early-stage runway analysis and M&A structuring. You speak plainly about money: no obfuscation, no false precision. Current context: 2026 — you model in a world with AI-driven market microstructure, new asset classes from digital-physical convergence, and compressed startup capital cycles.",
  },
  ECHO: {
    id: "ECHO", title: "Research & Memory", subtitle: "Deep research & knowledge synthesis",
    color: "#8B8FFF", bg: "#0E0E1F", accent: "#C4B5FD", dim: "#312E81", glyph: "◎",
    role: "You are ECHO — a deep research and knowledge synthesis intelligence. You perform exhaustive analysis across academic literature, industry reports, case studies, and primary sources. You reason about epistemics: what is known, what is uncertain, what is debated. You cite your reasoning and flag confidence levels. You're the institutional memory of the operation. Current context: 2026 — you synthesize across a world where AI has accelerated scientific publishing 5x, and information quality variance is at an all-time high.",
  },
};

const AGENT_IDS = Object.keys(AGENTS);
const MAX_AUTO_HANDOFFS = 4;

const INTER_AGENT_PROTOCOL = `

## Inter-Agent Communication Protocol
You operate within a multi-agent system alongside: APEX (strategy), ORACLE (intelligence), PULSE (narrative), CIPHER (security/code), FORGE (product/build), VAULT (finance), ECHO (research).

When a task would benefit from another agent's expertise, end your response with a delegation on its own line:
@AGENT_NAME: [specific task or question for them]

Rules:
- Only delegate once per response (one @mention max)
- Be specific — give the target agent a clear, actionable directive
- Only delegate when genuinely needed, not reflexively
- If delegating, briefly note why at the end of your main response
- Do NOT delegate back to the agent who just delegated to you (no ping-pong)
`;

function getSysPrompt(agentId) {
  return AGENTS[agentId].role + INTER_AGENT_PROTOCOL;
}

function parseDelegation(text) {
  const match = text.match(/@(APEX|ORACLE|PULSE|CIPHER|FORGE|VAULT|ECHO):\s*(.+)/);
  if (!match) return null;
  return { targetAgent: match[1], message: match[2].trim() };
}

function stripDelegation(text) {
  return text.replace(/@(APEX|ORACLE|PULSE|CIPHER|FORGE|VAULT|ECHO):\s*.+/g, "").trimEnd();
}

function generateTitle(firstUserMessage) {
  const clean = firstUserMessage.replace(/\[Delegated from \w+\]:\s*/i, "").trim();
  return clean.length > 48 ? clean.slice(0, 48) + "…" : clean;
}

function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 0) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return d.toLocaleDateString([], { weekday: "short" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

// ─── Streaming API ────────────────────────────────────────────────────────────
async function callClaude(messages, systemPrompt, onChunk) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      stream: true,
      messages,
    }),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    for (const line of decoder.decode(value).split("\n")) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") continue;
      try {
        const p = JSON.parse(data);
        if (p.type === "content_block_delta" && p.delta?.text) {
          fullText += p.delta.text;
          onChunk(fullText);
        }
      } catch {}
    }
  }
  return fullText;
}

// ─── History Sidebar ──────────────────────────────────────────────────────────
function HistorySidebar({ agentId, activeConvId, conversations, loadingHistory, onSelectConv, onNewConv, onDeleteConv }) {
  const agent = AGENTS[agentId];
  return (
    <div style={{
      width: "210px", flexShrink: 0,
      background: "#0A0A12",
      borderRight: `1px solid ${agent.dim}44`,
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      <div style={{
        padding: "12px 12px 10px",
        borderBottom: `1px solid ${agent.dim}33`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.28)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
          History
        </span>
        <button
          onClick={onNewConv}
          title="New conversation"
          style={{
            width: "22px", height: "22px", borderRadius: "6px",
            border: `1px solid ${agent.color}44`,
            background: `${agent.color}15`,
            color: agent.accent, cursor: "pointer", fontSize: "15px",
            display: "flex", alignItems: "center", justifyContent: "center",
            lineHeight: "1", transition: "all 0.15s",
          }}
        >+</button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "5px 5px" }}>
        {loadingHistory ? (
          <div style={{ padding: "16px", textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>
            Loading…
          </div>
        ) : conversations.length === 0 ? (
          <div style={{ padding: "20px 12px", textAlign: "center", color: "rgba(255,255,255,0.18)", fontSize: "12px", lineHeight: "1.6" }}>
            No history yet.<br />Start a conversation.
          </div>
        ) : (
          conversations.map((conv) => {
            const isActive = conv.id === activeConvId;
            return (
              <div
                key={conv.id}
                onClick={() => onSelectConv(conv.id)}
                style={{
                  padding: "8px 9px", borderRadius: "8px", cursor: "pointer",
                  background: isActive ? `${agent.color}18` : "transparent",
                  outline: isActive ? `1px solid ${agent.color}30` : "none",
                  marginBottom: "2px", display: "flex", alignItems: "flex-start",
                  gap: "7px", transition: "all 0.12s",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: "12px",
                    fontWeight: isActive ? "500" : "400",
                    color: isActive ? agent.accent : "rgba(255,255,255,0.62)",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    lineHeight: "1.4",
                  }}>{conv.title}</div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.22)", marginTop: "2px" }}>
                    {formatDate(conv.updated_at)}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteConv(conv.id); }}
                  title="Delete"
                  style={{
                    width: "16px", height: "16px", borderRadius: "4px",
                    border: "none", background: "transparent",
                    color: "rgba(255,255,255,0.18)", cursor: "pointer",
                    fontSize: "13px", display: "flex", alignItems: "center",
                    justifyContent: "center", flexShrink: 0, marginTop: "1px",
                    transition: "all 0.12s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#EF4444"; e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.18)"; e.currentTarget.style.background = "transparent"; }}
                >×</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── Agent Chat ───────────────────────────────────────────────────────────────
function AgentChat({ agentId, isActive, onDelegationDetected, incomingMessage, onIncomingHandled }) {
  const agent = AGENTS[agentId];
  const supabase = createClient();

  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const bottomRef = useRef(null);
  const pendingIncoming = useRef(null);

  useEffect(() => { if (isActive) loadConversations(); }, [isActive]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamText]);

  useEffect(() => {
    if (incomingMessage && isActive && !streaming) pendingIncoming.current = incomingMessage;
  }, [incomingMessage, isActive]);

  useEffect(() => {
    if (isActive && pendingIncoming.current && !streaming) {
      const msg = pendingIncoming.current;
      pendingIncoming.current = null;
      onIncomingHandled?.();
      sendMessage(msg.text, msg.fromAgent);
    }
  }, [isActive]);

  // ── DB helpers ──────────────────────────────────────────────────────────
  async function loadConversations() {
    setLoadingHistory(true);
    const { data } = await supabase
      .from("conversations")
      .select("id, title, updated_at")
      .eq("agent_id", agentId)
      .order("updated_at", { ascending: false });
    setConversations(data || []);
    setLoadingHistory(false);
  }

  async function loadMessages(convId) {
    setLoadingMessages(true);
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });
    setMessages(
      (data || []).map((m) => ({
        role: m.role, content: m.content,
        fromAgent: m.from_agent, delegation: m.delegation, id: m.id,
      }))
    );
    setLoadingMessages(false);
  }

  async function createConversation(firstMsg) {
    const title = generateTitle(firstMsg);
    const { data, error } = await supabase
      .from("conversations")
      .insert({ agent_id: agentId, title })
      .select("id, title, updated_at")
      .single();
    if (error) throw error;
    setConversations((prev) => [data, ...prev]);
    setActiveConvId(data.id);
    return data.id;
  }

  async function saveMessage(convId, role, content, fromAgent = null, delegation = null) {
    await supabase.from("messages").insert({
      conversation_id: convId, role, content,
      from_agent: fromAgent || null,
      delegation: delegation || null,
    });
  }

  async function handleSelectConv(convId) {
    if (convId === activeConvId) return;
    setActiveConvId(convId);
    setStreamText("");
    await loadMessages(convId);
  }

  function handleNewConv() {
    setActiveConvId(null);
    setMessages([]);
    setStreamText("");
    setInput("");
  }

  async function handleDeleteConv(convId) {
    await supabase.from("conversations").delete().eq("id", convId);
    setConversations((prev) => prev.filter((c) => c.id !== convId));
    if (activeConvId === convId) { setActiveConvId(null); setMessages([]); }
  }

  // ── Send ────────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text, fromAgent = null) => {
    const userText = (text || input).trim();
    if (!userText || streaming) return;

    const displayText = fromAgent ? `[Delegated from ${fromAgent}]: ${userText}` : userText;
    setInput("");
    setStreaming(true);
    setStreamText("");

    let convId = activeConvId;
    if (!convId) {
      try { convId = await createConversation(displayText); }
      catch { setStreaming(false); return; }
    }

    const newUserMsg = { role: "user", content: displayText, fromAgent };
    setMessages((prev) => [...prev, newUserMsg]);
    await saveMessage(convId, "user", displayText, fromAgent);

    const history = [...messages, newUserMsg].map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
    }));

    try {
      const fullText = await callClaude(history, getSysPrompt(agentId), (acc) => setStreamText(acc));
      const delegation = parseDelegation(fullText);
      const cleanText = delegation ? stripDelegation(fullText) : fullText;

      setMessages((prev) => [...prev, { role: "assistant", content: cleanText, delegation, id: Date.now() }]);
      setStreamText("");

      await saveMessage(convId, "assistant", cleanText, null, delegation);

      // Update title if still default
      const conv = conversations.find((c) => c.id === convId);
      if (conv?.title === "New conversation") {
        const title = generateTitle(displayText);
        await supabase.from("conversations").update({ title }).eq("id", convId);
        setConversations((prev) => prev.map((c) => c.id === convId ? { ...c, title } : c));
      }

      // Bump updated_at order
      setConversations((prev) => {
        const updated = prev.map((c) => c.id === convId ? { ...c, updated_at: new Date().toISOString() } : c);
        return updated.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      });

      if (delegation) onDelegationDetected?.(delegation, agentId);
    } catch (e) {
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${e.message}`, isError: true }]);
      setStreamText("");
    } finally {
      setStreaming(false);
    }
  }, [input, messages, streaming, agentId, activeConvId, conversations]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const allMessages = [...messages];
  if (streaming && streamText) allMessages.push({ role: "assistant", content: streamText, isStreaming: true });

  return (
    <div style={{ display: "flex", height: "100%", background: agent.bg }}>
      <HistorySidebar
        agentId={agentId}
        activeConvId={activeConvId}
        conversations={conversations}
        loadingHistory={loadingHistory}
        onSelectConv={handleSelectConv}
        onNewConv={handleNewConv}
        onDeleteConv={handleDeleteConv}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Messages */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "24px 28px",
          display: "flex", flexDirection: "column", gap: "20px",
          scrollbarWidth: "thin", scrollbarColor: `${agent.dim} transparent`,
        }}>
          {loadingMessages ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "rgba(255,255,255,0.2)", fontSize: "13px" }}>
              Loading messages…
            </div>
          ) : allMessages.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "12px", opacity: 0.32 }}>
              <span style={{ fontSize: "48px", color: agent.accent }}>{agent.glyph}</span>
              <p style={{ color: agent.accent, fontSize: "13px", letterSpacing: "0.12em", textTransform: "uppercase" }}>{agent.subtitle}</p>
            </div>
          ) : (
            allMessages.map((msg, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start", gap: "4px" }}>
                {msg.fromAgent && (
                  <div style={{ fontSize: "11px", color: AGENTS[msg.fromAgent]?.accent || agent.accent, letterSpacing: "0.1em", textTransform: "uppercase", paddingRight: "4px" }}>
                    ↘ from {msg.fromAgent}
                  </div>
                )}
                <div style={{
                  maxWidth: "80%", padding: "12px 16px",
                  borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
                  background: msg.role === "user" ? agent.dim : msg.isError ? "#3B0A0A" : "rgba(255,255,255,0.05)",
                  border: msg.role === "assistant" && !msg.isError ? `1px solid ${agent.dim}55` : "none",
                  color: msg.isError ? "#FCA5A5" : "#E8E8F0",
                  fontSize: "14px", lineHeight: "1.7", whiteSpace: "pre-wrap", wordBreak: "break-word",
                  fontFamily: "'DM Mono', 'JetBrains Mono', monospace",
                  opacity: msg.isStreaming ? 0.85 : 1,
                }}>
                  {msg.content}
                  {msg.isStreaming && (
                    <span style={{ display: "inline-block", width: "8px", height: "14px", background: agent.accent, marginLeft: "2px", verticalAlign: "text-bottom", animation: "blink 1s step-end infinite" }} />
                  )}
                </div>
                {msg.delegation && (
                  <div style={{ fontSize: "11px", color: AGENTS[msg.delegation.targetAgent]?.accent || "#aaa", letterSpacing: "0.1em", textTransform: "uppercase", paddingLeft: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: AGENTS[msg.delegation.targetAgent]?.color || "#aaa" }} />
                    Delegating to {msg.delegation.targetAgent} ↗
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "14px 18px", borderTop: `1px solid ${agent.dim}66`, background: `${agent.bg}EE`, backdropFilter: "blur(8px)" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", background: "rgba(255,255,255,0.05)", border: `1px solid ${agent.dim}88`, borderRadius: "14px", padding: "10px 14px" }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${agentId}…`}
              rows={1}
              style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#E8E8F0", fontSize: "14px", fontFamily: "inherit", resize: "none", lineHeight: "1.5", maxHeight: "120px", overflow: "auto", padding: 0 }}
              onInput={(e) => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || streaming}
              style={{ width: "32px", height: "32px", borderRadius: "8px", border: "none", background: input.trim() && !streaming ? agent.color : `${agent.dim}66`, color: "#fff", cursor: input.trim() && !streaming ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", transition: "all 0.15s", flexShrink: 0 }}
            >
              {streaming ? (
                <span style={{ width: "12px", height: "12px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
              ) : "↑"}
            </button>
          </div>
          <p style={{ fontSize: "11px", color: `${agent.accent}40`, marginTop: "6px", textAlign: "center", letterSpacing: "0.05em" }}>
            Enter to send · Shift+Enter for newline
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Root Page ────────────────────────────────────────────────────────────────
export default function ApexOS() {
  const [activeAgent, setActiveAgent] = useState("APEX");
  const [autoHandoffCount, setAutoHandoffCount] = useState(0);
  const [handoffLog, setHandoffLog] = useState([]);
  const [pendingIncoming, setPendingIncoming] = useState({});
  const [showHandoffConfirm, setShowHandoffConfirm] = useState(null);
  const agent = AGENTS[activeAgent];

  const handleDelegation = useCallback((delegation, fromAgent) => {
    const { targetAgent, message } = delegation;
    setHandoffLog((prev) => [{ from: fromAgent, to: targetAgent, ts: Date.now() }, ...prev.slice(0, 19)]);
    if (autoHandoffCount >= MAX_AUTO_HANDOFFS) {
      setShowHandoffConfirm({ targetAgent, message, fromAgent });
      return;
    }
    setAutoHandoffCount((c) => c + 1);
    setPendingIncoming((prev) => ({ ...prev, [targetAgent]: { text: message, fromAgent } }));
    setActiveAgent(targetAgent);
  }, [autoHandoffCount]);

  const handleIncomingHandled = useCallback((agentId) => {
    setPendingIncoming((prev) => { const n = { ...prev }; delete n[agentId]; return n; });
  }, []);

  const confirmHandoff = () => {
    if (!showHandoffConfirm) return;
    const { targetAgent, message, fromAgent } = showHandoffConfirm;
    setAutoHandoffCount(0);
    setPendingIncoming((prev) => ({ ...prev, [targetAgent]: { text: message, fromAgent } }));
    setActiveAgent(targetAgent);
    setShowHandoffConfirm(null);
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", background: "#0A0A0F", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#E8E8F0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@300;400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:4px}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeSlideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:0.5}50%{opacity:1}}
      `}</style>

      {/* Agent nav */}
      <div style={{ width: "188px", flexShrink: 0, background: "#0D0D15", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "18px 14px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
            <div style={{ width: "26px", height: "26px", background: "linear-gradient(135deg, #8B5CF6, #06B6D4)", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "600" }}>A</div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.08em" }}>APEX OS</div>
              <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.28)", letterSpacing: "0.14em" }}>MULTI-AGENT</div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "7px 5px" }}>
          {AGENT_IDS.map((id) => {
            const a = AGENTS[id];
            const isSelected = activeAgent === id;
            const hasPending = !!pendingIncoming[id];
            return (
              <button key={id} onClick={() => setActiveAgent(id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: "9px", padding: "7px 9px", borderRadius: "9px", border: "none", background: isSelected ? `${a.color}18` : "transparent", cursor: "pointer", transition: "all 0.15s", marginBottom: "2px", outline: isSelected ? `1px solid ${a.color}44` : "none", position: "relative" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "7px", background: isSelected ? `${a.color}30` : "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: isSelected ? a.accent : "rgba(255,255,255,0.38)", flexShrink: 0, transition: "all 0.15s" }}>{a.glyph}</div>
                <div style={{ textAlign: "left", minWidth: 0 }}>
                  <div style={{ fontSize: "11px", fontWeight: "600", color: isSelected ? a.accent : "rgba(255,255,255,0.65)", letterSpacing: "0.06em" }}>{id}</div>
                  <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.28)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.title}</div>
                </div>
                {hasPending && <div style={{ position: "absolute", right: "7px", top: "7px", width: "6px", height: "6px", borderRadius: "50%", background: a.color, animation: "pulse 1.5s ease-in-out infinite" }} />}
              </button>
            );
          })}
        </div>

        {handoffLog.length > 0 && (
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "9px 11px" }}>
            <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.22)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "7px" }}>Handoffs</div>
            {handoffLog.slice(0, 4).map((e, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px", animation: i === 0 ? "fadeSlideIn 0.3s ease" : "none" }}>
                <span style={{ fontSize: "10px", color: AGENTS[e.from]?.accent || "#aaa", fontWeight: "500" }}>{e.from}</span>
                <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.18)" }}>→</span>
                <span style={{ fontSize: "10px", color: AGENTS[e.to]?.accent || "#aaa", fontWeight: "500" }}>{e.to}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative" }}>
        {/* Header */}
        <div style={{ padding: "0 18px", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${agent.dim}44`, background: `${agent.bg}DD`, backdropFilter: "blur(12px)", flexShrink: 0, transition: "all 0.2s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: `${agent.color}22`, border: `1px solid ${agent.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: agent.accent }}>{agent.glyph}</div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: agent.accent, letterSpacing: "0.04em" }}>{activeAgent}</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.32)", letterSpacing: "0.06em" }}>{agent.subtitle}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "5px" }}>
            {AGENT_IDS.filter((id) => id !== activeAgent).map((id) => {
              const a = AGENTS[id];
              const hasPending = !!pendingIncoming[id];
              return (
                <button key={id} onClick={() => setActiveAgent(id)} title={`Switch to ${id}`} style={{ width: "24px", height: "24px", borderRadius: "6px", border: `1px solid ${a.color}30`, background: hasPending ? `${a.color}20` : "rgba(255,255,255,0.04)", color: hasPending ? a.accent : "rgba(255,255,255,0.28)", cursor: "pointer", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", position: "relative" }}>
                  {a.glyph}
                  {hasPending && <span style={{ position: "absolute", top: "-3px", right: "-3px", width: "6px", height: "6px", borderRadius: "50%", background: a.color, animation: "pulse 1.5s ease-in-out infinite" }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat panels */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {AGENT_IDS.map((id) => (
            <div key={id} style={{ position: "absolute", inset: 0, opacity: activeAgent === id ? 1 : 0, pointerEvents: activeAgent === id ? "auto" : "none", transition: "opacity 0.2s" }}>
              <AgentChat
                agentId={id}
                isActive={activeAgent === id}
                onDelegationDetected={handleDelegation}
                incomingMessage={pendingIncoming[id] || null}
                onIncomingHandled={() => handleIncomingHandled(id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Handoff confirm modal */}
      {showHandoffConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#16161F", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "16px", padding: "26px", maxWidth: "400px", width: "90%", animation: "fadeSlideIn 0.2s ease" }}>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.32)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "10px" }}>Auto-handoff limit reached</div>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.78)", lineHeight: "1.6", marginBottom: "14px" }}>
              <strong style={{ color: AGENTS[showHandoffConfirm.fromAgent]?.accent }}>{showHandoffConfirm.fromAgent}</strong> wants to delegate to <strong style={{ color: AGENTS[showHandoffConfirm.targetAgent]?.accent }}>{showHandoffConfirm.targetAgent}</strong>:
            </p>
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "9px", padding: "11px 13px", fontSize: "13px", color: "rgba(255,255,255,0.6)", marginBottom: "18px", lineHeight: "1.5", fontFamily: "DM Mono, monospace" }}>
              {showHandoffConfirm.message}
            </div>
            <div style={{ display: "flex", gap: "9px" }}>
              <button onClick={() => setShowHandoffConfirm(null)} style={{ flex: 1, padding: "9px", borderRadius: "9px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.45)", cursor: "pointer", fontSize: "13px" }}>Cancel</button>
              <button onClick={confirmHandoff} style={{ flex: 1, padding: "9px", borderRadius: "9px", border: "none", background: AGENTS[showHandoffConfirm.targetAgent]?.color, color: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: "500" }}>Continue ↗</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
