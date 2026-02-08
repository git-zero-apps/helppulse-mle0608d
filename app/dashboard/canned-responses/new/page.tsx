"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function NewCannedResponsPage() {
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
      author_id: formData.get("author_id"),
      category_id: formData.get("category_id"),
      title: formData.get("title"),
      body: formData.get("body"),
      use_count: formData.get("use_count") ? Number(formData.get("use_count")) : null,
    };

    const { error: insertError } = await supabase.from("canned_responses").insert(record);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      router.push("/dashboard/canned-responses");
      router.refresh();
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/dashboard/canned-responses" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Canned Responses
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Add Canned Respons</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label htmlFor="author_id" className="label">Author Id</label>
          <input id="author_id" name="author_id" type="text" className="input" placeholder="Enter author id" />
        </div>
        <div>
          <label htmlFor="category_id" className="label">Category Id</label>
          <input id="category_id" name="category_id" type="text" className="input" placeholder="Enter category id" />
        </div>
        <div>
          <label htmlFor="title" className="label">Title</label>
          <input id="title" name="title" type="text" className="input" placeholder="Enter title" required />
        </div>
        <div>
          <label htmlFor="body" className="label">Body</label>
          <textarea id="body" name="body" rows={4} className="input" placeholder="Enter body" required />
        </div>
        <div>
          <label htmlFor="use_count" className="label">Use Count</label>
          <input id="use_count" name="use_count" type="number" className="input" placeholder="Enter use count" />
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving..." : "Create Canned Respons"}
          </button>
          <Link href="/dashboard/canned-responses" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
