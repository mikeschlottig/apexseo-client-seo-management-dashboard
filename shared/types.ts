// Generic API response wrapper
export type ApiResponse<T = unknown> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
};
// File management data structure
export interface UploadedFile {
  id: string;
  clientId: string;
  fileName: string;
  fileType: 'csv' | 'pdf' | 'xml' | 'html' | 'docx';
  fileSize: number; // in bytes
  uploadDate: string;
  url: string; // URL to access the file
}
// SEO-specific data structures
export interface SEOStats {
  indexedKeywords: number;
  seoClicks: number;
  strategicTasks: {
    id: string;
    task: string;
    completed: boolean;
  }[];
  competitors: string[];
  longTailTargets: string[];
  lowKeywordDifficultyTargets: string[];
  websiteQualityRating: number; // A score out of 100
}
// Core CRM and SEO client data
export interface Client {
  id: string;
  company: string;
  contactPerson: string;
  industry: string;
  website: string;
  email: string;
  phone: string;
  createdAt: string;
  seoStats: SEOStats;
  uploadedFiles: UploadedFile[];
}
// Sales pipeline data structures
export type PipelineStage = 'Lead In' | 'Contact Made' | 'Proposal Sent' | 'Negotiation' | 'Won' | 'Lost';
export const PIPELINE_STAGES: PipelineStage[] = ['Lead In', 'Contact Made', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];
export interface Lead {
  id: string;
  company: string;
  contactPerson: string;
  email: string;
  phone: string;
  estimatedValue: number;
  stage: PipelineStage;
  source: string;
  createdAt: string;
}