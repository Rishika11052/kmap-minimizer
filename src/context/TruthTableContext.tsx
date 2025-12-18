import { createContext, useContext, useState, useMemo } from "react";
import type { ReactNode } from "react";

interface TruthTableContextType {
  truthTableValues: string[];
  setTruthTableValues: (values: string[]) => void;
  numVariables: number;
  resetTruthTable: () => void;
  isTableEmpty: () => boolean;
}

const TruthTableContext = createContext<TruthTableContextType | undefined>(undefined);

export function TruthTableProvider({ children }: { children: ReactNode }) {
  const [truthTableValues, setTruthTableValues] = useState<string[]>([]);

  // Memoized calculation of number of variables
  const numVariables = useMemo(() => {
    if (truthTableValues.length === 0) return 0;
    return Math.round(Math.log2(truthTableValues.length));
  }, [truthTableValues.length]);

  const resetTruthTable = () => {
    setTruthTableValues([]);
  };

  const isTableEmpty = () => {
    return truthTableValues.length === 0 || truthTableValues.every(val => val === "" || val === null);
  };

  const value = {
    truthTableValues,
    setTruthTableValues,
    numVariables,
    resetTruthTable,
    isTableEmpty,
  };

  return (
    <TruthTableContext.Provider value={value}>
      {children}
    </TruthTableContext.Provider>
  );
}

export function useTruthTable() {
  const context = useContext(TruthTableContext);
  if (context === undefined) {
    throw new Error("useTruthTable must be used within a TruthTableProvider");
  }
  return context;
}
