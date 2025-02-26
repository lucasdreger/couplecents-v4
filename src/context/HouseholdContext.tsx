import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface Household {
  id: string;
  name: string;
  created_at: string;
  created_by: string;
}

interface HouseholdContextType {
  currentHousehold: Household | null;
  households: Household[];
  loading: boolean;
  error: string | null;
  setCurrentHousehold: (household: Household) => void;
  createHousehold: (name: string) => Promise<{ error: any; data: any }>;
  joinHousehold: (id: string) => Promise<{ error: any }>;
  leaveHousehold: (id: string) => Promise<{ error: any }>;
  refreshHouseholds: () => Promise<void>;
}

const HouseholdContext = createContext<HouseholdContextType | undefined>(undefined);

export function HouseholdProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [currentHousehold, setCurrentHousehold] = useState<Household | null>(null);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load households when user changes
  useEffect(() => {
    if (user) {
      refreshHouseholds();
    } else {
      setHouseholds([]);
      setCurrentHousehold(null);
      setLoading(false);
    }
  }, [user]);

  // Fetch user's households
  const refreshHouseholds = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);

    try {
      // Get households the user belongs to
      const { data: userHouseholds, error: userHouseholdsError } = await supabase
        .from('user_households')
        .select('household_id')
        .eq('user_id', user.id);

      if (userHouseholdsError) throw userHouseholdsError;
      
      if (userHouseholds.length === 0) {
        setHouseholds([]);
        setCurrentHousehold(null);
        setLoading(false);
        return;
      }

      const householdIds = userHouseholds.map(uh => uh.household_id);

      // Get household details
      const { data: householdData, error: householdsError } = await supabase
        .from('households')
        .select('*')
        .in('id', householdIds);

      if (householdsError) throw householdsError;

      setHouseholds(householdData || []);
      
      // Set current household from local storage or use the first one
      const storedHouseholdId = localStorage.getItem('currentHouseholdId');
      const household = householdData?.find(h => h.id === storedHouseholdId) || householdData?.[0] || null;
      
      if (household) {
        setCurrentHousehold(household);
        localStorage.setItem('currentHouseholdId', household.id);
      }
    } catch (err: any) {
      console.error('Error fetching households:', err);
      setError(err.message || 'Failed to load households');
    } finally {
      setLoading(false);
    }
  };

  // Create a new household
  const createHousehold = async (name: string) => {
    if (!user) {
      return { error: new Error('User not authenticated'), data: null };
    }

    try {
      // Insert the new household
      const { data, error } = await supabase
        .from('households')
        .insert({ name, created_by: user.id })
        .select()
        .single();

      if (error) throw error;

      // Add user to the household
      const { error: joinError } = await supabase
        .from('user_households')
        .insert({
          user_id: user.id,
          household_id: data.id,
          role: 'owner',
        });

      if (joinError) throw joinError;

      // Update state
      await refreshHouseholds();
      
      return { data, error: null };
    } catch (err: any) {
      console.error('Error creating household:', err);
      return { error: err, data: null };
    }
  };

  // Join an existing household
  const joinHousehold = async (id: string) => {
    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    try {
      // Check if household exists
      const { data: household, error: checkError } = await supabase
        .from('households')
        .select('*')
        .eq('id', id)
        .single();

      if (checkError) throw checkError;

      // Check if user is already a member
      const { data: existingMembership, error: membershipError } = await supabase
        .from('user_households')
        .select('*')
        .eq('user_id', user.id)
        .eq('household_id', id)
        .maybeSingle();

      if (membershipError) throw membershipError;
      
      if (existingMembership) {
        return { error: new Error('You are already a member of this household') };
      }

      // Add user to the household
      const { error: joinError } = await supabase
        .from('user_households')
        .insert({
          user_id: user.id,
          household_id: id,
          role: 'member',
        });

      if (joinError) throw joinError;

      // Update state
      await refreshHouseholds();
      
      return { error: null };
    } catch (err: any) {
      console.error('Error joining household:', err);
      return { error: err };
    }
  };

  // Leave a household
  const leaveHousehold = async (id: string) => {
    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    try {
      // Remove user from household
      const { error } = await supabase
        .from('user_households')
        .delete()
        .eq('user_id', user.id)
        .eq('household_id', id);

      if (error) throw error;

      // If current household was left, select another
      if (currentHousehold?.id === id) {
        localStorage.removeItem('currentHouseholdId');
      }

      // Update state
      await refreshHouseholds();
      
      return { error: null };
    } catch (err: any) {
      console.error('Error leaving household:', err);
      return { error: err };
    }
  };

  // Handle setting current household with persistence
  const handleSetCurrentHousehold = (household: Household) => {
    setCurrentHousehold(household);
    localStorage.setItem('currentHouseholdId', household.id);
  };

  const value = {
    currentHousehold,
    households,
    loading,
    error,
    setCurrentHousehold: handleSetCurrentHousehold,
    createHousehold,
    joinHousehold,
    leaveHousehold,
    refreshHouseholds
  };

  return <HouseholdContext.Provider value={value}>{children}</HouseholdContext.Provider>;
}

export function useHousehold() {
  const context = useContext(HouseholdContext);
  
  if (context === undefined) {
    throw new Error('useHousehold must be used within a HouseholdProvider');
  }
  
  return context;
}