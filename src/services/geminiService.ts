import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface Location {
  name: string;
  description: string;
  category: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  costLevel: "Free" | "$" | "$$" | "$$$" | "$$$$";
  suggestedTime: string;
  narration: string;
  websiteUrl?: string;
  mapsUrl?: string;
}

export interface Day {
  dayNumber: number;
  title: string;
  summary: string;
  locations: Location[];
}

export interface Itinerary {
  destination: string;
  tripLength: number;
  days: Day[];
}

export const generateItinerary = async (params: {
  destination: string;
  tripLength: number;
  interests: string[];
  budget: string;
  preferences: string;
}): Promise<Itinerary> => {
  const prompt = `Generate a highly detailed, geographically coherent ${params.tripLength}-day travel itinerary for ${params.destination}.
  Interests: ${params.interests.join(", ")}
  Budget Level: ${params.budget}
  Additional Preferences: ${params.preferences}

  For each day, provide a title, a summary, and a sequence of locations.
  Each location MUST include:
  - name
  - description (short)
  - category (e.g., Culture, Food, Nature, Shopping)
  - coordinates (realistic lat/lng for ${params.destination})
  - costLevel (Free, $, $$, $$$, $$$$)
  - suggestedTime (e.g., "09:00 AM - 11:00 AM")
  - narration (2-4 vivid sentences for audio narration, describing what the visitor sees and feels).
  - websiteUrl (The official website of the location, if applicable)
  - mapsUrl (A direct Google Maps link for the location)

  Ensure the itinerary is realistically paced and walkable where possible. Use Google Search to find real, existing locations and their correct URLs.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          destination: { type: Type.STRING },
          tripLength: { type: Type.NUMBER },
          days: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                dayNumber: { type: Type.NUMBER },
                title: { type: Type.STRING },
                summary: { type: Type.STRING },
                locations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      description: { type: Type.STRING },
                      category: { type: Type.STRING },
                      coordinates: {
                        type: Type.OBJECT,
                        properties: {
                          lat: { type: Type.NUMBER },
                          lng: { type: Type.NUMBER },
                        },
                        required: ["lat", "lng"],
                      },
                      costLevel: { type: Type.STRING },
                      suggestedTime: { type: Type.STRING },
                      narration: { type: Type.STRING },
                      websiteUrl: { type: Type.STRING },
                      mapsUrl: { type: Type.STRING },
                    },
                    required: ["name", "description", "category", "coordinates", "costLevel", "suggestedTime", "narration", "websiteUrl", "mapsUrl"],
                  },
                },
              },
              required: ["dayNumber", "title", "summary", "locations"],
            },
          },
        },
        required: ["destination", "tripLength", "days"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
};

export const refineItinerary = async (
  currentItinerary: Itinerary,
  feedback: string
): Promise<Itinerary> => {
  const prompt = `The user wants to modify their current itinerary for ${currentItinerary.destination}.
  Current Itinerary: ${JSON.stringify(currentItinerary)}
  User Feedback: "${feedback}"

  Update the itinerary based on this feedback. Keep the parts that don't need adjusting.
  Ensure it remains geographically coherent and realistically paced.
  Each location MUST continue to have websiteUrl and mapsUrl.
  Return the full updated itinerary in the same JSON structure.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          destination: { type: Type.STRING },
          tripLength: { type: Type.NUMBER },
          days: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                dayNumber: { type: Type.NUMBER },
                title: { type: Type.STRING },
                summary: { type: Type.STRING },
                locations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      description: { type: Type.STRING },
                      category: { type: Type.STRING },
                      coordinates: {
                        type: Type.OBJECT,
                        properties: {
                          lat: { type: Type.NUMBER },
                          lng: { type: Type.NUMBER },
                        },
                        required: ["lat", "lng"],
                      },
                      costLevel: { type: Type.STRING },
                      suggestedTime: { type: Type.STRING },
                      narration: { type: Type.STRING },
                      websiteUrl: { type: Type.STRING },
                      mapsUrl: { type: Type.STRING },
                    },
                    required: ["name", "description", "category", "coordinates", "costLevel", "suggestedTime", "narration", "websiteUrl", "mapsUrl"],
                  },
                },
              },
              required: ["dayNumber", "title", "summary", "locations"],
            },
          },
        },
        required: ["destination", "tripLength", "days"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
};
