"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function EditKnowledgeBaseArticlePage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    async function fetchRecord() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("knowledge_base_articles")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) setError(error.message);
      else setRecord(data);
      setFetching(false);
    }
    fetchRecord();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const updates: Record<string, unknown> = {
      category_id: formData.get("category_id"),
      author_id: formData.get("author_id"),
      title: formData.get("title"),
      body: formData.get("body"),
      status: formData.get("status"),
      view_count: formData.get("view_count") ? Number(formData.get("view_count")) : null,
      helpful_votes: formData.get("helpful_votes") ? Number(formData.get("helpful_votes")) : null,
    };

    const { error: updateError } = await supabase
      .from("knowledge_base_articles")
      .update(updates)
      .eq("id", params.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      router.push("/dashboard/knowledge-base-articles");
      router.refresh();
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4">
        <p className="text-sm text-red-700">Knowledge Base Article not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/dashboard/knowledge-base-articles" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Knowledge Base Articles
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Knowledge Base Article</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label htmlFor="category_id" className="label">Category Id</label>
          <input id="category_id" name="category_id" type="text" className="input" defaultValue={String(record.category_id ?? "")} />
        </div>
        <div>
          <label htmlFor="author_id" className="label">Author Id</label>
          <input id="author_id" name="author_id" type="text" className="input" defaultValue={String(record.author_id ?? "")} />
        </div>
        <div>
          <label htmlFor="title" className="label">Title</label>
          <input id="title" name="title" type="text" className="input" defaultValue={String(record.title ?? "")} required />
        </div>
        <div>
          <label htmlFor="body" className="label">Body</label>
          <textarea id="body" name="body" rows={4} className="input" defaultValue={String(record.body ?? "")} required />
        </div>
        <div>
          <label htmlFor="status" className="label">Status</label>
          <input id="status" name="status" type="text" className="input" defaultValue={String(record.status ?? "")} />
        </div>
        <div>
          <label htmlFor="view_count" className="label">View Count</label>
          <input id="view_count" name="view_count" type="number" className="input" defaultValue={String(record.view_count ?? "")} />
        </div>
        <div>
          <label htmlFor="helpful_votes" className="label">Helpful Votes</label>
          <input id="helpful_votes" name="helpful_votes" type="number" className="input" defaultValue={String(record.helpful_votes ?? "")} />
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving..." : "Update Knowledge Base Article"}
          </button>
          <Link href="/dashboard/knowledge-base-articles" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
