import { useEffect, useMemo } from 'react';
import { useClientStore } from '@/store/client-store';
import { useLeadStore } from '@/store/lead-store';
import { StatCard } from '@/components/dashboard/StatCard';
import { ClientIndustryChart } from '@/components/dashboard/ClientIndustryChart';
import { PipelineStageChart } from '@/components/dashboard/PipelineStageChart';
import { RecentActivityFeed } from '@/components/dashboard/RecentActivityFeed';
import { TasksOverview } from '@/components/dashboard/TasksOverview';
import { Users, TrendingUp, Target, Briefcase } from 'lucide-react';
export default function DashboardPage() {
  const clients = useClientStore((state) => state.clients);
  const fetchClients = useClientStore((state) => state.fetchClients);
  const isLoadingClients = useClientStore((state) => state.isLoading);
  const leads = useLeadStore((state) => state.leads);
  const fetchLeads = useLeadStore((state) => state.fetchLeads);
  const isLoadingLeads = useLeadStore((state) => state.isLoading);
  useEffect(() => {
    if (clients.length === 0) fetchClients();
    if (leads.length === 0) fetchLeads();
  }, [fetchClients, fetchLeads, clients.length, leads.length]);
  const dashboardStats = useMemo(() => {
    const totalClients = clients.length;
    const totalSeoClicks = clients.reduce((sum, client) => sum + client.seoStats.seoClicks, 0);
    const activeLeads = leads.filter(lead => lead.stage !== 'Won' && lead.stage !== 'Lost').length;
    const totalPipelineValue = leads.reduce((sum, lead) => sum + lead.estimatedValue, 0);
    return {
      totalClients,
      totalSeoClicks,
      activeLeads,
      totalPipelineValue,
    };
  }, [clients, leads]);
  const isLoading = isLoadingClients || isLoadingLeads;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="space-y-8 animate-fade-in">
          <h2 className="text-4xl font-bold tracking-tight">Dashboard</h2>
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