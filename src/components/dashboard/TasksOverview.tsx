import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useClientStore } from '@/store/client-store';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
export function TasksOverview() {
  const clients = useClientStore((state) => state.clients);
  const incompleteTasks = useMemo(() => {
    return clients
      .flatMap(client =>
        client.seoStats.strategicTasks
          .filter(task => !task.completed)
          .map(task => ({ ...task, clientCompany: client.company, clientId: client.id }))
      )
      .slice(0, 5); // Show top 5
  }, [clients]);
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Strategic Tasks Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {incompleteTasks.length > 0 ? (
          <div className="space-y-3">
            {incompleteTasks.map(task => (
              <div key={`${task.clientId}-${task.id}`} className="flex items-start space-x-3">
                <Checkbox
                  id={`task-overview-${task.clientId}-${task.id}`}
                  className="mt-1"
                  disabled
                />
                <div>
                  <label htmlFor={`task-overview-${task.clientId}-${task.id}`} className="text-sm font-medium leading-none">
                    {task.task}
                  </label>
                  <p className="text-xs text-muted-foreground">
                    For: <Link to={`/clients/${task.clientId}`} className="hover:underline text-primary">{task.clientCompany}</Link>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">All tasks completed! 🎉</p>
        )}
      </CardContent>
    </Card>
  );
}