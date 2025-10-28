import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useClientStore } from '@/store/client-store';
import { useLeadStore } from '@/store/lead-store';
import { useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
type Activity = {
  type: 'new_client' | 'lead_won';
  title: string;
  description: string;
  date: Date;
};
export function RecentActivityFeed() {
  const clients = useClientStore((state) => state.clients);
  const leads = useLeadStore((state) => state.leads);
  const activities = useMemo(() => {
    const clientActivities: Activity[] = clients.map(c => ({
      type: 'new_client',
      title: `New Client: ${c.company}`,
      description: `${c.contactPerson} from ${c.industry}`,
      date: new Date(c.createdAt),
    }));
    const leadActivities: Activity[] = leads
      .filter(l => l.stage === 'Won')
      .map(l => ({
        type: 'lead_won',
        title: `Deal Won: ${l.company}`,
        description: `Value: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(l.estimatedValue)}`,
        date: new Date(l.createdAt), // Using createdAt for demo, a 'wonAt' date would be better
      }));
    return [...clientActivities, ...leadActivities]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
  }, [clients, leads]);
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-4">
              <Avatar>
                <AvatarFallback>
                  {activity.type === 'new_client' ? 'NC' : 'LW'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium leading-none">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(activity.date, { addSuffix: true })}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}