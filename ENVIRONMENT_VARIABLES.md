# Environment Variables

This document outlines the environment variables needed for the blog project.

## Required Environment Variables

### Supabase Configuration
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Public anon key (safe for client-side)
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (server-side only, never expose to client)

### Bluesky Integration
- `BLUESKY_HANDLE`: Your Bluesky handle (e.g., 'benwest.bsky.social')
- `BLUESKY_APP_PASSWORD`: Your Bluesky app password

## Local Development Setup

Create a `.env.local` file in the root directory:

```bash
# Supabase
SUPABASE_URL=https://jfsvlaaposslmeneovtp.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Bluesky
BLUESKY_HANDLE=benwest.bsky.social
BLUESKY_APP_PASSWORD=your_app_password_here
```

## Production Deployment

Set these environment variables in your hosting platform (Render, Vercel, etc.):

### Render
- Go to your service dashboard
- Navigate to Environment → Environment Variables
- Add each variable with its corresponding value

### Vercel
- Go to your project dashboard
- Navigate to Settings → Environment Variables
- Add each variable with its corresponding value

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit `.env` files to version control**
2. **Service role keys should only be used server-side**
3. **Public anon keys are safe for client-side use**
4. **Bluesky credentials should be kept secure**

## Script Usage

For scripts that require the service role key:

```bash
# Set environment variable for the session
export SUPABASE_SERVICE_ROLE_KEY=your_key_here

# Run the script
node scripts/export-posts-to-markdown.js
```

Or use a `.env` file and load it with a package like `dotenv`:

```bash
npm install dotenv
```

Then in your script:
```javascript
import dotenv from 'dotenv';
dotenv.config();
``` 