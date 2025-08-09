import { createClient } from "@supabase/supabase-js";

// Use environment variables for better configuration management
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://hhnntfthistqjsbizyse.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhobm50ZnRoaXN0cWpzYml6eXNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMDM5OTIsImV4cCI6MjA2OTg3OTk5Mn0.a06doAnhHYHv7ie1PNGpS7ZTkM4M_lXaPiI1ACcWspk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);