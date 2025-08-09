
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

  const signIn = useCallback(async (username: string, password: string, _csrfToken?: string): Promise<AdminUser | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-login', {
        body: { username, password }
      });

      if (error) throw error;
      if (!data || !data.success) {
        toast({
          title: 'Access denied',
          description: data?.message || 'Invalid username or password',
          variant: 'destructive',
        });
        return null;
      }

      const user: AdminUser = data.user;
      return user;
    } catch (error: any) {
      toast({
        title: 'Something went wrong',
        description: 'Please try again in a moment',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const changePassword = useCallback(async (username: string, currentPassword: string, newPassword: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-change-password', {
        body: { username, currentPassword, newPassword }
      });

      if (error) throw error;
      if (!data || !data.success) {
        toast({
          title: 'Error',
          description: data?.message || 'Failed to change password',
          variant: 'destructive',
        });
        return false;
      }

      toast({ title: 'Success', description: 'Password changed successfully' });
      return true;
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to change password', variant: 'destructive' });
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
