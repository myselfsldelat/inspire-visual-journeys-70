
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabaseCustom, supabaseOperations } from '@/integrations/supabase/client-custom';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabaseOperations.getAdminProfiles();
      
      if (error) {
        console.error('Error checking admin status:', error);
        return { isAdmin: false, isSuperAdmin: false };
      }
      
      const adminProfile = data?.find((profile: any) => profile.id === userId);
      
      if (adminProfile) {
        const isSuper = adminProfile.role === 'super_admin';
        return {
          isAdmin: true,
          isSuperAdmin: isSuper
        };
      }
      
      return { isAdmin: false, isSuperAdmin: false };
    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
      return { isAdmin: false, isSuperAdmin: false };
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabaseCustom.auth.getSession();
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const { isAdmin: adminStatus, isSuperAdmin: superAdminStatus } = await checkAdminStatus(session.user.id);
          setIsAdmin(adminStatus);
          setIsSuperAdmin(superAdminStatus);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabaseCustom.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const { isAdmin: adminStatus, isSuperAdmin: superAdminStatus } = await checkAdminStatus(session.user.id);
          setIsAdmin(adminStatus);
          setIsSuperAdmin(superAdminStatus);
        } else {
          setIsAdmin(false);
          setIsSuperAdmin(false);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await supabaseCustom.auth.signOut();
      setUser(null);
      setIsAdmin(false);
      setIsSuperAdmin(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    loading,
    isAdmin,
    isSuperAdmin,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
