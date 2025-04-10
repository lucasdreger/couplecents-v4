import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isInitialized: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUp: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    console.log("AuthProvider: initializing");
    let isSubscribed = true;
    
    // Get the initial session
    const getInitialSession = async () => {
      try {
        console.log("AuthProvider: getting initial session");
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("AuthProvider: got initial session", initialSession);
        
        // Only update state if component is still mounted
        if (isSubscribed) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          setLoading(false);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
        if (isSubscribed) {
          setLoading(false);
          setIsInitialized(true);
        }
      }
    };

    getInitialSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        console.log("AuthProvider: auth state changed", _event, newSession?.user?.email);
        
        if (isSubscribed) {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          setLoading(false);
          setIsInitialized(true);
        }
      }
    );

    // Add a safety timeout to prevent infinite loading
    const safetyTimeout = setTimeout(() => {
      if (isSubscribed && loading) {
        console.log("AuthProvider: Safety timeout reached, forcing loading to complete");
        setLoading(false);
        setIsInitialized(true);
      }
    }, 5000);

    // Cleanup function
    return () => {
      isSubscribed = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, [loading]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("AuthProvider: signing in", email);
      const result = await supabase.auth.signInWithPassword({ email, password });
      if (result.error) {
        console.error("Sign in error:", result.error);
        toast.error(result.error.message);
      } else {
        console.log("Sign in successful");
        toast.success("Signed in successfully");
      }
      return result;
    } catch (error) {
      console.error("Unexpected error during sign in:", error);
      toast.error("An unexpected error occurred");
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log("AuthProvider: signing up", email);
      const result = await supabase.auth.signUp({ email, password });
      if (result.error) {
        console.error("Sign up error:", result.error);
        toast.error(result.error.message);
      } else {
        console.log("Sign up successful");
        toast.success("Signed up successfully! Check your email to confirm your account.");
      }
      return result;
    } catch (error) {
      console.error("Unexpected error during sign up:", error);
      toast.error("An unexpected error occurred");
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log("AuthProvider: signing out");
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log("AuthProvider: resetting password", email);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error("Reset password error:", error);
        toast.error(error.message);
      } else {
        toast.success("Password reset instructions sent to your email");
      }
      
      return { error };
    } catch (error) {
      console.error("Unexpected error during password reset:", error);
      toast.error("An unexpected error occurred");
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    isInitialized,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  console.log("AuthProvider rendering, user:", user?.email, "loading:", loading, "initialized:", isInitialized);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
