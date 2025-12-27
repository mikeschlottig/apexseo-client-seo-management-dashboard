import React, { useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientDataTable } from "@/components/clients/ClientDataTable";
import { useClientStore } from "@/store/client-store";
import { ClientFormModal } from "@/components/clients/ClientFormModal";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
export default function ClientsPage() {
  const clients = useClientStore((state) => state.clients);
  const isLoading = useClientStore((state) => state.isLoading);
  const error = useClientStore((state) => state.error);
  const fetchClients = useClientStore((state) => state.fetchClients);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);
  const handleCreateClient = async (data: any) => {
    try {
      await api('/api/clients', {
        method: 'POST',
        body: JSON.stringify({
          company: data.company,
          contactPerson: data.contactPerson,
          email: data.email,
          phone: data.phone,
          website: data.website,
          industry: data.industry,
          seoStats: {
            indexedKeywords: data.indexedKeywords,
            seoClicks: data.seoClicks,
            websiteQualityRating: data.websiteQualityRating,
            strategicTasks: [],
            competitors: [],
            longTailTargets: [],
            lowKeywordDifficultyTargets: [],
          },
        }),
      });
      toast.success('Client created successfully!');
      fetchClients();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create client');
      throw error;
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-bold tracking-tight">Clients</h2>
            <Button 
              className="hover:scale-105 hover:bg-gradient-to-r hover:from-primary hover:to-primary/80 transition-all duration-200 shadow-md" 
              onClick={() => setIsModalOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Client
            </Button>
          </div>
          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error Fetching Clients</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!isLoading && !error && (
            <ClientDataTable data={clients} />
          )}
          <ClientFormModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            client={null}
            onSubmit={handleCreateClient}
          />
        </div>
      </div>
    </div>
  );
}