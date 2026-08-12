"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Product } from "@/types/product";

interface CompareContextType {
  compareItems: Product[];
  toggleCompare: (product: Product) => void;
  isInCompare: (id: string | number) => boolean;
  removeFromCompare: (id: string | number) => void;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const STORAGE_KEY = "compare";
const MAX_COMPARE_ITEMS = 4;

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [compareItems, setCompareItems] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setCompareItems(JSON.parse(stored));
    } catch (e) {
      console.error("Failed to load compare items", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compareItems));
    }
  }, [compareItems, isLoaded]);

  const toggleCompare = (product: Product) => {
    setCompareItems((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      if (prev.length >= MAX_COMPARE_ITEMS) return prev; // limitdan oshmasin
      return [...prev, product];
    });
  };

  const isInCompare = (id: string | number) => compareItems.some((p) => p.id === id);

  const removeFromCompare = (id: string | number) => {
    setCompareItems((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCompare = () => setCompareItems([]);

  return (
    <CompareContext.Provider
      value={{ compareItems, toggleCompare, isInCompare, removeFromCompare, clearCompare }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
};