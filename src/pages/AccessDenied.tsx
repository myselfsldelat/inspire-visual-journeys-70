
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const AccessDenied: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-red-100 p-3 rounded-full w-fit mb-4">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-800">Acesso Negado</CardTitle>
          <CardDescription className="text-red-600">
            Você não tem permissão para acessar esta página.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-gray-700">
            Apenas usuários com privilégios de administrador podem visualizar este conteúdo. 
            Se você acredita que isso é um erro, por favor, contate o suporte.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/">
              <Button className="w-full bg-red-600 hover:bg-red-700">
                Voltar para o Início
              </Button>
            </Link>
            <Link to="/recebavasoadmin">
              <Button variant="outline" className="w-full">
                Tentar Login Novamente
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessDenied;
