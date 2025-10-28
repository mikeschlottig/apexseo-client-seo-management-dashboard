import { IndexedEntity } from "./core-utils";
import type { Client, Lead } from "@shared/types";
import { MOCK_CLIENTS, MOCK_LEADS } from "@shared/mock-data";
// CLIENT ENTITY: one DO instance per client
export class ClientEntity extends IndexedEntity<Client> {
  static readonly entityName = "client";
  static readonly indexName = "clients";
  // A default state for a new client
  static readonly initialState: Client = {
    id: "",
    company: "",
    contactPerson: "",
    industry: "",
    website: "",
    email: "",
    phone: "",
    createdAt: new Date().toISOString(),
    seoStats: {
      indexedKeywords: 0,
      seoClicks: 0,
      strategicTasks: [],
      competitors: [],
      longTailTargets: [],
      lowKeywordDifficultyTargets: [],
      websiteQualityRating: 0,
    },
    uploadedFiles: [],
  };
  // Seed data to populate the DO on first run
  static seedData = MOCK_CLIENTS;
}
// LEAD ENTITY: one DO instance per lead
export class LeadEntity extends IndexedEntity<Lead> {
  static readonly entityName = "lead";
  static readonly indexName = "leads";
  // A default state for a new lead
  static readonly initialState: Lead = {
    id: "",
    company: "",
    contactPerson: "",
    email: "",
    phone: "",
    estimatedValue: 0,
    stage: 'Lead In',
    source: "",
    createdAt: new Date().toISOString(),
  };
  // Seed data to populate the DO on first run
  static seedData = MOCK_LEADS;
}