"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function EditTicketPage() {
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
        .from("tickets")
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
      customer_id: formData.get("customer_id"),
      assigned_agent_id: formData.get("assigned_agent_id"),
      category_id: formData.get("category_id"),
      ticket_number: formData.get("ticket_number"),
      subject: formData.get("subject"),
      description: formData.get("description"),
      status: formData.get("status"),
      priority: formData.get("priority"),
      source: formData.get("source"),
      customer_name: formData.get("customer_name"),
      customer_email: formData.get("customer_email"),
      resolved_at: formData.get("resolved_at"),
    };

    const { error: updateError } = await supabase
      .from("tickets")
      .update(updates)
      .eq("id", params.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      router.push("/dashboard/tickets");
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
        <p className="text-sm text-red-700">Ticket not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/dashboard/tickets" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Tickets
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Ticket</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label htmlFor="customer_id" className="label">Customer Id</label>
          <input id="customer_id" name="customer_id" type="text" className="input" defaultValue={String(record.customer_id ?? "")} />
        </div>
        <div>
          <label htmlFor="assigned_agent_id" className="label">Assigned Agent Id</label>
          <input id="assigned_agent_id" name="assigned_agent_id" type="text" className="input" defaultValue={String(record.assigned_agent_id ?? "")} />
        </div>
        <div>
          <label htmlFor="category_id" className="label">Category Id</label>
          <input id="category_id" name="category_id" type="text" className="input" defaultValue={String(record.category_id ?? "")} />
        </div>
        <div>
          <label htmlFor="ticket_number" className="label">Ticket Number</label>
          <input id="ticket_number" name="ticket_number" type="text" className="input" defaultValue={String(record.ticket_number ?? "")} required />
        </div>
        <div>
          <label htmlFor="subject" className="label">Subject</label>
          <input id="subject" name="subject" type="text" className="input" defaultValue={String(record.subject ?? "")} required />
        </div>
        <div>
          <label htmlFor="description" className="label">Description</label>
          <textarea id="description" name="description" rows={4} className="input" defaultValue={String(record.description ?? "")} required />
        </div>
        <div>
          <label htmlFor="status" className="label">Status</label>
          <input id="status" name="status" type="text" className="input" defaultValue={String(record.status ?? "")} />
        </div>
        <div>
          <label htmlFor="priority" className="label">Priority</label>
          <input id="priority" name="priority" type="text" className="input" defaultValue={String(record.priority ?? "")} />
        </div>
        <div>
          <label htmlFor="source" className="label">Source</label>
          <input id="source" name="source" type="text" className="input" defaultValue={String(record.source ?? "")} />
        </div>
        <div>
          <label htmlFor="customer_name" className="label">Customer Name</label>
          <input id="customer_name" name="customer_name" type="text" className="input" defaultValue={String(record.customer_name ?? "")} required />
        </div>
        <div>
          <label htmlFor="customer_email" className="label">Customer Email</label>
          <input id="customer_email" name="customer_email" type="email" className="input" defaultValue={String(record.customer_email ?? "")} required />
        </div>
        <div>
          <label htmlFor="resolved_at" className="label">Resolved At</label>
          <input id="resolved_at" name="resolved_at" type="datetime-local" className="input" defaultValue={String(record.resolved_at ?? "")} />
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving..." : "Update Ticket"}
          </button>
          <Link href="/dashboard/tickets" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
