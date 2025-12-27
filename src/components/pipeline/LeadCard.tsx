import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Lead } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
interface LeadCardProps {
  lead: Lead;
  isDragging?: boolean;
}
export function LeadCard({ lead, isDragging }: LeadCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({
    id: lead.id,
    data: {
      type: 'Lead',
      lead,
      stage: lead.stage,
    },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const initials = lead.contactPerson.split(' ').map(n => n[0]).join('');
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        className={cn(
          "hover:shadow-lg hover:scale-102 transition-all duration-300 relative group border hover:border-primary/30",
          (isSortableDragging || isDragging) && "shadow-xl ring-2 ring-primary opacity-60"
        )}
      >
        <button 
          {...listeners} 
          className="absolute top-2 right-2 p-1 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5" />
        </button>
        <CardHeader className="p-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <CardTitle className="text-base font-semibold pr-6 truncate">{lead.company}</CardTitle>
              </TooltipTrigger>
              {lead.company.length > 20 && (
                <TooltipContent>
                  <p>{lead.company}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-sm text-muted-foreground space-y-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 bg-gradient-to-br from-primary/20 to-chart-2/20">
              <AvatarFallback className="bg-transparent text-primary font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{lead.contactPerson}</p>
              <p className="text-lg font-bold text-primary">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(lead.estimatedValue)}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {lead.source}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}