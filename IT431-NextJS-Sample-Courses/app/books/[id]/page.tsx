import { FC } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import DeleteBookButton from "@/components/DeleteBookButton";
import { Book } from "@/types/book";

interface BookPageProps {
  params: {
    id: string;
  };
}

const BookPage: FC<BookPageProps> = async ({ params }) => {
  // Await params before accessing its properties
  const id = (await params).id;
  const bookId = parseInt(id, 10);
  
  // Check if the ID is valid
  if (isNaN(bookId)) {
    notFound();
  }
  
  // Get base URL from environment variables
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  
  try {
    // Fetch book from the API with base URL
    const response = await fetch(`${baseUrl}/api/books/${bookId}`, { next: { revalidate: 0 } });
    
    // If the response is not ok, show 404
    if (!response.ok) {
      notFound();
    }
    
    // Parse the book data
    const book: Book = await response.json();
    
    return (
      <div>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <Button asChild variant="outline" className="mb-4">
                <Link href="/">← Back to Books</Link>
              </Button>
              
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{book.title}</h1>
                <div className="space-x-2">
                  <Button asChild variant="outline">
                    <Link href={`/books/${book.id}/edit`}>Edit</Link>
                  </Button>
                  <DeleteBookButton bookId={book.id} />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-2">Book Genre</h2>
              <p className="mb-4">{book.genre}</p>

              <h2 className="text-xl font-semibold mb-2">Book Description</h2>
              <p className="mb-4">{book.description}</p>
              
              <h2 className="text-xl font-semibold mb-2">Book Rating</h2>
              <p>{book.rating}</p>
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('Error fetching book:', error);
    notFound();
  }
};

export default BookPage; 