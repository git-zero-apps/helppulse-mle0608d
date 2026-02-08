// Auto-generated database types from ZERO Builder
// Do not edit manually
export interface Profiles {
  id: string;
  full_name: string;
  email: string;
  role: string;
  avatar_url: string | null;
  status: string;
  subscription_plan?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfilesInsert {
  full_name: string;
  email: string;
  role?: string;
  avatar_url: string | null;
  status?: string;
  subscription_plan?: string | null;
}

export interface Customers {
  id?: string;
  user_id: string | null;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  total_tickets: number;
  created_at: string;
  updated_at: string;
}

export interface CustomersInsert {
  user_id: string | null;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  total_tickets?: number;
}

export interface Categories {
  id?: string;
  user_id: string | null;
  name: string;
  description: string | null;
  article_count: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CategoriesInsert {
  user_id: string | null;
  name: string;
  description: string | null;
  article_count?: number;
  display_order?: number;
}

export interface Tickets {
  id?: string;
  user_id: string | null;
  customer_id: string | null;
  assigned_agent_id: string | null;
  category_id: string | null;
  ticket_number: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  source: string;
  customer_name: string;
  customer_email: string;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TicketsInsert {
  user_id: string | null;
  customer_id: string | null;
  assigned_agent_id: string | null;
  category_id: string | null;
  ticket_number: string;
  subject: string;
  description: string;
  status?: string;
  priority?: string;
  source?: string;
  customer_name: string;
  customer_email: string;
  resolved_at: string | null;
}

export interface TicketReplies {
  id?: string;
  ticket_id: string;
  author_id: string | null;
  author_name: string;
  author_role: string;
  message: string;
  is_internal_note: boolean;
  attachments?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface TicketRepliesInsert {
  ticket_id: string;
  author_id: string | null;
  author_name: string;
  author_role: string;
  message: string;
  is_internal_note?: boolean;
  attachments?: Record<string, unknown> | null;
}

export interface KnowledgeBaseArticles {
  id?: string;
  user_id: string | null;
  category_id: string | null;
  author_id: string | null;
  title: string;
  body: string;
  status: string;
  view_count: number;
  helpful_votes: number;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeBaseArticlesInsert {
  user_id: string | null;
  category_id: string | null;
  author_id: string | null;
  title: string;
  body: string;
  status?: string;
  view_count?: number;
  helpful_votes?: number;
}

export interface CannedResponses {
  id?: string;
  user_id: string | null;
  author_id: string | null;
  category_id: string | null;
  title: string;
  body: string;
  use_count: number;
  created_at: string;
  updated_at: string;
}

export interface CannedResponsesInsert {
  user_id: string | null;
  author_id: string | null;
  category_id: string | null;
  title: string;
  body: string;
  use_count?: number;
}

export interface SatisfactionRatings {
  id?: string;
  ticket_id: string;
  rating: number;
  feedback: string | null;
  created_at: string;
  updated_at: string;
}

export interface SatisfactionRatingsInsert {
  ticket_id: string;
  rating: number;
  feedback: string | null;
}

export interface HelpdeskSettings {
  id?: string;
  user_id: string;
  company_name: string | null;
  support_email: string | null;
  custom_domain: string | null;
  logo_url: string | null;
  primary_color?: string | null;
  portal_enabled: boolean;
  widget_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface HelpdeskSettingsInsert {
  user_id: string;
  company_name: string | null;
  support_email: string | null;
  custom_domain: string | null;
  logo_url: string | null;
  primary_color?: string | null;
  portal_enabled?: boolean;
  widget_enabled?: boolean;
}
