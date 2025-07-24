
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseOperations } from '@/integrations/supabase/client-custom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast as sonnerToast } from 'sonner';

const linkSchema = z.object({
  title: z.string().min(3, 'O título é obrigatório'),
  url: z.string().url('Por favor, insira uma URL válida'),
  type: z.enum(['image', 'video']),
});

type LinkFormData = z.infer<typeof linkSchema>;

const MediaLinkUploader: React.FC = () => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LinkFormData>({
    resolver: zodResolver(linkSchema),
    defaultValues: { type: 'image' },
  });

  const mutation = useMutation({
    mutationFn: (data: LinkFormData) => {
        const itemData = {
            title: data.title,
            image: data.type === 'image' ? data.url : null,
            video_url: data.type === 'video' ? data.url : null,
            type: data.type,
            is_approved: true, // Auto-approve items added by admins
        };
        return supabaseOperations.insertGalleryItem(itemData);
    },
    onSuccess: (result) => {
      if (result.error) {
        throw new Error(result.error.message);
      }
      sonnerToast.success('Mídia adicionada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['gallery_items'] });
      reset();
    },
    onError: (error: Error) => {
      sonnerToast.error('Erro ao adicionar mídia.', {
        description: error.message,
      });
    },
  });

  const onSubmit = (data: LinkFormData) => {
    mutation.mutate(data);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Adicionar Mídia por Link</CardTitle>
        <CardDescription>
          Cole a URL de uma imagem ou vídeo para adicioná-la diretamente à galeria.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" {...register('title')} />
            {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL da Mídia</Label>
            <Input id="url" {...register('url')} placeholder="https://exemplo.com/imagem.jpg" />
            {errors.url && <p className="text-sm text-red-600">{errors.url.message}</p>}
          </div>
           <div className="space-y-2">
            <Label>Tipo de Mídia</Label>
            <div className="flex gap-4">
                <label className="flex items-center gap-2">
                    <input type="radio" value="image" {...register('type')} /> Imagem
                </label>
                <label className="flex items-center gap-2">
                    <input type="radio" value="video" {...register('type')} /> Vídeo
                </label>
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adicionando...' : 'Adicionar à Galeria'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MediaLinkUploader;
