import { SEOStats } from "@shared/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Target, CheckCircle, TrendingUp, Key, Users, ListChecks } from "lucide-react";
import { motion } from "framer-motion";
interface SEOMetricsCardProps {
  seoStats: SEOStats;
}
const StatDisplay = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg text-center hover:shadow-md transition-all duration-300"
  >
    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <p className="text-sm text-muted-foreground font-medium">{label}</p>
    <p className="text-2xl font-bold">{typeof value === 'number' ? new Intl.NumberFormat().format(value) : value}</p>
  </motion.div>
);
export function SEOMetricsCard({ seoStats }: SEOMetricsCardProps) {
  return (
    <Card className="hover:shadow-lg hover:border-primary/20 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">SEO Metrics & Strategy</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatDisplay icon={Key} label="Indexed Keywords" value={seoStats.indexedKeywords} />
          <StatDisplay icon={TrendingUp} label="Monthly SEO Clicks" value={seoStats.seoClicks} />
          <StatDisplay icon={CheckCircle} label="Quality Score" value={`${seoStats.websiteQualityRating}/100`} />
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center text-lg">
            <ListChecks className="mr-2 h-5 w-5 text-primary"/>
            Strategic Tasks
          </h4>
          {seoStats.strategicTasks.map((task, index) => (
            <motion.div 
              key={task.id} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              <Checkbox id={task.id} checked={task.completed} disabled />
              <label htmlFor={task.id} className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'font-medium'}`}>
                {task.task}
              </label>
            </motion.div>
          ))}
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center text-lg">
              <Users className="mr-2 h-5 w-5 text-primary"/>
              Competitors
            </h4>
            <div className="flex flex-wrap gap-2">
              {seoStats.competitors.map(c => (
                <Badge key={c} variant="outline" className="hover:shadow-sm transition-shadow">
                  {c}
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center text-lg">
              <Target className="mr-2 h-5 w-5 text-primary"/>
              Keyword Targets
            </h4>
            <div className="flex flex-wrap gap-2">
              {seoStats.lowKeywordDifficultyTargets.map(t => (
                <Badge key={t} variant="secondary" className="hover:shadow-sm transition-shadow">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Website Quality Rating</span>
            <span className="font-bold text-primary">{seoStats.websiteQualityRating}/100</span>
          </div>
          <Progress 
            value={seoStats.websiteQualityRating} 
            className="h-3 transition-all duration-500"
          />
        </div>
      </CardContent>
    </Card>
  );
}