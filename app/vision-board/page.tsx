import VisionBoardClient from "../components/VisionBoardClient";
import { openDb } from "@/app/lib/db";

async function getVisionBoardItems() {
  const db = await openDb();
  return db.all(`
    SELECT vb.id, vb.prompt_id, p.prompt, p.image_url, vb.position
    FROM vision_board vb
    JOIN prompts p ON vb.prompt_id = p.id
    ORDER BY vb.position
  `);
}

export default async function VisionBoard() {
  const items = await getVisionBoardItems();

  return <VisionBoardClient initialItems={items} />;
}
