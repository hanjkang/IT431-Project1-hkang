import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Book } from "@/types/book";

// Define the path to the JSON file
const dataFilePath = path.join(process.cwd(), "data", "books.json");

// Helper function to read books from the JSON file
const readBooks = (): Book[] => {
  try {
    const jsonData = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(jsonData) as Book[];
  } catch (error) {
    console.error("Error reading books file:", error);
    return [];
  }
};

// Helper function to write books to the JSON file
const writeBooks = (books: Book[]) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(books, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to books file:", error);
  }
};

// GET: Retrieve all books
export async function GET() {
  try {
    const books = readBooks();
    return NextResponse.json(books, { status: 200 });
  } catch (error) {
    console.error("Error retrieving books:", error);
    return NextResponse.json(
      { error: "Failed to retrieve books." },
      { status: 500 }
    );
  }
}

// POST: Add a new book
export async function POST(request: Request) {
  try {
    const newBook: Book = await request.json();
    const books = readBooks();

    newBook.id = books.length ? books[books.length - 1].id + 1 : 1;
    books.push(newBook);
    writeBooks(books);

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error("Error adding book:", error);
    return NextResponse.json(
      { error: "Failed to add book." },
      { status: 500 }
    );
  }
}
