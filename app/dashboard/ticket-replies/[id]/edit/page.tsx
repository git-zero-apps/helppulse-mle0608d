"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function EditTicketReplyPage() {
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
        .from("ticket_replies")
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
      ticket_id: formData.get("ticket_id"),
      author_id: formData.get("author_id"),
      author_name: formData.get("author_name"),
      author_role: formData.get("author_role"),
      message: formData.get("message"),
      is_internal_note: formData.get("is_internal_note") === "on",
      attachments: formData.get("attachments"),
    };

    const { error: updateError } = await supabase
      .from("ticket_replies")
      .update(updates)
      .eq("id", params.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      router.push("/dashboard/ticket-replies");
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
        <p className="text-sm text-red-700">Ticket Reply not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/dashboard/ticket-replies" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Ticket Replies
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Ticket Reply</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label htmlFor="ticket_id" className="label">Ticket Id</label>
          <input id="ticket_id" name="ticket_id" type="text" className="input" defaultValue={String(record.ticket_id ?? "")} required />
        </div>
        <div>
          <label htmlFor="author_id" className="label">Author Id</label>
          <input id="author_id" name="author_id" type="text" className="input" defaultValue={String(record.author_id ?? "")} />
        </div>
        <div>
          <label htmlFor="author_name" className="label">Author Name</label>
          <input id="author_name" name="author_name" type="text" className="input" defaultValue={String(record.author_name ?? "")} required />
        </div>
        <div>
          <label htmlFor="author_role" className="label">Author Role</label>
          <input id="author_role" name="author_role" type="text" className="input" defaultValue={String(record.author_role ?? "")} required />
        </div>
        <div>
          <label htmlFor="message" className="label">Message</label>
          <input id="message" name="message" type="text" className="input" defaultValue={String(record.message ?? "")} required />
        </div>
        <div className="flex items-center gap-3">
          <input id="is_internal_note" name="is_internal_note" type="checkbox" defaultChecked={!!record.is_internal_note} className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
          <label htmlFor="is_internal_note" className="text-sm font-medium text-gray-700">Is Internal Note</label>
        </div>
        <div>
          <label htmlFor="attachments" className="label">Attachments</label>
          <input id="attachments" name="attachments" type="text" className="input" defaultValue={String(record.attachments ?? "")} />
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving..." : "Update Ticket Reply"}
          </button>
          <Link href="/dashboard/ticket-replies" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
