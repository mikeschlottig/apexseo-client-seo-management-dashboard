import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Client } from '@shared/types';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
type ClientState = {
  clients: Client[];
  currentClient: Client | null;
  isLoading: boolean;
  error: string | null;
};
type ClientActions = {
  fetchClients: () => Promise<void>;
  fetchClientById: (clientId: string) => Promise<void>;
};
export const useClientStore = create<ClientState & ClientActions>()(
  immer((set, get) => ({
    clients: [],
    currentClient: null,
    isLoading: false,
    error: null,
    fetchClients: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await api<{ items: Client[] }>('/api/clients');
        set({ clients: response.items, isLoading: false });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch clients';
        set({ isLoading: false, error: errorMessage });
        toast.error(errorMessage);
      }
    },
    fetchClientById: async (clientId: string) => {
      // Check cache first
      const existingClient = get().clients.find(c => c.id === clientId);
      if (existingClient) {
        set({ currentClient: existingClient, isLoading: false, error: null });
        // Still fetch in background to get latest data
      } else {
        set({ isLoading: true, error: null, currentClient: null });
      }
      try {
        const client = await api<Client>(`/api/clients/${clientId}`);
        set((state) => {
          state.currentClient = client;
          // Update client in the main list as well
          const index = state.clients.findIndex(c => c.id === clientId);
          if (index !== -1) {
            state.clients[index] = client;
          } else {
            state.clients.push(client);
          }
          state.isLoading = false;
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch client details';
        set({ isLoading: false, error: errorMessage });
        toast.error(errorMessage);
      }
    },
  }))
);