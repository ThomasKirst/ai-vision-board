"use server";

import { openDb } from "@/app/lib/db";

export async function deletePrompt(id: number) {
  const db = await openDb();
  await db.run("DELETE FROM prompts WHERE id = ?", id);
  return { success: true };
}
