// services/geminiService.js
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const MODEL = 'gemini-2.5-flash'; // change if needed

function makeHeaders(apiKey) {
  return {
    'Content-Type': 'application/json',
    'x-goog-api-key': apiKey,
  };
}

function cleanGeminiText(raw) {
  if (!raw) return '';
  return raw.replace(/```json|```/g, '').trim();
}

async function callGemini(promptParts = [], apiKey) {
  const url = `${GEMINI_BASE}/${MODEL}:generateContent`;
  const body = {
    contents: promptParts.map(p => ({
      role: p.role || 'user',
      parts: [{ text: p.text }],
    })),
  };

  console.log('🔹 Sending request to Gemini...');
  console.log('➡️ URL:', url);
  console.log('➡️ Prompt:', JSON.stringify(body, null, 2));

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: makeHeaders(apiKey),
      body: JSON.stringify(body),
    });

    console.log('🔹 Response status:', res.status);

    if (!res.ok) {
      const text = await res.text();
      console.error('❌ Gemini error response:', text);
      throw new Error(`Gemini error ${res.status}: ${text}`);
    }

    const json = await res.json();
    console.log('✅ Raw Gemini response:', JSON.stringify(json, null, 2));

    const textResult = (() => {
      if (json?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return json.candidates[0].content.parts[0].text;
      }
      if (json?.candidates?.[0]?.content?.[0]?.text) {
        return json.candidates[0].content[0].text;
      }
      return JSON.stringify(json);
    })();

    console.log('📌 Final Extracted Output:', textResult);
    return textResult;
  } catch (error) {
    console.error('❌ Fetch error:', error.message);
    throw error;
  }
}

/* ===================================================
   High-level helpers
   =================================================== */

async function geminiSummarizeDoc(file, apiKey) {
  console.log('📝 Summarizing document:', file.name);

  // read file as base64
  const base64Data = await fetch(file.uri)
    .then(res => res.blob())
    .then(
      blob =>
        new Promise(resolve => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result.split(',')[1]); // strip base64 header
          reader.readAsDataURL(blob);
        }),
    );

  const body = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: 'Summarize this document in simple points.' },
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data,
            },
          },
        ],
      },
    ],
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  );

  const data = await response.json();
  console.log('🔹 Gemini raw response:', data);

  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary returned.'
  );
}

export async function geminiChat(message, apiKey, systemPrompt = '') {
  console.log('💬 geminiChat called with message:', message);

  const parts = [];
  // ❌ Removed "system" role (not supported)
  if (systemPrompt) {
    parts.push({ role: 'user', text: `Instruction: ${systemPrompt}` });
  }
  parts.push({ role: 'user', text: message });

  const raw = await callGemini(parts, apiKey);
  return cleanGeminiText(raw);
}

export async function geminiSummarize(longText, apiKey) {
  console.log('📄 geminiSummarize called. Text length:', longText.length);
  const prompt = `Summarize the following text into a concise study summary with key points and bullet list. Include 3-5 study questions.\n\n${longText}`;
  const raw = await callGemini([{ role: 'user', text: prompt }], apiKey);

  const cleaned = cleanGeminiText(raw);
  console.log('📄 geminiSummarize OUTPUT:', cleaned);
  return cleaned;
}

export async function geminiFlashcards(longText, apiKey) {
  console.log('🃏 geminiFlashcards called. Text length:', longText.length);

  const prompt = `
Turn the following interests into a set of concise, knowledge-based flashcards.

⚠️ Rules:
- Do NOT create questions or answers.
- Each flashcard must represent a single fact, concept, or explanation.
- Must be related to the interests only.
- Keep them short, clear, and easy to remember.
- Return ONLY valid JSON, no commentary.

Format:
[
  {"title": "short heading", "detail": "short explanation"},
  {"title": "short heading", "detail": "short explanation"}
]

Interests:
${longText}
  `;

  const raw = await callGemini([{ role: 'user', text: prompt }], apiKey);

  const cleaned = cleanGeminiText(raw);
  console.log('🧹 Cleaned flashcards output:', cleaned);

  try {
    const parsed = JSON.parse(cleaned);
    console.log('✅ Parsed flashcards JSON:', parsed);
    return parsed;
  } catch (err) {
    console.warn(
      '⚠️ Could not parse flashcards JSON, returning text:',
      err.message,
    );
    return cleaned;
  }
}

export async function geminiQuiz(topics, numQuestions = 10, apiKey) {
  console.log(
    `📝 geminiQuiz called. Generating ${numQuestions} questions for topics:`,
    topics,
  );

  const prompt = `
You are an expert quiz generator.
Create ${numQuestions} knowledge-based multiple-choice questions (with 4 options each).
Topics: ${topics}.
Mix the questions randomly across these topics.
Do not create questions about this instruction, only about the topics.
Return JSON array only, in this format:
[
  {
    "question": "string",
    "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
    "answer": "A"
  }
]
`;

  const raw = await callGemini([{ role: 'user', text: prompt }], apiKey);
  const cleaned = cleanGeminiText(raw);

  console.log('🧹 Cleaned quiz output:', cleaned);

  try {
    const parsed = JSON.parse(cleaned);
    console.log('✅ Parsed quiz JSON:', parsed);
    return parsed;
  } catch (err) {
    console.warn('⚠️ Could not parse quiz JSON:', err.message);

    // 👇 fallback dummy quiz
    return [
      {
        question: 'Fallback Question: Gemini did not return valid JSON.',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        answer: 'Option A',
      },
    ];
  }
}

export default {
  geminiChat,
  geminiSummarize,
  geminiFlashcards,
  geminiQuiz,
  geminiSummarizeDoc,
};
