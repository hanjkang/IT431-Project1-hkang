"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { Book } from "@/types/book";

interface EditBookPageProps {
  params: {
    id: string;
  };
}

export default function EditBookPage({ params }: EditBookPageProps) {
  const router = useRouter();
  // Note: On client components, we don't need to await params since they're already resolved
  const bookId = parseInt(params.id, 10);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Book>>({
    title: "",
    genre: "",
    description: "",
    rating: ""
  });

  // Fetch the book data
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/books/${bookId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch book");
        }
        
        const book: Book = await response.json();
        
        // Extract stars from rating (e.g., "5 stars" -> "5")
        let stars = book.rating;
        if (stars && stars.includes(" stars ")) {
          stars = stars.replace(" stars ", "");
        }
        
        setFormData({
          ...book,
          rating: stars
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching book:", err);
        setError("Failed to load book. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Format the rating to include "stars"
      const dataToSubmit = {
        ...formData,
        id: bookId,
        rating: formData.rating ? `${formData.rating} stars` : ""
      };

      const response = await fetch(`/api/books/${bookId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        throw new Error("Failed to update book");
      }

      // Redirect to book details page after successful update
      router.push(`/books/${bookId}`);
      router.refresh(); // Refresh the page data
    } catch (error) {
      console.error("Error updating book:", error);
      setError("Failed to update book. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <p>Loading book information...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Edit Book</h1>
            <Link href={`/books/${bookId}`}>
              <Button variant="outline">Cancel</Button>
            </Link>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
            <div className="space-y-2">
              <label htmlFor="title" className="block font-medium">
                Book Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter book title"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="genre" className="block font-medium">
                Genre <span className="text-red-500">*</span>
              </label>
              <input
                id="genre"
                name="genre"
                type="text"
                required
                value={formData.genre || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter book genre"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block font-medium">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description || ""}
                onChange={handleChange}
                rows={4}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter book description"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="estimatedTime" className="block font-medium">
                Rating (1-5 stars)
              </label>
              <input
                id="rating"
                name="rating"
                type="number"
                value={formData.rating || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter number of stars"
              />
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800"
                disabled={saving}
              >
                {saving ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 