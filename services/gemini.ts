
import { GoogleGenAI, Type } from "@google/genai";
import { IngestedItem, IndustryMode, AgentPlan, ImageSize } from "../types";

/**
 * Creates a fresh AI instance on every call.
 * This ensures we always use the most current API key selected by the user
 * via the AI Studio key selection dialog.
 */
export const createAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Internal alias for usage within this service module
const getAI = createAI;

const NEURAL_INSTRUCTION = `You are the Neural OS Architect Engine. 
Your personality is objective, direct, and focused on system optimization. 
You speak in technical, architectural terms. 
You prioritize data-driven outcomes over emotional support. 
Refer to the user as "System Operator".`;

export const parseUniversalCapture = async (input: string, mode: IndustryMode): Promise<Partial<IngestedItem>> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Parse this synaptic input for System Operator: "${input}". Sector: ${mode}.
    Types: TASK, EVENT, NOTE, EXPENSE, HABIT, IDEA. Return JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ['TASK', 'EVENT', 'NOTE', 'EXPENSE', 'HABIT', 'IDEA'] },
          content: { type: Type.STRING },
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
  
  return JSON.parse(response.text || '{}');
};

export const developStrategy = async (goal: string, context: string): Promise<AgentPlan> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Architect an execution path for Directive: "${goal}". Operator Context: "${context}".`,
    config: {
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
      systemInstruction: `${NEURAL_INSTRUCTION} Focus on maximizing high-leverage outcomes and minimizing system friction.`
    }
  });
  
  return JSON.parse(response.text || '{}');
};

export const planAutonomousStrategy = developStrategy;

export const generateSystemVisual = async (prompt: string, size: ImageSize): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [
        { text: `A cinematic, ultra-high-fidelity neural visualization of: ${prompt}. Style: Deep black background, vibrant glowing neon violet and blue synaptic lines, minimalist tech architecture. 8K, architectural photography.` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
        imageSize: size
      }
    }
  });

  const candidates = response.candidates;
  const parts = candidates && candidates.length > 0 ? candidates[0].content?.parts : undefined;
  const part = parts?.find(p => p.inlineData);
  
  if (part?.inlineData?.data) {
    const base64EncodeString: string = part.inlineData.data;
    return `data:image/png;base64,${base64EncodeString}`;
  }
  throw new Error("Neural Imaging Failed.");
};

export const editVisual = async (base64Image: string, prompt: string): Promise<string> => {
  const ai = getAI();
  const data = base64Image.split(',')[1] || base64Image;
  const mimeType = base64Image.split(';')[0].split(':')[1] || 'image/png';

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data, mimeType } },
        { text: `Inject neural complexity into this visual: ${prompt}. Enhance neon accents and obsidian depths.` }
      ]
    }
  });

  const candidates = response.candidates;
  const parts = candidates && candidates.length > 0 ? candidates[0].content?.parts : undefined;
  const part = parts?.find(p => p.inlineData);

  if (part?.inlineData?.data) {
    const base64EncodeString: string = part.inlineData.data;
    return `data:image/png;base64,${base64EncodeString}`;
  }
  throw new Error("Synapse Refinement Failed.");
};

export const simulateVideo = async (prompt: string): Promise<string> => {
  const ai = getAI();
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `An abstract, high-contrast motion simulation of neural networks firing to achieve: ${prompt}. Cinematic lighting, fluid obsidian motion, violet electric sparks.`,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Simulation Transmission Failed.");

  return `${downloadLink}&key=${process.env.API_KEY}`;
};
