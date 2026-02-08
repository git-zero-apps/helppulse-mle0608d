"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function NewSatisfactionRatingPage() {
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
      ticket_id: formData.get("ticket_id"),
      rating: formData.get("rating") ? Number(formData.get("rating")) : null,
      feedback: formData.get("feedback"),
    };

    const { error: insertError } = await supabase.from("satisfaction_ratings").insert(record);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      router.push("/dashboard/satisfaction-ratings");
      router.refresh();
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/dashboard/satisfaction-ratings" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Satisfaction Ratings
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Add Satisfaction Rating</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label htmlFor="ticket_id" className="label">Ticket Id</label>
          <input id="ticket_id" name="ticket_id" type="text" className="input" placeholder="Enter ticket id" required />
        </div>
        <div>
          <label htmlFor="rating" className="label">Rating</label>
          <input id="rating" name="rating" type="number" className="input" placeholder="Enter rating" required />
        </div>
        <div>
          <label htmlFor="feedback" className="label">Feedback</label>
          <input id="feedback" name="feedback" type="text" className="input" placeholder="Enter feedback" />
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving..." : "Create Satisfaction Rating"}
          </button>
          <Link href="/dashboard/satisfaction-ratings" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
