import { OAuth2Client } from 'google-auth-library';

// Ensure environment variables are available
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error('Missing OAuth credentials:', {
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    allEnvVars: Object.keys(process.env).filter(k => k.includes('GOOGLE'))
  });
}

const oauth2Client = new OAuth2Client(
  clientId,
  clientSecret,
  `${process.env.NODE_ENV === 'production' ? 'https://aug-3-pure-vite-framework-9385.vercel.app' : 'http://localhost:3001'}/api/auth/google/callback`
);

async function initiateGoogleAuth() {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'openid'
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true,
  });

  return authUrl;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Debug environment variables
    console.log('Environment check:', {
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ 
        error: 'Google Client ID not configured',
        debug: 'GOOGLE_CLIENT_ID environment variable is missing'
      });
    }

    const authUrl = await initiateGoogleAuth();
    res.redirect(302, authUrl);
  } catch (error) {
    console.error('Google auth initiation error:', error);
    res.status(500).json({ 
      error: 'Failed to initiate Google authentication',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
