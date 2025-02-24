import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Session, AuthError } from '@supabase/supabase-js';

interface AuthContextType {
  userId: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): React.ReactElement {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Check active sessions and set the user
    checkUser();
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: string, session: Session | null) => {
      if (session?.user) {
        setUserId(session.user.id);
        setLoading(false);
      } else {
        setUserId(null);
        setLoading(false);
        queryClient.resetQueries();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  async function checkUser() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (session?.user) {
        setUserId(session.user.id);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (data.user) {
        setUserId(data.user.id);
        navigate('/');
      }
    } catch (error) {
      if (error instanceof AuthError) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password');
        }
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear all local storage data
      Object.keys(localStorage)
        .filter(key => key.startsWith('sb-'))
        .forEach(key => localStorage.removeItem(key));
      
      queryClient.resetQueries();
      setUserId(null);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  if (loading) {
    return React.createElement(React.Fragment);
  }

  return React.createElement(AuthContext.Provider,
    {
      value: {
        userId,
        loading,
        signIn,
        signOut,
      }
    },
    children
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
