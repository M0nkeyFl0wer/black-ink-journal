
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';

interface PasswordManagerProps {
  username: string;
}

const PasswordManager = ({ username }: PasswordManagerProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const { changePassword, loading } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      alert('New password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    const success = await changePassword(username, currentPassword, newPassword);
    if (success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(newPassword);
  const strengthColors = ['bg-red-500', 'bg-red-400', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <Card className="bg-gray-900 border-gray-700 max-w-md">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Lock className="w-5 h-5 mr-2" />
          Change Password
        </CardTitle>
        <div className="flex items-center text-sm text-green-400">
          <Shield className="w-4 h-4 mr-1" />
          Password recovery enabled for authorized emails
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Current Password
            </label>
            <div className="relative">
              <Input
                type={showPasswords ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              New Password
            </label>
            <Input
              type={showPasswords ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
              required
              minLength={8}
            />
            {newPassword && (
              <div className="space-y-2">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded ${
                        i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-400">
                  Strength: {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : 'Very Weak'}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Confirm New Password
            </label>
            <Input
              type={showPasswords ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
              required
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-400">Passwords do not match</p>
            )}
          </div>

          <div className="pt-4 space-y-2">
            <Button
              type="submit"
              disabled={loading || !currentPassword || !newPassword || newPassword !== confirmPassword}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </Button>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>Password requirements:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>At least 8 characters long</li>
              <li>Mix of uppercase and lowercase letters</li>
              <li>Include numbers and special characters</li>
            </ul>
          </div>

          <div className="mt-4 p-3 bg-gray-800 rounded border border-gray-600">
            <p className="text-xs text-gray-400">
              <strong>Recovery emails:</strong> benw@monkeyflower.ca, ben@elephantroom.ca
            </p>
            <p className="text-xs text-gray-500 mt-1">
              If you forget your password, you can recover it using these authorized email addresses.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PasswordManager;
