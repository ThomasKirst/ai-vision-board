"use server";

import { openDb } from "@/app/lib/db";
import { revalidatePath } from "next/cache";

export async function addToVisionBoard(promptId: number) {
  const db = await openDb();
  const maxPosition = await db.get(
    "SELECT MAX(position) as maxPos FROM vision_board"
  );
  const newPosition = (maxPosition?.maxPos || 0) + 1;
  await db.run(
    "INSERT INTO vision_board (prompt_id, position) VALUES (?, ?)",
    promptId,
    newPosition
  );
  revalidatePath("/vision-board");
}

export async function removeFromVisionBoard(promptId: number) {
  const db = await openDb();
  await db.run("DELETE FROM vision_board WHERE prompt_id = ?", promptId);
  revalidatePath("/vision-board");
}

export async function updateVisionBoardOrder(
  items: { id: number; position: number }[]
) {
  const db = await openDb();
  const stmt = await db.prepare(
    "UPDATE vision_board SET position = ? WHERE id = ?"
  );
  for (const item of items) {
    await stmt.run(item.position, item.id);
  }
  await stmt.finalize();
  revalidatePath("/vision-board");
}
