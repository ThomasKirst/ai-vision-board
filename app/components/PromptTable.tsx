import Image from "next/image";
import { openDb } from "@/app/lib/db";
import ClientSideModal from "./ClientSideModal";
import { deletePrompt } from "@/app/actions/deletePrompt";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import {
  addToVisionBoard,
  removeFromVisionBoard,
} from "@/app/actions/visionBoardActions";

interface Prompt {
  id: number;
  prompt: string;
  resolution: string;
  quality: number;
  image_url: string;
  created_at: string;
  on_vision_board: boolean;
}

async function getPrompts(): Promise<Prompt[]> {
  const db = await openDb();
  return db.all(`
    SELECT p.*, CASE WHEN vb.id IS NULL THEN 0 ELSE 1 END as on_vision_board
    FROM prompts p
    LEFT JOIN vision_board vb ON p.id = vb.prompt_id
    ORDER BY p.created_at DESC
  `);
}

export default async function PromptTable() {
  const prompts = await getPrompts();

  async function handleDelete(id: number) {
    "use server";
    await deletePrompt(id);
    revalidatePath("/");
  }

  async function handleVisionBoard(id: number, onVisionBoard: boolean) {
    "use server";
    if (onVisionBoard) {
      await removeFromVisionBoard(id);
    } else {
      await addToVisionBoard(id);
    }
    revalidatePath("/");
  }

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Generated Images</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Image</th>
            <th className="py-2 px-4 border-b">Prompt</th>
            <th className="py-2 px-4 border-b">Resolution</th>
            <th className="py-2 px-4 border-b">Quality</th>
            <th className="py-2 px-4 border-b">Created At</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {prompts.map((prompt) => (
            <tr key={prompt.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">
                <ClientSideModal imageUrl={prompt.image_url}>
                  <Image
                    src={prompt.image_url}
                    alt={prompt.prompt}
                    width={100}
                    height={100}
                    className="object-cover cursor-pointer"
                  />
                </ClientSideModal>
              </td>
              <td className="py-2 px-4 border-b">{prompt.prompt}</td>
              <td className="py-2 px-4 border-b">{prompt.resolution}</td>
              <td className="py-2 px-4 border-b">{prompt.quality}</td>
              <td className="py-2 px-4 border-b">
                {new Date(prompt.created_at).toLocaleString()}
              </td>
              <td className="py-2 px-4 border-b">
                <form action={handleDelete.bind(null, prompt.id)}>
                  <Button
                    type="submit"
                    variant="destructive"
                    size="sm"
                    className="mr-2"
                  >
                    Delete
                  </Button>
                </form>
                <form
                  action={handleVisionBoard.bind(
                    null,
                    prompt.id,
                    prompt.on_vision_board
                  )}
                >
                  <Button
                    type="submit"
                    variant={prompt.on_vision_board ? "secondary" : "default"}
                    size="sm"
                  >
                    {prompt.on_vision_board
                      ? "Remove from Vision Board"
                      : "Add to Vision Board"}
                  </Button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
