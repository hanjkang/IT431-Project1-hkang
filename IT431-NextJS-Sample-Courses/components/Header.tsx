import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-green-100 border-b border-gray-200 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image src="/book-tracker.png" alt="Book Tracker Logo" width={40} height={40} />

          <h1 className="text-2xl font-bold">Book Tracker</h1>

          <nav className="flex gap-6">
            <Link href="/" className="text-gray-500 hover:text-gray-900">
              Home
            </Link>
            <Link href="/books" className="text-gray-500 hover:text-gray-900">
              View Books
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 