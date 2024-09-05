"use server";

import { revalidatePath } from "next/cache";
import { openDb } from "@/app/lib/db";
import Replicate from "replicate";
import fs from "fs";
import path from "path";
import { Buffer } from "buffer";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

interface GenerateImageParams {
  prompt: string;
  resolution: string;
  quality: number;
}

type ReplicateModel = `${string}/${string}` | `${string}/${string}:${string}`;

async function downloadImage(url: string, filepath: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Ensure the directory exists
    const dir = path.dirname(filepath);
    await fs.promises.mkdir(dir, { recursive: true });

    await fs.promises.writeFile(filepath, buffer);
    console.log("Image successfully written to", filepath);
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image");
  }
}

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
    const [width, height] = resolution.split("x").map(Number);
    let aspectRatio: string;
    if (width === 1440 && height === 810) {
      aspectRatio = "16:9";
    } else if (width === height) {
      aspectRatio = "1:1";
    } else {
      aspectRatio = "custom";
    }

    const output = (await replicate.run(model, {
      input: {
        prompt: prompt,
        aspect_ratio: aspectRatio,
        width: width,
        height: height,
        output_quality: quality,
      },
    })) as string[];

    const imageUrl = output[0];
    const imageName = `${Date.now()}.png`;
    const imagePath = path.join(process.cwd(), "public", "images", imageName);

    await downloadImage(imageUrl, imagePath);

    const db = await openDb();
    await db.run(
      "INSERT INTO prompts (prompt, resolution, quality, image_url) VALUES (?, ?, ?, ?)",
      [prompt, resolution, quality, `/images/${imageName}`]
    );

    revalidatePath("/");

    return { success: true, imageUrl: `/images/${imageName}` };
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image");
  }
}
