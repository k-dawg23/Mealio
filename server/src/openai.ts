import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { recipesPayloadSchema, type RecipesPayload } from "./types.js";

export type MeasurementSystem = "european" | "american";
export type LanguageCode = "en-GB" | "fr-FR" | "de-DE" | "it-IT" | "pt-PT" | "es-ES";

function getMeasurementGuidance(system: MeasurementSystem) {
  if (system === "american") {
    return "Use American recipe formatting by default. Use Fahrenheit for oven temperatures and volume-led measurements like cups where appropriate. Spoon amounts such as tsp and tbsp are fine.";
  }

  return "Use European recipe formatting by default. Any weights or volumes should be metric first using g and kg, with cups in brackets only when helpful. Any temperatures should be Celsius first with Fahrenheit in brackets. Counts of items and spoon amounts such as tsp and tbsp are fine.";
}

function getLanguageGuidance(language: LanguageCode) {
  const languageMap: Record<LanguageCode, string> = {
    "en-GB": "English",
    "fr-FR": "French",
    "de-DE": "German",
    "it-IT": "Italian",
    "pt-PT": "Portuguese from Portugal",
    "es-ES": "Spanish from Spain"
  };

  return `Return all recipe-facing text fields in ${languageMap[language]}. Keep the difficulty field in English using only Easy, Medium, or Hard for app compatibility.`;
}

export async function generateRecipesFromIngredients(
  ingredients: string[],
  measurementSystem: MeasurementSystem,
  language: LanguageCode
): Promise<RecipesPayload> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set.");
  }

  const client = new OpenAI({ apiKey });

  const response = await client.responses.parse({
    model: "gpt-5-nano",
    reasoning: {
      effort: "minimal"
    },
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text:
              `You are Mealio, a practical cooking assistant. Return exactly 4 recipes in JSON. Recipes must be realistic, safe to cook, and use the provided ingredients as the main starting point. Pantry staples like oil, salt, pepper, water, and basic seasonings are allowed. Keep descriptions concise and useful. ${getMeasurementGuidance(measurementSystem)} ${getLanguageGuidance(language)}`
          }
        ]
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Ingredients: ${ingredients.join(", ")}. Measurement preference: ${measurementSystem}. Language preference: ${language}.`
          }
        ]
      }
    ],
    max_output_tokens: 3200,
    text: {
      format: zodTextFormat(recipesPayloadSchema, "mealio_recipe_suggestions")
    }
  });

  if (!response.output_parsed) {
    throw new Error("OpenAI did not return valid recipe data.");
  }

  return recipesPayloadSchema.parse(response.output_parsed);
}
