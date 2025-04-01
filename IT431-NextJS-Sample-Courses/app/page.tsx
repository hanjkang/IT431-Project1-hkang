import { FC } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import BookCard from "@/components/BookCard";

interface Book {
  id: number;
  title: string;
  genre: string;
  description: string;
  rating: string;
}

// This is a Server Component that fetches data
async function getBooks(): Promise<Book[]> {
  try {
    // Use relative URL for API routes in the same Next.js app
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/books`, { 
      cache: "no-store",
    });
    
    if (!res.ok) {
      console.error('API response error:', await res.text());
      throw new Error(`Failed to fetch books: ${res.status}`);
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching books:', error);
    return []; // Return empty array on error to prevent UI from breaking
  }
}

const Home: FC = async () => {
  const books = await getBooks();
  
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-center">Available Books</h1>
          <Link href="/books/add">
            <Button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800">
              Add New Book
            </Button>
          </Link>
        </div>
        
        {books.length === 0 ? (
          <p className="text-center text-gray-500">No books available at the moment.</p>
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

export default Home;
