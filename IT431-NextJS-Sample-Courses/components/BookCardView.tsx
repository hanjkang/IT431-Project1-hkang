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
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{book.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-black-600 font-bold">{book.genre}</p>
        <p className="text-gray-600">{book.description}</p>
      </CardContent>
      <CardFooter>
        <p className="mt-4 text-2xl font-bold">{book.rating}</p>
      </CardFooter>
    </Card>
  );
} 