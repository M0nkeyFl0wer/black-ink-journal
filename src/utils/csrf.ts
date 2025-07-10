// Browser-compatible CSRF token generation and validation utilities
export class CSRFProtection {
  private static readonly SECRET_KEY = 'benwest-blog-csrf-secret-2024';
  private static readonly TOKEN_LENGTH = 32;
  private static readonly EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Generate a random string for CSRF token
   */
  private static generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Simple hash function for browser compatibility
   */
  private static async simpleHash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data + this.SECRET_KEY);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generate a new CSRF token
   */
  static async generateToken(): Promise<string> {
    const randomToken = this.generateRandomString(this.TOKEN_LENGTH);
    const timestamp = Date.now().toString();
    const data = `${randomToken}:${timestamp}`;
    
    const signature = await this.simpleHash(data);
    
    return `${data}:${signature}`;
  }

  /**
   * Validate a CSRF token
   */
  static async validateToken(token: string): Promise<boolean> {
    try {
      const parts = token.split(':');
      if (parts.length !== 3) {
        return false;
      }

      const [randomToken, timestamp, signature] = parts;
      const data = `${randomToken}:${timestamp}`;
      
      const expectedSignature = await this.simpleHash(data);
      
      // Check signature
      if (signature !== expectedSignature) {
        return false;
      }
      
      // Check expiry
      const tokenTime = parseInt(timestamp, 10);
      const currentTime = Date.now();
      
      if (currentTime - tokenTime > this.EXPIRY_TIME) {
        return false;
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Extract token from request headers or body
   */
  static extractToken(request: Request): string | null {
    // Check headers first
    const headerToken = request.headers.get('x-csrf-token');
    if (headerToken) {
      return headerToken;
    }

    // Check form data
    const contentType = request.headers.get('content-type');
    if (contentType?.includes('application/x-www-form-urlencoded')) {
      // For form submissions, we'd need to parse the body
      // This is a simplified version
      return null;
    }

    return null;
  }
}

/**
 * Hook for React components to manage CSRF tokens
 */
export const useCSRF = () => {
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate a new token when component mounts
    const generateToken = async () => {
      try {
        const newToken = await CSRFProtection.generateToken();
        setToken(newToken);
      } catch (error) {
        console.error('Failed to generate CSRF token:', error);
      } finally {
        setLoading(false);
      }
    };
    
    generateToken();
  }, []);

  const validateToken = useCallback(async (tokenToValidate: string) => {
    return await CSRFProtection.validateToken(tokenToValidate);
  }, []);

  const generateNewToken = useCallback(async () => {
    try {
      const newToken = await CSRFProtection.generateToken();
      setToken(newToken);
      return newToken;
    } catch (error) {
      console.error('Failed to generate new CSRF token:', error);
      return '';
    }
  }, []);

  return {
    token,
    loading,
    validateToken,
    generateNewToken
  };
};

// Import React hooks
import { useState, useEffect, useCallback } from 'react'; 