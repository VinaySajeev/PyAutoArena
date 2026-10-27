import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LocatorStrategy } from '../types';

interface InspectorContextType {
  isInspectorActive: boolean;
  toggleInspector: () => void;
  selectedElement: LocatorStrategy | null;
  inspectElement: (strategy: LocatorStrategy) => void;
  clearSelection: () => void;
  isCodeDrawerOpen: boolean;
  toggleCodeDrawer: () => void;
  activeFrameworkTab: 'selenium' | 'playwright';
  setActiveFrameworkTab: (fw: 'selenium' | 'playwright') => void;
}

const InspectorContext = createContext<InspectorContextType | undefined>(undefined);

export const InspectorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isInspectorActive, setIsInspectorActive] = useState(false);
  const [selectedElement, setSelectedElement] = useState<LocatorStrategy | null>(null);
  const [isCodeDrawerOpen, setIsCodeDrawerOpen] = useState(false);
  const [activeFrameworkTab, setActiveFrameworkTab] = useState<'selenium' | 'playwright'>('playwright');

  const toggleInspector = () => {
    setIsInspectorActive(prev => !prev);
    if (isInspectorActive) {
      setSelectedElement(null);
    }
  };

  const inspectElement = (strategy: LocatorStrategy) => {
    setSelectedElement(strategy);
  };

  const clearSelection = () => {
    setSelectedElement(null);
  };

  const toggleCodeDrawer = () => {
    setIsCodeDrawerOpen(prev => !prev);
  };

  return (
    <InspectorContext.Provider
      value={{
        isInspectorActive,
        toggleInspector,
        selectedElement,
        inspectElement,
        clearSelection,
        isCodeDrawerOpen,
        toggleCodeDrawer,
        activeFrameworkTab,
        setActiveFrameworkTab,
      }}
    >
      {children}
    </InspectorContext.Provider>
  );
};

export const useInspector = () => {
  const context = useContext(InspectorContext);
  if (!context) {
    throw new Error('useInspector must be used within an InspectorProvider');
  }
  return context;
};
