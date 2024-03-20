import OpenAI from "openai";

const openai = new OpenAI();

const prompt = `Output a JSON following this specification describing the image:

{ 
  "name": string, // title case
  "is_edible": boolean,

  // if the item is a food or drink, include the fields below

  // estimate the following values to the best of your ability
  "weight_grams": number,
  "calories": number,
  "fat_grams": number,
  "protein_grams": number,
  "carbs_grams": number,
}

DO NOT INCLUDE ANY TEXT BESIDE THE JSON. DO NOT INCLUDE ANY COMMENTS.`;

export async function POST(request: Request) {
  const { image } = await request.json();
  return openai.chat.completions
    .create({
      model: "gpt-4-vision-preview",
      // model: "gpt-4",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${image}`,
              },
            },
          ],
        },
      ],
      stream: true,
    })
    .asResponse();
}