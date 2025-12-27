import React, { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KanbanBoard } from "@/components/pipeline/KanbanBoard";
import { LeadsTable } from "@/components/pipeline/LeadsTable";
import { PipelineViewToggle } from "@/components/pipeline/PipelineViewToggle";
import { PipelineFilters } from "@/components/pipeline/PipelineFilters";
import { useLeadStore } from "@/store/lead-store";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
export default function SalesPipelinePage() {
  const fetchLeads = useLeadStore((state) => state.fetchLeads);
  const isLoading = useLeadStore((state) => state.isLoading);
  const error = useLeadStore((state) => state.error);
  const leads = useLeadStore((state) => state.leads);
  const [view, setView] = React.useState<'kanban' | 'table'>('kanban');
  const [filters, setFilters] = React.useState({
    stage: null as string | null,
    source: null as string | null,
    searchTerm: '',
  });
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);
  const uniqueSources = useMemo(() => {
    const sources = new Set(leads.map(lead => lead.source));
    return Array.from(sources).sort();
  }, [leads]);
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      if (filters.stage && lead.stage !== filters.stage) return false;
      if (filters.source && lead.source !== filters.source) return false;
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return (
          lead.company.toLowerCase().includes(searchLower) ||
          lead.contactPerson.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [leads, filters]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 h-full flex flex-col">
        <div className="space-y-8 h-full flex flex-col">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-bold tracking-tight">Sales Pipeline</h2>
            <PipelineViewToggle view={view} onViewChange={setView} />
          </div>
          <div className="bg-gradient-to-r from-muted/30 to-muted/50 rounded-lg">
            <PipelineFilters filters={filters} sources={uniqueSources} onChange={setFilters} />
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
          {!isLoading && !error && (
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1"
              >
                {view === 'kanban' ? (
                  <KanbanBoard />
                ) : (
                  <LeadsTable leads={filteredLeads} />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}