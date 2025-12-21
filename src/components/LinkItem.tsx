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
        flex items-center p-4 rounded-raycast cursor-pointer transition-all duration-200 group relative overflow-hidden
        ${isSelected 
          ? 'bg-raycast-highlight bg-opacity-15 shadow-raycast border border-raycast-highlight' 
          : 'bg-raycast-bg-secondary hover:bg-raycast-bg-tertiary border border-transparent hover:shadow-raycast'
        }
      `}
      onClick={onClick}
    >
      {/* 选中状态指示器 */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-raycast-highlight"></div>
      )}
      
      {/* 图标区域 */}
      <div className="flex-shrink-0 w-10 h-10 mr-4 flex items-center justify-center">
        {link.favicon ? (
          <img 
            src={link.favicon} 
            alt="" 
            className="w-6 h-6 rounded-sm object-contain bg-white bg-opacity-10 p-1"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : (
          <div className="w-6 h-6 bg-raycast-bg-tertiary rounded-sm flex items-center justify-center">
            <ExternalLink className="w-4 h-4 text-raycast-text-secondary" />
          </div>
        )}
        <div className="w-6 h-6 bg-raycast-bg-tertiary rounded-sm flex items-center justify-center hidden">
          <ExternalLink className="w-4 h-4 text-raycast-text-secondary" />
        </div>
      </div>
      
      {/* 内容区域 */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-raycast-text truncate mb-1">
          {link.title}
        </div>
        <div className="text-xs text-raycast-text-secondary truncate">
          {link.url}
        </div>
        {link.tags && (
          <div className="flex items-center mt-2">
            <span className="text-xs text-raycast-text-tertiary bg-raycast-bg-tertiary px-2 py-1 rounded-raycast-sm">
              {link.tags}
            </span>
          </div>
        )}
      </div>
      
      {/* 访问计数 */}
      <div className="flex items-center space-x-2 ml-4">
        {link.visit_count > 0 && (
          <div className="text-xs text-raycast-text-tertiary bg-raycast-bg-tertiary px-2 py-1 rounded-raycast-sm">
            {link.visit_count}
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-2 rounded-raycast-sm bg-raycast-bg-tertiary hover:bg-raycast-error hover:bg-opacity-20 opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
        >
          <Trash2 className="w-4 h-4 text-raycast-text-secondary hover:text-raycast-error transition-colors duration-200" />
        </button>
      </div>
    </div>
  );
}