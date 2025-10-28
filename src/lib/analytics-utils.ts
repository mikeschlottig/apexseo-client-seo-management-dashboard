import { Client, Lead } from '@shared/types';
import { subDays, isAfter } from 'date-fns';
export function calculateConversionRate(leads: Lead[]): number {
  const wonLeads = leads.filter(l => l.stage === 'Won').length;
  return leads.length > 0 ? (wonLeads / leads.length) * 100 : 0;
}
export function calculateAverageDealSize(leads: Lead[]): number {
  if (leads.length === 0) return 0;
  const totalValue = leads.reduce((sum, lead) => sum + lead.estimatedValue, 0);
  return totalValue / leads.length;
}
export function calculateWinRate(leads: Lead[]): number {
  const wonLeads = leads.filter(l => l.stage === 'Won').length;
  const lostLeads = leads.filter(l => l.stage === 'Lost').length;
  const totalClosed = wonLeads + lostLeads;
  return totalClosed > 0 ? (wonLeads / totalClosed) * 100 : 0;
}
export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}
export function calculatePipelineHealth(leads: Lead[]): {
  healthy: number;
  warning: number;
  critical: number;
} {
  const stageDistribution = leads.reduce((acc, lead) => {
    acc[lead.stage] = (acc[lead.stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const activeStages = ['Contact Made', 'Proposal Sent', 'Negotiation'];
  const activeCount = activeStages.reduce((sum, stage) => sum + (stageDistribution[stage] || 0), 0);
  const totalActive = leads.filter(l => l.stage !== 'Won' && l.stage !== 'Lost').length;
  const healthPercentage = totalActive > 0 ? (activeCount / totalActive) * 100 : 0;
  return {
    healthy: healthPercentage >= 70 ? healthPercentage : 0,
    warning: healthPercentage >= 40 && healthPercentage < 70 ? healthPercentage : 0,
    critical: healthPercentage < 40 ? healthPercentage : 0,
  };
}
export function filterByDateRange<T extends { createdAt: string }>(
  items: T[],
  range: '7d' | '30d' | '90d' | 'all'
): T[] {
  if (range === 'all') return items;
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const threshold = subDays(new Date(), days);
  return items.filter(item => isAfter(new Date(item.createdAt), threshold));
}
export function getDateRangeBounds(range: '7d' | '30d' | '90d' | 'all'): {
  start: Date | null;
  end: Date;
} {
  const end = new Date();
  if (range === 'all') return { start: null, end };
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  return { start: subDays(end, days), end };
}
export function sumBy<T>(array: T[], key: keyof T): number {
  return array.reduce((sum, item) => {
    const value = item[key];
    return sum + (typeof value === 'number' ? value : 0);
  }, 0);
}
export function averageBy<T>(array: T[], key: keyof T): number {
  if (array.length === 0) return 0;
  return sumBy(array, key) / array.length;
}
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}
export function countBy<T>(array: T[], predicate: (item: T) => boolean): number {
  return array.filter(predicate).length;
}
export function formatMetric(value: number, type: 'currency' | 'percentage' | 'number'): string {
  switch (type) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'number':
      return new Intl.NumberFormat('en-US').format(value);
    default:
      return String(value);
  }
}