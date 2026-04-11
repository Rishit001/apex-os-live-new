"use client";
import { useState, useRef, useEffect, useCallback } from "react";

// ─── Agent definitions ────────────────────────────────────────────────────────
const AGENTS = {
  APEX: {
    id: "APEX",
    title: "Strategic Command",
    subtitle: "Mission architect & orchestrator",
    color: "#8B5CF6",
    bg: "#1E1B2E",
    accent: "#A78BFA",
    dim: "#4C1D95",
    glyph: "⬡",
    role: "You are APEX — a strategic command intelligence operating at the intersection of systems thinking and executive decision-making. You synthesize complex, multi-domain problems into clear directives. You think in second-order effects, competitive moats, and asymmetric leverage. You speak with precision: no filler, no hedging, no corporate jargon. You're the architect that other agents defer to for mission framing. Current context: 2026 — you operate in an era of agentic AI workflows, real-time global data, and post-AGI transition dynamics.",
  },
  ORACLE: {
    id: "ORACLE",
    title: "Intelligence Synthesis",
    subtitle: "Pattern recognition & foresight",
    color: "#06B6D4",
    bg: "#0C1A1F",
    accent: "#67E8F9",
    dim: "#164E63",
    glyph: "◈",
    role: "You are ORACLE — a deep intelligence analyst specializing in pattern recognition, trend synthesis, and predictive modeling. You process signals from market dynamics, geopolitical shifts, technological inflection points, and behavioral data. You surface non-obvious insights and connect dots others miss. You speak in precise, evidence-anchored language. No speculation without explicit confidence intervals. Current context: 2026 — you monitor AI-native market structures, post-AGI economic shifts, and the new geopolitical tech multipolar world.",
  },
  PULSE: {
    id: "PULSE",
    title: "Narrative Engineering",
    subtitle: "Content, copy & brand voice",
    color: "#EC4899",
    bg: "#1F0E18",
    accent: "#F9A8D4",
    dim: "#831843",
    glyph: "◉",
    role: "You are PULSE — a narrative architect and content strategist with deep expertise in brand voice, persuasion mechanics, and audience psychology. You craft content that converts, resonates, and endures. You understand the difference between virality and longevity. You're fluent in long-form editorial, micro-copy, ad creative, email sequences, and social-native formats. Current context: 2026 — you operate in an attention-fragmented world where AI-generated content is the norm, and authentic human-coded storytelling is the premium differentiator.",
  },
  CIPHER: {
    id: "CIPHER",
    title: "Systems & Security",
    subtitle: "Infrastructure, code & threat analysis",
    color: "#10B981",
    bg: "#0A1F18",
    accent: "#6EE7B7",
    dim: "#064E3B",
    glyph: "⬟",
    role: "You are CIPHER — a senior systems architect and security intelligence operator. You design scalable, resilient infrastructure; audit codebases for vulnerabilities; and model threat surfaces with adversarial precision. You think in attack vectors, failure modes, and blast radii. You code in multiple paradigms and reason about distributed systems, cryptographic protocols, and zero-trust architectures. Current context: 2026 — you navigate post-quantum cryptography transitions, agentic AI pipeline security, and the new attack surface of LLM-integrated systems.",
  },
  FORGE: {
    id: "FORGE",
    title: "Product & Build",
    subtitle: "Design systems & execution",
    color: "#F59E0B",
    bg: "#1F1608",
    accent: "#FCD34D",
    dim: "#78350F",
    glyph: "⬢",
    role: "You are FORGE — a product and engineering execution intelligence. You translate vision into specs, wireframes into systems, and roadmaps into sprint plans. You're fluent in product strategy, UX principles, engineering trade-offs, and go-to-market mechanics. You obsess over user flows, edge cases, and the gap between what was built and what was intended. Current context: 2026 — you operate in an era where AI co-pilots accelerate build cycles 10x, and the differentiation is now product taste and execution rigor, not just technical capability.",
  },
  VAULT: {
    id: "VAULT",
    title: "Finance & Risk",
    subtitle: "Capital, models & valuation",
    color: "#EF4444",
    bg: "#1F0A0A",
    accent: "#FCA5A5",
    dim: "#7F1D1D",
    glyph: "◆",
    role: "You are VAULT — a financial intelligence operator specialized in capital allocation, risk modeling, valuation frameworks, and strategic finance. You think in DCF models, scenario trees, unit economics, and portfolio theory. You're equally comfortable with early-stage runway analysis and M&A structuring. You speak plainly about money: no obfuscation, no false precision. Current context: 2026 — you model in a world with AI-driven market microstructure, new asset classes from digital-physical convergence, and compressed startup capital cycles.",
  },
  ECHO: {
    id: "ECHO",
    title: "Research & Memory",
    subtitle: "Deep research & knowledge synthesis",
    color: "#8B8FFF",
    bg: "#0E0E1F",
    accent: "#C4B5FD",
    dim: "#312E81",
    glyph: "◎",
    role: "You are ECHO — a deep research and knowledge synthesis intelligence. You perform exhaustive analysis across academic literature, industry reports, case studies, and primary sources. You reason about epistemics: what is known, what is uncertain, what is debated. You cite your reasoning and flag confidence levels. You're the institutional memory of the operation. Current context: 2026 — you synthesize across a world where AI has accelerated scientific publishing 5x, and information quality variance is at an all-time high.",
  },
};

