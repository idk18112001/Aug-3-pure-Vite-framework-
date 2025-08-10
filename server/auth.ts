import { OAuth2Client } from 'google-auth-library';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// Initialize Google OAuth client
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NODE_ENV === 'production' ? 'https://lucidquant.in' : 'http://localhost:3000'}/auth/google/callback`
);

export async function initiateGoogleAuth() {
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

export async function handleGoogleCallback(code: string) {
  try {
    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    
    if (!tokens.id_token) {
      throw new Error('No ID token received from Google');
    }

    // Sign in to Supabase using the Google ID token
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: tokens.id_token,
    });

    if (error) {
      console.error('Supabase signInWithIdToken error:', error);
      throw error;
    }

    // Log successful authentication for verification
    console.log('✅ User successfully authenticated and stored in Supabase:', {
      userId: data.user?.id,
      email: data.user?.email,
      provider: 'google'
    });

    return { data, tokens };
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    throw error;
  }
}
