
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Bike, Lock, Eye, EyeOff } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/admin');
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Check if user is an admin
        const { data: adminData, error: adminError } = await supabase
          .from('admin_profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (adminError || !adminData) {
          await supabase.auth.signOut();
          toast({
            title: "Acesso negado",
            description: "Você não tem permissão para acessar o painel de administração.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Login bem-sucedido",
            description: "Bem-vindo ao painel de administração."
          });
          navigate('/admin');
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fillDefaultCredentials = () => {
    setEmail('admin@bikenight.com');
    setPassword('adminbikenight');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-event-dark p-6 text-center">
          <div className="flex justify-center mb-4">
            <Bike className="h-12 w-12 text-event-orange" />
          </div>
          <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
          <p className="text-gray-300 mt-1">BIKE NIGHT AMAZONAS</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email" 
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input 
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-event-orange hover:bg-orange-600"
            disabled={loading}
          >
            {loading ? "Entrando..." : <><Lock className="mr-2 h-4 w-4" /> Entrar</>}
          </Button>
        </form>
        
        <div className="px-6 pb-6 space-y-3">
          {/* Credenciais padrão */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">Credenciais Padrão</h3>
            <div className="space-y-1 text-xs text-blue-700">
              <p><strong>Email:</strong> admin@bikenight.com</p>
              <p><strong>Senha:</strong> adminbikenight</p>
            </div>
            <Button 
              variant="outline"
              size="sm"
              className="mt-2 text-xs"
              onClick={fillDefaultCredentials}
            >
              Usar credenciais padrão
            </Button>
          </div>
          
          <div className="text-center">
            <Button 
              variant="outline"
              className="text-sm"
              onClick={() => navigate('/')}
            >
              Voltar para o site
            </Button>
          </div>
          
          <div className="text-center border-t pt-4">
            <p className="text-xs text-gray-500 mb-2">
              Precisa de acesso administrativo?
            </p>
            <p className="text-xs text-gray-600">
              Entre em contato com um Super Administrador para criar sua conta.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Email: admin@bikenight.com | Senha: adminbikenight
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
