"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface StackBalanceState {
  balance: number;
  allowance: number;
  used: number;
  status: string;
  subscription: string | null;
  usagePeriodEndsAt: string | null;
  isLoading: boolean;
  error: string | null;
}

interface StackBalanceContextType {
  stackData: StackBalanceState;
  refreshBalance: () => Promise<void>;
  debitStacks: (amount: number) => void;
}

const initialState: StackBalanceState = {
  balance: 0,
  allowance: 0,
  used: 0,
  status: 'unknown',
  subscription: null,
  usagePeriodEndsAt: null,
  isLoading: true,
  error: null
};

const StackBalanceContext = createContext<StackBalanceContextType | undefined>(undefined);

export function StackBalanceProvider({ children }: { children: ReactNode }) {
  const [stackData, setStackData] = useState<StackBalanceState>(initialState);

  // Fetch the user's stack balance from the API
  const fetchBalance = async () => {
    setStackData(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await fetch('/api/user-balance', { credentials: 'include' });
      const data = await response.json();
      
      // Handle authentication error flag without throwing an error
      if (data.isAuthError) {
        console.log('User not authenticated, setting default balance values');
        setStackData(prev => ({
          ...initialState,
          isLoading: false,
          error: 'Please log in to view your balance'
        }));
        return;
      }
      
      // Otherwise, process the normal response
      setStackData({
        balance: data.balance,
        allowance: data.allowance,
        used: data.used,
        status: data.status,
        subscription: data.subscription || null,
        usagePeriodEndsAt: data.usagePeriodEndsAt,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching balance:', error);
      setStackData(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      }));
    }
  };

  // Initial fetch on component mount - use a ref to prevent multiple calls
  const initialFetchDone = React.useRef(false);
  useEffect(() => {
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchBalance();
    }
  }, []);

  // Refresh the balance data - wrapped in useCallback to avoid recreation on each render
  const refreshBalance = useCallback(async (): Promise<void> => {
    await fetchBalance();
  }, []);

  // Update balance after a debit operation - called after API responses
  const debitStacks = useCallback((amount: number): void => {
    setStackData(prev => ({
      ...prev,
      balance: prev.balance - amount,
      used: prev.used + amount
    }));
  }, []);

  const value = {
    stackData,
    refreshBalance,
    debitStacks
  };

  return (
    <StackBalanceContext.Provider value={value}>
      {children}
    </StackBalanceContext.Provider>
  );
}

export function useStackBalance() {
  const context = useContext(StackBalanceContext);
  if (context === undefined) {
    throw new Error('useStackBalance must be used within a StackBalanceProvider');
  }
  return context;
}
