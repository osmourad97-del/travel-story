"use client";
import { useState } from "react";

const VIBE_COLORS = {
  cozy:        { accent: "#f59e0b", light: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)" },
  romantic:    { accent: "#f472b6", light: "rgba(244,114,182,0.12)", border: "rgba(244,114,182,0.25)" },
  adventurous: { accent: "#4ade80", light: "rgba(74,222,128,0.10)", border: "rgba(74,222,128,0.25)" },
  chill:       { accent: "#60a5fa", light: "rgba(96,165,250,0.10)", border: "rgba(96,165,250,0.25)" },
  foodie:      { accent: "#fb923c", light: "rgba(251,146,60,0.12)", border: "rgba(251,146,60,0.25)" },
  cultural:    { accent: "#a78bfa", light: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.25)" },
};

const CAT_EMOJI = {
  Coffee: "☕", Food: "🍽️", Activity: "🎯", Hotel: "🏨",
  Transport: "🚕", Shopping: "🛍️", Nature: "🌿", Culture: "🎨", Entertainment: "🎬"
};

const CITIES = [
  "Amsterdam","Athens","Bangkok","Barcelona","Berlin","Brussels",
  "Budapest","Cairo","Cape Town","Copenhagen","Dubai","Dublin",
  "Florence","Istanbul","Jakarta","Kuala Lumpur","Lisbon","London",
  "Los Angeles","Madrid","Melbourne","Mexico City","Miami","Milan",
  "Montreal","Mumbai","Munich","New York","Oslo","Paris",
  "Prague","Rome","San Francisco","Seoul","Singapore","Stockholm",
  "Sydney","Tokyo","Toronto","Vienna","Warsaw","Zurich"
];

const AGES = Array.from({length: 53}, (_, i) => i + 18);
const FOOD_OPTIONS = ["🍕 Pizza","🍣 Sushi","🥩 Steak","🍗 Chicken","🍔 Burger","🌮 Tacos","🍜 Noodles","🥗 Salad","🦞 Seafood","🍛 Curry"];
const NEEDS_OPTIONS = ["🏨 Hotel","🏠 Airbnb"];
const INTERESTS = ["Cinema 🎬","Coffee ☕","Nature 🌿","Art 🎨","Food 🍽️","Nightlife 🌙","Shopping 🛍️","History 🏛️","Music 🎵","Sports ⚽"];
const WITH_OPTIONS = ["Solo 🧍","Partner ❤️","Friends 👯","Family 👨‍👩‍👧","Kids 🧒"];

function Tag({ label, color }) {
  return (
    <span style={{ fontSize:10, padding:"2px 10px", borderRadius:20, background:`${color}20`, color, border:`1px solid ${color}40`, fontWeight:600, letterSpacing:0.5, textTransform:"uppercase" }}>{label}</span>
  );
}

