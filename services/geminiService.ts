
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        fruitName: {
            type: Type.STRING,
            description: "The name of the fruit identified in the image (e.g., 'Banana', 'Apple')."
        },
        ripeness: {
            type: Type.STRING,
            enum: ['Unripe', 'Almost Ripe', 'Perfectly Ripe', 'Overripe', 'Unknown'],
            description: "The ripeness level of the fruit."
        },
        quality: {
            type: Type.STRING,
            enum: ['Excellent', 'Good', 'Fair', 'Poor', 'Unknown'],
            description: "The overall quality grade of the fruit based on visual cues like color, texture, and blemishes."
        },
        justification: {
            type: Type.STRING,
            description: "A brief, one-sentence justification for the ripeness and quality assessment."
        }
    },
    required: ['fruitName', 'ripeness', 'quality', 'justification']
};

export const analyzeFruitImage = async (base64ImageData: string, mimeType: string): Promise<AnalysisResult> => {
  const prompt = `Analyze the provided image of a fruit. Identify the fruit, determine its ripeness level, and grade its quality. Provide a brief, one-sentence justification for your assessment. Respond only with the JSON object.`;

  const imagePart = {
    inlineData: {
      data: base64ImageData,
      mimeType: mimeType,
    },
  };
  
  const textPart = {
    text: prompt
  };
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [textPart, imagePart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      }
    });

    const jsonString = response.text;
    if (!jsonString) {
      throw new Error("API returned an empty response.");
    }

    const parsedResult = JSON.parse(jsonString);
    return parsedResult as AnalysisResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to analyze image with Gemini API.");
  }
};
