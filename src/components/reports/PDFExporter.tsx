import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';
import { ReportType } from '@shared/types';
import { PDF_CONFIG, addPageHeader, addPageFooter, formatDate } from '@/lib/pdf-utils';
interface UsePDFExportOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}
export function usePDFExport(options?: UsePDFExportOptions) {
  const [isExporting, setIsExporting] = useState(false);
  const generatePDF = async (
    previewElement: HTMLElement,
    reportType: ReportType,
    fileName?: string
  ): Promise<void> => {
    setIsExporting(true);
    const toastId = toast.loading('Generating PDF...');
    try {
      // Capture the preview element as a high-quality image
      const canvas = await html2canvas(previewElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = PDF_CONFIG.dimensions.width - PDF_CONFIG.margins.left - PDF_CONFIG.margins.right;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      // Initialize PDF
      const pdf = new jsPDF({
        orientation: PDF_CONFIG.orientation,
        unit: PDF_CONFIG.unit,
        format: PDF_CONFIG.format,
      });
      const pageHeight = PDF_CONFIG.dimensions.height - PDF_CONFIG.margins.top - PDF_CONFIG.margins.bottom - 20;
      let heightLeft = imgHeight;
      let position = PDF_CONFIG.margins.top + 15; // Start below header
      const reportTitle = reportType === 'seo-audit' ? 'SEO Audit Report' : 'Proposal Report';
      const generatedDate = formatDate(new Date().toISOString());
      let pageNumber = 1;
      // Add first page with header
      addPageHeader(pdf, reportTitle, generatedDate, pageNumber);
      // Add image content
      pdf.addImage(
        imgData,
        'PNG',
        PDF_CONFIG.margins.left,
        position,
        imgWidth,
        imgHeight
      );
      heightLeft -= pageHeight;
      // Add additional pages if content overflows
      while (heightLeft > 0) {
        position = heightLeft - imgHeight + PDF_CONFIG.margins.top + 15;
        pdf.addPage();
        pageNumber++;
        addPageHeader(pdf, reportTitle, generatedDate, pageNumber);
        pdf.addImage(
          imgData,
          'PNG',
          PDF_CONFIG.margins.left,
          position,
          imgWidth,
          imgHeight
        );
        heightLeft -= pageHeight;
      }
      // Add footers to all pages
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        addPageFooter(pdf, i, totalPages);
      }
      // Generate filename
      const timestamp = new Date().toISOString().split('T')[0];
      const defaultFileName = `ApexSEO-${reportType}-${timestamp}.pdf`;
      const finalFileName = fileName || defaultFileName;
      // Save PDF
      pdf.save(finalFileName);
      toast.success('PDF generated successfully!', { id: toastId });
      options?.onSuccess?.();
    } catch (error) {
      console.error('[PDF EXPORT ERROR]', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate PDF';
      toast.error(errorMessage, { id: toastId });
      options?.onError?.(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      setIsExporting(false);
    }
  };
  return { generatePDF, isExporting };
}