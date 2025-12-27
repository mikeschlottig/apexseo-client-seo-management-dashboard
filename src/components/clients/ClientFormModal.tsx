import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Loader2, Check } from 'lucide-react';
import { Client } from '@shared/types';
import { cn } from '@/lib/utils';
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
  const [showSuccess, setShowSuccess] = React.useState(false);
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
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const getSliderColor = (value: number) => {
    if (value < 40) return 'bg-red-500';
    if (value < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl">{client ? 'Edit Client' : 'Add New Client'}</DialogTitle>
            <DialogDescription>
              {client ? 'Update client information and SEO metrics.' : 'Enter client information and initial SEO metrics.'}
              <span className="text-xs text-muted-foreground block mt-1">Press Esc to cancel, Ctrl+Enter to save</span>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company" className="font-medium">
                      Company Name <span className="text-primary">*</span>
                    </Label>
                    <Input
                      id="company"
                      {...register('company')}
                      placeholder="Acme Corp"
                    />
                    <AnimatePresence>
                      {errors.company && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-sm text-destructive"
                        >
                          {errors.company.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry" className="font-medium">
                      Industry <span className="text-primary">*</span>
                    </Label>
                    <Input
                      id="industry"
                      {...register('industry')}
                      placeholder="Technology"
                    />
                    <AnimatePresence>
                      {errors.industry && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-sm text-destructive"
                        >
                          {errors.industry.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="website" className="font-medium">
                      Website <span className="text-primary">*</span>
                    </Label>
                    <Input
                      id="website"
                      {...register('website')}
                      placeholder="https://example.com"
                    />
                    <p className="text-xs text-muted-foreground">Enter the full URL including https://</p>
                    <AnimatePresence>
                      {errors.website && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-sm text-destructive"
                        >
                          {errors.website.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Contact Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson" className="font-medium">
                      Contact Person <span className="text-primary">*</span>
                    </Label>
                    <Input
                      id="contactPerson"
                      {...register('contactPerson')}
                      placeholder="John Doe"
                    />
                    <AnimatePresence>
                      {errors.contactPerson && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-sm text-destructive"
                        >
                          {errors.contactPerson.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-medium">
                      Email <span className="text-primary">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="john@example.com"
                    />
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-sm text-destructive"
                        >
                          {errors.email.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-medium">
                      Phone <span className="text-primary">*</span>
                    </Label>
                    <Input
                      id="phone"
                      {...register('phone')}
                      placeholder="123-456-7890"
                    />
                    <AnimatePresence>
                      {errors.phone && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-sm text-destructive"
                        >
                          {errors.phone.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">SEO Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="indexedKeywords" className="font-medium">Indexed Keywords</Label>
                    <Input
                      id="indexedKeywords"
                      type="number"
                      {...register('indexedKeywords', { valueAsNumber: true })}
                      placeholder="0"
                    />
                    <p className="text-xs text-muted-foreground">Number of keywords currently indexed</p>
                    <AnimatePresence>
                      {errors.indexedKeywords && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-sm text-destructive"
                        >
                          {errors.indexedKeywords.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seoClicks" className="font-medium">Monthly SEO Clicks</Label>
                    <Input
                      id="seoClicks"
                      type="number"
                      {...register('seoClicks', { valueAsNumber: true })}
                      placeholder="0"
                    />
                    <p className="text-xs text-muted-foreground">Average monthly organic clicks</p>
                    <AnimatePresence>
                      {errors.seoClicks && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-sm text-destructive"
                        >
                          {errors.seoClicks.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="websiteQualityRating" className="font-medium">
                      Website Quality Rating: <span className={cn(
                        "font-bold",
                        websiteQualityRating < 40 && "text-red-500",
                        websiteQualityRating >= 40 && websiteQualityRating < 70 && "text-yellow-500",
                        websiteQualityRating >= 70 && "text-green-500"
                      )}>{websiteQualityRating}/100</span>
                    </Label>
                    <Slider
                      id="websiteQualityRating"
                      min={0}
                      max={100}
                      step={1}
                      value={[websiteQualityRating]}
                      onValueChange={(value) => setValue('websiteQualityRating', value[0])}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Poor (0-40)</span>
                      <span>Average (40-70)</span>
                      <span>Excellent (70-100)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || showSuccess} className="min-w-[120px]">
                {showSuccess ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Success!
                  </motion.div>
                ) : isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  client ? 'Update Client' : 'Create Client'
                )}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}