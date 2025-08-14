import { OAuth2Client } from 'google-auth-library';

// Google OAuth credentials for LucidQuant branding
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
  `${process.env.NODE_ENV === 'production' ? 'https://lucidquant.in' : 'http://localhost:5173'}/api/auth/callback/google`
);

async function initiateGoogleAuth() {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ];

  // Generate auth URL with LucidQuant branding
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true,
  });

  return authUrl;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Google OAuth setup check:', {
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      nodeEnv: process.env.NODE_ENV
    });

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ 
        error: 'Google Client ID not configured',
        debug: process.env.NODE_ENV === 'development' ? 'Check GOOGLE_CLIENT_ID in .env' : undefined
      });
    }

    const authUrl = await initiateGoogleAuth();
    
    console.log('Generated auth URL for LucidQuant OAuth');
    return res.status(200).json({ authUrl });
    
  } catch (error: any) {
    console.error('Google OAuth initiation error:', error);
    return res.status(500).json({ 
      error: 'Failed to initiate Google OAuth',
      message: error.message 
    });
  }
}
