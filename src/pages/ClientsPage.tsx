import React, { useEffect } from "react";
import { PlusCircle, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClientDataTable } from "@/components/clients/ClientDataTable";
import { useClientStore } from "@/store/client-store";
import { ClientFormModal } from "@/components/clients/ClientFormModal";
import { EmptyState } from "@/components/ui/empty-state";
import { api } from "@/lib/api-client";
import { exportToCSV } from "@/lib/export-utils";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
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

  const handleExportAll = () => {
    const data = clients.map(c => ({
      Company: c.company,
      Contact: c.contactPerson,
      Email: c.email,
      Phone: c.phone,
      Industry: c.industry,
      Keywords: c.seoStats.indexedKeywords,
      Clicks: c.seoStats.seoClicks,
    }));
    exportToCSV(data, `clients-export-${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'n': {
      handler: () => setIsModalOpen(true),
      description: 'New Client',
      showToast: false,
    },
    'e': {
      handler: handleExportAll,
      description: 'Export Clients',
      showToast: false,
    },
  });

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
  if (!isLoading && !error && clients.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <EmptyState
            icon={PlusCircle}
            title="No Clients Yet"
            description="Get started by adding your first client to track their SEO performance and manage their account."
            action={{ label: 'Add First Client', onClick: () => setIsModalOpen(true) }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold tracking-tight">Clients</h2>
              {clients.length > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  Managing {clients.length} client{clients.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {clients.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleExportAll}
                  className="gap-2 hover:scale-105 transition-transform"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              )}
            <Button
              className="hover:scale-105 hover:bg-gradient-to-r hover:from-primary hover:to-primary/80 transition-all duration-200 shadow-md"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Client
            </Button>
            </div>
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