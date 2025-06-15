import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseCustom, supabaseOperations } from '@/integrations/supabase/client-custom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminSetup: React.FC = () => {
  const [email, setEmail] = useState('admin@bikenight.com');
  const [password, setPassword] = useState('BikeNight2024!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [hasAdmin, setHasAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkExistingAdmin();
  }, []);

  const checkExistingAdmin = async () => {
    try {
      const { data, error } = await supabaseOperations.hasAnyAdmin();
      
      if (error) {
        console.error('Erro ao verificar admin existente:', error);
      } else {
        setHasAdmin(data);
      }
    } catch (error) {
      console.error('Erro ao verificar admin:', error);
    } finally {
      setCheckingExisting(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Criando usuário admin...');
      
      // Primeiro, criar o usuário no Supabase Auth
      const { data: authData, error: authError } = await supabaseCustom.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined, // Evita redirect automático
        }
      });

      if (authError) {
        throw authError;
      }

      if (authData.user) {
        console.log('Usuário criado:', authData.user.id);
        
        // Agora criar o perfil de admin
        const { error: profileError } = await supabaseOperations.insertAdminProfile({
            id: authData.user.id,
            role: 'super_admin'
        });

        if (profileError) {
          console.error('Erro ao criar perfil admin:', profileError);
          throw profileError;
        }

        console.log('Perfil admin criado com sucesso');
        
        setSuccess(true);
        toast({
          title: 'Super Admin criado com sucesso!',
          description: 'Agora você pode fazer login com as credenciais criadas.',
        });

        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          navigate('/admin-login');
        }, 3000);
      }
    } catch (error: any) {
      console.error('Erro ao criar admin:', error);
      
      if (error.message?.includes('User already registered')) {
        setError('Este email já está registrado. Tente fazer login ou use outro email.');
      } else {
        setError(error.message || 'Erro ao criar administrador. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (checkingExisting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-event-dark via-gray-800 to-event-blue p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Verificando configuração...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (hasAdmin && !success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-event-dark via-gray-800 to-event-blue p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-event-green p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Sistema Configurado</CardTitle>
            <CardDescription className="text-center">
              O sistema já possui um administrador configurado
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <p className="text-center text-gray-600">
                O sistema já está configurado. Use a página de login para acessar o painel administrativo.
              </p>
              
              <Button 
                onClick={() => navigate('/admin-login')}
                className="w-full bg-event-orange hover:bg-orange-600"
              >
                Ir para Login
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full"
              >
                Voltar ao Início
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-event-dark via-gray-800 to-event-blue p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-event-orange p-3 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            {success ? 'Admin Criado!' : 'Configuração Inicial'}
          </CardTitle>
          <CardDescription className="text-center">
            {success 
              ? 'Super administrador criado com sucesso'
              : 'Crie o primeiro super administrador do sistema'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {success ? (
            <div className="space-y-4 text-center">
              <div className="bg-green-50 p-4 rounded-lg">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <p className="text-green-800 font-medium">
                  Super Admin criado com sucesso!
                </p>
                <p className="text-green-600 text-sm mt-1">
                  Redirecionando para o login...
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg text-left">
                <p className="font-medium text-gray-800 mb-2">Credenciais de acesso:</p>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {email}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Senha:</strong> {password}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email do Administrador</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <p className="text-xs text-gray-500">
                  A senha deve ter pelo menos 6 caracteres
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-event-orange hover:bg-orange-600" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando Admin...
                  </>
                ) : (
                  'Criar Super Admin'
                )}
              </Button>
            </form>
          )}
          
          {!success && (
            <div className="mt-6 text-center">
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
                className="text-sm"
              >
                Voltar ao Início
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetup;
