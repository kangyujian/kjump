import { create } from 'zustand';
import { Link } from '../types/link';

interface LinkStore {
  links: Link[];
  searchQuery: string;
  selectedIndex: number;
  isCreating: boolean;
  setLinks: (links: Link[]) => void;
  setSearchQuery: (query: string) => void;
  setSelectedIndex: (index: number) => void;
  setIsCreating: (isCreating: boolean) => void;
}

export const useLinkStore = create<LinkStore>((set) => ({
  links: [],
  searchQuery: '',
  selectedIndex: 0,
  isCreating: false,
  setLinks: (links) => set({ links }),
  setSearchQuery: (searchQuery) => set({ searchQuery, selectedIndex: 0 }),
  setSelectedIndex: (selectedIndex) => set({ selectedIndex }),
  setIsCreating: (isCreating) => set({ isCreating })
}));