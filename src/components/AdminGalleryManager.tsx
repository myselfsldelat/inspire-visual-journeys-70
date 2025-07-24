
import React, { useEffect, useState } from 'react';
import { reportService, AdminUser } from '@/integrations/supabase/reportService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, UserCog, AlertCircle, Loader2 } from 'lucide-react';

const AdminReportView: React.FC = () => {
  const [report, setReport] = useState<{ superAdmins: AdminUser[], admins: AdminUser[] }>({ superAdmins: [], admins: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const reportData = await reportService.getAdminReport();
        setReport(reportData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-event-orange" />
        <span className="ml-4 text-lg">Gerando Relatório de Comando...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-500">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertCircle className="mr-2" />
            Falha na Geração do Relatório
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-700">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatório de Acesso Administrativo</CardTitle>
        <CardDescription>Hierarquia de todos os usuários com permissões elevadas no sistema.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center mb-3">
            <ShieldCheck className="mr-2 h-5 w-5 text-event-orange" />
            Super Administradores
          </h3>
          <ul className="list-disc list-inside pl-4 space-y-1">
            {report.superAdmins.length > 0 ? (
              report.superAdmins.map(u => <li key={u.email}>{u.email}</li>)
            ) : (
              <li className="text-gray-500">Nenhum Super Administrador encontrado.</li>
            )}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold flex items-center mb-3">
            <UserCog className="mr-2 h-5 w-5 text-event-blue" />
            Administradores
          </h3>
          <ul className="list-disc list-inside pl-4 space-y-1">
            {report.admins.length > 0 ? (
              report.admins.map(u => <li key={u.email}>{u.email}</li>)
            ) : (
              <li className="text-gray-500">Nenhum Administrador encontrado.</li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminReportView;
