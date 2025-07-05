
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map();

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

    // Rate limiting - allow max 3 requests per hour per IP
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitKey = `${clientIP}-${action}`;
    const now = Date.now();
    const rateLimitData = rateLimitMap.get(rateLimitKey) || { count: 0, resetTime: now + 3600000 }; // 1 hour

    if (now > rateLimitData.resetTime) {
      rateLimitData.count = 0;
      rateLimitData.resetTime = now + 3600000;
    }

    if (rateLimitData.count >= 3) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    rateLimitData.count++;
    rateLimitMap.set(rateLimitKey, rateLimitData);

    if (action === 'request') {
      // Check if email is authorized (without exposing which emails are valid)
      const authorizedEmails = ['benw@monkeyflower.ca', 'ben@elephantroom.ca'];
      
      if (!authorizedEmails.includes(email.toLowerCase())) {
        // Don't reveal whether email is authorized or not
        return new Response(JSON.stringify({ message: 'If this email is authorized, a recovery token will be sent' }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Generate secure 6-digit token
      const recoveryToken = Math.floor(100000 + Math.random() * 900000).toString();
      const tokenHash = await hashToken(recoveryToken);

      // Get admin user
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('id')
        .eq('username', 'admin')
        .single();

      if (adminUser) {
        // Store token in database
        await supabase
          .from('password_recovery_tokens')
          .insert({
            user_id: adminUser.id,
            token_hash: tokenHash,
            recovery_email: email.toLowerCase(),
            expires_at: new Date(Date.now() + 3600000).toISOString() // 1 hour
          });

        // In production, send email here
        // For now, log the token (remove in production)
        console.log(`Recovery token for ${email}: ${recoveryToken}`);
      }

      return new Response(JSON.stringify({ message: 'If this email is authorized, a recovery token will be sent' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'reset') {
      const tokenHash = await hashToken(token);

      // Find valid token
      const { data: tokenRecord } = await supabase
        .from('password_recovery_tokens')
        .select('user_id, expires_at, used_at')
        .eq('token_hash', tokenHash)
        .gt('expires_at', new Date().toISOString())
        .is('used_at', null)
        .single();

      if (!tokenRecord) {
        return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Hash new password
      const newPasswordHash = await hashPassword(newPassword);

      // Update password
      await supabase
        .from('admin_users')
        .update({ password_hash: newPasswordHash })
        .eq('id', tokenRecord.user_id);

      // Mark token as used
      await supabase
        .from('password_recovery_tokens')
        .update({ used_at: new Date().toISOString() })
        .eq('token_hash', tokenHash);

      return new Response(JSON.stringify({ message: 'Password reset successfully' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Password recovery error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token + 'recovery_salt_2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'admin_salt_2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
