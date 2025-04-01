import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Book } from "@/types/book";

// Define the path to the JSON file
const dataFilePath = path.join(process.cwd(), "data", "books.json");

// Helper function to read books
const readBooks = (): Book[] => {
  try {
    const jsonData = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(jsonData) as Book[];
  } catch (error) {
    console.error("Error reading books file:", error);
    return [];
  }
};

// Helper function to write books
const writeBooks = (books: Book[]) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(books, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to books file:", error);
  }
};

// GET: Retrieve a book by ID
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> } // Await params

) {
  try {
    const { id } = await context.params; // Await params before accessing
    const bookId = parseInt(id, 10);

    if (isNaN(bookId)) {
      return NextResponse.json(
        { error: "Invalid book ID." },
        { status: 400 }
      );
    }

    const books = readBooks();
    const book = books.find((b) => b.id === bookId);

    if (!book) {
      return NextResponse.json({ error: "Book not found." }, { status: 404 });
    }

    return NextResponse.json(book, { status: 200 });
  } catch (error) {
    console.error("Error retrieving book:", error);
    return NextResponse.json(
      { error: "Failed to retrieve book." },
      { status: 500 }
    );
  }
}

// PUT: Update a book by ID
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> } // Await params

) {
  try {
    const { id } = await context.params; // Await params before accessing
    const bookId = parseInt(id, 10);

    if (isNaN(bookId)) {
      return NextResponse.json(
        { error: "Invalid book ID." },
        { status: 400 }
      );
    }

    const updatedBook: Partial<Book> = await request.json();
    const books = readBooks();
    const index = books.findIndex((b) => b.id === bookId);

    if (index === -1) {
      return NextResponse.json({ error: "Book not found." }, { status: 404 });
    }

    books[index] = { ...books[index], ...updatedBook, id: bookId };

    writeBooks(books);

    return NextResponse.json(books[index], { status: 200 });
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json(
      { error: "Failed to update book." },
      { status: 500 }
    );
  }
}

// DELETE: Remove a book by ID
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> } // Await params

) {
  try {
    const { id } = await context.params; // Await params before accessing
    const bookId = parseInt(id, 10);

    if (isNaN(bookId)) {
      return NextResponse.json(
        { error: "Invalid book ID." },
        { status: 400 }
      );
    }

    let books = readBooks();
    const initialLength = books.length;
    books = books.filter((b) => b.id !== bookId);

    if (books.length === initialLength) {
      return NextResponse.json({ error: "Book not found." }, { status: 404 });
    }

    writeBooks(books);

    return NextResponse.json(
      { message: `Book with ID ${bookId} deleted.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json(
      { error: "Failed to delete book." },
      { status: 500 }
    );
  }
}
