
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MediaFile {
  file: File;
  type: 'image' | 'video';
  preview: string;
}

interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
}

const useMediaUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const { toast } = useToast();

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const allowedVideoTypes = ['video/mp4'];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (file.size > maxSize) {
      return { valid: false, error: 'Arquivo muito grande. Máximo 50MB.' };
    }

    if (!allowedImageTypes.includes(file.type) && !allowedVideoTypes.includes(file.type)) {
      return { valid: false, error: 'Formato não suportado. Use PNG, JPEG ou MP4.' };
    }

    return { valid: true };
  };

  const processFiles = (files: FileList): MediaFile[] => {
    const processedFiles: MediaFile[] = [];

    Array.from(files).forEach(file => {
      const validation = validateFile(file);
      
      if (!validation.valid) {
        toast({
          title: 'Arquivo inválido',
          description: `${file.name}: ${validation.error}`,
          variant: 'destructive',
        });
        return;
      }

      const type = file.type.startsWith('image/') ? 'image' : 'video';
      const preview = URL.createObjectURL(file);

      processedFiles.push({
        file,
        type,
        preview
      });
    });

    return processedFiles;
  };

  const uploadToSupabase = async (mediaFiles: MediaFile[], metadata: { title: string; description: string; motivation: string }) => {
    setUploading(true);
    const successfulUploads: string[] = [];

    try {
      for (const mediaFile of mediaFiles) {
        const fileName = `${Date.now()}-${mediaFile.file.name}`;
        
        // Update progress
        setUploadProgress(prev => [
          ...prev.filter(p => p.fileName !== mediaFile.file.name),
          { fileName: mediaFile.file.name, progress: 0, status: 'uploading' }
        ]);

        // For now, we'll store the file as a base64 data URL since we don't have storage setup
        const reader = new FileReader();
        const fileDataPromise = new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(mediaFile.file);
        });

        const fileData = await fileDataPromise;

        // Insert into gallery_items table
        const { error } = await supabase
          .from('gallery_items')
          .insert({
            title: `${metadata.title} - ${mediaFile.file.name}`,
            image: fileData, // Using data URL for now
            description: metadata.description,
            motivation: metadata.motivation,
          });

        if (error) throw error;

        // Update progress to success
        setUploadProgress(prev => 
          prev.map(p => 
            p.fileName === mediaFile.file.name 
              ? { ...p, progress: 100, status: 'success' as const }
              : p
          )
        );

        successfulUploads.push(mediaFile.file.name);
      }

      toast({
        title: 'Upload concluído',
        description: `${successfulUploads.length} arquivo(s) enviado(s) com sucesso.`,
      });

      return true;
    } catch (error: any) {
      console.error('Upload error:', error);
      
      setUploadProgress(prev => 
        prev.map(p => ({ ...p, status: 'error' as const }))
      );

      toast({
        title: 'Erro no upload',
        description: error.message || 'Erro ao enviar arquivos.',
        variant: 'destructive',
      });

      return false;
    } finally {
      setUploading(false);
      // Clear progress after 3 seconds
      setTimeout(() => setUploadProgress([]), 3000);
    }
  };

  return {
    uploading,
    uploadProgress,
    validateFile,
    processFiles,
    uploadToSupabase
  };
};

export default useMediaUpload;