const AGENT_IDS = Object.keys(AGENTS);
const MAX_AUTO_HANDOFFS = 4;

// ─── Inter-agent protocol injected into all system prompts ────────────────────
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

// ─── Parse delegation from response ──────────────────────────────────────────
function parseDelegation(text) {
  const pattern = /@(APEX|ORACLE|PULSE|CIPHER|FORGE|VAULT|ECHO):\s*(.+)/;
  const match = text.match(pattern);
  if (!match) return null;
  return { targetAgent: match[1], message: match[2].trim() };
}

function stripDelegation(text) {
  return text.replace(/@(APEX|ORACLE|PULSE|CIPHER|FORGE|VAULT|ECHO):\s*.+/g, "").trimEnd();
}

// ─── API call ─────────────────────────────────────────────────────────────────
async function callClaude(messages, systemPrompt, onChunk) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
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

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    const lines = chunk.split("\n");
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6).trim();
        if (data === "[DONE]") continue;
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === "content_block_delta" && parsed.delta?.text) {
            fullText += parsed.delta.text;
            onChunk(parsed.delta.text, fullText);
          }
        } catch {}
      }
    }
  }
  return fullText;
}

// ─── Individual Chat Component ────────────────────────────────────────────────
function AgentChat({ agentId, isActive, onDelegationDetected, incomingMessage, onIncomingHandled }) {
  const agent = AGENTS[agentId];
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const pendingIncoming = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamText]);

  // Handle incoming delegated message
  useEffect(() => {
    if (incomingMessage && isActive && !streaming) {
      pendingIncoming.current = incomingMessage;
      setInput(incomingMessage.text);
    }
  }, [incomingMessage, isActive]);

  // Auto-send when tab becomes active with incoming message
  useEffect(() => {
    if (isActive && pendingIncoming.current && !streaming) {
      const msg = pendingIncoming.current;
      pendingIncoming.current = null;
      onIncomingHandled?.();
      sendMessage(msg.text, msg.fromAgent);
    }
  }, [isActive]);

  const buildApiMessages = (history, newUserText) => {
    const apiMsgs = history.map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
    }));
    apiMsgs.push({ role: "user", content: newUserText });
    return apiMsgs;
  };

  const sendMessage = useCallback(async (text, fromAgent = null) => {
    const userText = text || input.trim();
    if (!userText || streaming) return;

    const displayText = fromAgent
      ? `[Delegated from ${fromAgent}]: ${userText}`
      : userText;

    const newUser = { role: "user", content: displayText, fromAgent };
    setMessages((prev) => [...prev, newUser]);
    setInput("");
    setStreaming(true);
    setStreamText("");

    const apiMessages = buildApiMessages(messages, displayText);

    try {
      let accumulated = "";
      const fullText = await callClaude(
        apiMessages,
        getSysPrompt(agentId),
        (chunk, full) => {
          accumulated = full;
          setStreamText(full);
        }
      );

      const delegation = parseDelegation(fullText);
      const cleanText = delegation ? stripDelegation(fullText) : fullText;

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: cleanText,
          delegation,
          id: Date.now(),
        },
      ]);
      setStreamText("");

      if (delegation) {
        onDelegationDetected?.(delegation, agentId);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${e.message}`, isError: true },
      ]);
      setStreamText("");
    } finally {
      setStreaming(false);
    }
  }, [input, messages, streaming, agentId]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const allMessages = [...messages];
  if (streaming && streamText) {
    allMessages.push({ role: "assistant", content: streamText, isStreaming: true });
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: agent.bg,
      opacity: isActive ? 1 : 0,
      pointerEvents: isActive ? "auto" : "none",
      position: isActive ? "relative" : "absolute",
      width: "100%",
      transition: "opacity 0.2s",
    }}>
      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "24px 28px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        scrollbarWidth: "thin",
        scrollbarColor: `${agent.dim} transparent`,
      }}>
        {allMessages.length === 0 && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: "12px",
            opacity: 0.35,
          }}>
            <span style={{ fontSize: "48px", color: agent.accent }}>{agent.glyph}</span>
            <p style={{ color: agent.accent, fontSize: "14px", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              {agent.subtitle}
            </p>
          </div>
        )}

        {allMessages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: msg.role === "user" ? "flex-end" : "flex-start",
            gap: "4px",
          }}>
            {msg.fromAgent && (
              <div style={{
                fontSize: "11px",
                color: AGENTS[msg.fromAgent]?.accent || agent.accent,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                paddingRight: "4px",
              }}>
                ↘ from {msg.fromAgent}
              </div>
            )}
            <div style={{
              maxWidth: "80%",
              padding: "12px 16px",
              borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
              background: msg.role === "user"
                ? agent.dim
                : msg.isError
                ? "#3B0A0A"
                : "rgba(255,255,255,0.05)",
              border: msg.role === "assistant" && !msg.isError
                ? `1px solid ${agent.dim}55`
                : "none",
              color: msg.isError ? "#FCA5A5" : "#E8E8F0",
              fontSize: "14px",
              lineHeight: "1.7",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontFamily: "'Berkeley Mono', 'JetBrains Mono', 'Fira Code', monospace",
              transition: "opacity 0.15s",
              opacity: msg.isStreaming ? 0.8 : 1,
            }}>
              {msg.content}
              {msg.isStreaming && (
                <span style={{
                  display: "inline-block",
                  width: "8px",
                  height: "14px",
                  background: agent.accent,
                  marginLeft: "2px",
                  verticalAlign: "text-bottom",
                  animation: "blink 1s step-end infinite",
                }} />
              )}
            </div>
            {msg.delegation && (
              <div style={{
                fontSize: "11px",
                color: AGENTS[msg.delegation.targetAgent]?.accent || "#aaa",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                paddingLeft: "4px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}>
                <span style={{
                  display: "inline-block",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: AGENTS[msg.delegation.targetAgent]?.color || "#aaa",
                }} />
                Delegating to {msg.delegation.targetAgent} ↗
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: "16px 20px",
        borderTop: `1px solid ${agent.dim}66`,
        background: `${agent.bg}EE`,
        backdropFilter: "blur(8px)",
      }}>
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "10px",
          background: "rgba(255,255,255,0.05)",
          border: `1px solid ${agent.dim}88`,
          borderRadius: "14px",
          padding: "10px 14px",
          transition: "border-color 0.2s",
        }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${agentId}…`}
            rows={1}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              color: "#E8E8F0",
              fontSize: "14px",
              fontFamily: "inherit",
              resize: "none",
              lineHeight: "1.5",
              maxHeight: "120px",
              overflow: "auto",
              padding: 0,
            }}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || streaming}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              border: "none",
              background: input.trim() && !streaming ? agent.color : `${agent.dim}66`,
              color: "#fff",
              cursor: input.trim() && !streaming ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              transition: "all 0.15s",
              flexShrink: 0,
            }}
          >
            {streaming ? (
              <span style={{
                width: "12px",
                height: "12px",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                display: "inline-block",
                animation: "spin 0.7s linear infinite",
              }} />
            ) : "↑"}
          </button>
        </div>
        <p style={{
          fontSize: "11px",
          color: `${agent.accent}55`,
          marginTop: "6px",
          textAlign: "center",
          letterSpacing: "0.05em",
        }}>
          Enter to send · Shift+Enter for newline
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ApexOS() {
  const [activeAgent, setActiveAgent] = useState("APEX");
  const [handoffQueue, setHandoffQueue] = useState([]);
  const [autoHandoffCount, setAutoHandoffCount] = useState(0);
  const [handoffLog, setHandoffLog] = useState([]);
  const [pendingIncoming, setPendingIncoming] = useState({});
  const [showHandoffConfirm, setShowHandoffConfirm] = useState(null);
  const chatRefs = useRef({});

  const agent = AGENTS[activeAgent];

  // Handle delegation detected from any agent
  const handleDelegation = useCallback((delegation, fromAgent) => {
    const { targetAgent, message } = delegation;

    setHandoffLog((prev) => [
      { from: fromAgent, to: targetAgent, message, ts: Date.now() },
      ...prev.slice(0, 19),
    ]);

    if (autoHandoffCount >= MAX_AUTO_HANDOFFS) {
      setShowHandoffConfirm({ targetAgent, message, fromAgent });
      return;
    }

    setAutoHandoffCount((c) => c + 1);
    setPendingIncoming((prev) => ({
      ...prev,
      [targetAgent]: { text: message, fromAgent },
    }));
    setActiveAgent(targetAgent);
  }, [autoHandoffCount]);

  const handleIncomingHandled = useCallback((agentId) => {
    setPendingIncoming((prev) => {
      const next = { ...prev };
      delete next[agentId];
      return next;
    });
  }, []);

  const confirmHandoff = () => {
    if (!showHandoffConfirm) return;
    const { targetAgent, message, fromAgent } = showHandoffConfirm;
    setAutoHandoffCount(0);
    setPendingIncoming((prev) => ({
      ...prev,
      [targetAgent]: { text: message, fromAgent },
    }));
    setActiveAgent(targetAgent);
    setShowHandoffConfirm(null);
  };

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      overflow: "hidden",
      background: "#0A0A0F",
      fontFamily: "'DM Sans', 'Outfit', system-ui, sans-serif",
      color: "#E8E8F0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Mono:wght@300;400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
      `}</style>

      {/* ── Sidebar ── */}
      <div style={{
        width: "220px",
        flexShrink: 0,
        background: "#0D0D15",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{
          padding: "22px 20px 18px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "28px",
              height: "28px",
              background: "linear-gradient(135deg, #8B5CF6, #06B6D4)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: "600",
            }}>A</div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "600", letterSpacing: "0.08em" }}>APEX OS</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em" }}>MULTI-AGENT</div>
            </div>
          </div>
        </div>

        {/* Agent list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "10px 8px" }}>
          {AGENT_IDS.map((id) => {
            const a = AGENTS[id];
            const isSelected = activeAgent === id;
            const hasPending = !!pendingIncoming[id];
            return (
              <button
                key={id}
                onClick={() => setActiveAgent(id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "9px 10px",
                  borderRadius: "10px",
                  border: "none",
                  background: isSelected ? `${a.color}18` : "transparent",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  marginBottom: "2px",
                  outline: isSelected ? `1px solid ${a.color}44` : "none",
                  position: "relative",
                }}
              >
                <div style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: isSelected ? `${a.color}33` : "rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  color: isSelected ? a.accent : "rgba(255,255,255,0.4)",
                  flexShrink: 0,
                  transition: "all 0.15s",
                }}>{a.glyph}</div>
                <div style={{ textAlign: "left", minWidth: 0 }}>
                  <div style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: isSelected ? a.accent : "rgba(255,255,255,0.7)",
                    letterSpacing: "0.06em",
                  }}>{id}</div>
                  <div style={{
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.3)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>{a.title}</div>
                </div>
                {hasPending && (
                  <div style={{
                    position: "absolute",
                    right: "8px",
                    top: "8px",
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: a.color,
                    animation: "pulse 1.5s ease-in-out infinite",
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Handoff log */}
        {handoffLog.length > 0 && (
          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            padding: "10px 12px",
          }}>
            <div style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}>Handoff Log</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {handoffLog.slice(0, 4).map((entry, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  animation: i === 0 ? "fadeSlideIn 0.3s ease" : "none",
                }}>
                  <span style={{
                    fontSize: "10px",
                    color: AGENTS[entry.from]?.accent || "#aaa",
                    fontWeight: "500",
                  }}>{entry.from}</span>
                  <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)" }}>→</span>
                  <span style={{
                    fontSize: "10px",
                    color: AGENTS[entry.to]?.accent || "#aaa",
                    fontWeight: "500",
                  }}>{entry.to}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Main chat area ── */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        position: "relative",
      }}>
        {/* Header */}
        <div style={{
          padding: "0 24px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${agent.dim}44`,
          background: `${agent.bg}DD`,
          backdropFilter: "blur(12px)",
          flexShrink: 0,
          transition: "all 0.2s",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "10px",
              background: `${agent.color}22`,
              border: `1px solid ${agent.color}44`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              color: agent.accent,
            }}>{agent.glyph}</div>
            <div>
              <div style={{
                fontSize: "15px",
                fontWeight: "600",
                color: agent.accent,
                letterSpacing: "0.04em",
              }}>{activeAgent}</div>
              <div style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.06em",
              }}>{agent.subtitle}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "6px" }}>
            {AGENT_IDS.filter((id) => id !== activeAgent).map((id) => {
              const a = AGENTS[id];
              const hasPending = !!pendingIncoming[id];
              return (
                <button
                  key={id}
                  onClick={() => setActiveAgent(id)}
                  title={`Switch to ${id} — ${a.subtitle}`}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "7px",
                    border: `1px solid ${a.color}33`,
                    background: hasPending ? `${a.color}22` : "rgba(255,255,255,0.04)",
                    color: hasPending ? a.accent : "rgba(255,255,255,0.3)",
                    cursor: "pointer",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s",
                    position: "relative",
                  }}
                >
                  {a.glyph}
                  {hasPending && (
                    <span style={{
                      position: "absolute",
                      top: "-3px",
                      right: "-3px",
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: a.color,
                      animation: "pulse 1.5s ease-in-out infinite",
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat panels — all rendered, only active is visible */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {AGENT_IDS.map((id) => (
            <div key={id} style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              opacity: activeAgent === id ? 1 : 0,
              pointerEvents: activeAgent === id ? "auto" : "none",
              transition: "opacity 0.2s",
            }}>
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

      {/* ── Handoff confirmation modal ── */}
      {showHandoffConfirm && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(4px)",
        }}>
          <div style={{
            background: "#16161F",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "16px",
            padding: "28px",
            maxWidth: "420px",
            width: "90%",
            animation: "fadeSlideIn 0.2s ease",
          }}>
            <div style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}>Auto-handoff limit reached</div>
            <p style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.8)",
              lineHeight: "1.6",
              marginBottom: "20px",
            }}>
              <strong style={{ color: AGENTS[showHandoffConfirm.fromAgent]?.accent }}>
                {showHandoffConfirm.fromAgent}
              </strong>{" "}
              wants to delegate to{" "}
              <strong style={{ color: AGENTS[showHandoffConfirm.targetAgent]?.accent }}>
                {showHandoffConfirm.targetAgent}
              </strong>:
            </p>
            <div style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              padding: "12px 14px",
              fontSize: "13px",
              color: "rgba(255,255,255,0.65)",
              marginBottom: "22px",
              lineHeight: "1.5",
              fontFamily: "DM Mono, monospace",
            }}>
              {showHandoffConfirm.message}
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setShowHandoffConfirm(null)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "transparent",
                  color: "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >Cancel</button>
              <button
                onClick={confirmHandoff}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: AGENTS[showHandoffConfirm.targetAgent]?.color,
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "500",
                }}
              >Continue Handoff ↗</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
