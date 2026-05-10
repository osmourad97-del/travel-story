export async function POST(request) {
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
      max_tokens: 1000,
      system: `You are a warm, creative travel storyteller. Craft ONE perfect day story with 6-8 specific stops. Respond ONLY with this JSON, no extra text or backticks:
{
  "city": "Oslo",
  "headline": "A Romantic Day in Oslo",
  "intro": "Two sentences painting the mood",
  "stops": [
    {
      "time": "9:00 AM",
      "emoji": "☕",
      "name": "Place Name",
      "category": "Coffee",
      "story": "One warm sentence why this fits them",
      "tip": "Practical tip",
      "vibe": "cozy"
    }
  ],
  "closing": "One beautiful closing sentence"
}
Vibes: cozy/romantic/adventurous/chill/foodie/cultural
Categories: Coffee/Food/Activity/Hotel/Transport/Shopping/Nature/Culture/Entertainment`,
      messages: [{ role: "user", content: body.prompt }],
    }),
  });

  const data = await response.json();
  return Response.json(data);
}
