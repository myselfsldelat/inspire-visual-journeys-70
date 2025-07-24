
import React, { useState, useEffect } from 'react';
import { supabaseOperations } from '@/integrations/supabase/client-custom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { Edit, Trash, Image as ImageIcon, Camera, RefreshCw, Loader2, Upload, Link as LinkIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import MediaUploadManager from './MediaUploadManager';
import MediaLinkUploader from './MediaLinkUploader';
import { GalleryItem } from '@/integrations/supabase/custom-types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // IMPORTAÇÃO CORRIGIDA

interface GalleryItemFormData {
  title: string;
  image: string;
  description: string;
}

const AdminGalleryManager: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const form = useForm<GalleryItemFormData>();

  useEffect(() => { fetchGalleryItems(); }, []);
  useEffect(() => {
    if (selectedItem) {
      form.reset({
        title: selectedItem.title,
        image: selectedItem.image,
        description: selectedItem.description || '',
      });
    }
  }, [selectedItem, form]);

  const fetchGalleryItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabaseOperations.getGalleryItems();
      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      const errorMessage = (err instanceof Error) ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      toast({ title: 'Erro ao carregar galeria', description: errorMessage, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditItem = async (formData: GalleryItemFormData) => {
    if (!selectedItem) return;
    try {
      await supabaseOperations.updateGalleryItem(String(selectedItem.id), formData);
      toast({ title: 'Item atualizado!' });
      setIsEditModalOpen(false);
      fetchGalleryItems();
    } catch (err) {
      const errorMessage = (err instanceof Error) ? err.message : 'Erro ao atualizar';
      toast({ title: 'Erro', description: errorMessage, variant: 'destructive' });
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;
    try {
      await supabaseOperations.deleteGalleryItem(String(selectedItem.id));
      toast({ title: 'Item excluído!' });
      setIsDeleteModalOpen(false);
      fetchGalleryItems();
    } catch (err) {
      const errorMessage = (err instanceof Error) ? err.message : 'Erro ao excluir';
      toast({ title: 'Erro', description: errorMessage, variant: 'destructive' });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Gerenciador da Galeria</h2>
      <Tabs defaultValue="manage">
        <TabsList>
          <TabsTrigger value="manage">Gerenciar</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="links">Adicionar por Link</TabsTrigger>
        </TabsList>
        <TabsContent value="manage" className="mt-4">
          <Button onClick={() => fetchGalleryItems()} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          {loading && <p>Carregando...</p>}
          {error && <Alert variant="destructive"><AlertTitle>Erro</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
          <div className="grid grid-cols-4 gap-4 mt-4">
            {items.map((item) => (
              <Card key={String(item.id)}>
                <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />
                <CardContent className="p-2">
                  <p className="font-semibold truncate">{item.title}</p>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button size="sm" onClick={() => { setSelectedItem(item); setIsEditModalOpen(true); }}><Edit size={16} /></Button>
                    <Button size="sm" variant="destructive" onClick={() => { setSelectedItem(item); setIsDeleteModalOpen(true); }}><Trash size={16} /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="upload" className="mt-4"><MediaUploadManager onUploadComplete={fetchGalleryItems} /></TabsContent>
        <TabsContent value="links" className="mt-4"><MediaLinkUploader /></TabsContent>
      </Tabs>
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar Item</DialogTitle></DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditItem)} className="space-y-4">
              <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Título</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="image" render={({ field }) => (<FormItem><FormLabel>URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Descrição</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
              <DialogFooter><Button type="submit">Salvar</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirmar Exclusão</DialogTitle></DialogHeader>
          <DialogDescription>Deseja excluir "{selectedItem?.title}"?</DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteItem}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default AdminGalleryManager;
