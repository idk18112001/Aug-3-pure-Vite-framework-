import { OAuth2Client } from 'google-auth-library';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NODE_ENV === 'production' ? 'https://lucidquant.in' : 'http://localhost:3001'}/auth/google/callback`
);

async function handleGoogleCallback(code: string) {
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

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, error: authError } = req.query;

    if (authError) {
      return res.redirect(`/?error=${encodeURIComponent(authError as string)}`);
    }

    if (!code) {
      return res.redirect('/?error=no_code');
    }

    const { data } = await handleGoogleCallback(code as string);
    
    // Redirect to home with success
    res.redirect('/?auth=success');
    
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.redirect('/?error=auth_failed');
  }
}
