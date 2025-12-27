import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Loader2 } from 'lucide-react';
import { Client } from '@shared/types';
const clientSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  contactPerson: z.string().min(1, 'Contact person is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  website: z.string().url('Invalid URL'),
  industry: z.string().min(1, 'Industry is required'),
  indexedKeywords: z.number().min(0, 'Must be 0 or greater'),
  seoClicks: z.number().min(0, 'Must be 0 or greater'),
  websiteQualityRating: z.number().min(0).max(100),
});
type ClientFormData = z.infer<typeof clientSchema>;
interface ClientFormModalProps {
  open: boolean;
  onClose: () => void;
  client?: Client | null;
  onSubmit: (data: ClientFormData) => Promise<void>;
}
export function ClientFormModal({ open, onClose, client, onSubmit }: ClientFormModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: client
      ? {
          company: client.company,
          contactPerson: client.contactPerson,
          email: client.email,
          phone: client.phone,
          website: client.website,
          industry: client.industry,
          indexedKeywords: client.seoStats.indexedKeywords,
          seoClicks: client.seoStats.seoClicks,
          websiteQualityRating: client.seoStats.websiteQualityRating,
        }
      : {
          company: '',
          contactPerson: '',
          email: '',
          phone: '',
          website: '',
          industry: '',
          indexedKeywords: 0,
          seoClicks: 0,
          websiteQualityRating: 50,
        },
  });
  const websiteQualityRating = watch('websiteQualityRating');
  React.useEffect(() => {
    if (open && client) {
      reset({
        company: client.company,
        contactPerson: client.contactPerson,
        email: client.email,
        phone: client.phone,
        website: client.website,
        industry: client.industry,
        indexedKeywords: client.seoStats.indexedKeywords,
        seoClicks: client.seoStats.seoClicks,
        websiteQualityRating: client.seoStats.websiteQualityRating,
      });
    } else if (open && !client) {
      reset({
        company: '',
        contactPerson: '',
        email: '',
        phone: '',
        website: '',
        industry: '',
        indexedKeywords: 0,
        seoClicks: 0,
        websiteQualityRating: 50,
      });
    }
  }, [open, client, reset]);
  const handleFormSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{client ? 'Edit Client' : 'Add New Client'}</DialogTitle>
          <DialogDescription>
            {client ? 'Update client information and SEO metrics.' : 'Enter client information and initial SEO metrics.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  {...register('company')}
                  placeholder="Acme Corp"
                />
                {errors.company && (
                  <p className="text-sm text-destructive">{errors.company.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Input
                  id="industry"
                  {...register('industry')}
                  placeholder="Technology"
                />
                {errors.industry && (
                  <p className="text-sm text-destructive">{errors.industry.message}</p>
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="website">Website *</Label>
                <Input
                  id="website"
                  {...register('website')}
                  placeholder="https://example.com"
                />
                {errors.website && (
                  <p className="text-sm text-destructive">{errors.website.message}</p>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input
                  id="contactPerson"
                  {...register('contactPerson')}
                  placeholder="John Doe"
                />
                {errors.contactPerson && (
                  <p className="text-sm text-destructive">{errors.contactPerson.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="123-456-7890"
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">SEO Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="indexedKeywords">Indexed Keywords</Label>
                <Input
                  id="indexedKeywords"
                  type="number"
                  {...register('indexedKeywords', { valueAsNumber: true })}
                  placeholder="0"
                />
                {errors.indexedKeywords && (
                  <p className="text-sm text-destructive">{errors.indexedKeywords.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoClicks">Monthly SEO Clicks</Label>
                <Input
                  id="seoClicks"
                  type="number"
                  {...register('seoClicks', { valueAsNumber: true })}
                  placeholder="0"
                />
                {errors.seoClicks && (
                  <p className="text-sm text-destructive">{errors.seoClicks.message}</p>
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="websiteQualityRating">
                  Website Quality Rating: {websiteQualityRating}/100
                </Label>
                <Slider
                  id="websiteQualityRating"
                  min={0}
                  max={100}
                  step={1}
                  value={[websiteQualityRating]}
                  onValueChange={(value) => setValue('websiteQualityRating', value[0])}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {client ? 'Update Client' : 'Create Client'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}