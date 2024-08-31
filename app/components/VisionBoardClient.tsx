"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
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

const ITEMS_PER_ROW = 3;
const ITEM_WIDTH = 300;
const ITEM_GAP = 16;

export default function VisionBoardClient({
  initialItems,
}: VisionBoardClientProps) {
  const [items, setItems] = useState(initialItems);

  const onDragEnd = useCallback(
    (result: any) => {
      if (!result.destination) return;

      const newItems = Array.from(items);
      const [reorderedItem] = newItems.splice(result.source.index, 1);
      newItems.splice(result.destination.index, 0, reorderedItem);

      setItems(newItems);
      updateVisionBoardOrder(
        newItems.map((item, index) => ({ id: item.id, position: index }))
      );
    },
    [items]
  );

  const handleRemove = useCallback(async (id: number) => {
    await removeFromVisionBoard(id);
    setItems((prevItems) => prevItems.filter((item) => item.prompt_id !== id));
  }, []);

  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    userSelect: "none",
    padding: `${ITEM_GAP / 2}px`,
    margin: `0 ${ITEM_GAP / 2}px ${ITEM_GAP}px`,
    background: isDragging ? "lightblue" : "white",
    width: `${ITEM_WIDTH}px`,
    ...draggableStyle,
  });

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="vision-board" type="COLUMN">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="max-w-6xl mx-auto"
          >
            {Array.from({
              length: Math.ceil(items.length / ITEMS_PER_ROW),
            }).map((_, rowIndex) => (
              <Droppable
                key={rowIndex}
                droppableId={`row-${rowIndex}`}
                direction="horizontal"
                type="ROW"
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      display: "flex",
                      width: `${ITEMS_PER_ROW * (ITEM_WIDTH + ITEM_GAP)}px`,
                      margin: "0 auto",
                    }}
                  >
                    {items
                      .slice(
                        rowIndex * ITEMS_PER_ROW,
                        (rowIndex + 1) * ITEMS_PER_ROW
                      )
                      .map((item, index) => (
                        <Draggable
                          key={item.prompt_id.toString()}
                          draggableId={item.prompt_id.toString()}
                          index={rowIndex * ITEMS_PER_ROW + index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`relative ${
                                snapshot.isDragging ? "z-10 shadow-lg" : ""
                              }`}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              <div className="cursor-move">
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
                                onClick={() => handleRemove(item.prompt_id)}
                                className="absolute top-2 right-2 rounded-full w-8 h-8 p-0 bg-transparent hover:bg-white/20"
                              >
                                <span className="sr-only">
                                  Remove from Vision Board
                                </span>
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
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
