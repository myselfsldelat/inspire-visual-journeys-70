
import { supabaseCustom } from '@/integrations/supabase/client-custom';

export interface AdminUser {
  email: string;
  role: string;
}

export const reportService = {
  async getAdminReport(): Promise<{ superAdmins: AdminUser[], admins: AdminUser[] }> {
    // 1. Buscar todos os perfis de administrador
    const { data: profiles, error: profilesError } = await supabaseCustom
      .from('admin_profiles')
      .select('id, role');

    if (profilesError) {
      throw new Error(`Erro ao buscar perfis: ${profilesError.message}`);
    }

    if (!profiles || profiles.length === 0) {
      return { superAdmins: [], admins: [] };
    }

    // 2. Para cada perfil, buscar o email correspondente
    const adminUsers = await Promise.all(
      profiles.map(async (profile) => {
        const { data: userResponse, error: userError } = await supabaseCustom.auth.admin.getUserById(profile.id);
        const email = userError ? `ID Órfão: ${profile.id}` : userResponse.user.email;
        return { email, role: profile.role };
      })
    );

    // 3. Organizar e retornar os dados
    return {
      superAdmins: adminUsers.filter(u => u.role === 'super_admin'),
      admins: adminUsers.filter(u => u.role === 'admin')
    };
  }
};
