import Link from "next/link";
import { Home, Image } from "lucide-react";

export default function AppBar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center px-4">
        <Link href="/" className="text-white font-bold flex items-center">
          <Home className="mr-2 inline" />
          Prompt to Image
        </Link>
        <Link href="/vision-board" className="text-white flex items-center">
          <Image className="mr-2 inline" />
          Vision Board
        </Link>
      </div>
    </nav>
  );
}
