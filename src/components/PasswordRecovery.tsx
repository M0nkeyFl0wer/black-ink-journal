import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Mail, ArrowLeft } from 'lucide-react';

interface PasswordRecoveryProps {
  onBack: () => void;
}

const PasswordRecovery = ({ onBack }: PasswordRecoveryProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'request' | 'token' | 'reset'>('request');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();

  const requestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);

    try {
      const { error } = await supabase.functions.invoke('password-recovery', {
        body: { email, action: 'request' }
      });

      if (error) throw error;

      toast({
        title: "Recovery request sent",
        description: "If this email is authorized, you'll receive a recovery token",
      });
      setStep('token');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to process recovery request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.functions.invoke('password-recovery', {
        body: { 
          token,
          newPassword,
          action: 'reset'
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password has been reset successfully",
      });
      onBack();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to reset password. Token may be invalid or expired.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {step === 'request' ? 'Password Recovery' : step === 'token' ? 'Enter Recovery Token' : 'Reset Password'}
          </CardTitle>
          <p className="text-gray-600 text-sm">
            {step === 'request' ? 'Enter your email address' : 
             step === 'token' ? 'Enter the token sent to your email' : 
             'Create a new password'}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 'request' && (
            <form onSubmit={requestPasswordReset} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500">
                  Recovery is only available for authorized users
                </p>
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Recovery Email'}
              </Button>
            </form>
          )}

          {step === 'token' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Recovery Token</label>
                <Input
                  type="text"
                  placeholder="Enter 6-digit token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="h-12 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 text-center font-mono text-lg"
                  maxLength={6}
                />
              </div>
              <Button 
                onClick={() => setStep('reset')}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={token.length !== 6}
              >
                Verify Token
              </Button>
            </div>
          )}

          {step === 'reset' && (
            <form onSubmit={resetPassword} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">New Password</label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-12 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
                  required
                  minLength={8}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={loading || !newPassword || newPassword !== confirmPassword}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          )}

          <Button
            variant="ghost"
            onClick={onBack}
            className="w-full flex items-center justify-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordRecovery;
