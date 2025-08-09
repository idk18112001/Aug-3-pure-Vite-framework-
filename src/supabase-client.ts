import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://hhnntfthistqjsbizyse.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhobm50ZnRoaXN0cWpzYml6eXNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMDM5OTIsImV4cCI6MjA2OTg3OTk5Mn0.a06doAnhHYHv7ie1PNGpS7ZTkM4M_lXaPiI1ACcWspk"
);