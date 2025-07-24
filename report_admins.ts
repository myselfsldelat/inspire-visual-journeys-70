
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Carregando variáveis de ambiente de forma segura
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('As variaveis de ambiente VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY sao obrigatorias.');
}

// Cliente Supabase dedicado com permissões de serviço
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Tipagem forte, conforme a diretriz
enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
}

interface AdminProfile {
  id: string;
  role: AdminRole;
}

interface AdminUser {
  email: string;
  role: AdminRole;
  createdAt: string;
}

async function generateAdminReport() {
  console.log('Iniciando geracao do relatorio de comando...');

  try {
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('admin_profiles')
      .select('id, role');

    if (profilesError) throw new Error('Falha na comunicacao com a base de perfis: ' + profilesError.message);
    if (!profiles || profiles.length === 0) {
      console.log('Nenhum perfil de administrador encontrado no sistema.');
      return;
    }

    const adminUsers: AdminUser[] = [];
    // Substituindo Promise.all por um loop for...of para melhor controle e tratamento de erros
    for (const profile of profiles as AdminProfile[]) {
      const { data: userResponse, error: userError } = await supabaseAdmin.auth.admin.getUserById(profile.id);

      // Tratamento de dados ausentes e emails undefined
      const email = userResponse?.user?.email ?? `ID Orfao: ${profile.id}`;
      const createdAt = userResponse?.user?.created_at ? new Date(userResponse.user.created_at).toLocaleString('pt-BR') : 'N/A';
      
      adminUsers.push({ email, role: profile.role, createdAt });
    }

    const reportContent = generateReportContent(adminUsers);
    const outputPath = path.resolve(process.cwd(), 'relatorio_admins.txt');
    fs.writeFileSync(outputPath, reportContent);

    // Confirmacao no console com caminho absoluto e sintaxe corrigida
    console.log('
Relatorio de Comando gerado com sucesso!');
    console.log('Caminho do arquivo: ' + outputPath);

  } catch (error) {
    console.error('
ERRO CRITICO NA OPERACAO: ' + (error as Error).message);
  }
}

function generateReportContent(users: AdminUser[]): string {
  const now = new Date();
  const totalAdmins = users.length;
  const superAdminCount = users.filter(u => u.role === AdminRole.SUPER_ADMIN).length;
  const adminCount = users.filter(u => u.role === AdminRole.ADMIN).length;

  // Geracao do relatorio com concatenacao segura e caracteres ASCII
  let content = '=================================================
';
  content += '  RELATORIO DE ACESSO ADMINISTRATIVO
';
  content += '  Gerado em: ' + now.toLocaleString('pt-BR', { timeZone: 'America/Manaus' }) + '
';
  content += '=================================================

';
  content += 'ESTATISTICAS:
';
  content += ' - Total de Administradores: ' + totalAdmins + '
';
  content += ' - Super Admins: ' + superAdminCount + '
';
  content += ' - Admins: ' + adminCount + '

';
  content += '-------------------------------------------------
';
  content += 'SUPER ADMINS (' + superAdminCount + ')
';
  content += '-------------------------------------------------
';
  users.filter(u => u.role === AdminRole.SUPER_ADMIN).forEach(u => {
    content += 'Email: ' + u.email + '
';
    content += '   Data de Criacao: ' + u.createdAt + '

';
  });
  content += '-------------------------------------------------
';
  content += 'ADMINS (' + adminCount + ')
';
  content += '-------------------------------------------------
';
  users.filter(u => u.role === AdminRole.ADMIN).forEach(u => {
    content += 'Email: ' + u.email + '
';
    content += '   Data de Criacao: ' + u.createdAt + '

';
  });
  content += '=================================================
';
  content += '  FIM DO RELATORIO
';
  content += '=================================================
';

  return content;
}

generateAdminReport();
