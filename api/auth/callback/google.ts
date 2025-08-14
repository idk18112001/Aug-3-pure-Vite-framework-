import { OAuth2Client } from 'google-auth-library';
import { createClient } from '@supabase/supabase-js';

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://hhnntfthistqjsbizyse.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY - this is needed for server-side operations');
}

// Create Supabase client with service role key for server operations
const supabase = createClient(supabaseUrl, supabaseServiceKey || process.env.VITE_SUPABASE_ANON_KEY || '');

const oauth2Client = new OAuth2Client(
  clientId,
  clientSecret,
  `${process.env.NODE_ENV === 'production' ? 'https://lucidquant.in' : 'http://localhost:5173'}/api/auth/callback/google`
);

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, error: oauthError } = req.query;

    if (oauthError) {
      console.error('OAuth error from Google:', oauthError);
      return res.redirect(`${process.env.NODE_ENV === 'production' ? 'https://lucidquant.in' : 'http://localhost:5173'}?error=oauth_error`);
    }

    if (!code) {
      console.error('No authorization code received');
      return res.redirect(`${process.env.NODE_ENV === 'production' ? 'https://lucidquant.in' : 'http://localhost:5173'}?error=no_code`);
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      throw new Error('Failed to fetch user info from Google');
    }

    const googleUser = await userInfoResponse.json();
    console.log('Google user info:', { email: googleUser.email, name: googleUser.name });

    // Create or update user in Supabase
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: googleUser.email,
      email_confirm: true,
      user_metadata: {
        full_name: googleUser.name,
        avatar_url: googleUser.picture,
        provider: 'google',
        google_id: googleUser.id,
      },
    });

    if (authError && !authError.message.includes('already registered')) {
      console.error('Supabase auth error:', authError);
      return res.redirect(`${process.env.NODE_ENV === 'production' ? 'https://lucidquant.in' : 'http://localhost:5173'}?error=auth_failed`);
    }

    // Generate a session token for the user
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: googleUser.email,
    });

    if (sessionError) {
      console.error('Session generation error:', sessionError);
      return res.redirect(`${process.env.NODE_ENV === 'production' ? 'https://lucidquant.in' : 'http://localhost:5173'}?error=session_failed`);
    }

    // Redirect to frontend with magic link for auto-login
    const redirectUrl = `${process.env.NODE_ENV === 'production' ? 'https://lucidquant.in' : 'http://localhost:5173'}/auth/callback?token_hash=${encodeURIComponent(sessionData.properties?.hashed_token || '')}&type=magiclink`;
    
    console.log('Google OAuth callback successful, redirecting user');
    return res.redirect(redirectUrl);

  } catch (error: any) {
    console.error('Google OAuth callback error:', error);
    return res.redirect(`${process.env.NODE_ENV === 'production' ? 'https://lucidquant.in' : 'http://localhost:5173'}?error=callback_failed&message=${encodeURIComponent(error.message)}`);
  }
}
