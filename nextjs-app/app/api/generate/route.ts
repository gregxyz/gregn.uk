import { client } from "@/sanity/lib/client";
import { settingsQuery } from "@/sanity/lib/queries";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return new Response("Prompt is required", { status: 400 });
    }

    let settings = null;
    try {
      settings = await client.fetch(settingsQuery);
    } catch (error) {
      console.warn("Failed to fetch settings from Sanity:", error);
    }

    const basePrompt =
      settings?.basePrompt ||
      "Generate a project summary based on the following prompt, keeping it concise and engaging and under 3 short paragraphs:";

    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash-lite-preview-06-17",
      contents: `${basePrompt}\n\n${prompt}`,
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            controller.enqueue(new TextEncoder().encode(chunk.text));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in generate API:", error);
    return new Response(
      error instanceof Error ? error.message : "Internal Server Error",
      { status: 500 },
    );
  }
}
