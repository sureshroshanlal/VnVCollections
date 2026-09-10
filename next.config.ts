import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_WHATSAPP_NUMBER:
      process.env.WHATSAPP_NUMBER ||
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
      '919876543210',
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      '',
  },
};

export default nextConfig;
