"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function NewCategoryPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const record: Record<string, unknown> = {
      user_id: user?.id,
      name: formData.get("name"),
      description: formData.get("description"),
      article_count: formData.get("article_count") ? Number(formData.get("article_count")) : null,
      display_order: formData.get("display_order") ? Number(formData.get("display_order")) : null,
    };

    const { error: insertError } = await supabase.from("categories").insert(record);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      router.push("/dashboard/categories");
      router.refresh();
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/dashboard/categories" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Categories
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Add Category</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label htmlFor="name" className="label">Name</label>
          <input id="name" name="name" type="text" className="input" placeholder="Enter name" required />
        </div>
        <div>
          <label htmlFor="description" className="label">Description</label>
          <textarea id="description" name="description" rows={4} className="input" placeholder="Enter description" />
        </div>
        <div>
          <label htmlFor="article_count" className="label">Article Count</label>
          <input id="article_count" name="article_count" type="number" className="input" placeholder="Enter article count" />
        </div>
        <div>
          <label htmlFor="display_order" className="label">Display Order</label>
          <input id="display_order" name="display_order" type="number" className="input" placeholder="Enter display order" />
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving..." : "Create Category"}
          </button>
          <Link href="/dashboard/categories" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
