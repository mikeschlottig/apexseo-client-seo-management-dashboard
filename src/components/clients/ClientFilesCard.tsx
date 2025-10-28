import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, Loader2 } from 'lucide-react';
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
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Uploaded Files</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200",
            isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
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
              <UploadCloud className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="font-semibold">Drag & drop files here, or click to select</p>
              <p className="text-sm text-muted-foreground">Supported: CSV, PDF, XML, HTML, DOCX</p>
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