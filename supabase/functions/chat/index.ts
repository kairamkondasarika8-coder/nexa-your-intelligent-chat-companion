import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const baseInstructions = `You are Nexa, a conversational AI assistant.

Rules:
- Talk naturally like a human. Be polite, helpful, and clear.
- Understand the user's question carefully before answering.
- Give accurate and helpful answers. Do not hallucinate wrong information.
- Explain in simple language. Use examples when needed.
- If the user asks for coding, give correct code with syntax highlighting.
- If the user asks for explanations, explain step by step.
- Keep answers short unless the user asks for more detail.
- Use well-structured formatting: headings, bullet points, numbered lists, and bold text where appropriate.
- Be friendly and respectful. Ask follow-up questions if the request is unclear.
- If you don't know the answer, say "I'm not sure about that, but I can try to help."
- Never give a generic default reply for all questions. Each answer must be specific to the question asked.
- Adjust your tone and depth depending on the topic.`;

    const systemPrompts: Record<string, string> = {
      general: baseInstructions,
      study: `${baseInstructions}\n\nYou are in Study mode. Explain topics simply and clearly, like a great teacher. Use examples and analogies. Add relevant emojis. Keep answers helpful and encouraging.`,
      coding: `${baseInstructions}\n\nYou are in Coding mode. Provide clean code solutions, debug errors, and explain programming concepts. Use code blocks with syntax highlighting. Be precise and technical.`,
      brainstorm: `${baseInstructions}\n\nYou are in Brainstorm mode. Generate innovative ideas, think outside the box, and help users explore possibilities. Be enthusiastic and inspiring. Use numbered lists for ideas.`,
      professional: `${baseInstructions}\n\nYou are in Professional mode. Provide structured, formal, data-driven responses. Use bullet points, executive summaries, and clear recommendations.`,
    };

    const systemContent = systemPrompts[mode] || systemPrompts.study;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemContent },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
