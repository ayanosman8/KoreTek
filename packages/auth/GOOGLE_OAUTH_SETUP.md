# Google OAuth Setup for Internal Tools

## Why Google OAuth for Internal Tools?

✅ **Single Sign-On (SSO)** - Team members use their Google accounts
✅ **No Password Management** - No need to create/remember passwords
✅ **Domain Restriction** - Limit to `@korelnx.com` emails only
✅ **Better Security** - Google's MFA + security features
✅ **Easy Onboarding** - New team members can access immediately

## Setup Instructions

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one (e.g., "KoreLnx Internal Tools")
3. Enable the Google+ API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. Create OAuth credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "Scope AI - Internal Tools"

5. Configure redirect URIs:
   - Authorized JavaScript origins:
     ```
     http://localhost:3001
     https://your-production-domain.com
     ```
   - Authorized redirect URIs:
     ```
     https://xzgcbzpkyfrulzlocyvw.supabase.co/auth/v1/callback
     ```

6. Click "Create" and copy:
   - **Client ID**
   - **Client Secret**

### 2. Configure Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/xzgcbzpkyfrulzlocyvw)
2. Navigate to "Authentication" → "Providers"
3. Find "Google" and click to expand
4. Toggle "Enable Sign in with Google"
5. Paste your Google OAuth credentials:
   - **Client ID**: (from step 1)
   - **Client Secret**: (from step 1)
6. Click "Save"

### 3. (Optional) Restrict to Your Domain

To only allow `@korelnx.com` email addresses:

1. In Supabase, go to "Authentication" → "Providers" → "Google"
2. Under "Advanced settings", add:
   ```
   hd=korelnx.com
   ```
3. This ensures only users with `@korelnx.com` emails can sign in

### 4. Test the Login

1. Visit: http://localhost:3001/auth/login
2. Click "Continue with Google"
3. Sign in with your Google account
4. Should redirect to `/admin` dashboard

## How It Works

1. User clicks "Continue with Google"
2. Redirected to Google sign-in page
3. After authentication, Google redirects to Supabase
4. Supabase creates/updates user and redirects to `/auth/callback`
5. Callback route exchanges code for session
6. User is redirected to `/admin` dashboard

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Make sure the redirect URI in Google Console exactly matches:
  ```
  https://xzgcbzpkyfrulzlocyvw.supabase.co/auth/v1/callback
  ```

### Error: "Access blocked"
- Your app needs to be verified by Google if you want external users
- For internal use only, add your team members to "Test users" in Google Console

### Domain restriction not working
- Make sure you added `hd=korelnx.com` in Supabase Google provider settings
- Or implement server-side check in `/auth/callback/route.ts`

## Production Deployment

When deploying to production:

1. Update Google OAuth redirect URIs to include production URL
2. Add production domain to "Authorized JavaScript origins"
3. Update Supabase site URL in dashboard
4. No code changes needed!

## Managing Access

**To add a new team member:**
1. They visit the login page
2. Click "Continue with Google"
3. Sign in with their `@korelnx.com` Google account
4. Automatically gets access (if domain restriction is set)

**To revoke access:**
1. Go to Supabase Dashboard → Authentication → Users
2. Find the user
3. Click "..." → "Delete user"

That's it! Your team can now sign in with Google.
