"use client";
import { useState } from "react";

const COUNTRIES = [
   "Australia", "Austria","Belgium",  "Canada","Denmark", "Finland", "France","Germany", "Greece", "Ireland", "Israel", "Italy", "Japan", 
 "netherlands", "New Zealand", "Norway", "Spain", "Sweden", "Switzerland","Turkey", "UAE", "Ukraine", "United Kingdom", "United States"
];

"use client";
import { useState } from "react";

const INTERESTS = ["Coffee ☕", "Restaurant 🍽️", "Shopping 🛍️", "History 🏛️", "Nature 🌿"];
const FOODS = ["Meat 🥩", "Chicken 🍗", "Sushi 🍣", "Burger 🍔", "Pizza 🍕", "Tacos 🌮", "Noodles 🍜", "Seafood 🦞", "Salad 🥗", "Curry 🍛"];
const NEEDS = ["Hotel 🏨", "Airbnb 🏠"];
const AGES = ["18-24", "25-34", "35-44", "45-54", "55+"];
const COMPANIONS = ["Solo", "Partner", "Friends", "Family"];

export default function TravelStory() {
  const [step, setStep] = useState("input");
  const [form, setForm] = useState({ country: "", age: "", companion: "", interests: [], food: [], needs: [] });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleItem = (field, item) =>
    setForm(f => ({
      ...f,
      [field]: f[field].includes(item)
        ? f[field].filter(i => i !== item)
        : [...f[field], item]
    }));

  const generate = async () => {
    if (!form.country) return;
    setLoading(true);
    setError("");
    try {
      const prompt = `Country: ${form.country}\nAge: ${form.age || "not specified"}\nTraveling companion: ${form.companion || "not specified"}\nInterests: ${form.interests.join(", ") || "general"}\nFavorite food: ${form.food.join(", ") || "anything local"}\nNeeds: ${form.needs.join(", ") || "standard travel needs"}`;
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      if (!res.ok) throw new Error("Server Error");
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "";
      setResult(JSON.parse(text.replace(/```json|```/g, "").trim()));
      setStep("result");
    } catch (e) {
      setError("Couldn't generate your story. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep("input");
    setResult(null);
    setForm({ country: "", age: "", companion: "", interests: [], food: [], needs: [] });
    setError("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", fontFamily: "'Lora',Georgia,serif", color: "#1c1917", padding: "0 0 80px" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 16px" }}>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", borderRadius: 20, padding: "10px 24px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", marginBottom: 20 }}>
            <span style={{ fontSize: 28 }}>✈️</span>
            <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 26, fontWeight: 700, background: "linear-gradient(135deg, #667eea, #764ba2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>TravelYDay</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 42, margin: "8px 0", color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>Plan Your Day</h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16 }}>Your country. Your vibe. Your perfect day written just for you.</p>
        </div>

        {step === "input" && (
          <div style={{ background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 14, fontWeight: 700, color: "#4c1d95" }}>🌍 Where are you going?</label>
              <select
                value={form.country}
                onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                style={{ width: "100%", marginTop: 8, padding: "10px 14px", borderRadius: 10, border: "2px solid #e9d5ff", fontSize: 16, boxSizing: "border-box", color: "#1c1917" }}
              >
                <option value="">Select a country...</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 14, fontWeight: 700, color: "#4c1d95" }}>🎂 Your Age</label>
                <select value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} style={{ width: "100%", marginTop: 8, padding: "10px 14px", borderRadius: 10, border: "2px solid #e9d5ff", fontSize: 15 }}>
                  <option value="">Select...</option>
                  {AGES.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 14, fontWeight: 700, color: "#4c1d95" }}>👥 Traveling with</label>
                <select value={form.companion} onChange={e => setForm(f => ({ ...f, companion: e.target.value }))} style={{ width: "100%", marginTop: 8, padding: "10px 14px", borderRadius: 10, border: "2px solid #e9d5ff", fontSize: 15 }}>
                  <option value="">Select...</option>
                  {COMPANIONS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 14, fontWeight: 700, color: "#4c1d95" }}>❤️ What do you love to do?</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {INTERESTS.map(i => (
                  <button key={i} onClick={() => toggleItem("interests", i)}
                    style={{ padding: "8px 16px", borderRadius: 99, border: "2px solid #e9d5ff", background: form.interests.includes(i) ? "linear-gradient(135deg, #667eea, #764ba2)" : "#fff", color: form.interests.includes(i) ? "#fff" : "#4c1d95", cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "all 0.2s" }}>
                    {i}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 14, fontWeight: 700, color: "#4c1d95" }}>🍽️ Favorite food?</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {FOODS.map(i => (
                  <button key={i} onClick={() => toggleItem("food", i)}
                    style={{ padding: "8px 16px", borderRadius: 99, border: "2px solid #e9d5ff", background: form.food.includes(i) ? "linear-gradient(135deg, #667eea, #764ba2)" : "#fff", color: form.food.includes(i) ? "#fff" : "#4c1d95", cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "all 0.2s" }}>
                    {i}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 14, fontWeight: 700, color: "#4c1d95" }}>🏠 What do you need?</label>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                {NEEDS.map(i => (
                  <button key={i} onClick={() => toggleItem("needs", i)}
                    style={{ padding: "8px 16px", borderRadius: 99, border: "2px solid #e9d5ff", background: form.needs.includes(i) ? "linear-gradient(135deg, #667eea, #764ba2)" : "#fff", color: form.needs.includes(i) ? "#fff" : "#4c1d95", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                    {i}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={generate} disabled={loading || !form.country}
              style={{ width: "100%", padding: 16, borderRadius: 12, background: "linear-gradient(135deg, #667eea, #764ba2)", color: "#fff", fontSize: 17, fontWeight: 700, border: "none", cursor: loading ? "wait" : "pointer", boxShadow: "0 4px 15px rgba(102,126,234,0.5)" }}>
              {loading ? "Writing your story..." : "✦ Write My Day Story"}
            </button>
            {error && <p style={{ color: "#ef4444", marginTop: 12, textAlign: "center" }}>{error}</p>}
          </div>
        )}

        {step === "result" && result && (
          <div>
            <div style={{ background: "#fff", borderRadius: 20, padding: 24, marginBottom: 16, textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
              <h2 style={{ margin: "0 0 8px", fontFamily: "'Playfair Display',Georgia,serif", fontSize: 28 }}>Your Day in {form.country} ✦</h2>
              <p style={{ color: "#78716c", margin: 0 }}>{result.headline}</p>
            </div>
            {result.stops?.map((stop, idx) => (
              <div key={idx} style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
                <div style={{ fontSize: 13, color: "#7c3aed", fontWeight: 600 }}>{stop.time} · {stop.category}</div>
                <div style={{ fontSize: 22, margin: "6px 0" }}>{stop.emoji} <strong>{stop.name}</strong></div>
                <p style={{ margin: "8px 0", color: "#44403c" }}>{stop.story}</p>
                <p style={{ color: "#a8a29e", fontSize: 13, margin: 0 }}>💡 {stop.tip}</p>
              </div>
            ))}
            <p style={{ textAlign: "center", fontStyle: "italic", color: "rgba(255,255,255,0.9)", padding: "0 16px" }}>{result.closing}</p>
            <button onClick={reset} style={{ display: "block", margin: "24px auto 0", padding: "14px 36px", borderRadius: 99, background: "#fff", color: "#7c3aed", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700, boxShadow: "0 4px 15px rgba(0,0,0,0.15)" }}>
              Plan Another Day
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

