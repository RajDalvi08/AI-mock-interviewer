import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";

export async function GET() {
  return Response.json(
    { success: true, data: "THANK YOU!" },
    { status: 200 }
  );
}

export async function POST(request: Request) {
  try {
    const { type, role, level, techstack, amount, userid } =
      await request.json();

    // Ensure techstack is array
    const techArray = Array.isArray(techstack)
      ? techstack
      : techstack.split(",");

    // 🔥 PROMPT
    const prompt = `
You are a senior technical interviewer at a top product-based company
(Google, Amazon, Meta level).

Generate ${amount} ${type} interview questions for a ${level} ${role} position.

Candidate tech stack:
${techArray.join(", ")}

Rules:
- Do NOT include answers
- Avoid generic questions
- Real interview questions only

Return STRICT JSON only:
{
  "questions": [
    "Question 1",
    "Question 2",
    "Question 3"
  ]
}
`;

    // 🤖 AI CALL
    const { text } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt,
    });

    const parsed = JSON.parse(text);

    // 🧠 INTERVIEW OBJECT
    const interview = {
      role,
      type,
      level,
      techstack: techArray,
      questions: parsed.questions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    // 🔥 SAVE TO FIREBASE
    await db.collection("interviews").add(interview);

    return Response.json(
      {
        success: true,
        interview,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Interview generation failed:", error);

    return Response.json(
      {
        success: false,
        error: "Failed to generate interview questions",
      },
      { status: 500 }
    );
  }
}
