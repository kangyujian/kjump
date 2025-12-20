import { ExternalLink, Trash2 } from 'lucide-react';
import { Link } from '../types/link';

interface LinkItemProps {
  link: Link;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}

/**
 * 链接列表项组件
 */
export function LinkItem({ link, isSelected, onClick, onDelete }: LinkItemProps) {
  return (
    <div
      className={`
        flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 group
        ${isSelected ? 'bg-raycast-highlight bg-opacity-20' : 'hover:bg-raycast-border'}
      `}
      onClick={onClick}
    >
      <div className="flex-shrink-0 w-8 h-8 mr-3 flex items-center justify-center">
        {link.favicon ? (
          <img src={link.favicon} alt="" className="w-5 h-5" />
        ) : (
          <ExternalLink className="w-5 h-5 text-raycast-secondary" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-raycast-text truncate">
          {link.title}
        </div>
        <div className="text-xs text-raycast-secondary truncate">
          {link.url}
        </div>
      </div>
      
      <div className="flex items-center space-x-2 ml-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 rounded hover:bg-raycast-border opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-4 h-4 text-raycast-secondary hover:text-red-400" />
        </button>
      </div>
    </div>
  );
}