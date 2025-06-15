
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseCustom, supabaseOperations } from '@/integrations/supabase/client-custom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, CheckCircle, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminSetup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [hasAdmin, setHasAdmin] = useState(false);
  const [isCreatingAdditional, setIsCreatingAdditional] = useState(false);
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
        // Se já tem admin e veio da página de login, permite criar adicional
        if (data && window.location.search.includes('create-new')) {
          setIsCreatingAdditional(true);
        }
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

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Criando usuário admin...');
      
      // Criar o usuário no Supabase Auth
      const { data: authData, error: authError } = await supabaseCustom.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin-login`,
          data: {
            role: 'admin' // Metadados para identificar como admin
          }
        }
      });

      if (authError) {
        if (authError.message?.includes('User already registered')) {
          setError('Este email já está registrado. Tente fazer login ou use outro email.');
        } else {
          throw authError;
        }
        return;
      }

      if (authData.user) {
        console.log('Usuário criado:', authData.user.id);
        
        // Criar o perfil de admin
        const adminRole = isCreatingAdditional || hasAdmin ? 'admin' : 'super_admin';
        const { error: profileError } = await supabaseOperations.insertAdminProfile({
            id: authData.user.id,
            role: adminRole
        });

        if (profileError) {
          console.error('Erro ao criar perfil admin:', profileError);
          throw profileError;
        }

        console.log('Perfil admin criado com sucesso');
        
        setSuccess(true);
        toast({
          title: 'Usuário criado com sucesso!',
          description: 'Verifique seu email para confirmar a conta e depois faça login.',
        });

        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          navigate('/admin-login');
        }, 3000);
      }
    } catch (error: any) {
      console.error('Erro ao criar admin:', error);
      setError(error.message || 'Erro ao criar administrador. Tente novamente.');
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

  if (hasAdmin && !success && !isCreatingAdditional) {
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
                onClick={() => setIsCreatingAdditional(true)}
                className="w-full"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Criar Novo Administrador
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

  const pageTitle = isCreatingAdditional ? 'Criar Novo Administrador' : 'Configuração Inicial';
  const pageDescription = isCreatingAdditional 
    ? 'Adicione um novo administrador ao sistema'
    : 'Crie o primeiro super administrador do sistema';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-event-dark via-gray-800 to-event-blue p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-event-orange p-3 rounded-full">
              {success ? <CheckCircle className="h-8 w-8 text-white" /> : <Shield className="h-8 w-8 text-white" />}
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            {success ? 'Confirme seu E-mail' : pageTitle}
          </CardTitle>
          <CardDescription className="text-center">
            {success 
              ? 'Um e-mail de confirmação foi enviado para sua caixa de entrada.'
              : pageDescription
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {success ? (
            <div className="space-y-4 text-center">
              <div className="bg-green-50 p-4 rounded-lg">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <p className="text-green-800 font-medium">
                  Administrador criado com sucesso!
                </p>
                <p className="text-green-600 text-sm mt-2">
                  1. Verifique sua caixa de entrada
                </p>
                <p className="text-green-600 text-sm">
                  2. Clique no link de confirmação
                </p>
                <p className="text-green-600 text-sm">
                  3. Faça login com suas credenciais
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg text-left">
                <p className="font-medium text-gray-800 mb-2">Suas credenciais:</p>
                <p className="text-sm text-gray-600 break-all">
                  <strong>Email:</strong> {email}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Senha:</strong> (a que você definiu)
                </p>
              </div>

              <Alert>
                <AlertDescription className="text-sm">
                  <strong>Importante:</strong> Você deve confirmar seu email antes de fazer login. 
                  Após a confirmação, você será redirecionado automaticamente.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isCreatingAdditional && (
                <Alert>
                  <AlertDescription>
                    Você está criando um administrador adicional. Este usuário terá permissões de admin (não super admin).
                  </AlertDescription>
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
                  minLength={6}
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
                    Criando {isCreatingAdditional ? 'Admin' : 'Super Admin'}...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Criar {isCreatingAdditional ? 'Admin' : 'Super Admin'}
                  </>
                )}
              </Button>
            </form>
          )}
          
          {!success && (
            <div className="mt-6 text-center space-y-2">
              {isCreatingAdditional && (
                <Button 
                  variant="outline"
                  onClick={() => setIsCreatingAdditional(false)}
                  className="w-full text-sm"
                >
                  Voltar
                </Button>
              )}
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full text-sm"
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
