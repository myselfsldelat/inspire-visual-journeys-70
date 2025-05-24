import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GalleryItem } from '@/data/gallery';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { Edit, Trash, Image, Plus, Camera, RefreshCw, Loader2, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import MediaUploadManager from './MediaUploadManager';

interface GalleryItemFormData {
  title: string;
  image: string;
  description: string;
  motivation: string;
}

const AdminGalleryManager: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const form = useForm<GalleryItemFormData>({
    defaultValues: {
      title: '',
      image: '',
      description: '',
      motivation: '',
    },
  });

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  useEffect(() => {
    if (selectedItem && isEditModalOpen) {
      form.reset({
        title: selectedItem.title,
        image: selectedItem.image,
        description: selectedItem.description || '',
        motivation: selectedItem.motivation || '',
      });
    } else if (isAddModalOpen) {
      form.reset({
        title: '',
        image: '',
        description: '',
        motivation: '',
      });
    }
  }, [selectedItem, isEditModalOpen, isAddModalOpen, form]);

  const fetchGalleryItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setItems(data || []);
    } catch (error: any) {
      console.error('Error fetching gallery items:', error);
      setError(error.message || 'Erro ao carregar imagens da galeria');
      toast({
        title: 'Erro ao carregar imagens',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshGallery = async () => {
    setIsRefreshing(true);
    try {
      await fetchGalleryItems();
      toast({
        title: 'Galeria atualizada',
        description: 'As imagens foram atualizadas com sucesso.',
      });
    } catch (error) {
      // Erros já são tratados em fetchGalleryItems
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAddItem = async (data: GalleryItemFormData) => {
    try {
      const { error } = await supabase.from('gallery_items').insert([
        {
          title: data.title,
          image: data.image,
          description: data.description,
          motivation: data.motivation,
        },
      ]);
      
      if (error) throw error;
      
      toast({
        title: 'Imagem adicionada',
        description: 'A imagem foi adicionada com sucesso.',
      });
      
      setIsAddModalOpen(false);
      fetchGalleryItems();
    } catch (error: any) {
      console.error('Error adding gallery item:', error);
      toast({
        title: 'Erro ao adicionar imagem',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleEditItem = async (data: GalleryItemFormData) => {
    if (!selectedItem) return;
    
    try {
      const { error } = await supabase
        .from('gallery_items')
        .update({
          title: data.title,
          image: data.image,
          description: data.description,
          motivation: data.motivation,
        })
        .eq('id', String(selectedItem.id)); // Convert id to string
      
      if (error) throw error;
      
      toast({
        title: 'Imagem atualizada',
        description: 'A imagem foi atualizada com sucesso.',
      });
      
      setIsEditModalOpen(false);
      fetchGalleryItems();
    } catch (error: any) {
      console.error('Error updating gallery item:', error);
      toast({
        title: 'Erro ao atualizar imagem',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;
    
    try {
      const { error } = await supabase
        .from('gallery_items')
        .delete()
        .eq('id', String(selectedItem.id)); // Convert id to string
      
      if (error) throw error;
      
      toast({
        title: 'Imagem excluída',
        description: 'A imagem foi excluída com sucesso.',
      });
      
      setIsDeleteModalOpen(false);
      fetchGalleryItems();
    } catch (error: any) {
      console.error('Error deleting gallery item:', error);
      toast({
        title: 'Erro ao excluir imagem',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 my-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Camera className="h-8 w-8 text-event-orange" />
          <h2 className="text-3xl font-bold text-event-dark">Gerenciar Galeria</h2>
        </div>
        <Button 
          onClick={refreshGallery}
          variant="outline"
          disabled={isRefreshing}
          className="flex items-center gap-2 hover:bg-gray-50"
        >
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Atualizar
        </Button>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="upload" className="flex items-center gap-2 py-3">
            <Upload className="h-4 w-4" />
            Novo Upload
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2 py-3">
            <Image className="h-4 w-4" />
            Gerenciar Existentes ({items.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6">
          <MediaUploadManager />
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Erro ao carregar imagens</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Itens da Galeria</h3>
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-event-green hover:bg-green-600 flex items-center gap-2"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              Adicionar Manual
            </Button>
          </div>
          
          {loading ? (
            <div className="flex flex-col justify-center items-center py-16">
              <Loader2 className="w-12 h-12 text-event-orange animate-spin mb-4" />
              <div className="text-lg text-gray-600">Carregando galeria...</div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <Image className="h-20 w-20 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhuma imagem encontrada</h3>
              <p className="text-gray-500 mb-6">Comece adicionando imagens e vídeos à sua galeria.</p>
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-event-orange hover:bg-orange-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeira Imagem
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <div key={String(item.id)} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-48 overflow-hidden bg-gray-100">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 h-10 mb-3">
                      {item.description || 'Sem descrição'}
                    </p>
                    <div className="text-xs text-gray-500 mb-3">
                      Adicionado em: {new Date(item.created_at).toLocaleDateString('pt-BR')}
                    </div>
                    
                    <div className="flex justify-between gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsEditModalOpen(true);
                        }}
                        className="flex-1 hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsDeleteModalOpen(true);
                        }}
                        className="flex-1 hover:bg-red-50 hover:border-red-300 text-red-600"
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Item da Galeria</DialogTitle>
            <DialogDescription>
              Modifique as informações do item selecionado da galeria.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditItem)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Título da imagem" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Imagem</FormLabel>
                    <FormControl>
                      <Input placeholder="https://exemplo.com/imagem.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input placeholder="Descrição da imagem" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="motivation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivação</FormLabel>
                    <FormControl>
                      <Input placeholder="Mensagem inspiradora" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-event-blue hover:bg-blue-600">
                  Salvar Alterações
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Add Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Imagem</DialogTitle>
            <DialogDescription>
              Adicione um novo item à galeria preenchendo as informações abaixo.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddItem)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Título da imagem" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Imagem</FormLabel>
                    <FormControl>
                      <Input placeholder="https://exemplo.com/imagem.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input placeholder="Descrição da imagem" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="motivation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivação</FormLabel>
                    <FormControl>
                      <Input placeholder="Mensagem inspiradora" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-event-green hover:bg-green-600">
                  Adicionar Imagem
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. O item será permanentemente removido da galeria.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-gray-700">
              Tem certeza que deseja excluir <strong>"{selectedItem?.title}"</strong>?
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteItem}
            >
              Excluir Permanentemente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminGalleryManager;
