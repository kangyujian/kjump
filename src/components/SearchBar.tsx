import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * 搜索栏组件
 */
export function SearchBar({ value, onChange, placeholder = "搜索链接..." }: SearchBarProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-raycast-secondary" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-3 py-3 bg-raycast-border border border-raycast-border rounded-xl text-raycast-text placeholder-raycast-secondary focus:outline-none focus:ring-2 focus:ring-raycast-highlight focus:border-transparent"
        placeholder={placeholder}
        autoFocus
      />
    </div>
  );
}