
import { supabaseCustom } from './src/integrations/supabase/client-custom';

async function generateAdminReport() {
  console.log('Gerando relatório de administradores...');
  try {
    const { data: profiles, error: profilesError } = await supabaseCustom
      .from('admin_profiles')
      .select('id, role');

    if (profilesError) throw new Error(`Erro ao buscar perfis: ${profilesError.message}`);
    if (!profiles || profiles.length === 0) {
      console.log('Nenhum administrador encontrado.');
      return;
    }

    const adminUsers = await Promise.all(
      profiles.map(async (profile) => {
        const { data: userResponse, error: userError } = await supabaseCustom.auth.admin.getUserById(profile.id);
        const email = userError ? `ID Órfão: ${profile.id}` : userResponse.user.email;
        return { email, role: profile.role };
      })
    );

    console.log('
--- Relatório de Acesso Administrativo ---');
    console.log('------------------------------------------');
    
    const superAdmins = adminUsers.filter(u => u.role === 'super_admin');
    const admins = adminUsers.filter(u => u.role === 'admin');

    console.log('
👑 SUPER ADMINS:');
    if (superAdmins.length > 0) {
      superAdmins.forEach(u => console.log(`   - ${u.email}`));
    } else {
      console.log('   Nenhum Super Admin encontrado.');
    }

    console.log('
🛡️ ADMINS:');
    if (admins.length > 0) {
      admins.forEach(u => console.log(`   - ${u.email}`));
    } else {
      console.log('   Nenhum Admin encontrado.');
    }
      
    console.log('
------------------------------------------');
  } catch (error) {
    const err = error as Error;
    console.error(`
❌ FALHA NA OPERAÇÃO: ${err.message}`);
  }
}

generateAdminReport();
