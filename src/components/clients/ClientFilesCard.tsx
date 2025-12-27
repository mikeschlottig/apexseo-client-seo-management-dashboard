import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, Loader2, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Client } from '@shared/types';
import { FileList } from './FileList';
import { useFileUpload } from '@/hooks/use-file-upload';
interface ClientFilesCardProps {
  client: Client;
}
export function ClientFilesCard({ client }: ClientFilesCardProps) {
  const { isUploading, uploadFile, downloadFile, deleteFile } = useFileUpload(client.id);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      uploadFile(file);
    });
  }, [uploadFile]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/pdf': ['.pdf'],
      'application/xml': ['.xml', 'text/xml'],
      'text/html': ['.html', '.htm'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    disabled: isUploading,
  });
  return (
    <Card className="hover:shadow-lg hover:border-primary/20 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Uploaded Files</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300",
            isDragActive ? "border-primary bg-primary/5 scale-105 animate-pulse" : "border-border hover:border-primary hover:bg-primary/5",
            isUploading && "cursor-not-allowed opacity-60"
          )}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-3" />
              <p className="text-muted-foreground">Uploading files...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <UploadCloud className="h-10 w-10 text-muted-foreground mb-3" />
              </motion.div>
              <p className="font-semibold">Drag & drop files here, or click to select</p>
              <p className="text-sm text-muted-foreground mt-2">Supported formats:</p>
              <div className="flex gap-2 mt-2 flex-wrap justify-center">
                <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded">CSV</span>
                <span className="text-xs bg-red-500/10 text-red-600 px-2 py-1 rounded">PDF</span>
                <span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-1 rounded">XML</span>
                <span className="text-xs bg-orange-500/10 text-orange-600 px-2 py-1 rounded">HTML</span>
                <span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-1 rounded">DOCX</span>
              </div>
            </div>
          )}
        </div>
        <FileList
          files={client.uploadedFiles}
          onDownload={downloadFile}
          onDelete={deleteFile}
        />
      </CardContent>
    </Card>
  );
}