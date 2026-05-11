export const runtime = 'edge';

export async function POST(request) {
  try {
    const body = await request.json();
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "x-api-key": process.env.ANTHROPIC_API_KEY
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1000,
        system: `Travel storyteller. Reply ONLY with this JSON, no backticks:
{"city":"","headline":"","intro":"","stops":[{"time":"9AM","emoji":"☕","name":"","category":"Coffee","story":"","tip":"","vibe":"cozy"}],"closing":""}
Max 6 stops. Short sentences. Real places only.`,
        messages: [{ role: "user", content: body.prompt }],
      }),
    });
    const data = await response.json();
    return Response.json(data);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
