// Input validation utilities for the blog

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ValidationRule {
  test: (value: any) => boolean;
  message: string;
}

/**
 * Generic validator class
 */
export class Validator {
  private rules: ValidationRule[] = [];

  addRule(rule: ValidationRule): Validator {
    this.rules.push(rule);
    return this;
  }

  validate(value: any): ValidationResult {
    const errors: string[] = [];
    
    for (const rule of this.rules) {
      if (!rule.test(value)) {
        errors.push(rule.message);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * Common validation rules
 */
export const ValidationRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    test: (value: any) => value !== null && value !== undefined && value !== '',
    message
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    test: (value: string) => typeof value === 'string' && value.length >= min,
    message: message || `Must be at least ${min} characters long`
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    test: (value: string) => typeof value === 'string' && value.length <= max,
    message: message || `Must be no more than ${max} characters long`
  }),

  email: (message = 'Must be a valid email address'): ValidationRule => ({
    test: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return typeof value === 'string' && emailRegex.test(value);
    },
    message
  }),

  url: (message = 'Must be a valid URL'): ValidationRule => ({
    test: (value: string) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message
  }),

  slug: (message = 'Must be a valid slug (letters, numbers, hyphens only)'): ValidationRule => ({
    test: (value: string) => {
      const slugRegex = /^[a-z0-9-]+$/;
      return typeof value === 'string' && slugRegex.test(value);
    },
    message
  }),

  noScript: (message = 'Script tags are not allowed'): ValidationRule => ({
    test: (value: string) => {
      const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
      return typeof value === 'string' && !scriptRegex.test(value);
    },
    message
  }),

  noXSS: (message = 'Potentially unsafe content detected'): ValidationRule => ({
    test: (value: string) => {
      const xssPatterns = [
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
        /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
        /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi
      ];
      
      return typeof value === 'string' && !xssPatterns.some(pattern => pattern.test(value));
    },
    message
  }),

  passwordStrength: (message = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'): ValidationRule => ({
    test: (value: string) => {
      if (typeof value !== 'string' || value.length < 8) return false;
      
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumbers = /\d/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      
      return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
    },
    message
  })
};

/**
 * Pre-configured validators for common use cases
 */
export const Validators = {
  username: new Validator()
    .addRule(ValidationRules.required('Username is required'))
    .addRule(ValidationRules.minLength(3, 'Username must be at least 3 characters'))
    .addRule(ValidationRules.maxLength(50, 'Username must be no more than 50 characters'))
    .addRule(ValidationRules.slug('Username can only contain letters, numbers, and hyphens')),

  email: new Validator()
    .addRule(ValidationRules.required('Email is required'))
    .addRule(ValidationRules.email()),

  password: new Validator()
    .addRule(ValidationRules.required('Password is required'))
    .addRule(ValidationRules.passwordStrength()),

  postTitle: new Validator()
    .addRule(ValidationRules.required('Title is required'))
    .addRule(ValidationRules.minLength(1, 'Title cannot be empty'))
    .addRule(ValidationRules.maxLength(200, 'Title must be no more than 200 characters'))
    .addRule(ValidationRules.noScript()),

  postContent: new Validator()
    .addRule(ValidationRules.required('Content is required'))
    .addRule(ValidationRules.minLength(10, 'Content must be at least 10 characters'))
    .addRule(ValidationRules.maxLength(50000, 'Content must be no more than 50,000 characters'))
    .addRule(ValidationRules.noXSS()),

  postSlug: new Validator()
    .addRule(ValidationRules.required('Slug is required'))
    .addRule(ValidationRules.slug()),

  url: new Validator()
    .addRule(ValidationRules.url())
};

/**
 * Hook for form validation
 */
export const useValidation = <T extends Record<string, any>>(initialData: T) => {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [data, setData] = useState<T>(initialData);

  const validateField = useCallback((field: keyof T, value: any, validator: Validator) => {
    const result = validator.validate(value);
    setErrors(prev => ({
      ...prev,
      [field]: result.errors
    }));
    return result.isValid;
  }, []);

  const validateForm = useCallback((validators: Record<keyof T, Validator>) => {
    const newErrors: Record<string, string[]> = {};
    let isValid = true;

    for (const [field, validator] of Object.entries(validators)) {
      const result = validator.validate(data[field as keyof T]);
      if (!result.isValid) {
        newErrors[field] = result.errors;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [data]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    data,
    setData,
    errors,
    validateField,
    validateForm,
    clearErrors
  };
};

// Import React hooks
import { useState, useCallback } from 'react'; 