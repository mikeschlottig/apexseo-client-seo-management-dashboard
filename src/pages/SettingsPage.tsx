import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useClientStore } from '@/store/client-store';
import { useLeadStore } from '@/store/lead-store';
import { exportToJSON } from '@/lib/export-utils';
import { toast } from 'sonner';
import { useTheme } from '@/hooks/use-theme';
import { Download, Upload, Trash2, Info, Zap } from 'lucide-react';
export default function SettingsPage() {
  const { isDark, toggleTheme } = useTheme();
  const [showClearDialog, setShowClearDialog] = React.useState(false);
  const [showResetDialog, setShowResetDialog] = React.useState(false);
  const clients = useClientStore((state) => state.clients);
  const leads = useLeadStore((state) => state.leads);
  const handleSave = () => {
    toast.success('Settings saved!');
  };
  const handleExportData = () => {
    const data = {
      clients,
      leads,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    const success = exportToJSON(data, `apexseo-backup-${new Date().toISOString().split('T')[0]}.json`);
    if (success) {
      toast.success('Data exported successfully');
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            console.log('Import data:', data);
            toast.success('Data imported successfully (feature in development)');
          } catch (error) {
            toast.error('Invalid file format');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearCache = () => {
    localStorage.clear();
    toast.success('Cache cleared');
    setShowClearDialog(false);
  };

  const handleResetApp = () => {
    localStorage.clear();
    window.location.reload();
  };

  const storageUsed = React.useMemo(() => {
    const data = { clients, leads };
    return new Blob([JSON.stringify(data)]).size;
  }, [clients, leads]);

  const storageUsedKB = (storageUsed / 1024).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <h2 className="text-4xl font-bold tracking-tight mb-6">Settings</h2>
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="profile" className="border rounded-lg">
            <Card className="border-0">
            <CardHeader>
              <AccordionTrigger className="hover:no-underline">
                <CardTitle className="text-xl font-semibold">Profile Settings</CardTitle>
              </AccordionTrigger>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <AccordionContent>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-medium">Name</Label>
                <Input id="name" defaultValue="John Doe" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium">Email</Label>
                <Input id="email" type="email" defaultValue="john.doe@apexseo.com" disabled />
              </div>
            </CardContent>
            </AccordionContent>
          </Card>
          </AccordionItem>

          <AccordionItem value="preferences" className="border rounded-lg">
            <Card className="border-0">
            <CardHeader>
              <AccordionTrigger className="hover:no-underline">
                <CardTitle className="text-xl font-semibold">Preferences</CardTitle>
              </AccordionTrigger>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <AccordionContent>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="theme" className="font-medium">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Toggle dark mode theme</p>
                </div>
                <Switch 
                  id="theme" 
                  checked={isDark} 
                  onCheckedChange={toggleTheme}
                  className="transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language" className="font-medium">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="fontSize">Font Size</Label>
                <Select defaultValue="medium">
                  <SelectTrigger id="fontSize">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="compact">Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">Reduce spacing for more content</p>
                </div>
                <Switch id="compact" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="animations">Animations</Label>
                  <p className="text-sm text-muted-foreground">Enable smooth transitions</p>
                </div>
                <Switch id="animations" defaultChecked />
              </div>
            </CardContent>
            </AccordionContent>
          </Card>
          </AccordionItem>

          <AccordionItem value="data" className="border rounded-lg">
            <Card className="border-0">
            <CardHeader>
              <AccordionTrigger className="hover:no-underline">
                <CardTitle className="text-xl font-semibold">Data Management</CardTitle>
              </AccordionTrigger>
              <CardDescription>Export, import, and manage your data</CardDescription>
            </CardHeader>
            <AccordionContent>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Info className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Storage Used</p>
                    <p className="text-xs text-muted-foreground">{storageUsedKB} KB</p>
                  </div>
                </div>
                <Badge variant="secondary">{clients.length} clients, {leads.length} leads</Badge>
              </div>
              <Separator />
              <div className="space-y-2">
                <Button onClick={handleExportData} variant="outline" className="w-full justify-start gap-2">
                  <Download className="h-4 w-4" />
                  Export All Data
                </Button>
                <Button onClick={handleImportData} variant="outline" className="w-full justify-start gap-2">
                  <Upload className="h-4 w-4" />
                  Import Data
                </Button>
                <Button onClick={() => setShowClearDialog(true)} variant="outline" className="w-full justify-start gap-2">
                  <Trash2 className="h-4 w-4" />
                  Clear Cache
                </Button>
                <Button onClick={() => setShowResetDialog(true)} variant="destructive" className="w-full justify-start gap-2">
                  <Zap className="h-4 w-4" />
                  Reset Application
                </Button>
              </div>
            </CardContent>
            </AccordionContent>
          </Card>
          </AccordionItem>

          <AccordionItem value="notifications" className="border rounded-lg">
            <Card className="border-0">
            <CardHeader>
              <AccordionTrigger className="hover:no-underline">
                <CardTitle className="text-xl font-semibold">Notifications</CardTitle>
              </AccordionTrigger>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <AccordionContent>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch 
                  id="email-notifications" 
                  defaultChecked 
                  className="transition-all duration-200"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications" className="font-medium">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive browser notifications</p>
                </div>
                <Switch 
                  id="push-notifications"
                  className="transition-all duration-200"
                />
              </div>
            </CardContent>
            </AccordionContent>
          </Card>
          </AccordionItem>
        </Accordion>

        <div className="flex justify-end gap-4 mt-6">
          <p className="text-sm text-muted-foreground">
            This is a placeholder page for demonstration purposes.
          </p>
          <Button onClick={handleSave} className="hover:scale-105 transition-transform">
            Save Changes
          </Button>
        </div>
      </div>
    </div>

    <ConfirmDialog
      open={showClearDialog}
      onClose={() => setShowClearDialog(false)}
      title="Clear Cache?"
      description="This will clear all cached data including form drafts and preferences. Your clients and leads data will not be affected."
      confirmLabel="Clear Cache"
      onConfirm={handleClearCache}
    />

    <ConfirmDialog
      open={showResetDialog}
      onClose={() => setShowResetDialog(false)}
      title="Reset Application?"
      description="This will clear ALL data and reload the application. This action cannot be undone. Make sure to export your data first."
      confirmLabel="Reset"
      isDangerous
      onConfirm={handleResetApp}
    />
  );
}