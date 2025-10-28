import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Lead } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
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
          "hover:shadow-md transition-shadow duration-200 relative group",
          (isSortableDragging || isDragging) && "shadow-xl ring-2 ring-primary opacity-80"
        )}
      >
        <button {...listeners} className="absolute top-2 right-2 p-1 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors cursor-grab active:cursor-grabbing">
          <GripVertical className="h-5 w-5" />
        </button>
        <CardHeader className="p-4">
          <CardTitle className="text-base font-semibold pr-6">{lead.company}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{lead.contactPerson}</p>
              <p>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(lead.estimatedValue)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}