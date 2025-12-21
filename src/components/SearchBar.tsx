import { Search, Link } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onEnterPress?: (value: string) => void;
  placeholder?: string;
}

/**
 * 检测是否为有效URL格式
 */
function isValidUrl(string: string): boolean {
  try {
    // 添加协议前缀如果缺失
    const urlWithProtocol = string.startsWith('http://') || string.startsWith('https://') 
      ? string 
      : `https://${string}`;
    
    const url = new URL(urlWithProtocol);
    // 验证域名格式
    return url.hostname.includes('.') && url.hostname.length > 3;
  } catch (_) {
    return false;
  }
}

/**
 * 搜索栏组件 - 支持URL检测和快速创建
 */
export function SearchBar({ value, onChange, onEnterPress, placeholder = "搜索链接..." }: SearchBarProps) {
  const [isUrl, setIsUrl] = useState(false);

  useEffect(() => {
    setIsUrl(isValidUrl(value));
  }, [value]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onEnterPress) {
      e.preventDefault();
      onEnterPress(value);
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-raycast-secondary" />
      </div>
      {isUrl && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <Link className="h-4 w-4 text-raycast-highlight" />
        </div>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        className="block w-full pl-10 pr-10 py-3 bg-raycast-border border border-raycast-border rounded-xl text-raycast-text placeholder-raycast-secondary focus:outline-none focus:ring-2 focus:ring-raycast-highlight focus:border-transparent"
        placeholder={placeholder}
        autoFocus
      />
    </div>
  );
}