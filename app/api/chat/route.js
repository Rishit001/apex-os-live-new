import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { system, messages, apiKey } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: "API Key is missing." }, { status: 401 });
    }

    let url, headers, body;
    const formattedMessages = messages.map(m => ({ role: m.role, content: m.content }));

    // 1. GEMINI KEY ROUTING
    if (apiKey.startsWith("AIza")) {
      const geminiMessages = messages.map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }));
      url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      headers = { "Content-Type": "application/json" };
      body = JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: geminiMessages
      });
      
      const res = await fetch(url, { method: "POST", headers, body });
      const data = await res.json();
      if (!res.ok) return NextResponse.json({ error: data.error?.message || "Gemini Error" }, { status: res.status });
      return NextResponse.json({ reply: data.candidates?.[0]?.content?.parts?.[0]?.text || "" });
    }

    // 2. GROQ KEY ROUTING
    else if (apiKey.startsWith("gsk_")) {
      url = "https://api.groq.com/openai/v1/chat/completions";
      headers = { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` };
      body = JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: system }, ...formattedMessages]
      });
    }

    // 3. ANTHROPIC KEY ROUTING
    else if (apiKey.startsWith("sk-ant-")) {
      url = "https://api.anthropic.com/v1/messages";
      headers = { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" };
      body = JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        system: system,
        messages: formattedMessages
      });
      
      const res = await fetch(url, { method: "POST", headers, body });
      const data = await res.json();
      if (!res.ok) return NextResponse.json({ error: data.error?.message || "Anthropic Error" }, { status: res.status });
      return NextResponse.json({ reply: data.content?.[0]?.text || "" });
    }

    // 4. OPENROUTER KEY ROUTING
    else if (apiKey.startsWith("sk-or-")) {
      url = "https://openrouter.ai/api/v1/chat/completions";
      headers = { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` };
      body = JSON.stringify({
        model: "openrouter/free", 
        messages: [{ role: "system", content: system }, ...formattedMessages]
      });
    }

    // 5. OPENAI KEY ROUTING (Fallback for standard sk-)
    else if (apiKey.startsWith("sk-")) {
      url = "https://api.openai.com/v1/chat/completions";
      headers = { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` };
      body = JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: system }, ...formattedMessages]
      });
    }

    else {
      return NextResponse.json({ error: "Invalid API Key format." }, { status: 400 });
    }

    // Standard OpenAI-compatible fetch (Handles Groq, OpenRouter, OpenAI)
    const res = await fetch(url, { method: "POST", headers, body });
    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: data.error?.message || "API Error" }, { status: res.status });
    return NextResponse.json({ reply: data.choices?.[0]?.message?.content || "" });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}