# OAuth Configuration for LucidQuant

To enable OAuth authentication, you need to configure the following providers in your Supabase dashboard:

## Required OAuth Providers:

### 1. Google OAuth
- Go to Supabase Dashboard > Authentication > Providers
- Enable Google provider
- Add your Google OAuth credentials (Client ID & Client Secret)
- Set authorized redirect URI: https://your-project.supabase.co/auth/v1/callback

### 2. Microsoft OAuth (Azure)
- Go to Supabase Dashboard > Authentication > Providers  
- Enable Azure provider
- Add your Azure OAuth credentials (Client ID & Client Secret)
- Set authorized redirect URI: https://your-project.supabase.co/auth/v1/callback

### 3. Apple OAuth
- Go to Supabase Dashboard > Authentication > Providers
- Enable Apple provider
- Add your Apple OAuth credentials (Client ID & Client Secret)
- Set authorized redirect URI: https://your-project.supabase.co/auth/v1/callback

## Setup Steps:

1. Create OAuth apps for each provider:
   - Google: https://console.developers.google.com/
   - Microsoft: https://portal.azure.com/
   - Apple: https://developer.apple.com/

2. Copy the Client ID and Client Secret from each provider

3. In Supabase Dashboard:
   - Go to Authentication > Providers
   - Enable each provider
   - Paste the credentials
   - Save the configuration

4. Test the OAuth flows by clicking the respective buttons in the signup modal

## Current Implementation:

- ✅ OAuth buttons added to signup modal
- ✅ Supabase OAuth integration implemented
- ✅ Auth callback page created
- ✅ Error handling and loading states added
- ✅ Modal made opaque (bg-black/90 with backdrop-blur)
- ✅ Email magic link fallback maintained

The signup modal now includes:
- Google OAuth
- Microsoft OAuth  
- Apple OAuth
- Email magic link (existing functionality)
- Improved opacity and visual design
