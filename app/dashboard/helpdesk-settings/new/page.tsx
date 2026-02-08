"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function NewHelpdeskSettingPage() {
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
      company_name: formData.get("company_name"),
      support_email: formData.get("support_email"),
      custom_domain: formData.get("custom_domain"),
      logo_url: formData.get("logo_url"),
      primary_color: formData.get("primary_color"),
      portal_enabled: formData.get("portal_enabled") === "on",
      widget_enabled: formData.get("widget_enabled") === "on",
    };

    const { error: insertError } = await supabase.from("helpdesk_settings").insert(record);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      router.push("/dashboard/helpdesk-settings");
      router.refresh();
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/dashboard/helpdesk-settings" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Helpdesk Settings
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Add Helpdesk Setting</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label htmlFor="company_name" className="label">Company Name</label>
          <input id="company_name" name="company_name" type="text" className="input" placeholder="Enter company name" />
        </div>
        <div>
          <label htmlFor="support_email" className="label">Support Email</label>
          <input id="support_email" name="support_email" type="email" className="input" placeholder="Enter support email" />
        </div>
        <div>
          <label htmlFor="custom_domain" className="label">Custom Domain</label>
          <input id="custom_domain" name="custom_domain" type="text" className="input" placeholder="Enter custom domain" />
        </div>
        <div>
          <label htmlFor="logo_url" className="label">Logo Url</label>
          <input id="logo_url" name="logo_url" type="url" className="input" placeholder="Enter logo url" />
        </div>
        <div>
          <label htmlFor="primary_color" className="label">Primary Color</label>
          <input id="primary_color" name="primary_color" type="text" className="input" placeholder="Enter primary color" />
        </div>
        <div className="flex items-center gap-3">
          <input id="portal_enabled" name="portal_enabled" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
          <label htmlFor="portal_enabled" className="text-sm font-medium text-gray-700">Portal Enabled</label>
        </div>
        <div className="flex items-center gap-3">
          <input id="widget_enabled" name="widget_enabled" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
          <label htmlFor="widget_enabled" className="text-sm font-medium text-gray-700">Widget Enabled</label>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving..." : "Create Helpdesk Setting"}
          </button>
          <Link href="/dashboard/helpdesk-settings" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
