import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientInfoCard } from "@/components/clients/ClientInfoCard";
import { SEOMetricsCard } from "@/components/clients/SEOMetricsCard";
import { ClientFilesCard } from "@/components/clients/ClientFilesCard";
import { useClientStore } from "@/store/client-store";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
export default function ClientDetailPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const { currentClient, isLoading, error, fetchClientById } = useClientStore();
  useEffect(() => {
    if (clientId) {
      fetchClientById(clientId);
    }
  }, [clientId, fetchClientById]);
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-7 w-7 rounded-md" />
          <Skeleton className="h-9 w-1/3" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="lg:col-span-1 h-96" />
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }
  if (error && !currentClient) {
    return (
      <div className="text-center">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button asChild variant="link" className="mt-4">
          <Link to="/clients">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clients
          </Link>
        </Button>
      </div>
    );
  }
  if (!currentClient) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Client not found</h2>
        <p className="text-muted-foreground">The client you are looking for does not exist.</p>
        <Button asChild variant="link" className="mt-4">
          <Link to="/clients">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clients
          </Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon" className="h-7 w-7">
          <Link to="/clients">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">{currentClient.company}</h2>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <ClientInfoCard client={currentClient} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <SEOMetricsCard seoStats={currentClient.seoStats} />
          <ClientFilesCard client={currentClient} />
        </div>
      </div>
    </div>
  );
}