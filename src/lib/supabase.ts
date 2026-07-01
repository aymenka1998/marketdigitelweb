import { createClient } from "@supabase/supabase-js";
import { Order, Review, Template } from "../types";

// Get keys from env or localStorage
const getKeys = () => {
  const localUrl = localStorage.getItem("LP_SUPABASE_URL") || "";
  const localKey = localStorage.getItem("LP_SUPABASE_ANON_KEY") || "";
  
  const envUrl = ((import.meta as any).env?.VITE_SUPABASE_URL as string) || "";
  const envKey = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) || "";
  
  return {
    url: localUrl || envUrl,
    key: localKey || envKey,
    isConfigured: !!(localUrl || envUrl) && !!(localKey || envKey)
  };
};

export const getSupabaseClient = () => {
  const { url, key, isConfigured } = getKeys();
  if (!isConfigured) return null;
  try {
    return createClient(url, key);
  } catch (e) {
    console.error("Supabase initialization error:", e);
    return null;
  }
};

export const isSupabaseConnected = (): boolean => {
  return getSupabaseClient() !== null;
};

// Database APIs with local fallback
export const db = {
  // Save an order
  saveOrder: async (order: Order): Promise<{ success: boolean; error?: string }> => {
    const client = getSupabaseClient();
    
    // Save to local storage always for robust redundancy
    const localOrders = JSON.parse(localStorage.getItem("LP_ORDERS") || "[]");
    localStorage.setItem("LP_ORDERS", JSON.stringify([order, ...localOrders]));
    
    if (client) {
      try {
        const { error } = await client
          .from("orders")
          .insert({
            id: order.id,
            created_at: order.createdAt,
            customer_name: order.customerName,
            customer_email: order.customerEmail,
            items: order.items,
            total: order.total,
            payment_status: order.paymentStatus
          });
          
        if (error) {
          console.warn("Supabase insert error, falling back to local:", error.message);
          return { success: true, error: `تم الحفظ محلياً: ${error.message}` };
        }
        return { success: true };
      } catch (e: any) {
        return { success: true, error: e.message || "فشل الاتصال بسوبابيس" };
      }
    }
    return { success: true }; // Sandbox mode success
  },

  // Get order history
  getOrders: async (email?: string): Promise<Order[]> => {
    const client = getSupabaseClient();
    const localOrders = JSON.parse(localStorage.getItem("LP_ORDERS") || "[]");
    
    if (client && email) {
      try {
        const { data, error } = await client
          .from("orders")
          .select("*")
          .eq("customer_email", email)
          .order("created_at", { ascending: false });
          
        if (error) {
          console.warn("Error loading from Supabase:", error.message);
          return localOrders.filter((o: Order) => !email || o.customerEmail === email);
        }
        
        if (data) {
          return data.map((item: any) => ({
            id: item.id,
            createdAt: item.created_at,
            customerName: item.customer_name,
            customerEmail: item.customer_email,
            items: item.items,
            total: item.total,
            paymentStatus: item.payment_status
          }));
        }
      } catch (e) {
        console.error(e);
      }
    }
    
    return email ? localOrders.filter((o: Order) => o.customerEmail === email) : localOrders;
  },

  // Save review
  saveReview: async (review: Review): Promise<void> => {
    const client = getSupabaseClient();
    const localReviews = JSON.parse(localStorage.getItem("LP_REVIEWS") || "[]");
    localStorage.setItem("LP_REVIEWS", JSON.stringify([review, ...localReviews]));

    if (client) {
      try {
        await client.from("reviews").insert({
          id: review.id,
          user_name: review.userName,
          rating: review.rating,
          date: review.date,
          comment: review.comment
        });
      } catch (e) {
        console.error("Supabase review save error:", e);
      }
    }
  },

  // Get reviews
  getReviews: async (): Promise<Review[]> => {
    const client = getSupabaseClient();
    const localReviews = JSON.parse(localStorage.getItem("LP_REVIEWS") || "[]");
    
    if (client) {
      try {
        const { data, error } = await client
          .from("reviews")
          .select("*")
          .order("date", { ascending: false });
        if (!error && data) {
          return data.map((r: any) => ({
            id: r.id,
            userName: r.user_name,
            rating: r.rating,
            date: r.date,
            comment: r.comment
          }));
        }
      } catch (e) {
        console.error("Supabase review fetch error:", e);
      }
    }
    return localReviews;
  }
};
export const getSupabaseSetupSQL = (): string => {
  return `-- SQL لإنشاء الجداول اللازمة في لوحة تحكم سوبابيس (Supabase SQL Editor)

-- 1. جدول الطلبات (Orders Table)
create table if
  not exists public.orders (
    id text primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    customer_name text not null,
    customer_email text not null,
    items jsonb not null,
    total numeric not null,
    payment_status text not null
  );

-- تمكين الوصول العام للجدول للتبسيط (يمكن تعديل RLS لاحقاً)
alter table public.orders enable row level security;
create policy "Allow all public inserts" on public.orders for insert with check (true);
create policy "Allow public read by email" on public.orders for select using (true);

-- 2. جدول المراجعات والتقييمات (Reviews Table)
create table if
  not exists public.reviews (
    id text primary key,
    user_name text not null,
    rating integer not null,
    date text not null,
    comment text not null
  );

alter table public.reviews enable row level security;
create policy "Allow all public inserts" on public.reviews for insert with check (true);
create policy "Allow all public reads" on public.reviews for select using (true);
`;
};
