import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Lead, PipelineStage } from '@shared/types';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
type LeadState = {
  leads: Lead[];
  isLoading: boolean;
  error: string | null;
};
type LeadActions = {
  fetchLeads: () => Promise<void>;
  updateLeadStage: (leadId: string, newStage: PipelineStage) => Promise<void>;
  moveLead: (leadId: string, newStage: PipelineStage) => void;
};
export const useLeadStore = create<LeadState & LeadActions>()(
  immer((set, get) => ({
    leads: [],
    isLoading: false,
    error: null,
    fetchLeads: async () => {
      set({ isLoading: true, error: null });
      try {
        const leads = await api<Lead[]>('/api/leads');
        set({ leads, isLoading: false });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch leads';
        set({ isLoading: false, error: errorMessage });
        toast.error(errorMessage);
      }
    },
    moveLead: (leadId, newStage) => {
      set((state) => {
        const lead = state.leads.find((l) => l.id === leadId);
        if (lead) {
          lead.stage = newStage;
        }
      });
    },
    updateLeadStage: async (leadId, newStage) => {
      const originalLeads = get().leads;
      // Optimistically update the UI
      get().moveLead(leadId, newStage);
      try {
        await api(`/api/leads/${leadId}/stage`, {
          method: 'PUT',
          body: JSON.stringify({ stage: newStage }),
        });
        toast.success("Lead stage updated!");
      } catch (error) {
        // Revert on failure
        set({ leads: originalLeads });
        const errorMessage = error instanceof Error ? error.message : 'Failed to update lead stage';
        toast.error(errorMessage);
      }
    },
  }))
);