
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
  username: string;
  last_login: string | null;
}

export const useAdminAuth = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const signIn = useCallback(async (username: string, password: string): Promise<AdminUser | null> => {
    setLoading(true);

    try {
      // First check if account is locked
      const { data: user, error: userError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .single();

      if (userError) {
        toast({
          title: "Access denied",
          description: "Invalid username or password",
          variant: "destructive",
        });
        return null;
      }

      // Check if account is locked
      if (user.locked_until && new Date(user.locked_until) > new Date()) {
        toast({
          title: "Account locked",
          description: "Account is temporarily locked due to too many failed attempts",
          variant: "destructive",
        });
        return null;
      }

      // Verify password using a simple hash comparison (in production, use proper bcrypt)
      const isValidPassword = await verifyPassword(password, user.password_hash);

      if (!isValidPassword) {
        // Increment failed attempts
        const failedAttempts = (user.failed_login_attempts || 0) + 1;
        const lockUntil = failedAttempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null; // 15 minutes

        await supabase
          .from('admin_users')
          .update({ 
            failed_login_attempts: failedAttempts,
            locked_until: lockUntil?.toISOString() || null
          })
          .eq('id', user.id);

        toast({
          title: "Access denied",
          description: failedAttempts >= 5 
            ? "Account locked for 15 minutes due to too many failed attempts"
            : "Invalid username or password",
          variant: "destructive",
        });
        return null;
      }

      // Successful login - reset failed attempts and update last login
      await supabase
        .from('admin_users')
        .update({ 
          failed_login_attempts: 0,
          locked_until: null,
          last_login: new Date().toISOString()
        })
        .eq('id', user.id);

      return {
        id: user.id,
        username: user.username,
        last_login: user.last_login
      };
    } catch (error: any) {
      toast({
        title: "Something went wrong",
        description: "Please try again in a moment",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const changePassword = useCallback(async (username: string, currentPassword: string, newPassword: string): Promise<boolean> => {
    setLoading(true);

    try {
      const { data: user, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .single();

      if (error || !user) {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
        return false;
      }

      const isValidPassword = await verifyPassword(currentPassword, user.password_hash);
      if (!isValidPassword) {
        toast({
          title: "Error",
          description: "Current password is incorrect",
          variant: "destructive",
        });
        return false;
      }

      const newPasswordHash = await hashPassword(newPassword);
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({ password_hash: newPasswordHash })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Password changed successfully",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to change password",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    signIn,
    changePassword,
    loading
  };
};

// Simple password hashing (in production, use proper bcrypt)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'admin_salt_2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}
