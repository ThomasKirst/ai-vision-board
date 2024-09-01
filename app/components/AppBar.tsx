import Link from "next/link";

export default function AppBar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white font-bold">
          Prompt to Image
        </Link>
        <Link href="/vision-board" className="text-white">
          Vision Board
        </Link>
      </div>
    </nav>
  );
}
