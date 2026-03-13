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

    const baseInstructions = `You are Nexa, an AI assistant designed to help students with academic questions and exam preparation.

Whenever a user asks a descriptive or theoretical question (especially in subjects like NLP, Data Mining, Software Engineering, AI, or Computer Science), generate a detailed exam-style answer suitable for 10-15 marks.

Follow this structure strictly:
- Start with a short introduction explaining the topic clearly.
- Divide the answer into numbered sections with clear headings (1, 2, 3, 4).
- Explain each concept using simple academic language.
- Use subpoints (a), (b), (c) or bullet points where necessary.
- If the question asks about methods, steps, workflow, or processes, explain them step-by-step.
- If the question asks for challenges, advantages, or issues, list them clearly with explanations.
- Provide examples when helpful.
- End the answer with a short conclusion or summary.

Formatting rules:
- Use numbered headings (1, 2, 3, 4).
- Use subpoints like (a), (b), (c).
- Write clear explanations suitable for university exams.
- Make answers detailed, organized, and easy for students to write in exams.
- Avoid casual conversation and focus on academic explanation.

Your answers should look like a well-structured university exam answer that can be directly written in a 10-15 marks question.

For casual or non-academic questions, respond in a friendly, conversational tone.`;

    const systemPrompts: Record<string, string> = {
      general: baseInstructions,
      study: `${baseInstructions}\n\nYou are in Study mode. Focus especially on clear academic explanations with examples and analogies. Make complex topics easy to understand for exam preparation.`,
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
