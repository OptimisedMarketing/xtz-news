import { useState, useEffect, useCallback } from "react";

export interface AddressEntry {
  address: string;
  label: string;
  addedAt: number;
}

const STORAGE_KEY = "xtz_address_book";

function loadBook(): AddressEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveBook(entries: AddressEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {}
}

export function useAddressBook() {
  const [entries, setEntries] = useState<AddressEntry[]>(() => loadBook());

  // Sync to localStorage whenever entries change
  useEffect(() => {
    saveBook(entries);
  }, [entries]);

  const addEntry = useCallback((address: string, label: string) => {
    const trimAddr = address.trim();
    const trimLabel = label.trim() || trimAddr.slice(0, 12) + "…";
    setEntries(prev => {
      // Update if already exists
      if (prev.some(e => e.address === trimAddr)) {
        return prev.map(e => e.address === trimAddr ? { ...e, label: trimLabel } : e);
      }
      return [...prev, { address: trimAddr, label: trimLabel, addedAt: Date.now() }];
    });
  }, []);

  const removeEntry = useCallback((address: string) => {
    setEntries(prev => prev.filter(e => e.address !== address));
  }, []);

  const updateLabel = useCallback((address: string, label: string) => {
    setEntries(prev => prev.map(e => e.address === address ? { ...e, label: label.trim() } : e));
  }, []);

  const hasEntry = useCallback((address: string) => {
    return entries.some(e => e.address === address);
  }, [entries]);

  return { entries, addEntry, removeEntry, updateLabel, hasEntry };
}
