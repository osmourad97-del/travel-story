"use client";
import { useState } from "react";

const COUNTRIES = [
  "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahrain", "Bangladesh", "Belarus", "Belgium", "Bolivia", "Bosnia", "Brazil", "Bulgaria", "Cambodia", "Canada",
  "Chile", "China", "Colombia", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Ecuador", "Egypt",
  "Estonia", "Finland", "France", "Georgia", "Germany", "Greece", "Guatemala", "Hong Kong", "Hungary", "Iceland",
  "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Japan", "Jordan", "Kazakhstan",
  "Kuwait", "Latvia", "Lebanon", "Lithuania", "Luxembourg", "Malaysia", "Malta", "Mexico", "Moldova", "Monaco",
  "Mongolia", "Montenegro", "Morocco", "Netherlands", "New Zealand", "North Macedonia", "Norway", "Oman", "Pakistan", "Panama",
  "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Saudi Arabia", "Serbia",
  "Singapore", "Slovakia", "Slovenia", "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland", "Taiwan", "Thailand",
  "Tunisia", "Turkey", "UAE", "Ukraine", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam"
];

const INTERESTS = ["Cinema 🎬", "Coffee ☕", "Nature 🌿", "Art 🎨", "Food 🍽️", "Nightlife 🌙", "Shopping 🛍️", "History 🏛️", "Music 🎵", "Sports ⚽"];
const FOODS = ["Pizza 🍕", "Sushi 🍣", "Steak 🥩", "Chicken 🍗", "Burger 🍔", "Tacos 🌮", "Noodles 🍜", "Salad 🥗", "Seafood 🦞", "Curry 🍛"];
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
    <div style={{ minHeight: "100vh", background: "#faf7f2", fontFamily: "'Lora',Georgia,serif", color: "#1c1917", padding: "0 0 80px" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 16px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ background: "#1c1917", color: "#faf7f2", borderRadius: 99, padding: "4px 16px", fontSize: 13 }}>✦ AI TRAVEL PLANNER</span>
          <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 48, margin: "16px 0 8px" }}>Plan Your Day</h1>
          <p style={{ color: "#78716c" }}>Your country. Your vibe. Your perfect day written just for you.</p>
        </div>

        {step === "input" && (
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 2px 16px #0001" }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 14, fontWeight: 600 }}>🌍 Where are you going?</label>
              <select
                value={form.country}
                onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                style={{ width: "100%", marginTop: 8, padding: "10px 14px", borderRadius: 8, border: "1px solid #e7e5e4", fontSize: 16, boxSizing: "border-box" }}
              >
                <option value="">Select a country...</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 14, fontWeight: 600 }}>🎂 Your Age</label>
                <select value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} style={{ width: "100%", marginTop: 8, padding: "10px 14px", borderRadius: 8, border: "1px solid #e7e5e4", fontSize: 15 }}>
                  <option value="">Select...</option>
                  {AGES.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 14, fontWeight: 600 }}>👥 Traveling with</label>
                <select value={form.companion} onChange={e => setForm(f => ({ ...f, companion: e.target.value }))} style={{ width: "100%", marginTop: 8, padding: "10px 14px", borderRadius: 8, border: "1px solid #e7e5e4", fontSize: 15 }}>
                  <option value="">Select...</option>
                  {COMPANIONS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 14, fontWeight: 600 }}>❤️ What do you love?</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {INTERESTS.map(i => (
                  <button key={i} onClick={() => toggleItem("interests", i)}
                    style={{ padding: "6px 14px", borderRadius: 99, border: "1px solid #e7e5e4", background: form.interests.includes(i) ? "#1c1917" : "#fff", color: form.interests.includes(i) ? "#fff" : "#1c1917", cursor: "pointer", fontSize: 14 }}>
                    {i}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 14, fontWeight: 600 }}>🍽️ Favorite food?</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {FOODS.map(i => (
                  <button key={i} onClick={() => toggleItem("food", i)}
                    style={{ padding: "6px 14px", borderRadius: 99, border: "1px solid #e7e5e4", background: form.food.includes(i) ? "#1c1917" : "#fff", color: form.food.includes(i) ? "#fff" : "#1c1917", cursor: "pointer", fontSize: 14 }}>
                    {i}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 14, fontWeight: 600 }}>🏠 What do you need?</label>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                {NEEDS.map(i => (
                  <button key={i} onClick={() => toggleItem("needs", i)}
                    style={{ padding: "6px 14px", borderRadius: 99, border: "1px solid #e7e5e4", background: form.needs.includes(i) ? "#1c1917" : "#fff", color: form.needs.includes(i) ? "#fff" : "#1c1917", cursor: "pointer", fontSize: 14 }}>
                    {i}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={generate} disabled={loading || !form.country}
              style={{ width: "100%", padding: 14, borderRadius: 10, background: "#1c1917", color: "#fff", fontSize: 16, fontWeight: 600, border: "none", cursor: loading ? "wait" : "pointer" }}>
              {loading ? "Writing your story..." : "✦ Write My Day Story"}
            </button>
            {error && <p style={{ color: "red", marginTop: 12, textAlign: "center" }}>{error}</p>}
          </div>
        )}

        {step === "result" && result && (
          <div>
            <h2 style={{ textAlign: "center" }}>Your Day in {form.country} ✦</h2>
            <p style={{ textAlign: "center", color: "#78716c" }}>{result.headline}</p>
            {result.stops?.map((stop, idx) => (
              <div key={idx} style={{ background: "#fff", borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: "0 1px 8px #0001" }}>
                <div style={{ fontSize: 13, color: "#78716c" }}>{stop.time} · {stop.category}</div>
                <div style={{ fontSize: 22 }}>{stop.emoji} <strong>{stop.name}</strong></div>
                <p>{stop.story}</p>
                <p style={{ color: "#a8a29e", fontSize: 13 }}>💡 {stop.tip}</p>
              </div>
            ))}
            <p style={{ textAlign: "center", fontStyle: "italic", color: "#78716c" }}>{result.closing}</p>
            <button onClick={reset} style={{ display: "block", margin: "24px auto 0", padding: "12px 32px", borderRadius: 99, background: "#1c1917", color: "#fff", border: "none", cursor: "pointer", fontSize: 15 }}>
              Plan Another Day
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
