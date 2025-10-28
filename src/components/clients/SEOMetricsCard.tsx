import { SEOStats } from "@shared/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Target, CheckCircle, TrendingUp, Key, Users, ListChecks } from "lucide-react";
interface SEOMetricsCardProps {
  seoStats: SEOStats;
}
const StatDisplay = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) => (
    <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg text-center">
        <Icon className="h-6 w-6 text-primary mb-2" />
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{typeof value === 'number' ? new Intl.NumberFormat().format(value) : value}</p>
    </div>
);
export function SEOMetricsCard({ seoStats }: SEOMetricsCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>SEO Metrics & Strategy</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatDisplay icon={Key} label="Indexed Keywords" value={seoStats.indexedKeywords} />
            <StatDisplay icon={TrendingUp} label="Monthly SEO Clicks" value={seoStats.seoClicks} />
            <StatDisplay icon={CheckCircle} label="Quality Score" value={`${seoStats.websiteQualityRating}/100`} />
        </div>
        <div className="space-y-2">
            <h4 className="font-semibold flex items-center"><ListChecks className="mr-2 h-4 w-4 text-primary"/>Strategic Tasks</h4>
            {seoStats.strategicTasks.map(task => (
                <div key={task.id} className="flex items-center space-x-2">
                    <Checkbox id={task.id} checked={task.completed} disabled />
                    <label htmlFor={task.id} className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.task}
                    </label>
                </div>
            ))}
        </div>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <h4 className="font-semibold flex items-center"><Users className="mr-2 h-4 w-4 text-primary"/>Competitors</h4>
                <div className="flex flex-wrap gap-2">
                    {seoStats.competitors.map(c => <Badge key={c} variant="outline">{c}</Badge>)}
                </div>
            </div>
            <div className="space-y-2">
                <h4 className="font-semibold flex items-center"><Target className="mr-2 h-4 w-4 text-primary"/>Keyword Targets</h4>
                <div className="flex flex-wrap gap-2">
                    {seoStats.lowKeywordDifficultyTargets.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}