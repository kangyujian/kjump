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
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200">
        <Search className="h-5 w-5 text-raycast-text-secondary group-focus-within:text-raycast-highlight transition-colors duration-200" />
      </div>
      {isUrl && (
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center animate-scale-in">
          <div className="w-6 h-6 bg-raycast-highlight bg-opacity-20 rounded-full flex items-center justify-center">
            <Link className="h-3 w-3 text-raycast-highlight" />
          </div>
        </div>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        className="block w-full pl-12 pr-12 py-4 bg-raycast-bg-secondary border-2 border-raycast-border rounded-raycast text-raycast-text placeholder-raycast-text-secondary focus:outline-none focus:ring-2 focus:ring-raycast-border-focus focus:border-raycast-border-focus transition-all duration-200 hover:border-raycast-border-focus hover:bg-raycast-bg-tertiary"
        placeholder={placeholder}
        autoFocus
      />
      <div className="absolute inset-0 rounded-raycast pointer-events-none border-2 border-transparent group-focus-within:border-raycast-highlight opacity-0 group-focus-within:opacity-100 transition-opacity duration-200"></div>
    </div>
  );
}