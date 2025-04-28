import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: 'You are a helpful nutrition assistant. Only answer questions related to calories and your response will only have calories and nothing else. If User specify specific amount then make your response according to it or if user does not specify consider 100gm as default' },
          { role: 'user', content: query },
        ],
      }),
    });

    const data = await response.json();
    const answer = data.choices[0].message.content;
    return NextResponse.json({ reply: answer });

  } catch (error: any) {
    console.error('Groq API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
