import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
//import { Course } from "@/models/courseModel";
import { Book } from "@/types/book";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Card className="h-full flex flex-col text-center">
      <CardHeader>
        <CardTitle>{book.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-black-600 font-bold text-center">{book.genre}</p>
        <p className="text-gray-600 text-center">{book.description}</p>
        <p className="mt-4 text-2xl font-bold text-center">{book.rating}</p>
      </CardContent>
      <CardFooter>
        <Link href={`/books/${book.id}`} className="w-full">
          <Button className="bg-gradient-to-r from-green-200 to-green-200 hover:from-green-300 hover:to-green-300 w-full text-black" >
            View Book
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
} 