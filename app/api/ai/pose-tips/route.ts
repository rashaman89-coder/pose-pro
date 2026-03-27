import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: Request) {
  const { poseTitle, category } = await req.json();

  if (!poseTitle || !category) {
    return new Response("Missing poseTitle or category", { status: 400 });
  }

  const stream = client.messages.stream({
    model: "claude-opus-4-6",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `You are an expert photography coach. Give concise, actionable shooting tips for this pose.

Pose: "${poseTitle}"
Category: ${category} photography

Provide 3–4 bullet points covering:
- Camera settings or lens suggestion
- Subject positioning and body language
- Lighting setup or direction
- One creative or emotional tip

Keep each bullet to 1–2 sentences. Be practical and specific.`,
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