export default function TravelStory() {
  const [step, setStep] = useState("input");
  const [form, setForm] = useState({ city:"", age:"", companion:"", interests:[], food:[], needs:[] });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleItem = (field, item) => setForm(f => ({ ...f, [field]: f[field].includes(item) ? f[field].filter(i=>i!==item) : [...f[field], item] }));
  const toggleInterest = (item) => toggleItem("interests", item);

  const generate = async () => {
    if (!form.city) return;
    setLoading(true); setError("");
    try {
      const prompt = `City: ${form.city}\nAge: ${form.age||"not specified"}\nTraveling companion: ${form.companion||"not specified"}\nInterests: ${form.interests.join(", ")||"general"}\nFavorite food: ${form.food.join(", ")||"anything local"}\nNeeds: ${form.needs.join(", ")||"standard travel needs"}`;
      const res = await fetch("/api/story", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({prompt}) });
      const data = await res.json();
      const text = data.content?.find(b=>b.type==="text")?.text||"";
      setResult(JSON.parse(text.replace(/```json|```/g,"").trim()));
      setStep("result");
    } catch(e) { setError("Couldn't generate your story. Try again!"); }
    finally { setLoading(false); }
  };

  const reset = () => { setStep("input"); setResult(null); setForm({city:"",age:"",companion:"",interests:[],food:[],needs:[]}); setError(""); };

  const sel = { width:"100%", border:"1.5px solid #e7e5e4", borderRadius:12, padding:"13px 16px", fontSize:15, outline:"none", background:"#faf7f2", appearance:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" };

  return (
    <div style={{ minHeight:"100vh", background:"#faf7f2", fontFamily:"'Lora',Georgia,serif", color:"#1c1917", padding:"0 0 80px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        .fade{animation:fadeUp 0.45s ease both}
        button{cursor:pointer}
        .pill{transition:all 0.15s}
        .pill:hover{transform:translateY(-1px)}
      `}</style>

      <div style={{ background:"linear-gradient(160deg,#292524,#1c1917)", padding:"48px 24px 56px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-40, right:-40, width:200, height:200, borderRadius:"50%", background:"rgba(245,158,11,0.08)" }}/>
        <div style={{ display:"inline-block", background:"rgba(245,158,11,0.15)", border:"1px solid rgba(245,158,11,0.3)", borderRadius:20, padding:"4px 16px", marginBottom:20, fontSize:11, color:"#f59e0b", letterSpacing:2, textTransform:"uppercase", fontFamily:"'DM Sans',sans-serif" }}>✦ AI Travel Planner</div>
        <h1 style={{ fontSize:"clamp(28px,6vw,52px)", fontWeight:700, margin:"0 0 14px", color:"#faf7f2", lineHeight:1.2, fontStyle:"italic" }}>Plan Your Day</h1>
        <p style={{ color:"#a8a29e", fontSize:16, margin:"0 auto", fontFamily:"'DM Sans',sans-serif", maxWidth:420, lineHeight:1.6 }}>Your city. Your vibe. Your perfect day — written just for you.</p>
      </div>

      <div style={{ maxWidth:620, margin:"-24px auto 0", padding:"0 16px", position:"relative" }}>

        {step==="input" && (
          <div className="fade">
            <div style={{ background:"#fff", borderRadius:20, padding:28, boxShadow:"0 4px 40px rgba(0,0,0,0.08)", border:"1px solid #e7e5e4" }}>

              <div style={{ marginBottom:18 }}>
                <label style={{ display:"block", fontSize:13, color:"#78716c", marginBottom:8, fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>📍 Where are you going? *</label>
                <select value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))} style={{...sel, color:form.city?"#1c1917":"#a8a29e"}}>
                  <option value="">Select a city...</option>
                  {CITIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:18 }}>
                <div>
                  <label style={{ display:"block", fontSize:13, color:"#78716c", marginBottom:8, fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>🎂 Your Age</label>
                  <select value={form.age} onChange={e=>setForm(f=>({...f,age:e.target.value}))} style={{...sel, color:form.age?"#1c1917":"#a8a29e"}}>
                    <option value="">Select...</option>
                    {AGES.map(a=><option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display:"block", fontSize:13, color:"#78716c", marginBottom:8, fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>👥 Traveling with</label>
                  <select value={form.companion} onChange={e=>setForm(f=>({...f,companion:e.target.value}))} style={{...sel, color:form.companion?"#1c1917":"#a8a29e"}}>
                    <option value="">Select...</option>
                    {WITH_OPTIONS.map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom:18 }}>
                <label style={{ display:"block", fontSize:13, color:"#78716c", marginBottom:10, fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>❤️ What do you love?</label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {INTERESTS.map(item => { const a=form.interests.includes(item); return <button key={item} className="pill" onClick={()=>toggleInterest(item)} style={{ padding:"7px 14px", borderRadius:20, fontSize:13, fontFamily:"'DM Sans',sans-serif", fontWeight:500, background:a?"#292524":"#f5f5f4", color:a?"#faf7f2":"#78716c", border:a?"1.5px solid #292524":"1.5px solid #e7e5e4" }}>{item}</button>; })}
                </div>
              </div>

              <div style={{ marginBottom:18 }}>
                <label style={{ display:"block", fontSize:13, color:"#78716c", marginBottom:10, fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>🍽️ Favorite food?</label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {FOOD_OPTIONS.map(item => { const a=form.food.includes(item); return <button key={item} className="pill" onClick={()=>toggleItem("food",item)} style={{ padding:"7px 14px", borderRadius:20, fontSize:13, fontFamily:"'DM Sans',sans-serif", fontWeight:500, background:a?"#292524":"#f5f5f4", color:a?"#faf7f2":"#78716c", border:a?"1.5px solid #292524":"1.5px solid #e7e5e4" }}>{item}</button>; })}
                </div>
              </div>

              <div style={{ marginBottom:24 }}>
                <label style={{ display:"block", fontSize:13, color:"#78716c", marginBottom:10, fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>🎒 What do you need?</label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {NEEDS_OPTIONS.map(item => { const a=form.needs.includes(item); return <button key={item} className="pill" onClick={()=>toggleItem("needs",item)} style={{ padding:"7px 14px", borderRadius:20, fontSize:13, fontFamily:"'DM Sans',sans-serif", fontWeight:500, background:a?"#292524":"#f5f5f4", color:a?"#faf7f2":"#78716c", border:a?"1.5px solid #292524":"1.5px solid #e7e5e4" }}>{item}</button>; })}
                </div>
              </div>

              <button onClick={generate} disabled={loading||!form.city} style={{ width:"100%", padding:"16px", background:loading?"#e7e5e4":"linear-gradient(135deg,#292524,#44403c)", border:"none", borderRadius:14, color:loading?"#a8a29e":"#faf7f2", fontSize:16, fontWeight:600, fontFamily:"'DM Sans',sans-serif", opacity:!form.city?0.5:1 }}>
                {loading?<span style={{animation:"pulse 1.2s infinite"}}>✦ Writing your story...</span>:"✦ Write My Day Story"}
              </button>
              {error && <p style={{ color:"#ef4444", fontSize:13, textAlign:"center", marginTop:12, fontFamily:"'DM Sans',sans-serif" }}>{error}</p>}
            </div>
          </div>
        )}

        {step==="result" && result && (
          <div>
            <div className="fade" style={{ background:"#292524", borderRadius:20, padding:"28px 24px", marginBottom:16, position:"relative", overflow:"hidden", boxShadow:"0 8px 40px rgba(0,0,0,0.15)" }}>
              <div style={{ fontSize:12, color:"#f59e0b", marginBottom:10, fontFamily:"'DM Sans',sans-serif", letterSpacing:2, textTransform:"uppercase" }}>✦ Your Story</div>
              <h2 style={{ fontSize:24, fontWeight:700, color:"#faf7f2", margin:"0 0 12px", fontStyle:"italic", lineHeight:1.3 }}>{result.headline}</h2>
              <p style={{ fontSize:14, color:"#a8a29e", lineHeight:1.8, margin:"0 0 20px", fontFamily:"'DM Sans',sans-serif" }}>{result.intro}</p>
              <button onClick={reset} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"8px 16px", color:"#a8a29e", fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>← Plan Another Day</button>
            </div>

            <div style={{ position:"relative", paddingRight:8 }}>
              <div style={{ position:"absolute", right:28, top:0, bottom:0, width:2, background:"linear-gradient(180deg,#f59e0b,#e7e5e4)", borderRadius:2 }}/>
              {result.stops?.map((stop,i) => {
                const v=VIBE_COLORS[stop.vibe]||VIBE_COLORS.chill;
                return (
                  <div key={i} className="fade" style={{ display:"flex", gap:16, marginBottom:14, animationDelay:`${i*0.09}s` }}>
                    <div style={{ flex:1 }}>
                      <div style={{ background:"#fff", borderRadius:16, padding:"18px 20px", border:`1px solid ${v.border}`, boxShadow:"0 2px 16px rgba(0,0,0,0.05)" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                          <div>
                            <div style={{ fontSize:11, color:"#a8a29e", fontFamily:"'DM Sans',sans-serif", marginBottom:4 }}>{stop.time}</div>
                            <div style={{ fontSize:17, fontWeight:700, color:"#1c1917" }}>{stop.name}</div>
                          </div>
                          <Tag label={stop.category} color={v.accent}/>
                        </div>
                        <p style={{ fontSize:14, color:"#57534e", lineHeight:1.7, margin:"0 0 10px", fontStyle:"italic" }}>{stop.story}</p>
                        <div style={{ background:v.light, borderRadius:10, padding:"8px 12px", fontSize:12, color:"#78716c", fontFamily:"'DM Sans',sans-serif", border:`1px solid ${v.border}` }}>💡 {stop.tip}</div>
                      </div>
                    </div>
                    <div style={{ width:36, height:36, borderRadius:"50%", flexShrink:0, background:v.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, marginTop:18, boxShadow:`0 0 0 4px ${v.light}` }}>
                      {stop.emoji||CAT_EMOJI[stop.category]||"📍"}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="fade" style={{ background:"linear-gradient(135deg,#292524,#44403c)", borderRadius:16, padding:"24px 20px", marginTop:8, textAlign:"center" }}>
              <div style={{ fontSize:20, marginBottom:12 }}>✨</div>
              <p style={{ fontSize:16, color:"#faf7f2", fontStyle:"italic", lineHeight:1.8, margin:0 }}>"{result.closing}"</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
