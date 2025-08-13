# Google OAuth Setup Guide

This guide will help you set up Google OAuth to show "LucidQuant" branding instead of the Supabase URL.

## Prerequisites

1. **Google Cloud Console Project**: You need a Google Cloud project with OAuth credentials
2. **Supabase Project**: Your existing Supabase project (free tier is fine)

## Step 1: Set Up Google OAuth Credentials

### 1.1 Configure OAuth Consent Screen
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **OAuth consent screen**
3. Fill in the required information:
   - **Application name**: `LucidQuant`
   - **User support email**: Your email
   - **Application homepage**: `https://lucidquant.in`
   - **Application logo**: Upload your LucidQuant logo (optional)
   - **Authorized domains**: Add `lucidquant.in` and `localhost` (for development)
   - **Developer contact information**: Your email

### 1.2 Create OAuth Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Application type: **Web Application**
4. Name: `LucidQuant OAuth`
5. **Authorized JavaScript origins**:
   - `http://localhost:3001` (for development)
   - `https://lucidquant.in` (for production)
6. **Authorized redirect URIs**:
   - `http://localhost:3001/auth/google/callback` (for development)
   - `https://lucidquant.in/auth/google/callback` (for production)

## Step 2: Configure Environment Variables

### 2.1 Copy your Google credentials
1. After creating the OAuth client, copy the **Client ID** and **Client Secret**
2. Create a `.env.local` file in your project root:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_actual_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
```

### 2.2 Verify other environment variables
Make sure your `.env` file contains:

```bash
# Supabase Configuration  
VITE_SUPABASE_URL=https://hhnntfthistqjsbizyse.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Branding
VITE_APP_NAME=LucidQuant
VITE_APP_DOMAIN=lucidquant.in
```

## Step 3: Test the Implementation

### 3.1 Start the development server
```bash
npm run dev
```

### 3.2 Test the OAuth flow
1. Open http://localhost:3001
2. Click on "Continue with Google" in the signup modal
3. You should see "LucidQuant" in the Google OAuth consent screen
4. Complete the authentication
5. Check your Supabase dashboard to verify the user was created

## Step 4: Production Deployment

When deploying to production:

1. **Update Google OAuth settings** with your production domain
2. **Set environment variables** on your hosting platform:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NODE_ENV=production`

## How It Works

1. **User clicks "Continue with Google"** → Redirects to `/auth/google`
2. **Your server** → Redirects to Google OAuth (showing your domain)
3. **Google** → Shows "LucidQuant" consent screen instead of Supabase URL
4. **Google redirects back** → To `/auth/google/callback` with authorization code
5. **Your server** → Exchanges code for tokens and signs user into Supabase
6. **Supabase** → Stores user data normally (same as before)
7. **User** → Redirected to homepage with success message

## Benefits

✅ **Branded OAuth**: Users see "LucidQuant" instead of random Supabase URL  
✅ **Same functionality**: All Supabase auth features work exactly as before  
✅ **Free tier compatible**: No paid Supabase plan required  
✅ **User data preservation**: All existing auth flows and data storage unchanged  

## Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch" error**:
   - Check that your redirect URIs in Google Cloud Console match exactly
   - For development: `http://localhost:3001/auth/google/callback`
   - For production: `https://lucidquant.in/auth/google/callback`

2. **Environment variables not loading**:
   - Make sure `.env.local` is in the project root
   - Restart your development server after adding variables

3. **CORS errors**:
   - Verify authorized JavaScript origins in Google Cloud Console
   - Make sure domains match exactly (including http/https)

## Security Notes

- ✅ `.env.local` is ignored by git (contains secrets)
- ✅ `.env.example` shows the structure without real credentials
- ✅ Google Client Secret is only used server-side
- ✅ Users are still authenticated through Supabase's secure system
