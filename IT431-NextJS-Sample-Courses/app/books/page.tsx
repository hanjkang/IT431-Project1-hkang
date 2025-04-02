import { FC } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import BookCard from "@/components/BookCardView";

interface Book {
  id: number;
  title: string;
  genre: string;
  description: string;
  rating: string;
}

async function getBooks(): Promise<Book[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/books`, { cache: "no-store" });
    
    if (!res.ok) {
      console.error('API response error:', await res.text());
      throw new Error(`Failed to fetch books: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}

const BooksPage: FC = async () => {
  const books = await getBooks();
  
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-center">List of Books Read</h1>
        </div>

        {books.length === 0 ? (
          <p className="text-center text-gray-500">No books were added.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BooksPage;