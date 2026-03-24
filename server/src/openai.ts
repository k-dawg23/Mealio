import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { recipesPayloadSchema, type RecipesPayload } from "./types.js";

export async function generateRecipesFromIngredients(ingredients: string[]): Promise<RecipesPayload> {
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
              "You are Mealio, a practical cooking assistant. Return exactly 4 recipes in JSON. Recipes must be realistic, safe to cook, and use the provided ingredients as the main starting point. Pantry staples like oil, salt, pepper, water, and basic seasonings are allowed. Keep descriptions concise and useful."
          }
        ]
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Ingredients: ${ingredients.join(", ")}`
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
