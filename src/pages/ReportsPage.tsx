import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileDown, Terminal } from 'lucide-react';
import { ReportConfigForm } from '@/components/reports/ReportConfigForm';
import { ReportPreview } from '@/components/reports/ReportPreview';
import { usePDFExport } from '@/components/reports/PDFExporter';
import { useReportData } from '@/hooks/use-report-data';
import { ReportType, ReportConfig, ReportData } from '@shared/types';
import { toast } from 'sonner';
export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportType>('seo-audit');
  const [currentConfig, setCurrentConfig] = useState<ReportConfig>({
    type: 'seo-audit',
    clientIds: [],
    sections: [],
  });
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const { generatePDF, isExporting } = usePDFExport();
  const { availableClients, availableLeads, isLoadingConfig, generateReportData } = useReportData();
  const handleTabChange = (value: string) => {
    const newType = value as ReportType;
    setActiveTab(newType);
    setCurrentConfig({
      type: newType,
      clientIds: [],
      leadIds: [],
      sections: [],
    });
    setReportData(null);
  };
  const handleConfigChange = async (config: ReportConfig) => {
    setCurrentConfig(config);
    // Auto-generate preview if valid config
    if (
      config.clientIds &&
      config.clientIds.length > 0 &&
      config.sections.length > 0
    ) {
      setIsLoadingData(true);
      try {
        const data = await generateReportData(config);
        setReportData(data);
      } catch (error) {
        console.error('[REPORT DATA ERROR]', error);
        setReportData(null);
      } finally {
        setIsLoadingData(false);
      }
    } else {
      setReportData(null);
    }
  };
  const handleGeneratePDF = async () => {
    if (!previewRef.current || !reportData) {
      toast.error('No report preview available to export');
      return;
    }
    const fileName = `ApexSEO-${activeTab}-${new Date().toISOString().split('T')[0]}.pdf`;
    await generatePDF(previewRef.current, activeTab, fileName);
  };
  const canGeneratePDF =
    reportData &&
    currentConfig.clientIds &&
    currentConfig.clientIds.length > 0 &&
    currentConfig.sections.length > 0;
  if (isLoadingConfig) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <Skeleton className="h-12 w-48 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <div className="lg:col-span-3">
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="space-y-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-bold tracking-tight">Reports</h2>
            <Button
              onClick={handleGeneratePDF}
              disabled={!canGeneratePDF || isExporting}
              className="hover:scale-105 transition-transform"
            >
              {isExporting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="mr-2"
                  >
                    <FileDown className="h-4 w-4" />
                  </motion.div>
                  Generating...
                </>
              ) : (
                <>
                  <FileDown className="mr-2 h-4 w-4" />
                  Generate PDF
                </>
              )}
            </Button>
          </div>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="seo-audit" className="transition-all">
                SEO Audit Report
              </TabsTrigger>
              <TabsTrigger value="proposal" className="transition-all">
                Proposal Report
              </TabsTrigger>
            </TabsList>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="seo-audit" className="mt-8">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                      <Card className="p-6 bg-gradient-to-br from-primary/5 to-chart-2/5">
                        <h3 className="text-lg font-semibold mb-4">Report Configuration</h3>
                        <ReportConfigForm
                          reportType="seo-audit"
                          availableClients={availableClients}
                          availableLeads={availableLeads}
                          onConfigChange={handleConfigChange}
                        />
                      </Card>
                    </div>
                    <div className="lg:col-span-3">
                      <Card className="p-6 min-h-[600px]">
                        <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
                        <ReportPreview
                          ref={previewRef}
                          reportType="seo-audit"
                          config={currentConfig}
                          reportData={reportData}
                          isLoading={isLoadingData}
                        />
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="proposal" className="mt-8">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                      <Card className="p-6 bg-gradient-to-br from-primary/5 to-chart-2/5">
                        <h3 className="text-lg font-semibold mb-4">Report Configuration</h3>
                        <ReportConfigForm
                          reportType="proposal"
                          availableClients={availableClients}
                          availableLeads={availableLeads}
                          onConfigChange={handleConfigChange}
                        />
                      </Card>
                    </div>
                    <div className="lg:col-span-3">
                      <Card className="p-6 min-h-[600px]">
                        <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
                        <ReportPreview
                          ref={previewRef}
                          reportType="proposal"
                          config={currentConfig}
                          reportData={reportData}
                          isLoading={isLoadingData}
                        />
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
          {!canGeneratePDF && (
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Configuration Required</AlertTitle>
              <AlertDescription>
                Select at least one client and one report section to generate a preview and export PDF.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}