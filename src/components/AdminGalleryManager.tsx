
import React, { useEffect, useState } from 'react';
import { supabaseCustom } from '@/integrations/supabase/client-custom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, UserCog, AlertCircle, Loader2, History } from 'lucide-react';
import { reportService, AdminUser } from '@/integrations/supabase/reportService'; // Reutilizando nosso serviço
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface AuditLog {
  id: string;
  created_at: string;
  action: string;
  entity: string;
  details: any;
}

const AuditView: React.FC = () => {
  const [report, setReport] = useState<{ superAdmins: AdminUser[], admins: AdminUser[] }>({ superAdmins: [], admins: [] });
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuditData = async () => {
      try {
        // Fase 1: Relatório de Hierarquia
        const reportData = await reportService.getAdminReport();
        setReport(reportData);

        // Fase 2: Trilha de Auditoria
        const { data: auditData, error: auditError } = await supabaseCustom
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(15);
        
        if (auditError) throw new Error(`Falha ao buscar trilha de auditoria: ${auditError.message}`);
        setLogs(auditData);

      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-event-orange" />
        <span className="ml-4 text-lg">Realizando Auditoria Completa...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-500 m-4">
        <CardHeader><CardTitle className="text-red-600"><AlertCircle className="mr-2" />Falha na Auditoria</CardTitle></CardHeader>
        <CardContent><p className="text-red-700">{error}</p></CardContent>
      </Card>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Relatório de Acesso Administrativo</CardTitle>
          <CardDescription>Hierarquia de todos os usuários com permissões elevadas.</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <h3 className="font-semibold flex items-center mb-2"><ShieldCheck className="mr-2 text-event-orange" />Super Administradores</h3>
            <ul className="list-disc pl-5">
              {report.superAdmins.length > 0 ? report.superAdmins.map(u => <li key={u.email}>{u.email}</li>) : <li className="text-gray-500">Nenhum encontrado.</li>}
            </ul>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold flex items-center mb-2"><UserCog className="mr-2 text-event-blue" />Administradores</h3>
            <ul className="list-disc pl-5">
              {report.admins.length > 0 ? report.admins.map(u => <li key={u.email}>{u.email}</li>) : <li className="text-gray-500">Nenhum encontrado.</li>}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trilha de Auditoria Recente</CardTitle>
          <CardDescription>Últimas 15 ações sensíveis registradas no sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Entidade</TableHead>
                <TableHead>Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map(log => (
                <TableRow key={log.id}>
                  <TableCell>{new Date(log.created_at).toLocaleString('pt-BR')}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.entity}</TableCell>
                  <TableCell><pre className="text-xs">{JSON.stringify(log.details, null, 2)}</pre></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditView;
