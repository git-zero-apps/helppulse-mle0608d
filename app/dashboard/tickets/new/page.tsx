"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function NewTicketPage() {
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

    const { error: insertError } = await supabase.from("tickets").insert(record);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      router.push("/dashboard/tickets");
      router.refresh();
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/dashboard/tickets" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Tickets
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Add Ticket</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label htmlFor="customer_id" className="label">Customer Id</label>
          <input id="customer_id" name="customer_id" type="text" className="input" placeholder="Enter customer id" />
        </div>
        <div>
          <label htmlFor="assigned_agent_id" className="label">Assigned Agent Id</label>
          <input id="assigned_agent_id" name="assigned_agent_id" type="text" className="input" placeholder="Enter assigned agent id" />
        </div>
        <div>
          <label htmlFor="category_id" className="label">Category Id</label>
          <input id="category_id" name="category_id" type="text" className="input" placeholder="Enter category id" />
        </div>
        <div>
          <label htmlFor="ticket_number" className="label">Ticket Number</label>
          <input id="ticket_number" name="ticket_number" type="text" className="input" placeholder="Enter ticket number" required />
        </div>
        <div>
          <label htmlFor="subject" className="label">Subject</label>
          <input id="subject" name="subject" type="text" className="input" placeholder="Enter subject" required />
        </div>
        <div>
          <label htmlFor="description" className="label">Description</label>
          <textarea id="description" name="description" rows={4} className="input" placeholder="Enter description" required />
        </div>
        <div>
          <label htmlFor="status" className="label">Status</label>
          <input id="status" name="status" type="text" className="input" placeholder="Enter status" />
        </div>
        <div>
          <label htmlFor="priority" className="label">Priority</label>
          <input id="priority" name="priority" type="text" className="input" placeholder="Enter priority" />
        </div>
        <div>
          <label htmlFor="source" className="label">Source</label>
          <input id="source" name="source" type="text" className="input" placeholder="Enter source" />
        </div>
        <div>
          <label htmlFor="customer_name" className="label">Customer Name</label>
          <input id="customer_name" name="customer_name" type="text" className="input" placeholder="Enter customer name" required />
        </div>
        <div>
          <label htmlFor="customer_email" className="label">Customer Email</label>
          <input id="customer_email" name="customer_email" type="email" className="input" placeholder="Enter customer email" required />
        </div>
        <div>
          <label htmlFor="resolved_at" className="label">Resolved At</label>
          <input id="resolved_at" name="resolved_at" type="datetime-local" className="input" placeholder="Enter resolved at" />
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving..." : "Create Ticket"}
          </button>
          <Link href="/dashboard/tickets" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
