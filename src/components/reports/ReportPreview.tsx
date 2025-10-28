import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ReportType, ReportConfig, ReportData } from '@shared/types';
import { FileText, TrendingUp, Users, Target } from 'lucide-react';
import { formatDate } from '@/lib/pdf-utils';
interface ReportPreviewProps {
  reportType: ReportType;
  config: ReportConfig;
  reportData: ReportData | null;
  isLoading: boolean;
}
const COLORS = ['#1E40AF', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
export const ReportPreview = React.forwardRef<HTMLDivElement, ReportPreviewProps>(
  ({ reportType, config, reportData, isLoading }, ref) => {
    if (isLoading) {
      return (
        <div ref={ref} className="space-y-6 p-6 bg-white rounded-lg">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      );
    }
    if (!reportData || config.sections.length === 0) {
      return (
        <div ref={ref} className="flex flex-col items-center justify-center h-full p-12 bg-gradient-to-br from-muted/30 to-muted/50 rounded-lg">
          <FileText className="h-24 w-24 text-muted-foreground/40 mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Preview Available</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Select clients/leads and report sections to see a live preview of your report.
          </p>
        </div>
      );
    }
    const { clients, leads, aggregateMetrics } = reportData;
    return (
      <div ref={ref} className="space-y-8 p-8 bg-white rounded-lg" id="report-preview">
        {/* Report Header */}
        <div className="border-b-4 border-primary pb-6">
          <h1 className="text-4xl font-bold text-primary mb-2">
            {reportType === 'seo-audit' ? 'SEO Audit Report' : 'Proposal Report'}
          </h1>
          <p className="text-muted-foreground">
            Generated on {formatDate(reportData.generatedAt)}
          </p>
        </div>
        {/* SEO Audit Sections */}
        {reportType === 'seo-audit' && (
          <>
            {config.sections.includes('keywords') && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Keywords Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-primary">{aggregateMetrics.totalKeywords}</p>
                    <p className="text-sm text-muted-foreground">Total Indexed Keywords</p>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Keywords</TableHead>
                        <TableHead>SEO Clicks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">{client.company}</TableCell>
                          <TableCell>{client.seoStats.indexedKeywords.toLocaleString()}</TableCell>
                          <TableCell>{client.seoStats.seoClicks.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
            {config.sections.includes('tasks') && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Strategic Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {clients.map((client) => (
                    <div key={client.id} className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold mb-2">{client.company}</h4>
                      <div className="space-y-2">
                        {client.seoStats.strategicTasks.map((task) => (
                          <div key={task.id} className="flex items-center gap-2">
                            <div
                              className={`h-4 w-4 rounded border-2 ${
                                task.completed ? 'bg-green-500 border-green-500' : 'border-muted-foreground'
                              }`}
                            />
                            <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                              {task.task}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            {config.sections.includes('competitors') && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Competitor Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {clients.map((client) => (
                    <div key={client.id}>
                      <h4 className="font-semibold mb-2">{client.company}</h4>
                      <div className="flex flex-wrap gap-2">
                        {client.seoStats.competitors.map((competitor) => (
                          <Badge key={competitor} variant="outline">
                            {competitor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            {config.sections.includes('charts') && (
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart data={clients.map((c) => ({ name: c.company, clicks: c.seoStats.seoClicks }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="clicks" fill="#1E40AF" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
            {config.sections.includes('quality') && (
              <Card>
                <CardHeader>
                  <CardTitle>Website Quality Ratings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {clients.map((client) => (
                    <div key={client.id}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{client.company}</span>
                        <span className="font-bold text-primary">{client.seoStats.websiteQualityRating}/100</span>
                      </div>
                      <Progress value={client.seoStats.websiteQualityRating} className="h-3" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </>
        )}
        {/* Proposal Sections */}
        {reportType === 'proposal' && (
          <>
            {config.sections.includes('clientInfo') && (
              <Card>
                <CardHeader>
                  <CardTitle>Client Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {clients.map((client) => (
                    <div key={client.id} className="border-l-4 border-primary pl-4">
                      <h4 className="text-lg font-semibold">{client.company}</h4>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Contact:</span> {client.contactPerson}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Industry:</span> {client.industry}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Email:</span> {client.email}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Phone:</span> {client.phone}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            {config.sections.includes('metrics') && (
              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <p className="text-3xl font-bold text-primary">{aggregateMetrics.totalKeywords}</p>
                      <p className="text-sm text-muted-foreground">Total Keywords</p>
                    </div>
                    <div className="text-center p-4 bg-chart-2/10 rounded-lg">
                      <p className="text-3xl font-bold text-chart-2">{aggregateMetrics.totalClicks.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Monthly Clicks</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {config.sections.includes('pipelineValue') && (
              <Card>
                <CardHeader>
                  <CardTitle>Pipeline Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-3xl font-bold text-primary">
                      ${aggregateMetrics.totalPipelineValue.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Estimated Value</p>
                  </div>
                  {leads.length > 0 && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Company</TableHead>
                          <TableHead>Stage</TableHead>
                          <TableHead>Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leads.map((lead) => (
                          <TableRow key={lead.id}>
                            <TableCell className="font-medium">{lead.company}</TableCell>
                            <TableCell>
                              <Badge>{lead.stage}</Badge>
                            </TableCell>
                            <TableCell>${lead.estimatedValue.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            )}
            {config.sections.includes('nextSteps') && (
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-2">
                    <li className="text-sm">Review and approve the proposed SEO strategy</li>
                    <li className="text-sm">Schedule kickoff meeting with the ApexSEO team</li>
                    <li className="text-sm">Provide access to analytics and webmaster tools</li>
                    <li className="text-sm">Begin initial audit and baseline measurement</li>
                    <li className="text-sm">Implement priority optimizations in first 30 days</li>
                  </ol>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    );
  }
);
ReportPreview.displayName = 'ReportPreview';