export async function POST(request) {
  try {
    const body = await request.json();
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        system: `You are a travel storyteller. Given a city and preferences, create ONE perfect day itinerary. Reply ONLY with valid JSON, no markdown, no backticks, no explanation:
{"city":"","headline":"","intro":"","stops":[{"time":"9:00 AM","emoji":"☕","name":"","category":"Coffee","story":"","tip":"","vibe":"cozy"}],"closing":""}
Vibes: cozy/romantic/adventurous/chill/foodie/cultural
Categories: Coffee/Food/Activity/Hotel/Transport/Shopping/Nature/Culture/Entertainment
Include 6-8 stops. Be specific with real place names.`,
        messages: [{ role: "user", content: body.prompt }],
      }),
    });
    const data = await response.json();
    return Response.json(data);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
