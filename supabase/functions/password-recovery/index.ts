import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import bcrypt from "https://esm.sh/bcryptjs@3.0.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// In-memory rate limiting (IP + action). For production, use a persistent store.
const rateLimitMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT_MAX = 5; // per hour
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { email, token, newPassword, action } = await req.json();

    // Basic input validation
    if (!action || (action !== 'request' && action !== 'reset')) {
      return json({ error: 'Invalid action' }, 400);
    }

    // Rate limit key
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
    const rateKey = `${clientIP}:${action}`;
    const now = Date.now();
    const entry = rateLimitMap.get(rateKey) || { count: 0, reset: now + RATE_LIMIT_WINDOW_MS };
    if (now > entry.reset) {
      entry.count = 0;
      entry.reset = now + RATE_LIMIT_WINDOW_MS;
    }
    if (entry.count >= RATE_LIMIT_MAX) {
      return json({ error: 'Rate limit exceeded' }, 429);
    }
    entry.count++;
    rateLimitMap.set(rateKey, entry);

    if (action === 'request') {
      if (typeof email !== 'string' || !email) {
        return json({ error: 'Email is required' }, 400);
      }

      // Allow only specific emails without revealing validity
      const authorizedEmails = ['benw@monkeyflower.ca', 'ben@elephantroom.ca'];
      if (!authorizedEmails.includes(email.toLowerCase())) {
        return json({ message: 'If this email is authorized, a recovery token will be sent' });
      }

      // Generate a strong token (32 bytes, base64url)
      const recoveryToken = generateToken(32);
      const tokenLookupHash = await sha256(`${recoveryToken}`);

      // Get admin user (adjust if multiple admins are expected)
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('id')
        .eq('username', 'admin')
        .maybeSingle();

      if (adminUser) {
        await supabase
          .from('password_recovery_tokens')
          .insert({
            user_id: adminUser.id,
            token_hash: tokenLookupHash,
            recovery_email: email.toLowerCase(),
            expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
          });
      }

      // Do NOT leak token in logs or response
      return json({ message: 'If this email is authorized, a recovery token will be sent' });
    }

    if (action === 'reset') {
      if (typeof token !== 'string' || typeof newPassword !== 'string') {
        return json({ error: 'Invalid payload' }, 400);
      }
      if (newPassword.length < 8) {
        return json({ error: 'Password must be at least 8 characters long' }, 400);
      }

      const tokenLookupHash = await sha256(`${token}`);

      // Find a valid token record
      const { data: tokenRecord } = await supabase
        .from('password_recovery_tokens')
        .select('user_id, expires_at, used_at')
        .eq('token_hash', tokenLookupHash)
        .gt('expires_at', new Date().toISOString())
        .is('used_at', null)
        .maybeSingle();

      if (!tokenRecord) {
        return json({ error: 'Invalid or expired token' }, 400);
      }

      // Hash new password with bcrypt
      const newHash = await bcrypt.hash(newPassword, 12);

      // Update password for the admin user
      await supabase
        .from('admin_users')
        .update({ password_hash: newHash })
        .eq('id', tokenRecord.user_id);

      // Mark token as used
      await supabase
        .from('password_recovery_tokens')
        .update({ used_at: new Date().toISOString() })
        .eq('token_hash', tokenLookupHash);

      return json({ message: 'Password reset successfully' });
    }

    return json({ error: 'Invalid action' }, 400);
  } catch (err) {
    console.error('Password recovery error:', err);
    return json({ error: 'Internal server error' }, 500);
  }
}, { onListen: () => {} });

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function generateToken(bytes = 32) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  // base64url
  const base64 = btoa(String.fromCharCode(...arr));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}
