"use client";

import { useState } from "react";
import ImageModal from "./ImageModal";

interface ClientSideModalProps {
  imageUrl: string;
  children: React.ReactNode;
}

export default function ClientSideModal({
  imageUrl,
  children,
}: ClientSideModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <div onClick={openModal}>{children}</div>
      {isOpen && <ImageModal imageUrl={imageUrl} onClose={closeModal} />}
    </>
  );
}
