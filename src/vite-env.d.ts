// Environment variables declaration for TypeScript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ALPHA_VANTAGE_API_KEY: string
  readonly VITE_IEX_CLOUD_API_KEY: string
  readonly VITE_POLYGON_API_KEY: string
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
