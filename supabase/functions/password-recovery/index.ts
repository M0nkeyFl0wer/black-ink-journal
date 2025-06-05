
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PasswordRecoveryRequest {
  email?: string;
  token?: string;
  newPassword?: string;
  action: 'request' | 'reset';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { email, token, newPassword, action }: PasswordRecoveryRequest = await req.json();

    if (action === 'request') {
      // Verify email is authorized
      const authorizedEmails = ['benw@monkeyflower.ca', 'ben@elephantroom.ca'];
      if (!email || !authorizedEmails.includes(email.toLowerCase())) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized email address' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get admin user
      const { data: adminUser, error: userError } = await supabaseClient
        .from('admin_users')
        .select('id')
        .eq('username', 'admin')
        .single();

      if (userError || !adminUser) {
        return new Response(
          JSON.stringify({ error: 'Admin user not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Generate 6-digit token
      const recoveryToken = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Hash the token for storage
      const encoder = new TextEncoder();
      const data = encoder.encode(recoveryToken + 'recovery_salt_2024');
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const tokenHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Store recovery token
      const { error: tokenError } = await supabaseClient
        .from('password_recovery_tokens')
        .insert({
          user_id: adminUser.id,
          token_hash: tokenHash,
          recovery_email: email.toLowerCase(),
          expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour
        });

      if (tokenError) {
        console.error('Token storage error:', tokenError);
        return new Response(
          JSON.stringify({ error: 'Failed to create recovery token' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // In a real implementation, send email with token
      // For now, we'll just log it (you'd integrate with a service like Resend)
      console.log(`Password recovery token for ${email}: ${recoveryToken}`);
      
      // You should implement email sending here using Resend or similar service
      // const emailResponse = await sendRecoveryEmail(email, recoveryToken);

      return new Response(
        JSON.stringify({ message: 'Recovery token sent', token: recoveryToken }), // Remove token in production
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'reset') {
      if (!token || !newPassword) {
        return new Response(
          JSON.stringify({ error: 'Token and new password required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Hash the provided token
      const encoder = new TextEncoder();
      const data = encoder.encode(token + 'recovery_salt_2024');
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const tokenHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Find valid token
      const { data: recoveryData, error: recoveryError } = await supabaseClient
        .from('password_recovery_tokens')
        .select('*')
        .eq('token_hash', tokenHash)
        .is('used_at', null)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (recoveryError || !recoveryData) {
        return new Response(
          JSON.stringify({ error: 'Invalid or expired token' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Hash new password
      const passwordData = encoder.encode(newPassword + 'admin_salt_2024');
      const passwordHashBuffer = await crypto.subtle.digest('SHA-256', passwordData);
      const passwordHashArray = Array.from(new Uint8Array(passwordHashBuffer));
      const newPasswordHash = passwordHashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Update password
      const { error: updateError } = await supabaseClient
        .from('admin_users')
        .update({ 
          password_hash: newPasswordHash,
          failed_login_attempts: 0,
          locked_until: null
        })
        .eq('id', recoveryData.user_id);

      if (updateError) {
        return new Response(
          JSON.stringify({ error: 'Failed to update password' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Mark token as used
      await supabaseClient
        .from('password_recovery_tokens')
        .update({ used_at: new Date().toISOString() })
        .eq('id', recoveryData.id);

      return new Response(
        JSON.stringify({ message: 'Password reset successfully' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Password recovery error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
