
import React, { useState, useEffect } from 'react';
import { supabaseCustom, supabaseOperations } from '@/integrations/supabase/client-custom';
import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { UserPlus, Users, Shield, Trash2, Crown } from 'lucide-react';
import { AdminProfile, UserData } from '@/integrations/supabase/custom-types';

interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
  created_at: string;
}

interface NewAdminFormData {
  email: string;
  password: string;
  role: 'admin' | 'super_admin';
}

const AdminUserManager: React.FC = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const { isSuperAdmin } = useAuth();

  const form = useForm<NewAdminFormData>({
    defaultValues: {
      email: '',
      password: '',
      role: 'admin',
    },
  });

  useEffect(() => {
    if (isSuperAdmin) {
      fetchAdmins();
    }
  }, [isSuperAdmin]);

  const fetchAdmins = async () => {
    try {
      // First get admin profiles
      const { data: adminProfiles, error: profilesError } = await supabaseOperations.getAdminProfiles();
      
      if (profilesError) throw profilesError;
      
      // Get user emails using the function with proper typing
      const { data: usersData, error: usersError } = await supabaseOperations.getAllUsers() as { data: UserData[] | null, error: any };
      
      if (usersError) throw usersError;
      
      // Map the data correctly
      const formattedAdmins: AdminUser[] = adminProfiles?.map((profile: AdminProfile) => {
        const userData = usersData?.find(user => user.id === profile.id);
        return {
          id: profile.id,
          email: userData?.email || 'Email não encontrado',
          role: profile.role as 'admin' | 'super_admin',
          created_at: profile.created_at || new Date().toISOString(),
        };
      }) || [];
      
      setAdmins(formattedAdmins);
    } catch (error: any) {
      console.error('Error fetching admins:', error);
      toast({
        title: 'Erro ao carregar administradores',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (data: NewAdminFormData) => {
    setCreatingUser(true);
    
    try {
      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabaseCustom.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: undefined, // Evita redirect automático
        }
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        // Adicionar perfil de admin
        const { error: profileError } = await supabaseOperations.insertAdminProfile({
          id: authData.user.id,
          role: data.role,
        });
        
        if (profileError) throw profileError;
        
        toast({
          title: 'Administrador criado com sucesso',
          description: `Novo ${data.role === 'super_admin' ? 'super admin' : 'admin'} adicionado ao sistema.`,
        });
        
        setIsCreateModalOpen(false);
        form.reset();
        fetchAdmins();
      }
    } catch (error: any) {
      console.error('Error creating admin:', error);
      toast({
        title: 'Erro ao criar administrador',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setCreatingUser(false);
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    if (!confirm('Tem certeza que deseja remover este administrador?')) return;
    
    try {
      const { error } = await supabaseOperations.deleteAdminProfile(adminId);
      
      if (error) throw error;
      
      toast({
        title: 'Administrador removido',
        description: 'O acesso administrativo foi revogado com sucesso.',
      });
      
      fetchAdmins();
    } catch (error: any) {
      console.error('Error deleting admin:', error);
      toast({
        title: 'Erro ao remover administrador',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (!isSuperAdmin) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Acesso restrito a Super Administradores</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-event-orange" />
              <CardTitle>Gerenciar Administradores</CardTitle>
            </div>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-event-green hover:bg-green-600"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Admin
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Carregando administradores...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {admins.map((admin) => (
                <div key={admin.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 rounded-full">
                      {admin.role === 'super_admin' ? (
                        <Crown className="h-5 w-5 text-yellow-600" />
                      ) : (
                        <Shield className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{admin.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={admin.role === 'super_admin' ? 'default' : 'secondary'}>
                          {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Criado em {new Date(admin.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {admin.role !== 'super_admin' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAdmin(admin.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remover
                    </Button>
                  )}
                </div>
              ))}
              
              {admins.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Nenhum administrador encontrado</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Admin Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Criar Novo Administrador</DialogTitle>
            <DialogDescription>
              Adicione um novo usuário com permissões administrativas ao sistema.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateAdmin)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                rules={{ 
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Email inválido'
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="admin@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                rules={{ 
                  required: 'Senha é obrigatória',
                  minLength: {
                    value: 6,
                    message: 'Senha deve ter pelo menos 6 caracteres'
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível de Acesso</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o nível" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin - Gerenciar galeria e comentários</SelectItem>
                        <SelectItem value="super_admin">Super Admin - Acesso total</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={creatingUser}
                  className="bg-event-green hover:bg-green-600"
                >
                  {creatingUser ? 'Criando...' : 'Criar Admin'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUserManager;
