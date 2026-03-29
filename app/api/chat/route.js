import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { system, messages, apiKey } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: "API Key is missing." }, { status: 401 });
    }

    // Connects to Groq's insanely fast API
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // One of the smartest and fastest models
        max_tokens: 1000,
        messages: [
          { role: "system", content: system },
          ...messages.map(m => ({ role: m.role, content: m.content }))
        ]
      })
    });

    const data = await res.json();
    
    if (!res.ok) {
      return NextResponse.json({ error: data?.error?.message || res.statusText }, { status: res.status });
    }

    return NextResponse.json({ reply: data.choices?.[0]?.message?.content || "" });
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}