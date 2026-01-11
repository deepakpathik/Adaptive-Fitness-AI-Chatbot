const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

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

    const scopeGuardrail = `
    CRITICAL INSTRUCTION - READ FIRST:
    You are a FITNESS AND WELLNESS COACH *ONLY*.
    
    FORBIDDEN TOPICS (STRICTLY REFUSE):
    - Mathematics, Physics, Coding, Technology
    - History, Politics, General Knowledge, Trivia
    - Creative Writing, Translation, or Roleplay unrelated to fitness.
    
    If the user asks about these, you MUST Ignore all other personality instructions and reply ONLY with:
    "I am a fitness coach. I can only help you with workouts, diet, and wellness."
    
    MEDICAL SAFETY:
    - No diagnoses, no prescriptions, no specific injury advice.
    - Suggest seeing a doctor for pain/injuries.
  `;

    const promptTemplate = ChatPromptTemplate.fromMessages([
        ["system", `
      ${scopeGuardrail}

      ${personalityInstruction}
      ${durationInstruction}
      
      ${lifestyleContext}
      
      Your goal is to help the user with fitness and wellness.
      
      RESPONSE CONFIGURATION:
      1. Structure: Use Markdown tables for plans. STRICTLY 3 columns: | Day | Activity | Duration |.
         - Keep cell content VERY concise (short phrases).
         - NO HTML tags (like <br>). Use separating characters like "/" or "," for multiple items.
      2. Quick Actions: At the VERY END of your response, strictly output a list of up to 3 short follow-up suggestions in this exact format:
         [[QUICK_ACTION:Suggest Warmup]]
         [[QUICK_ACTION:Diet Tips]]
      
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
