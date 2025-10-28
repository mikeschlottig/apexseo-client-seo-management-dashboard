import { useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientDataTable } from "@/components/clients/ClientDataTable";
import { clientColumns } from "@/components/clients/ClientColumns";
import { useClientStore } from "@/store/client-store";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
export default function ClientsPage() {
  const { clients, isLoading, error, fetchClients } = useClientStore();
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
        <Button className="hover:scale-105 transition-transform duration-200">
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
        <ClientDataTable columns={clientColumns} data={clients} />
      )}
    </div>
  );
}