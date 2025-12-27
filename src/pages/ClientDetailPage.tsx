import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Terminal, Pencil, Home, ChevronRight, Mail, Calendar, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ClientInfoCard } from "@/components/clients/ClientInfoCard";
import { SEOMetricsCard } from "@/components/clients/SEOMetricsCard";
import { ClientFilesCard } from "@/components/clients/ClientFilesCard";
import { ClientFormModal } from "@/components/clients/ClientFormModal";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import { useClientStore } from "@/store/client-store";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDistanceToNow } from 'date-fns';
export default function ClientDetailPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const currentClient = useClientStore((state) => state.currentClient);
  const isLoading = useClientStore((state) => state.isLoading);
  const error = useClientStore((state) => state.error);
  const fetchClientById = useClientStore((state) => state.fetchClientById);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  useEffect(() => {
    if (clientId) {
      fetchClientById(clientId);
    }
  }, [clientId, fetchClientById]);
  const handleUpdateClient = async (data: any) => {
    if (!currentClient) return;
    try {
      await api(`/api/clients/${currentClient.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          company: data.company,
          contactPerson: data.contactPerson,
          email: data.email,
          phone: data.phone,
          website: data.website,
          industry: data.industry,
          seoStats: {
            ...currentClient.seoStats,
            indexedKeywords: data.indexedKeywords,
            seoClicks: data.seoClicks,
            websiteQualityRating: data.websiteQualityRating,
          },
        }),
      });
      toast.success('Client updated successfully!');
      if (clientId) {
        fetchClientById(clientId);
      }
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update client');
      throw error;
    }
  };
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <Skeleton className="h-7 w-7 rounded-md" />
              <Skeleton className="h-9 w-1/3" />
            </div>
            <div className="grid gap-8 lg:grid-cols-3">
              <Skeleton className="lg:col-span-1 h-96" />
              <div className="lg:col-span-2 space-y-8">
                <Skeleton className="h-96" />
                <Skeleton className="h-64" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (error && !currentClient) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
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
        </div>
      </div>
    );
  }
  if (!currentClient) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
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
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="space-y-8 animate-fade-in">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/clients" className="hover:text-foreground transition-colors">
              Clients
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">{currentClient.company}</span>
          </nav>

          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="icon" className="h-7 w-7 hover:bg-accent hover:-translate-x-1 transition-all">
              <Link to="/clients">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div className="flex items-center gap-4">
              <h2 className="text-4xl font-bold tracking-tight">{currentClient.company}</h2>
              <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(true)} className="hover:scale-105 transition-transform">
                <Pencil className="mr-2 h-4 w-4" />
                Edit Client
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => window.location.href = `mailto:${currentClient.email}`}>
              <Mail className="h-4 w-4" />
              Send Email
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Meeting
            </Button>
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <Link to="/reports">
                <FileText className="h-4 w-4" />
                Generate Report
              </Link>
            </Button>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-8">
              <ClientInfoCard client={currentClient} />
              
              {/* Activity Timeline */}
              <Card className="hover:shadow-md transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentClient.uploadedFiles.length > 0 ? (
                    currentClient.uploadedFiles.slice(0, 3).map((file, idx) => (
                      <div key={file.id}>
                        {idx > 0 && <Separator className="my-2" />}
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.fileName}</p>
                            <p className="text-xs text-muted-foreground">
                              Uploaded {formatDistanceToNow(new Date(file.uploadDate), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2 space-y-8">
              <SEOMetricsCard seoStats={currentClient.seoStats} />
              <ClientFilesCard client={currentClient} />
            </div>
          </div>
          <ClientFormModal
            open={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            client={currentClient}
            onSubmit={handleUpdateClient}
          />
        </div>
      </div>
    </div>
  );
}