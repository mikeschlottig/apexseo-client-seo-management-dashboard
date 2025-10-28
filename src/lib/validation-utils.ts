export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-+()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}
export function isValidDateRange(start: string, end: string): boolean {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return startDate <= endDate;
}
export function isPositiveNumber(value: number): boolean {
  return typeof value === 'number' && value >= 0 && !isNaN(value);
}
export function isWithinRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}
export function isValidSEOMetrics(metrics: {
  indexedKeywords: number;
  seoClicks: number;
  websiteQualityRating: number;
}): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!isPositiveNumber(metrics.indexedKeywords)) {
    errors.push('Indexed keywords must be a positive number');
  }
  if (!isPositiveNumber(metrics.seoClicks)) {
    errors.push('SEO clicks must be a positive number');
  }
  if (!isWithinRange(metrics.websiteQualityRating, 0, 100)) {
    errors.push('Website quality rating must be between 0 and 100');
  }
  if (metrics.indexedKeywords > 10000) {
    warnings.push('Unusually high number of indexed keywords');
  }
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
export function isValidLeadValue(value: number): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!isPositiveNumber(value)) {
    errors.push('Lead value must be a positive number');
  }
  if (value > 1000000) {
    warnings.push('Unusually high lead value');
  }
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
export function isValidClientData(client: {
  company: string;
  email: string;
  website: string;
}): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!client.company || client.company.trim().length === 0) {
    errors.push('Company name is required');
  }
  if (!isValidEmail(client.email)) {
    errors.push('Invalid email address');
  }
  if (!isValidURL(client.website)) {
    errors.push('Invalid website URL');
  }
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
export function sanitizeString(str: string): string {
  return str.trim().replace(/[<>]/g, '');
}
export function sanitizeNumber(value: any): number | null {
  const num = Number(value);
  return isNaN(num) ? null : num;
}
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}