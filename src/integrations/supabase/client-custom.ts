import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://hfjkmuonmttsjogmsxak.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmamttdW9ubXR0c2pvZ21zeGFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyMjI5OTgsImV4cCI6MjA2Mzc5ODk5OH0.thgO0hwb2XTupV67mwgQmxokH4ziUK2XQTeU1X38VvI";

// Create a Supabase client without strict typing to avoid type errors
export const supabaseCustom = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

// Type-safe wrapper functions for common operations
export const supabaseOperations = {
  // Gallery items operations
  async getGalleryItems() {
    return await supabaseCustom
      .from('gallery_items')
      .select('*')
      .order('created_at', { ascending: false });
  },

  async updateGalleryItem(id: string, data: any) {
    return await supabaseCustom
      .from('gallery_items')
      .update(data)
      .eq('id', id);
  },

  async deleteGalleryItem(id: string) {
    return await supabaseCustom
      .from('gallery_items')
      .delete()
      .eq('id', id);
  },

  // Comments operations
  async getComments(isApproved: boolean, page: number, pageSize: number) {
    return await supabaseCustom
      .from('comments')
      .select(`
        *,
        gallery_title:gallery_items(title),
        gallery_image:gallery_items(image)
      `, { count: 'exact' })
      .eq('is_approved', isApproved)
      .range((page - 1) * pageSize, page * pageSize - 1)
      .order('created_at', { ascending: false });
  },

  async updateComment(id: string, data: any) {
    return await supabaseCustom
      .from('comments')
      .update(data)
      .eq('id', id);
  },

  async deleteComment(id: string) {
    return await supabaseCustom
      .from('comments')
      .delete()
      .eq('id', id);
  },

  // Admin profiles operations
  async getAdminProfiles() {
    return await supabaseCustom
      .from('admin_profiles')
      .select('id, role, created_at');
  },

  async insertAdminProfile(data: any) {
    return await supabaseCustom
      .from('admin_profiles')
      .insert([data]);
  },

  async deleteAdminProfile(id: string) {
    return await supabaseCustom
      .from('admin_profiles')
      .delete()
      .eq('id', id);
  },

  async updateAdminProfile(id: string, data: any) {
    return await supabaseCustom
      .from('admin_profiles')
      .update(data)
      .eq('id', id);
  },

  // System stats operations
  async getSystemStats() {
    return await supabaseCustom
      .from('system_stats')
      .select('*')
      .order('stat_date', { ascending: false })
      .limit(10);
  },

  // Audit logs operations
  async getAuditLogs(page: number, pageSize: number, filters: any = {}) {
    let query = supabaseCustom
      .from('audit_logs')
      .select('*', { count: 'exact' })
      .range((page - 1) * pageSize, page * pageSize - 1)
      .order('created_at', { ascending: false });
    
    if (filters.search) {
      query = query.or(`entity_id.ilike.%${filters.search}%,details.ilike.%${filters.search}%`);
    }
    
    if (filters.actionFilter) {
      query = query.eq('action', filters.actionFilter);
    }
    
    if (filters.entityFilter) {
      query = query.eq('entity', filters.entityFilter);
    }
    
    return await query;
  },

  // Site Content operations
  async getSiteContent() {
    return await supabaseCustom
      .from('site_content')
      .select('*');
  },
  async updateSiteContent(updates: { key: string; content: string }[]) {
    return await supabaseCustom
      .from('site_content')
      .upsert(updates, { onConflict: 'key' });
  },

  // RPC functions
  async getAllUsers() {
    return await supabaseCustom.rpc('get_all_users');
  },

  async getUserByEmail(email: string) {
    return await supabaseCustom.rpc('get_user_by_email', { user_email: email });
  },

  async getUserById(userId: string) {
    return await supabaseCustom.rpc('get_user_by_id', { user_id: userId });
  }
};
