import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: Request) {
  const { category, notes } = await req.json();

  if (!category) {
    return new Response("Missing category", { status: 400 });
  }

  const notesContext = notes?.trim()
    ? `\nAdditional context from the photographer: ${notes}`
    : "";

  const stream = client.messages.stream({
    model: "claude-opus-4-6",
    max_tokens: 800,
    messages: [
      {
        role: "user",
        content: `You are an expert photography assistant. Generate a practical shot list for a ${category} photography session.${notesContext}

Return exactly 8–10 shot list items. Format each item on its own line starting with "- ".
Each item should be a specific, actionable shot description (e.g. "- Wide establishing shot of the venue exterior").
Cover a variety of shot types: wide/establishing, detail, emotional moments, portraits, and creative/artistic shots.
Do not add headers, explanations, or any text other than the bullet list.`,
      },
    ],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
