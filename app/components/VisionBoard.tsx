import Image from "next/image";
import { openDb } from "@/app/lib/db";
import ClientSideModal from "./ClientSideModal";
import { Button } from "@/components/ui/button";
import { removeFromVisionBoard } from "@/app/actions/visionBoardActions";
import VisionBoardClient from "./VisionBoardClient";

interface VisionBoardItem {
  id: number;
  prompt_id: number;
  prompt: string;
  image_url: string;
  position: number;
}

async function getVisionBoardItems(): Promise<VisionBoardItem[]> {
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

  if (items.length === 0) {
    return (
      <div className="text-center text-xl mt-8">No images on vision board</div>
    );
  }

  return <VisionBoardClient initialItems={items} />;
}
