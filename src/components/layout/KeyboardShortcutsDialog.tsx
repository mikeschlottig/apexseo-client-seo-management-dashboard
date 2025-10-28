import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, Navigation, Zap, Settings as SettingsIcon } from 'lucide-react';
interface KeyboardShortcutsDialogProps {
  open: boolean;
  onClose: () => void;
}
const shortcuts = [
  {
    category: 'Navigation',
    icon: Navigation,
    items: [
      { keys: ['D'], description: 'Go to Dashboard' },
      { keys: ['C'], description: 'Go to Clients' },
      { keys: ['P'], description: 'Go to Pipeline' },
      { keys: ['R'], description: 'Go to Reports' },
      { keys: ['S'], description: 'Go to Settings' },
    ],
  },
  {
    category: 'Actions',
    icon: Zap,
    items: [
      { keys: ['/'], description: 'Focus Search' },
      { keys: ['N'], description: 'New Client' },
      { keys: ['E'], description: 'Export Data' },
      { keys: ['R'], description: 'Refresh Page' },
      { keys: ['G'], description: 'Generate Report' },
    ],
  },
  {
    category: 'General',
    icon: SettingsIcon,
    items: [
      { keys: ['?'], description: 'Show Keyboard Shortcuts' },
      { keys: ['Esc'], description: 'Close Dialog' },
      { keys: ['B'], description: 'Toggle Sidebar' },
    ],
  },
];
export function KeyboardShortcutsDialog({ open, onClose }: KeyboardShortcutsDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredShortcuts = shortcuts.map(category => ({
    ...category,
    items: category.items.filter(
      item =>
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.keys.some(key => key.toLowerCase().includes(searchTerm.toLowerCase()))
    ),
  })).filter(category => category.items.length > 0);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Use these shortcuts to navigate and perform actions quickly
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search shortcuts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          {filteredShortcuts.map((category, idx) => {
            const Icon = category.icon;
            return (
              <div key={category.category}>
                {idx > 0 && <Separator className="my-4" />}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">{category.category}</h3>
                  </div>
                  <div className="space-y-2">
                    {category.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
                      >
                        <span className="text-sm">{item.description}</span>
                        <div className="flex gap-1">
                          {item.keys.map((key, keyIdx) => (
                            <Badge
                              key={keyIdx}
                              variant="outline"
                              className="font-mono text-xs px-2 py-1"
                            >
                              {key}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}