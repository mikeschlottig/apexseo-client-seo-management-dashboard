import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Search } from 'lucide-react';
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
  const activeFilterCount = [filters.stage, filters.source, filters.searchTerm].filter(Boolean).length;
  const hasActiveFilters = activeFilterCount > 0;
  return (
    <div className="flex flex-wrap items-end gap-4 p-4 border-l-4 border-primary/20">
      <div className="flex-1 min-w-[200px] space-y-2">
        <Label htmlFor="search" className="font-medium">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-transform focus-within:scale-110" />
          <Input
            id="search"
            placeholder="Search company or contact..."
            value={filters.searchTerm}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>
      </div>
      <div className="min-w-[180px] space-y-2">
        <Label htmlFor="stage" className="font-medium">Stage</Label>
        <Select value={filters.stage || 'all'} onValueChange={handleStageChange}>
          <SelectTrigger id="stage" className="hover:border-primary/50 transition-colors">
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
        <Label htmlFor="source" className="font-medium">Source</Label>
        <Select value={filters.source || 'all'} onValueChange={handleSourceChange}>
          <SelectTrigger id="source" className="hover:border-primary/50 transition-colors">
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
        <Button 
          variant="outline" 
          onClick={handleClearFilters} 
          className="gap-2 hover:scale-105 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all"
        >
          <X className="h-4 w-4" />
          Clear Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      )}
    </div>
  );
}