import { create } from 'zustand';
import { Link } from '../types/link';

interface LinkStore {
  links: Link[];
  searchQuery: string;
  selectedIndex: number;
  isCreating: boolean;
  selectedCategory: string;
  setLinks: (links: Link[]) => void;
  setSearchQuery: (query: string) => void;
  setSelectedIndex: (index: number) => void;
  setIsCreating: (isCreating: boolean) => void;
  setSelectedCategory: (category: string) => void;
}

export const useLinkStore = create<LinkStore>((set) => ({
  links: [],
  searchQuery: '',
  selectedIndex: 0,
  isCreating: false,
  selectedCategory: 'all',
  setLinks: (links) => {
    console.log('LinkStore setLinks called with:', links.length, 'links');
    if (links.length > 0) {
      console.log('First link sample:', { id: links[0].id, title: links[0].title, tags: links[0].tags });
    }
    return set({ links });
  },
  setSearchQuery: (searchQuery) => set({ searchQuery, selectedIndex: 0 }),
  setSelectedIndex: (selectedIndex) => set({ selectedIndex }),
  setIsCreating: (isCreating) => set({ isCreating }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory })
}));