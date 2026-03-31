import { createAI } from './gemini';
import { Type } from '@google/genai';

export interface NLQueryResult {
  generatedSQL: string;
  naturalLanguage: string;
  explanation: string;
  rowCount: number;
  executionTime: string;
  mockResults: any[];
  alloydbConfig: Record<string, string>;
}

export const PRESET_QUERIES = [
  { label: 'COGNITIVE LOAD ANALYSIS', query: 'Show me all HIGH priority tasks completed when cognitive load stress level was above 80' },
  { label: 'RECENT HIGH-PRIORITY TASKS', query: 'Show me all HIGH priority tasks from the last 7 days' },
  { label: 'LATEST METRICS', query: 'Get the latest system telemetry metrics grouped by name' },
];

const SCHEMA_CONTEXT = `
You are an expert PostgreSQL and AlloyDB database architect. 
You are given a natural language query and must convert it to a valid PostgreSQL query using pgvector if necessary.

Database Schema:
- neural_logs (id UUID, entry_type TEXT, content TEXT, priority TEXT, created_at TIMESTAMP, embedding vector(768))
- habit_streaks (id UUID, habit_name TEXT, streak_days INT, last_checked DATE)
- system_metrics (id UUID, metric_name TEXT, metric_value NUMERIC, recorded_at TIMESTAMP)
- cognitive_load_events (id UUID, stress_level INT, focus_score INT, logged_at TIMESTAMP)

Respond strictly in JSON matching the exact schema requested. Provide a realistic SQL query, a short clear explanation, and realistic mock output rows that match exactly the columns returned by your SQL query. 
`;

export async function runNaturalLanguageQuery(query: string): Promise<NLQueryResult> {
  const ai = createAI();
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `Translate this query into SQL and generate realistic mock results: "${query}"`,
    config: {
      systemInstruction: SCHEMA_CONTEXT,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          generatedSQL: { type: Type.STRING },
          explanation: { type: Type.STRING, description: "Short explanation of the SQL logic" },
          rowCount: { type: Type.INTEGER, description: "Number of rows returned" },
          executionTime: { type: Type.STRING, description: "For example: '14ms'" },
          mockResults: {
            type: Type.ARRAY,
            description: "Array of JSON objects representing the exact row results. Ensure the keys match the SQL SELECT clause.",
            items: { type: Type.OBJECT }
          }
        },
        required: ["generatedSQL", "explanation", "rowCount", "executionTime", "mockResults"]
      }
    }
  });

  const rawText = response.text || '{}';
  const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleanJson);
  
  return {
    naturalLanguage: query,
    generatedSQL: parsed.generatedSQL || "SELECT * FROM neural_logs LIMIT 10;",
    explanation: parsed.explanation || "Query processed by AlloyDB Neural Engine.",
    rowCount: parsed.rowCount || 0,
    executionTime: parsed.executionTime || "12ms",
    mockResults: parsed.mockResults || [],
    alloydbConfig: {
      "WORKER_NODES": "4",
      "PG_VERSION": "15.4",
      "VECTOR_EXT": "pgvector 0.5.1",
      "REGION": "asia-south1",
      "LWT": "Enabled"
    }
  };
}
