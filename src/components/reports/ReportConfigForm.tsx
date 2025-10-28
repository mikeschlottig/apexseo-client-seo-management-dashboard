import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Key,
  CheckSquare,
  Users,
  BarChart,
  Award,
  Building,
  TrendingUp,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import { ReportType, ReportConfig } from '@shared/types';
import { cn } from '@/lib/utils';
interface ReportConfigFormProps {
  reportType: ReportType;
  availableClients: { id: string; name: string }[];
  availableLeads: { id: string; name: string }[];
  onConfigChange: (config: ReportConfig) => void;
}
const seoAuditSections = [
  { id: 'keywords', label: 'Keywords Analysis', icon: Key, description: 'Indexed keywords and rankings' },
  { id: 'tasks', label: 'Strategic Tasks', icon: CheckSquare, description: 'Task completion status' },
  { id: 'competitors', label: 'Competitor Analysis', icon: Users, description: 'Competitive landscape' },
  { id: 'charts', label: 'Performance Charts', icon: BarChart, description: 'Visual metrics and trends' },
  { id: 'quality', label: 'Quality Rating', icon: Award, description: 'Website quality score' },
];
const proposalSections = [
  { id: 'clientInfo', label: 'Client Information', icon: Building, description: 'Company details and contact' },
  { id: 'metrics', label: 'Key Metrics', icon: TrendingUp, description: 'Performance indicators' },
  { id: 'pipelineValue', label: 'Pipeline Value', icon: DollarSign, description: 'Deal value and forecast' },
  { id: 'nextSteps', label: 'Next Steps', icon: ArrowRight, description: 'Action items and timeline' },
];
const configSchema = z.object({
  clientIds: z.array(z.string()).min(1, 'Select at least one client'),
  leadIds: z.array(z.string()).optional(),
  sections: z.array(z.string()).min(1, 'Select at least one section'),
});
type ConfigFormData = z.infer<typeof configSchema>;
export function ReportConfigForm({
  reportType,
  availableClients,
  availableLeads,
  onConfigChange,
}: ReportConfigFormProps) {
  const [selectedClients, setSelectedClients] = React.useState<string[]>([]);
  const [selectedLeads, setSelectedLeads] = React.useState<string[]>([]);
  const [selectedSections, setSelectedSections] = React.useState<string[]>([]);
  const sections = reportType === 'seo-audit' ? seoAuditSections : proposalSections;
  const {
    formState: { errors },
    trigger,
  } = useForm<ConfigFormData>({
    resolver: zodResolver(configSchema),
    mode: 'onChange',
  });
  React.useEffect(() => {
    const config: ReportConfig = {
      type: reportType,
      clientIds: selectedClients,
      leadIds: reportType === 'proposal' ? selectedLeads : undefined,
      sections: selectedSections,
    };
    onConfigChange(config);
    trigger();
  }, [selectedClients, selectedLeads, selectedSections, reportType, onConfigChange, trigger]);
  const handleClientToggle = (clientId: string) => {
    setSelectedClients((prev) =>
      prev.includes(clientId) ? prev.filter((id) => id !== clientId) : [...prev, clientId]
    );
  };
  const handleLeadToggle = (leadId: string) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]
    );
  };
  const handleSectionToggle = (sectionId: string) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  };
  return (
    <div className="space-y-6">
      <Card className="hover:shadow-md transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            Select Clients
            {selectedClients.length > 0 && (
              <Badge variant="secondary">{selectedClients.length} selected</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48 pr-4">
            <div className="space-y-2">
              {availableClients.map((client, index) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'flex items-center space-x-3 p-3 rounded-md hover:bg-muted/50 transition-colors cursor-pointer',
                    selectedClients.includes(client.id) && 'bg-primary/5 border border-primary/20'
                  )}
                  onClick={() => handleClientToggle(client.id)}
                >
                  <Checkbox
                    id={`client-${client.id}`}
                    checked={selectedClients.includes(client.id)}
                    onCheckedChange={() => handleClientToggle(client.id)}
                  />
                  <Label htmlFor={`client-${client.id}`} className="flex-1 cursor-pointer">
                    {client.name}
                  </Label>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
          {errors.clientIds && (
            <p className="text-sm text-destructive mt-2">{errors.clientIds.message}</p>
          )}
        </CardContent>
      </Card>
      {reportType === 'proposal' && (
        <Card className="hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Select Leads
              {selectedLeads.length > 0 && (
                <Badge variant="secondary">{selectedLeads.length} selected</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48 pr-4">
              <div className="space-y-2">
                {availableLeads.map((lead, index) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'flex items-center space-x-3 p-3 rounded-md hover:bg-muted/50 transition-colors cursor-pointer',
                      selectedLeads.includes(lead.id) && 'bg-primary/5 border border-primary/20'
                    )}
                    onClick={() => handleLeadToggle(lead.id)}
                  >
                    <Checkbox
                      id={`lead-${lead.id}`}
                      checked={selectedLeads.includes(lead.id)}
                      onCheckedChange={() => handleLeadToggle(lead.id)}
                    />
                    <Label htmlFor={`lead-${lead.id}`} className="flex-1 cursor-pointer">
                      {lead.name}
                    </Label>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
      <Card className="hover:shadow-md transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            Report Sections
            {selectedSections.length > 0 && (
              <Badge variant="secondary">{selectedSections.length} selected</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    'flex items-start space-x-3 p-4 rounded-lg border-2 hover:border-primary/50 transition-all cursor-pointer',
                    selectedSections.includes(section.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-background'
                  )}
                  onClick={() => handleSectionToggle(section.id)}
                >
                  <Checkbox
                    id={`section-${section.id}`}
                    checked={selectedSections.includes(section.id)}
                    onCheckedChange={() => handleSectionToggle(section.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-4 w-4 text-primary" />
                      <Label htmlFor={`section-${section.id}`} className="font-semibold cursor-pointer">
                        {section.label}
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          {errors.sections && (
            <p className="text-sm text-destructive mt-2">{errors.sections.message}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}