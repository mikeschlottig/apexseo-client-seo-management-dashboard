import { useMemo, useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { createPortal } from 'react-dom';
import { KanbanColumn } from './KanbanColumn';
import { LeadCard } from './LeadCard';
import { useLeadStore } from '@/store/lead-store';
import { Lead, PIPELINE_STAGES, PipelineStage } from '@shared/types';
export function KanbanBoard() {
  const leads = useLeadStore((state) => state.leads);
  const updateLeadStage = useLeadStore((state) => state.updateLeadStage);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const leadsByStage = useMemo(() => {
    const grouped: Record<PipelineStage, Lead[]> = {
      'Lead In': [],
      'Contact Made': [],
      'Proposal Sent': [],
      'Negotiation': [],
      'Won': [],
      'Lost': [],
    };
    leads.forEach((lead) => {
      grouped[lead.stage].push(lead);
    });
    return grouped;
  }, [leads]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const lead = leads.find(l => l.id === active.id);
    if (lead) {
      setActiveLead(lead);
    }
  };
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveLead(null);
    const { active, over } = event;
    if (!over) {
      return;
    }
    const leadId = active.id as string;
    const newStage = over.data.current?.type === 'COLUMN'
      ? over.id as PipelineStage
      : over.data.current?.stage as PipelineStage;
    const currentLead = leads.find(l => l.id === leadId);
    if (currentLead && newStage && currentLead.stage !== newStage) {
      updateLeadStage(leadId, newStage);
    }
  };
  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 items-start">
        {PIPELINE_STAGES.map((stage) => (
          <KanbanColumn key={stage} stage={stage} leads={leadsByStage[stage]} />
        ))}
      </div>
      {createPortal(
        <DragOverlay>
          {activeLead ? <LeadCard lead={activeLead} isDragging /> : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}