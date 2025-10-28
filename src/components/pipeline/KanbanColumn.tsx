import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { Lead, PipelineStage } from '@shared/types';
import { LeadCard } from './LeadCard';
import { cn } from '@/lib/utils';
interface KanbanColumnProps {
  stage: PipelineStage;
  leads: Lead[];
}
export function KanbanColumn({ stage, leads }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
  });
  const totalValue = leads.reduce((sum, lead) => sum + lead.estimatedValue, 0);
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col p-3 bg-muted/60 rounded-lg h-full transition-colors duration-200",
        isOver && "bg-primary/10"
      )}
    >
      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="font-semibold text-md">{stage}</h3>
        <span className="text-sm font-medium text-muted-foreground bg-background px-2 py-0.5 rounded-full">
          {leads.length}
        </span>
      </div>
      <div className="flex flex-col gap-3 overflow-y-auto min-h-[200px]">
        <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </SortableContext>
      </div>
       <div className="mt-4 pt-2 border-t text-right">
        <p className="text-sm text-muted-foreground">Total Value</p>
        <p className="font-bold text-lg">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalValue)}
        </p>
      </div>
    </div>
  );
}