import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useTheme } from '@/hooks/use-theme';
export default function SettingsPage() {
  const { isDark, toggleTheme } = useTheme();
  const handleSave = () => {
    toast.success('Settings saved!');
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <h2 className="text-4xl font-bold tracking-tight mb-6">Settings</h2>
        <div className="space-y-8">
          <Card className="hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Profile Settings</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
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
          </Card>
          <Card className="hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Preferences</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
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
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Notifications</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
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
          </Card>
          <div className="flex justify-end">
            <Button onClick={handleSave} className="hover:scale-105 transition-transform">
              Save Changes
            </Button>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            This is a placeholder page for demonstration purposes.
          </p>
        </div>
      </div>
    </div>
  );
}