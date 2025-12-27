import { useState } from "react";
import { motion } from "framer-motion";
import { UploadedFile } from "@shared/types";
import { FileText, MoreVertical, Trash2, Download, FileSpreadsheet, FileCode, Globe, Calendar, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
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
const fileTypeConfig = {
  csv: { icon: FileSpreadsheet, color: 'text-green-600', bg: 'bg-green-500/10' },
  pdf: { icon: FileText, color: 'text-red-600', bg: 'bg-red-500/10' },
  xml: { icon: FileCode, color: 'text-blue-600', bg: 'bg-blue-500/10' },
  html: { icon: Globe, color: 'text-orange-600', bg: 'bg-orange-500/10' },
  docx: { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-500/10' },
};
export function FileList({ files, onDownload, onDelete }: FileListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const handleDeleteClick = (file: UploadedFile) => {
    setDeletingId(file.id);
  };
  const handleConfirmDelete = (file: UploadedFile) => {
    onDelete(file);
    setDeletingId(null);
  };
  const handleCancelDelete = () => {
    setDeletingId(null);
  };
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
      {files.map((file, index) => {
        const config = fileTypeConfig[file.fileType] || fileTypeConfig.pdf;
        const Icon = config.icon;
        const isDeleting = deletingId === file.id;
        return (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className={cn(
              "flex items-center p-3 hover:bg-muted/50 rounded-md transition-all duration-200",
              isDeleting && "bg-destructive/10"
            )}>
              <div className={`h-10 w-10 rounded-lg ${config.bg} flex items-center justify-center mr-4 flex-shrink-0`}>
                <Icon className={`h-5 w-5 ${config.color}`} />
              </div>
              <div className="flex-grow min-w-0">
                <p className="font-medium text-sm truncate">{file.fileName}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <HardDrive className="h-3 w-3" />
                    {formatBytes(file.fileSize)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(file.uploadDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {isDeleting ? (
                <div className="flex gap-2">
                  <Button size="sm" variant="destructive" onClick={() => handleConfirmDelete(file)}>
                    Confirm
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelDelete}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:scale-110 transition-transform">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onDownload(file)}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteClick(file)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            {index < files.length - 1 && <Separator />}
          </motion.div>
        );
      })}
    </div>
  );
}