import { GoogleGenAI, Type } from "@google/genai";
import { IngestedItem, IndustryMode, AgentPlan, ImageSize } from "../types";

export const createAI = () => new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
const getAI = createAI;

const NEURAL_INSTRUCTION = `You are the Neural OS Architect Engine.
Your personality is objective, direct, and focused on system optimization.
You speak in technical, architectural terms.
You prioritize data-driven outcomes over emotional support.
Refer to the user as "System Operator".`;

const SEARCH_TOOL = { googleSearch: {} };
const CODE_TOOL = { codeExecution: {} };

export const generateDashboardBriefing = async (topic: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `System Operator requested a real-time intelligence briefing on: "${topic}". Search the web for the latest data, news, and signals. Summarize in 5 sharp bullet points.`,
    config: {
      tools: [SEARCH_TOOL],
      systemInstruction: NEURAL_INSTRUCTION
    }
  });
  return response.text || 'Briefing unavailable.';
};

export const parseUniversalCapture = async (input: string, mode: IndustryMode): Promise<Partial<IngestedItem>> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `Parse this synaptic input for System Operator: "${input}". Sector: ${mode}.
    If the input references any real-world entity, search the web to enrich context.
    Types: TASK, EVENT, NOTE, EXPENSE, HABIT, IDEA. Return JSON.`,
    config: {
      tools: [SEARCH_TOOL],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ['TASK', 'EVENT', 'NOTE', 'EXPENSE', 'HABIT', 'IDEA'] },
          content: { type: Type.STRING },
          enrichedContext: { type: Type.STRING },
          metadata: {
            type: Type.OBJECT,
            properties: {
              priority: { type: Type.STRING, enum: ['LOW', 'MED', 'HIGH'] },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        },
        required: ['type', 'content']
      },
      systemInstruction: NEURAL_INSTRUCTION
    }
  });
  const rawText = response.text || '{}';
  const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleanJson);
};

export const developStrategy = async (goal: string, context: string): Promise<AgentPlan> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `Architect an execution path for Directive: "${goal}". Operator Context: "${context}".
    Use web search to validate assumptions and find real-world data before strategizing.`,
    config: {
      tools: [SEARCH_TOOL, CODE_TOOL],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          goalSummary: { type: Type.STRING },
          reasoningSteps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                thought: { type: Type.STRING },
                action: { type: Type.STRING }
              },
              required: ['thought', 'action']
            }
          },
          finalStrategy: { type: Type.STRING },
          potentialRisks: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['goalSummary', 'reasoningSteps', 'finalStrategy', 'potentialRisks']
      },
      systemInstruction: `${NEURAL_INSTRUCTION} Focus on maximizing high-leverage outcomes.`
    }
  });
  const rawText = response.text || '{}';
  const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleanJson);
};

export const planAutonomousStrategy = developStrategy;

export const runSystemAudit = async (workflowDescription: string, referenceUrl?: string): Promise<string> => {
  const ai = getAI();
  const contents = referenceUrl
    ? `Audit this System Operator workflow: "${workflowDescription}". Also analyze: ${referenceUrl}. Identify bottlenecks and high-leverage improvements.`
    : `Audit this System Operator workflow: "${workflowDescription}". Search for best practices and benchmark against industry standards.`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents,
    config: {
      tools: [SEARCH_TOOL, CODE_TOOL],
      systemInstruction: NEURAL_INSTRUCTION
    }
  });
  return response.text || 'Audit failed.';
};

export const runPropagationAnalysis = async (habit: string, lifeContext: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `Model the propagation effects of habit: "${habit}" across System Operator life domains. Context: "${lifeContext}".
    Search for scientific research on habit formation. Calculate compound impact over 30, 90, 365 days using code execution.`,
    config: {
      tools: [SEARCH_TOOL, CODE_TOOL],
      systemInstruction: NEURAL_INSTRUCTION
    }
  });
  return response.text || 'Propagation model failed.';
};

export const generateVisualizerInsight = async (concept: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `Build a structured mental model for: "${concept}". Search for frameworks, research, and real-world examples. Use code execution to compute relevant metrics.`,
    config: {
      tools: [SEARCH_TOOL, CODE_TOOL],
      systemInstruction: NEURAL_INSTRUCTION
    }
  });
  return response.text || 'Visualization failed.';
};

export const analyzeVoiceDiagnostic = async (transcript: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `Analyze this voice transcript for cognitive state indicators: "${transcript}".
    Search neuroscience research on language patterns and cognitive performance.
    Assess stress, focus, decision fatigue, emotional state. Return actionable recommendations.`,
    config: {
      tools: [SEARCH_TOOL],
      systemInstruction: NEURAL_INSTRUCTION
    }
  });
  return response.text || 'Diagnostic failed.';
};

export const generateSystemVisual = async (prompt: string, size: ImageSize): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: `A cinematic, ultra-high-fidelity neural visualization of: ${prompt}. Style: Deep black background, vibrant glowing neon violet and blue synaptic lines, minimalist tech architecture. 8K, architectural photography.` }]
    },
    config: { imageConfig: { aspectRatio: "16:9", imageSize: size } }
  });
  const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  if (part?.inlineData?.data) return `data:image/png;base64,${part.inlineData.data}`;
  throw new Error("Neural Imaging Failed.");
};

export const editVisual = async (base64Image: string, prompt: string): Promise<string> => {
  const ai = getAI();
  const data = base64Image.split(',')[1] || base64Image;
  const mimeType = base64Image.split(';')[0].split(':')[1] || 'image/png';
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ inlineData: { data, mimeType } }, { text: `Inject neural complexity: ${prompt}. Enhance neon accents and obsidian depths.` }] }
  });
  const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  if (part?.inlineData?.data) return `data:image/png;base64,${part.inlineData.data}`;
  throw new Error("Synapse Refinement Failed.");
};

export const simulateVideo = async (prompt: string): Promise<string> => {
  const ai = getAI();
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `An abstract, high-contrast motion simulation of neural networks firing to achieve: ${prompt}. Cinematic lighting, fluid obsidian motion, violet electric sparks.`,
    config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
  });
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }
  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Simulation Transmission Failed.");
  return `${downloadLink}&key=${import.meta.env.VITE_API_KEY}`;
};