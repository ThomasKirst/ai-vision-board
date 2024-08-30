"use server";

import { revalidatePath } from "next/cache";
import { openDb } from "@/app/lib/db";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

interface GenerateImageParams {
  prompt: string;
  resolution: string;
  quality: number;
}

type ReplicateModel = `${string}/${string}` | `${string}/${string}:${string}`;

export async function generateImage({
  prompt,
  resolution,
  quality,
}: GenerateImageParams) {
  const model = process.env.REPLICATE_MODEL as ReplicateModel;

  if (!model) {
    throw new Error("No model specified");
  }

  try {
    const output = (await replicate.run(model, {
      input: {
        prompt: prompt,
        width: parseInt(resolution.split("x")[0]),
        height: parseInt(resolution.split("x")[1]),
        output_quality: quality,
        // num_inference_steps: 50,
        // guidance_scale: 7.5,
        // num_outputs: 1,
      },
    })) as string[];

    const imageUrl = output[0];

    const db = await openDb();
    await db.run(
      "INSERT INTO prompts (prompt, resolution, quality, image_url) VALUES (?, ?, ?, ?)",
      [prompt, resolution, quality, imageUrl]
    );

    revalidatePath("/");

    return { success: true, imageUrl };
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image");
  }
}
