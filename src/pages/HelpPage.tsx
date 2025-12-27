import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Mail, ExternalLink } from 'lucide-react';
export default function HelpPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <h2 className="text-3xl font-bold tracking-tight mb-6">Help & Support</h2>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I add a new client?</AccordionTrigger>
                  <AccordionContent>
                    Navigate to the Clients page and click the "Add New Client" button in the top right corner. 
                    Fill out the form with the client's company information, contact details, and initial SEO metrics. 
                    Click "Save" to add the client to your dashboard.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I upload files?</AccordionTrigger>
                  <AccordionContent>
                    Go to a client's detail page by clicking on their name in the Clients table. 
                    Scroll down to the "Uploaded Files" section. You can drag and drop files into the upload area 
                    or click to select files from your computer. Supported formats include CSV, PDF, XML, HTML, and DOCX.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How does the pipeline work?</AccordionTrigger>
                  <AccordionContent>
                    The Sales Pipeline helps you track leads through different stages: Lead In, Contact Made, 
                    Proposal Sent, Negotiation, Won, and Lost. You can drag and drop leads between stages on the 
                    Kanban board, or use the table view for a more detailed overview. Filter leads by stage or source 
                    to focus on specific segments of your pipeline.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Can I export my data?</AccordionTrigger>
                  <AccordionContent>
                    Data export functionality is currently in development. In the meantime, you can use your browser's 
                    print function to save reports as PDFs. Full CSV and Excel export capabilities will be available 
                    in a future update.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>How do I edit or delete a client?</AccordionTrigger>
                  <AccordionContent>
                    In the Clients table, click the three-dot menu icon in the Actions column for any client. 
                    Select "Edit client" to modify their information, or "Delete client" to remove them from your system. 
                    You can also edit a client from their detail page using the "Edit Client" button.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                  <AccordionTrigger>How do I contact support?</AccordionTrigger>
                  <AccordionContent>
                    You can reach our support team via email at support@apexseo.com. We typically respond within 
                    24 hours during business days. For urgent issues, please include "URGENT" in your email subject line.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Need more help? Get in touch with our team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email Support</p>
                  <a href="mailto:support@apexseo.com" className="text-sm text-primary hover:underline">
                    support@apexseo.com
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <ExternalLink className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Help Center</p>
                  <a href="#" className="text-sm text-primary hover:underline">
                    Visit our online help center
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}