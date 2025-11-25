import React, { createContext, useContext, useState, useCallback } from 'react';

// Define the shape of screen state that headers might need
interface ScreenState {
  searchQuery?: string;
  selectedItems?: string[];
  filterOptions?: any;
  isLoading?: boolean;
  notifications?: number;
  userData?: any;
  showBackButton?: boolean; // Whether to show back button in header
  [key: string]: any; // Allow for custom state
}

// Define actions that headers can trigger
interface ScreenActions {
  homeScreenActions?: {
    onSettingsPress?: () => void;
  };
  onSearch?: (query: string) => void;
  onFilter?: (filters: any) => void;
  onAdd?: () => void;
  onDelete?: (items: string[]) => void;
  onRefresh?: () => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
  [key: string]: any; // Allow for custom actions
}

interface ScreenContextValue {
  state: ScreenState;
  actions: ScreenActions;
  updateState: (newState: Partial<ScreenState>) => void;
  registerActions: (newActions: Partial<ScreenActions>) => void;
}

const ScreenContext = createContext<ScreenContextValue | undefined>(undefined);

// Provider component to wrap screens
export const ScreenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ScreenState>({});
  const [actions, setActions] = useState<ScreenActions>({});

  const updateState = useCallback((newState: Partial<ScreenState>) => {
    setState(prev => ({ ...prev, ...newState }));
  }, []);

  const registerActions = useCallback((newActions: Partial<ScreenActions>) => {
    setActions(prev => ({ ...prev, ...newActions }));
  }, []);

  return (
    <ScreenContext.Provider value={{ state, actions, updateState, registerActions }}>
      {children}
    </ScreenContext.Provider>
  );
};

// Hook to use screen context
export const useScreenContext = () => {
  const context = useContext(ScreenContext);
  if (!context) {
    throw new Error('useScreenContext must be used within a ScreenProvider');
  }
  return context;
};
