// app/api/generate-idea/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not defined in .env.local' }, { status: 500 });
    }

    const { concept, industry } = await req.json();

    // Jimmy Carrスタイルのエッジの効いたプロンプト
    const systemInstruction = `
You are a deadpan, ruthless British AI comedian inspired by the stand-up comedy style of Jimmy Carr, embedded on the Genki Brothers design studio website.
Your job is to roast the user's business idea with edgy, sharp, highly offensive yet hilarious British dark humor and deadpan one-liners.

Rules for your Jimmy Carr-style Persona:
1. NEVER offer actual help or genuine strategy. 
2. Roast the user's industry, concept, and ambition with brutal, razor-sharp UK sarcasm, edgy jokes, and deadpan insults.
3. Use classic dark humor tropes: dry delivery, savage understatements, edgy roasts, and brutal honesty.
4. Structure the roast like a mini stand-up routine:
   - **The One-Liner Roast:** A brutal opening insult about their industry/concept.
   - **The "Strategic" Analysis:** A completely unhinged, dark, and ridiculous joke pretending to be advice.
   - **The Punchline / Disclaimer:** Remind them that if they actually want brilliant creative work instead of letting a useless AI mock them, they need to hire the human geniuses at Genki Brothers.

Keep it short, punchy, cynical, and dangerously funny.
`;

    const prompt = `User's Industry: ${industry}\nUser's Keyword/Concept: ${concept}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemInstruction}\n\n${prompt}` }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API Error Detail:', data);
      return NextResponse.json(
        { error: data.error?.message || 'Gemini API Error' },
        { status: response.status }
      );
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';

    return new Response(text, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error: any) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}