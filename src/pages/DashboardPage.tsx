import React, { useEffect, useMemo, useState } from 'react';
import { useClientStore } from '@/store/client-store';
import { useLeadStore } from '@/store/lead-store';
import { DashboardFilters, TimeRange } from '@/components/dashboard/DashboardFilters';
import { StatCard } from '@/components/dashboard/StatCard';
import { ClientIndustryChart } from '@/components/dashboard/ClientIndustryChart';
import { PipelineStageChart } from '@/components/dashboard/PipelineStageChart';
import { RecentActivityFeed } from '@/components/dashboard/RecentActivityFeed';
import { TasksOverview } from '@/components/dashboard/TasksOverview';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Target, Briefcase } from 'lucide-react';
import { exportToCSV } from '@/lib/export-utils';
import { toast } from 'sonner';
import { subDays } from 'date-fns';
export default function DashboardPage() {
  const clients = useClientStore((state) => state.clients);
  const fetchClients = useClientStore((state) => state.fetchClients);
  const isLoadingClients = useClientStore((state) => state.isLoading);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const leads = useLeadStore((state) => state.leads);
  const fetchLeads = useLeadStore((state) => state.fetchLeads);
  const isLoadingLeads = useLeadStore((state) => state.isLoading);
  useEffect(() => {
    if (clients.length === 0) fetchClients();
    if (leads.length === 0) fetchLeads();
  }, [fetchClients, fetchLeads, clients.length, leads.length]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (e.key === 'e' || e.key === 'E') {
        handleExport();
      } else if (e.key === 'r' || e.key === 'R') {
        fetchClients();
        fetchLeads();
        setLastUpdated(new Date());
        toast.success('Dashboard refreshed');
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [fetchClients, fetchLeads]);

  const getDateThreshold = (range: TimeRange): Date | null => {
    if (range === 'all') return null;
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    return subDays(new Date(), days);
  };

  const filteredClients = useMemo(() => {
    const threshold = getDateThreshold(timeRange);
    if (!threshold) return clients;
    return clients.filter(c => new Date(c.createdAt) >= threshold);
  }, [clients, timeRange]);

  const filteredLeads = useMemo(() => {
    const threshold = getDateThreshold(timeRange);
    if (!threshold) return leads;
    return leads.filter(l => new Date(l.createdAt) >= threshold);
  }, [leads, timeRange]);
  const dashboardStats = useMemo(() => {
    const totalClients = filteredClients.length;
    const totalSeoClicks = filteredClients.reduce((sum, client) => sum + client.seoStats.seoClicks, 0);
    const activeLeads = filteredLeads.filter(lead => lead.stage !== 'Won' && lead.stage !== 'Lost').length;
    const totalPipelineValue = filteredLeads.reduce((sum, lead) => sum + lead.estimatedValue, 0);
    return {
      totalClients,
      totalSeoClicks,
      activeLeads,
      totalPipelineValue,
    };
  }, [filteredClients, filteredLeads]);

  const handleExport = () => {
    const data = filteredClients.map(c => ({
      Company: c.company,
      Contact: c.contactPerson,
      Industry: c.industry,
      Keywords: c.seoStats.indexedKeywords,
      Clicks: c.seoStats.seoClicks,
      Quality: c.seoStats.websiteQualityRating,
    }));
    const success = exportToCSV(data, `dashboard-export-${new Date().toISOString().split('T')[0]}.csv`);
    if (success) {
      toast.success('Dashboard data exported successfully');
    }
  };
  const isLoading = isLoadingClients || isLoadingLeads;

  if (!isLoading && filteredClients.length === 0 && filteredLeads.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <EmptyState
            icon={Users}
            title="No Data Available"
            description="There are no clients or leads in the selected time range. Try adjusting your filters or add some data to get started."
            action={{
              label: 'View All Time',
              onClick: () => setTimeRange('all'),
            }}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="space-y-8 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-4xl font-bold tracking-tight">Dashboard</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
            {timeRange !== 'all' && (
              <Badge variant="outline">Filtered View</Badge>
            )}
          </div>
          <DashboardFilters timeRange={timeRange} onTimeRangeChange={setTimeRange} onExport={handleExport} />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div style={{ animationDelay: '0ms' }} className="animate-fade-in">
              <StatCard
                title="Total Clients"
                value={dashboardStats.totalClients}
                icon={Users}
                description="Currently managed"
                isLoading={isLoading}
              />
            </div>
            <div style={{ animationDelay: '100ms' }} className="animate-fade-in">
              <StatCard
                title="Aggregate SEO Clicks"
                value={new Intl.NumberFormat().format(dashboardStats.totalSeoClicks)}
                icon={TrendingUp}
                description="Monthly"
                isLoading={isLoading}
              />
            </div>
            <div style={{ animationDelay: '200ms' }} className="animate-fade-in">
              <StatCard
                title="Active Leads"
                value={dashboardStats.activeLeads}
                icon={Target}
                description="In pipeline"
                isLoading={isLoading}
              />
            </div>
            <div style={{ animationDelay: '300ms' }} className="animate-fade-in">
              <StatCard
                title="Total Pipeline Value"
                value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(dashboardStats.totalPipelineValue)}
                icon={Briefcase}
                description="Estimated total value"
                isLoading={isLoading}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PipelineStageChart />
            </div>
            <div>
              <ClientIndustryChart />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentActivityFeed />
            </div>
            <div>
              <TasksOverview />
            </div>
          </div>
          <footer className="text-center text-sm text-muted-foreground pt-8">
            Built with ❤️ at Cloudflare
          </footer>
        </div>
      </div>
    </div>
  );
}