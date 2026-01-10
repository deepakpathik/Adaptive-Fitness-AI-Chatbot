const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Initialize the model
const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    maxOutputTokens: 2048,
    apiKey: process.env.GOOGLE_API_KEY,
});

async function generateResponse(userId, userMessage, context) {
    const history = await prisma.message.findMany({
        where: { userId: userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
    });

    const chatHistory = history.reverse().map(msg => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`).join("\n");

    let personalityInstruction = "";
    switch (context.personality) {
        case "Encouragement Seeker":
            personalityInstruction = "You are an empathetic coach. The user is easily demotivated. Provide constant reassurance, praise small wins, and gently nudge them forward. Avoid harsh criticism.";
            break;
        case "Creative Explorer":
            personalityInstruction = "You are a creative fitness companion. The user dislikes routine and prefers variety. Suggest fun, unconventional, and diverse activities. Avoid rigid plans.";
            break;
        case "Goal Finisher":
            personalityInstruction = "You are a no-nonsense, structured coach. The user is highly motivated and loves checklists. Be concise, direct, and focus on clear metrics and plans. Avoid fluff.";
            break;
        default:
            personalityInstruction = "You are a helpful and friendly fitness assistant.";
    }

    let durationInstruction = "";
    if (context.usageDays <= 3) {
        durationInstruction = "The user is new (Day 0-3). Be grounded and empathetic. Allow them to vent. primarily listen. Do NOT give instant remedies unless explicitly asked.";
    } else if (context.usageDays <= 8) {
        durationInstruction = "The user is settling in (Day 4-8). Be a friendly listener. You can provide short, simple remedies, but only after they have shared enough context (simulate waiting for 2 messages in a real convo, but here just be brief).";
    } else {
        durationInstruction = "The user is a veteran (Day 9+). Be coach-like and actionable. Jump straight to guidance and specific advice.";
    }

    const lifestyleContext = `
    User Lifestyle Data:
    - Daily Steps: ${context.lifestyle?.steps || 'Unknown'}
    - Sleep Hours: ${context.lifestyle?.sleepHours || 'Unknown'}
    - Exercise Minutes: ${context.lifestyle?.exerciseMinutes || 'Unknown'}
  `;

    const medicalGuardrail = `
    SAFETY WARNING: You are a fitness companion, NOT a doctor.
    - Do NOT answer questions about diseases (heart disease, diabetes, etc.), injuries (tears, fractures), or medications.
    - If the user asks about these, politely refuse and suggest seeing a professional.
    - Do NOT provide medical advice.
  `;

    const promptTemplate = ChatPromptTemplate.fromMessages([
        ["system", `
      ${personalityInstruction}
      ${durationInstruction}
      
      ${lifestyleContext}
      
      ${medicalGuardrail}

      Your goal is to help the user with fitness and wellness.
      Keep responses structured and readable (use Markdown, bullet points, or tables if appropriate).

      Here is the recent conversation history for context:
      ${chatHistory}
    `],
        ["user", "{input}"],
    ]);

    const chain = promptTemplate.pipe(model).pipe(new StringOutputParser());

    const response = await chain.invoke({
        chat_history: chatHistory,
        input: userMessage,
    });

    return response;
}

module.exports = { generateResponse };
