// Environment variables declaration for TypeScript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ALPHA_VANTAGE_API_KEY: string
  readonly VITE_POLYGON_API_KEY: string
  readonly VITE_FRED_API_KEY: string
  readonly VITE_GOOGLE_TRENDS_API_KEY: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_DOMAIN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
