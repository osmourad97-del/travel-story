"use client";
import { useState, useEffect } from "react";

// ... (Your VIBE_COLORS, CITIES, and other constants)

export default function TravelStory() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState("input");
  const [form, setForm] = useState({ city: "", age: "", companion: "", interests: [], food: [], needs: [] });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1. Trigger mount state
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleItem = (field, item) => setForm(f => ({ ...f, [field]: f[field].includes(item) ? f[field].filter(i => i !== item) : [...f[field], item] }));
  const toggleInterest = (item) => toggleItem("interests", item);

  const generate = async () => {
    if (!form.city) return;
    setLoading(true); setError("");
    try {
      const prompt = `City: ${form.city}\nAge: ${form.age || "not specified"}\nTraveling companion: ${form.companion || "not specified"}\nInterests: ${form.interests.join(", ") || "general"}\nFavorite food: ${form.food.join(", ") || "anything local"}\nNeeds: ${form.needs.join(", ") || "standard travel needs"}`;
      const res = await fetch("/api/story", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
      
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

  const reset = () => { setStep("input"); setResult(null); setForm({ city: "", age: "", companion: "", interests: [], food: [], needs: [] }); setError(""); };

  // 2. Prevent rendering until mounted
  if (!mounted) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#faf7f2", fontFamily: "'Lora',Georgia,serif", color: "#1c1917", padding: "0 0 80px" }}>
      {/* ... rest of your JSX code ... */}
    </div>
  );
}
