import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          From Prompt to Image
        </Link>
        <nav>
          <Link href="/vision-board" className="hover:text-gray-300">
            Vision Board
          </Link>
        </nav>
      </div>
    </header>
  );
}
