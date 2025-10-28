import { useEffect } from "react";
import { KanbanBoard } from "@/components/pipeline/KanbanBoard";
import { useLeadStore } from "@/store/lead-store";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
export default function SalesPipelinePage() {
  const fetchLeads = useLeadStore((state) => state.fetchLeads);
  const isLoading = useLeadStore((state) => state.isLoading);
  const error = useLeadStore((state) => state.error);
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Sales Pipeline</h2>
      </div>
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ))}
        </div>
      )}
      {error && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {!isLoading && !error && <KanbanBoard />}
    </div>
  );
}