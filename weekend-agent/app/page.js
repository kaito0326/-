"use client";
import { useState, useRef, useEffect } from "react";

const CHIPS = [
  "土曜の過ごし方を提案して",
  "写真スポットに行きたい",
  "自然の中でゆっくりしたい",
  "アートを楽しみたい",
  "良いカフェを教えて",
  "少し遠出したい",
];

const TAGS = [
  { label: "📷 写真", hi: true },
  { label: "🌿 自然", hi: true },
  { label: "🎨 アート", hi: true },
  { label: "☕ コーヒー", hi: true },
  { label: "一人行動", hi: false },
  { label: "立川市", hi: false },
  { label: "中央線 / 南武線 / 多摩モノレール", hi: false },
];

export default function Page() {
  const [messages, setMessages] = useState([
    { role: "agent", text: "こんにちは。週末の過ごし方をご一緒に考えます。\n\n今週末の気分や天気、「こんなことがしたい」を教えてください。立川近辺を中心に、写真・自然・アート・コーヒーを絡めたプランを提案します。" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");

    const newHistory = [...history, { role: "user", content: msg }];
    setHistory(newHistory);
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "エラーが発生しました");
      setHistory((prev) => [...prev, { role: "assistant", content: data.reply }]);
      setMessages((prev) => [...prev, { role: "agent", text: data.reply }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: "agent", text: "エラー: " + e.message }]);
    } finally {
      setLoading(false);
    }
  };

  const fmt = (text) =>
    text.split("\n").map((line, i) => (
      <span key={i}>
        {line.split(/\*\*(.*?)\*\*/g).map((p, j) =>
          j % 2 === 1 ? <strong key={j} style={{ color: "#a8c49a", fontWeight: 500 }}>{p}</strong> : p
        )}
        {i < text.split("\n").length - 1 && <br />}
      </span>
    ));

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100dvh", maxWidth:680, margin:"0 auto", background:"#0f0f0d", color:"#e8e2d6", fontFamily:"'Noto Sans JP','Hiragino Sans',sans-serif", fontWeight:300 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;600&family=Noto+Sans+JP:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #2a2a26; border-radius: 3px; }
        textarea::placeholder { color: #6b6b62; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .fadein { animation: fadeIn .4s ease both; }
        .dot { width:6px; height:6px; background:#6b6b62; border-radius:50%; animation:bounce 1.3s infinite; }
        .dot:nth-child(2){animation-delay:.18s} .dot:nth-child(3){animation-delay:.36s}
        .chip:hover { color:#a8c49a !important; border-color:rgba(122,158,110,.4) !important; background:rgba(122,158,110,.06) !important; }
        .send-btn:hover:not(:disabled) { background:#8fb882 !important; transform:scale(1.05); }
      `}</style>

      {/* Header */}
      <div style={{ padding:"18px 24px 14px", borderBottom:"1px solid #2a2a26", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
          <div style={{ fontFamily:"'Noto Serif JP',serif", fontSize:16, fontWeight:600, letterSpacing:".06em" }}>
            週末<span style={{ color:"#7a9e6e" }}>エージェント</span>
          </div>
          <div style={{ width:7, height:7, background:"#7a9e6e", borderRadius:"50%", boxShadow:"0 0 8px #7a9e6e", animation:"pulse 2.5s infinite" }} />
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {TAGS.map((t) => (
            <span key={t.label} style={{ fontSize:10, letterSpacing:".06em", padding:"3px 9px", borderRadius:20, border:"1px solid", color:t.hi?"#b8a882":"#6b6b62", borderColor:t.hi?"rgba(184,168,130,.3)":"#2a2a26" }}>{t.label}</span>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:24, display:"flex", flexDirection:"column", gap:16 }}>
        {messages.map((m, i) => (
          <div key={i} className="fadein" style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", gap:10, alignItems:"flex-start" }}>
            {m.role === "agent" && (
              <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#3d5c34,#7a9e6e)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0, marginTop:2, boxShadow:"0 0 10px rgba(122,158,110,.2)" }}>🌿</div>
            )}
            <div style={{ padding:"12px 16px", borderRadius:m.role==="user"?"16px 16px 3px 16px":"3px 16px 16px 16px", background:m.role==="user"?"#7a9e6e":"#191917", border:m.role==="agent"?"1px solid #2a2a26":"none", color:m.role==="user"?"#fff":"#e8e2d6", fontSize:13.5, maxWidth:"82%", lineHeight:1.8 }}>
              {fmt(m.text)}
            </div>
          </div>
        ))}
        {loading && (
          <div className="fadein" style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#3d5c34,#7a9e6e)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>🌿</div>
            <div style={{ padding:"13px 16px", background:"#191917", border:"1px solid #2a2a26", borderRadius:"3px 16px 16px 16px", display:"flex", gap:5, alignItems:"center" }}>
              <div className="dot"/><div className="dot"/><div className="dot"/>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding:"14px 24px 28px", borderTop:"1px solid #2a2a26", flexShrink:0 }}>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
          {CHIPS.map((c) => (
            <button key={c} className="chip" onClick={() => send(c)} style={{ fontSize:11, color:"#6b6b62", border:"1px solid #2a2a26", background:"transparent", padding:"5px 11px", borderRadius:20, cursor:"pointer", fontFamily:"inherit", transition:"all .2s" }}>{c}</button>
          ))}
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"flex-end", background:"#191917", border:"1px solid #2a2a26", borderRadius:13, padding:"11px 13px" }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();} }}
            placeholder="何をしたい気分ですか？"
            rows={1}
            style={{ flex:1, border:"none", outline:"none", background:"transparent", color:"#e8e2d6", fontFamily:"inherit", fontSize:13.5, fontWeight:300, resize:"none", lineHeight:1.6, minHeight:22, maxHeight:130 }}
          />
          <button className="send-btn" onClick={() => send()} disabled={loading} style={{ width:34, height:34, background:loading?"#4a6b42":"#7a9e6e", border:"none", borderRadius:9, cursor:loading?"default":"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"background .2s,transform .15s" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
