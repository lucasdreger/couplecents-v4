import { createContext, useContext, useEffect, useState } from "react";
import { User, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  error: AuthError | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    console.log("AuthProvider: initializing");
    // Get the initial session
    const getInitialSession = async () => {
      try {
        console.log("AuthProvider: getting initial session");
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("AuthProvider: got initial session", initialSession);
        setUser(initialSession?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error("Error getting initial session:", error);
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("AuthProvider: auth state changed", _event, session?.user?.email);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      console.log("AuthProvider: signing in", email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error("Sign in error:", error);
        toast.error(error.message);
        throw error;
      } else {
        console.log("Sign in successful");
        toast.success("Signed in successfully");
      }
    } catch (error) {
      setError(error as AuthError);
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
      setError(null);
      console.log("AuthProvider: signing out");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        toast.error(error.message);
        throw error;
      } else {
        toast.success("Signed out successfully");
      }
    } catch (error) {
      setError(error as AuthError);
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
    signIn,
    signOut,
    loading,
    error,
  };

  console.log("AuthProvider rendering, user:", user?.email);
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
