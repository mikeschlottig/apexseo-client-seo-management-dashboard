import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { PIPELINE_STAGES } from '@shared/types';
interface PipelineFiltersProps {
  filters: {
    stage: string | null;
    source: string | null;
    searchTerm: string;
  };
  sources: string[];
  onChange: (filters: { stage: string | null; source: string | null; searchTerm: string }) => void;
}
export function PipelineFilters({ filters, sources, onChange }: PipelineFiltersProps) {
  const handleStageChange = (value: string) => {
    onChange({ ...filters, stage: value === 'all' ? null : value });
  };
  const handleSourceChange = (value: string) => {
    onChange({ ...filters, source: value === 'all' ? null : value });
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, searchTerm: e.target.value });
  };
  const handleClearFilters = () => {
    onChange({ stage: null, source: null, searchTerm: '' });
  };
  const hasActiveFilters = filters.stage || filters.source || filters.searchTerm;
  return (
    <div className="flex flex-wrap items-end gap-4 p-4 bg-muted/50 rounded-lg">
      <div className="flex-1 min-w-[200px] space-y-2">
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          placeholder="Search company or contact..."
          value={filters.searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="min-w-[180px] space-y-2">
        <Label htmlFor="stage">Stage</Label>
        <Select value={filters.stage || 'all'} onValueChange={handleStageChange}>
          <SelectTrigger id="stage">
            <SelectValue placeholder="All Stages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {PIPELINE_STAGES.map((stage) => (
              <SelectItem key={stage} value={stage}>
                {stage}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[180px] space-y-2">
        <Label htmlFor="source">Source</Label>
        <Select value={filters.source || 'all'} onValueChange={handleSourceChange}>
          <SelectTrigger id="source">
            <SelectValue placeholder="All Sources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {sources.map((source) => (
              <SelectItem key={source} value={source}>
                {source}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {hasActiveFilters && (
        <Button variant="outline" onClick={handleClearFilters} className="gap-2">
          <X className="h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}