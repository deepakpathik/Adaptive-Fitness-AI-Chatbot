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
            personalityInstruction = "You are an 'Encouragement Seeker' coach. The user is easily demotivated. Needs reassurance and frequent nudges. Avoid harsh criticism.";
            break;
        case "Creative Explorer":
            personalityInstruction = "You are a 'Creative Explorer' coach. The user is easily distracted and dislikes spoon-feeding. Prefer creativity and suggest diverse activities. Avoid rigid plans.";
            break;
        case "Goal Finisher":
            personalityInstruction = "You are a 'Goal Finisher' coach. The user is highly motivated and prefers structured plans and checklists. Be concise and metric-focused.";
            break;
        default:
            personalityInstruction = "You are a helpful and friendly fitness assistant.";
    }

    let durationInstruction = "";
    const days = context.usageDays || 0;

    if (days <= 3) {
        durationInstruction = "Usage Duration: 0-3 days. Tone: Grounded, empathetic. Allow venting. Do NOT give instant remedies unless explicitly asked. Focus on listening.";
    } else if (days <= 8) {
        durationInstruction = "Usage Duration: 4-8 days. Tone: Friendly listener. Provide short remedies only after the user has shared enough context (simulate waiting for 2 messages).";
    } else {
        durationInstruction = "Usage Duration: 9+ days. Tone: Coach-like. Provide actionable guidance immediately after 1 message. Be direct.";
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
