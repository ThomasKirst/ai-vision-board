"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import ClientSideModal from "./ClientSideModal";
import {
  removeFromVisionBoard,
  updateVisionBoardOrder,
} from "@/app/actions/visionBoardActions";

interface VisionBoardItem {
  id: number;
  prompt_id: number;
  prompt: string;
  image_url: string;
  position: number;
}

interface VisionBoardClientProps {
  initialItems: VisionBoardItem[];
}

const ITEM_WIDTH = 300;
const ITEM_GAP = 16;

const SortableItem = ({
  item,
  onRemove,
}: {
  item: VisionBoardItem;
  onRemove: (promptId: number) => Promise<void>;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.prompt_id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: `${ITEM_WIDTH}px`,
    margin: `${ITEM_GAP / 2}px`,
  };

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      console.log("X icon clicked for promptId:", item.prompt_id);
      onRemove(item.prompt_id);
    },
    [item.prompt_id, onRemove]
  );

  return (
    <div ref={setNodeRef} style={style}>
      <div className="relative group">
        <div {...attributes} {...listeners} className="cursor-move">
          <Image
            src={item.image_url}
            alt={item.prompt}
            width={ITEM_WIDTH}
            height={ITEM_WIDTH}
            className="object-cover w-full h-auto"
          />
        </div>
        <ClientSideModal imageUrl={item.image_url}>
          <Button className="absolute bottom-2 left-2 bg-white/50 hover:bg-white/75 text-black">
            View Full Image
          </Button>
        </ClientSideModal>
        <Button
          onClick={handleRemove}
          className="absolute top-2 right-2 rounded-full w-8 h-8 p-0 bg-transparent hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <span className="sr-only">Remove from Vision Board</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default function VisionBoardClient({
  initialItems,
}: VisionBoardClientProps) {
  const [items, setItems] = useState(initialItems);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(
          (item) => item.prompt_id === active.id
        );
        const newIndex = items.findIndex((item) => item.prompt_id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        updateVisionBoardOrder(
          newItems.map((item: VisionBoardItem, index: number) => ({
            id: item.id,
            position: index,
          }))
        );
        return newItems;
      });
    }
  }, []);

  const handleRemove = useCallback(async (promptId: number) => {
    console.log("Attempting to remove item with promptId:", promptId);
    try {
      await removeFromVisionBoard(promptId);
      console.log("Item removed from backend successfully");
      setItems((prevItems) => {
        const newItems = prevItems.filter(
          (item) => item.prompt_id !== promptId
        );
        console.log("New items state:", newItems);
        return newItems;
      });
    } catch (error) {
      console.error("Error removing item:", error);
    }
  }, []);

  console.log("Current items:", items);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((item) => item.prompt_id)}>
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center">
          {items.map((item) => (
            <SortableItem
              key={item.prompt_id}
              item={item}
              onRemove={handleRemove}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
