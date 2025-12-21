import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Link } from '../types/link';

/**
 * URL验证函数 - 支持多种格式
 */
const isValidUrl = (string: string): boolean => {
  if (!string.trim()) return false;
  
  try {
    const urlWithProtocol = string.startsWith('http://') || string.startsWith('https://') 
      ? string 
      : `https://${string}`;
    
    const url = new URL(urlWithProtocol);
    return url.hostname.includes('.') && url.hostname.length > 3;
  } catch (_) {
    return false;
  }
};

interface EditLinkFormProps {
  link: Link;
  onUpdate: (id: number, title: string, url: string, tags?: string) => void;
  onCancel: () => void;
}

/**
 * 编辑链接表单组件
 */
export function EditLinkForm({ link, onUpdate, onCancel }: EditLinkFormProps) {
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);
  const [tags, setTags] = useState(link.tags || '');
  const [urlError, setUrlError] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 自动聚焦到标题输入框
    titleInputRef.current?.focus();
  }, []);

  const validateAndSetUrl = (value: string) => {
    setUrl(value);
    if (value.trim() && !isValidUrl(value)) {
      setUrlError('请输入有效的网址 (如: example.com 或 https://example.com)');
    } else {
      setUrlError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && url.trim()) {
      if (!isValidUrl(url)) {
        setUrlError('请输入有效的网址');
        return;
      }
      // 处理标签为空的情况
      const processedTags = tags && tags.trim() ? tags.trim() : undefined;
      onUpdate(link.id, title.trim(), url.trim(), processedTags);
    }
  };

  return (
    <div className="fixed inset-0 bg-raycast-overlay backdrop-blur-raycast flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-raycast-bg-secondary border border-raycast-border rounded-raycast-lg p-8 w-full max-w-md mx-4 shadow-raycast-lg animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-raycast-text">编辑链接</h3>
          <button
            onClick={onCancel}
            className="p-2 rounded-raycast-sm bg-raycast-bg-tertiary hover:bg-raycast-border transition-all duration-200 transform hover:scale-105"
          >
            <X className="w-5 h-5 text-raycast-text-secondary" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-raycast-text-secondary mb-3">
              标题
            </label>
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-raycast-bg-tertiary border-2 border-raycast-border rounded-raycast-sm text-raycast-text placeholder-raycast-text-tertiary focus:outline-none focus:ring-2 focus:ring-raycast-border-focus focus:border-raycast-border-focus transition-all duration-200"
              placeholder="输入链接标题"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-raycast-text-secondary mb-3">
              URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => validateAndSetUrl(e.target.value)}
              className={`w-full px-4 py-3 bg-raycast-bg-tertiary border-2 rounded-raycast-sm text-raycast-text placeholder-raycast-text-tertiary focus:outline-none focus:ring-2 focus:ring-raycast-border-focus focus:border-raycast-border-focus transition-all duration-200 ${
                urlError ? 'border-raycast-error' : 'border-raycast-border'
              }`}
              placeholder="example.com 或 https://example.com"
              required
            />
            {urlError && (
              <p className="text-xs text-raycast-error mt-2">{urlError}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-raycast-text-secondary mb-3">
              标签 (可选)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-3 bg-raycast-bg-tertiary border-2 border-raycast-border rounded-raycast-sm text-raycast-text placeholder-raycast-text-tertiary focus:outline-none focus:ring-2 focus:ring-raycast-border-focus focus:border-raycast-border-focus transition-all duration-200"
              placeholder="工作, 工具, 学习"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-raycast-bg-tertiary hover:bg-raycast-border text-raycast-text rounded-raycast-sm transition-all duration-200 transform hover:scale-105 font-medium"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-raycast-highlight hover:bg-raycast-highlight-hover text-white rounded-raycast-sm transition-all duration-200 transform hover:scale-105 font-medium shadow-raycast"
            >
              更新
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}