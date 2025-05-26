
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseCustom } from '@/integrations/supabase/client-custom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Authenticate user
      const { data: authData, error: authError } = await supabaseCustom.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Check if user is admin
        const { data: adminData, error: adminError } = await (supabaseCustom as any)
          .from('admin_profiles')
          .select('role')
          .eq('id', authData.user.id)
          .single();

        if (adminError) {
          console.error('Error checking admin status:', adminError);
          throw new Error('Acesso negado. Este usuário não tem permissões administrativas.');
        }

        if (adminData) {
          toast({
            title: 'Login realizado com sucesso!',
            description: `Bem-vindo, ${adminData.role === 'super_admin' ? 'Super Admin' : 'Admin'}!`,
          });
          
          navigate('/admin');
        } else {
          throw new Error('Acesso negado. Este usuário não tem permissões administrativas.');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
      
      // Sign out if there was an error after authentication
      await supabaseCustom.auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-event-dark via-gray-800 to-event-blue p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-event-orange p-3 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Acesso Administrativo</CardTitle>
          <CardDescription className="text-center">
            Entre com suas credenciais de administrador
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@bikenightamazonas.com"
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
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-event-orange hover:bg-orange-600" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Problemas para acessar?{' '}
              <a href="mailto:admin@bikenightamazonas.com" className="text-event-orange hover:underline">
                Contate o suporte
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
