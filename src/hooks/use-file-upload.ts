import { useState } from 'react';
import { api } from '@/lib/api-client';
import { Client, UploadedFile } from '@shared/types';
import { useClientStore } from '@/store/client-store';
import { toast } from 'sonner';
export function useFileUpload(clientId: string) {
  const [isUploading, setIsUploading] = useState(false);
  const uploadFile = async (file: File) => {
    setIsUploading(true);
    const toastId = toast.loading(`Uploading ${file.name}...`);
    // This is a mock of the upload process.
    // In a real app, you would upload the file to a storage service (like R2)
    // and then send the URL and metadata to your worker.
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      const fileType = file.name.split('.').pop() as UploadedFile['fileType'];
      const metadata: Omit<UploadedFile, 'id' | 'uploadDate'> = {
        clientId,
        fileName: file.name,
        fileType: ['csv', 'pdf', 'xml', 'html', 'docx'].includes(fileType) ? fileType : 'pdf',
        fileSize: file.size,
        url: `/uploads/${clientId}/${file.name}`, // Mock URL
      };
      // Send metadata to the backend
      const updatedClient = await api<Client>(`/api/clients/${clientId}/files`, {
        method: 'POST',
        body: JSON.stringify(metadata),
      });
      // After the API confirms the update, update the store with the new state from the server response.
      // This ensures the UI is perfectly in sync with the backend.
      useClientStore.setState(state => {
        if (state.currentClient && state.currentClient.id === clientId) {
          state.currentClient.uploadedFiles = updatedClient.uploadedFiles;
        }
        const clientInList = state.clients.find(c => c.id === clientId);
        if (clientInList) {
          clientInList.uploadedFiles = updatedClient.uploadedFiles;
        }
      });
      toast.success(`${file.name} uploaded successfully!`, { id: toastId });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      toast.error(`Failed to upload ${file.name}: ${errorMessage}`, { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };
  const downloadFile = (file: UploadedFile) => {
    window.open(file.url, '_blank');
    toast.success(`Opening ${file.fileName}...`);
  };
  const deleteFile = async (file: UploadedFile) => {
    const toastId = toast.loading(`Deleting ${file.fileName}...`);
    // Optimistic update - remove from local state
    const originalState = useClientStore.getState();
    useClientStore.setState(state => {
      if (state.currentClient && state.currentClient.id === clientId) {
        state.currentClient.uploadedFiles = state.currentClient.uploadedFiles.filter(f => f.id !== file.id);
      }
      const clientInList = state.clients.find(c => c.id === clientId);
      if (clientInList) {
        clientInList.uploadedFiles = clientInList.uploadedFiles.filter(f => f.id !== file.id);
      }
    });
    try {
      await api(`/api/clients/${clientId}/files/${file.id}`, {
        method: 'DELETE',
      });
      toast.success(`${file.fileName} deleted successfully!`, { id: toastId });
    } catch (error) {
      // Revert on error
      useClientStore.setState({
        currentClient: originalState.currentClient,
        clients: originalState.clients,
      });
      const errorMessage = error instanceof Error ? error.message : 'Delete failed';
      toast.error(`Failed to delete ${file.fileName}: ${errorMessage}`, { id: toastId });
    }
  };
  return { isUploading, uploadFile, downloadFile, deleteFile };
}