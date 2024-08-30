"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

export default function ImageModal({ imageUrl, onClose }: ImageModalProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative max-w-screen-lg max-h-screen">
        <button
          className="absolute top-4 right-4 text-white text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <Image
          src={imageUrl}
          alt="Full-screen image"
          layout="responsive"
          width={1920}
          height={1080}
          objectFit="contain"
        />
      </div>
    </div>
  );
}
