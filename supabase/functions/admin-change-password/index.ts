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

    const { username, currentPassword, newPassword } = await req.json();
    if (!username || !currentPassword || !newPassword) return json({ success: false, message: 'Missing fields' }, 400);
    if (newPassword.length < 8) return json({ success: false, message: 'Password must be at least 8 characters' }, 400);

    const { data: user } = await supabase
      .from('admin_users')
      .select('id, username, password_hash')
      .eq('username', username)
      .maybeSingle();

    if (!user) return json({ success: false, message: 'User not found' }, 404);

    const ok = await bcrypt.compare(currentPassword, user.password_hash);
    if (!ok) return json({ success: false, message: 'Current password is incorrect' }, 401);

    const newHash = await bcrypt.hash(newPassword, 12);
    await supabase
      .from('admin_users')
      .update({ password_hash: newHash })
      .eq('id', user.id);

    return json({ success: true });
  } catch (err) {
    console.error('admin-change-password error:', err);
    return json({ success: false, message: 'Internal server error' }, 500);
  }
});

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
