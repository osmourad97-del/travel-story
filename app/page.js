"use client";
import { useState } from "react";

const COUNTRIES = [
  "Australia", "Austria",
  "Bahrain", "Belgium",
  "Canada", "Croatia", "Cyprus", "Czech Republic",
  "Denmark",
  "Estonia",
  "Finland", "France",
  "Germany", "Greece",
  "Hungary",
  "Iceland", "Ireland", "Israel", "Italy",
  "Japan", "Jordan",
  "Kuwait",
  "Latvia", "Lebanon", "Luxembourg",
  "Malta", "Netherlands", "New Zealand", "Norway",
  "Oman",
  "Poland", "Portugal",
  "Qatar",
  "Romania",
  "Saudi Arabia", "Serbia", "Singapore", "Slovenia", "Spain", "Sweden", "Switzerland",
  "Turkey",
  "UAE", "United Kingdom", "United States"
];

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
                    style={{ padding: "8px 16px", borderRadius: 99, border: "2px solid #e9d5ff",​​​​​​​​​​​​​​​​
