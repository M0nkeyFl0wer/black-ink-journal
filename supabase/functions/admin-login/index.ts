import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import bcrypt from "https://esm.sh/bcryptjs@3.0.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { username, password } = await req.json();
    if (!username || !password) return json({ success: false, message: 'Missing credentials' }, 400);

    const { data: user } = await supabase
      .from('admin_users')
      .select('id, username, password_hash, failed_login_attempts, locked_until, last_login')
      .eq('username', username)
      .maybeSingle();

    // Generic error to avoid enumeration
    if (!user) return json({ success: false, message: 'Invalid username or password' }, 401);

    // Check lock
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return json({ success: false, message: 'Account temporarily locked' }, 423);
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      const failed = (user.failed_login_attempts || 0) + 1;
      const lockUntil = failed >= 5 ? new Date(Date.now() + 15 * 60 * 1000).toISOString() : null;
      await supabase
        .from('admin_users')
        .update({ failed_login_attempts: failed, locked_until: lockUntil })
        .eq('id', user.id);
      return json({ success: false, message: failed >= 5 ? 'Account locked due to too many attempts' : 'Invalid username or password' }, 401);
    }

    // Reset counters on success
    await supabase
      .from('admin_users')
      .update({ failed_login_attempts: 0, locked_until: null, last_login: new Date().toISOString() })
      .eq('id', user.id);

    return json({ success: true, user: { id: user.id, username: user.username, last_login: user.last_login } });
  } catch (err) {
    console.error('admin-login error:', err);
    return json({ success: false, message: 'Internal server error' }, 500);
  }
});

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
