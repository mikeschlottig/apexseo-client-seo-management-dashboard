import { UploadedFile } from "@shared/types";
import { FileText, MoreVertical, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
interface FileListProps {
  files: UploadedFile[];
  onDownload: (file: UploadedFile) => void;
  onDelete: (file: UploadedFile) => void;
}
function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
export function FileList({ files, onDownload, onDelete }: FileListProps) {
  if (!files || files.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-medium text-foreground">No files uploaded</h3>
        <p className="mt-1 text-sm text-muted-foreground">Get started by uploading a document.</p>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {files.map((file, index) => (
        <div key={file.id}>
          <div className="flex items-center p-2 hover:bg-muted/50 rounded-md">
            <FileText className="h-6 w-6 text-primary mr-4 flex-shrink-0" />
            <div className="flex-grow">
              <p className="font-medium text-sm truncate">{file.fileName}</p>
              <p className="text-xs text-muted-foreground">
                {formatBytes(file.fileSize)} &bull; {new Date(file.uploadDate).toLocaleDateString()}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onDownload(file)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(file)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {index < files.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  );
}