import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a product image based on the item name and type using Gemini 2.5 Flash Image.
 */
export const generateProductImage = async (name: string, type: string): Promise<string> => {
  try {
    const prompt = `Professional product photography of ${name} (${type}). Minimalist style, placed on a clean white studio background. High quality, photorealistic, commercial aesthetic. 4k resolution.`;
    
    // Using gemini-2.5-flash-image for efficient image generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
            aspectRatio: "1:1"
        }
      }
    });

    // Iterate through parts to find the image data
    if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Error generating product image:", error);
    // Return a fallback image if generation fails to keep the UI robust
    return `https://picsum.photos/seed/${encodeURIComponent(name)}/400/400`;
  }
};