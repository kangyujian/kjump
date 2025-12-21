import { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';
import { useLinkStore } from '../store/linkStore';

/**
 * 标签筛选按钮组件
 * 显示一个按钮，点击后展开下拉菜单列出所有标签，支持选择“全部”或具体标签
 */
export function TagFilterButton() {
  const { links, selectedCategory, setSelectedCategory } = useLinkStore();
  const [open, setOpen] = useState(false);

  const tags = useMemo(() => {
    const set = new Set<string>();
    links.forEach(l => (l.tags || '').split(',').map(t => t.trim()).filter(Boolean).forEach(t => set.add(t)));
    return Array.from(set).sort();
  }, [links]);

  const currentLabel = selectedCategory.startsWith('tag:')
    ? selectedCategory.slice(4)
    : '全部';

  const handleSelect = (cat: string) => {
    setSelectedCategory(cat);
    setOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center space-x-2 px-3 py-2 rounded-raycast-sm bg-raycast-bg-secondary hover:bg-raycast-bg-tertiary text-sm"
      >
        <Filter className="w-4 h-4" />
        <span>{currentLabel}</span>
      </button>
      {open && (
        <div className="absolute z-50 mt-2 w-48 rounded-raycast bg-raycast-bg-secondary shadow-raycast border border-raycast-bg-tertiary p-2">
          <button
            onClick={() => handleSelect('all')}
            className={`w-full text-left px-2 py-2 rounded-raycast-sm text-sm ${selectedCategory==='all' ? 'bg-raycast-highlight bg-opacity-20' : 'hover:bg-raycast-bg-tertiary'}`}
          >
            全部
          </button>
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => handleSelect(`tag:${tag}`)}
              className={`w-full text-left px-2 py-2 rounded-raycast-sm text-sm ${selectedCategory===`tag:${tag}` ? 'bg-raycast-highlight bg-opacity-20' : 'hover:bg-raycast-bg-tertiary'}`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
