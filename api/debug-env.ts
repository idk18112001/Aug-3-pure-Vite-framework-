export default async function handler(req: any, res: any) {
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    hasSupabaseUrl: !!process.env.VITE_SUPABASE_URL,
    hasSupabaseKey: !!process.env.VITE_SUPABASE_ANON_KEY,
    allGoogleVars: Object.keys(process.env).filter(k => k.includes('GOOGLE')),
    allViteVars: Object.keys(process.env).filter(k => k.includes('VITE')),
    totalEnvVars: Object.keys(process.env).length
  };
  
  res.json(envVars);
}
