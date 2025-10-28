import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { ReportConfig, ReportData } from '@shared/types';
import { toast } from 'sonner';
interface ReportConfigOption {
  id: string;
  name: string;
}
interface ReportConfigOptions {
  clients: ReportConfigOption[];
  leads: ReportConfigOption[];
}
export function useReportData() {
  const [availableClients, setAvailableClients] = useState<ReportConfigOption[]>([]);
  const [availableLeads, setAvailableLeads] = useState<ReportConfigOption[]>([]);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoadingConfig(true);
      try {
        const config = await api<ReportConfigOptions>('/api/reports/config');
        setAvailableClients(config.clients);
        setAvailableLeads(config.leads);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load report configuration';
        toast.error(errorMessage);
        console.error('[REPORT CONFIG ERROR]', error);
      } finally {
        setIsLoadingConfig(false);
      }
    };
    fetchConfig();
  }, []);
  const generateReportData = async (config: ReportConfig): Promise<ReportData> => {
    setIsGenerating(true);
    try {
      const reportData = await api<ReportData>('/api/reports/data', {
        method: 'POST',
        body: JSON.stringify(config),
      });
      return reportData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate report data';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };
  return {
    availableClients,
    availableLeads,
    isLoadingConfig,
    generateReportData,
    isGenerating,
  };
}