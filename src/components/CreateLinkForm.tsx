import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface CreateLinkFormProps {
  onCreate: (title: string, url: string, tags?: string) => void;
  onCancel: () => void;
  initialTitle?: string;
  initialUrl?: string;
  initialTags?: string;
}

/**
 * 创建链接表单组件
 */
export function CreateLinkForm({ onCreate, onCancel, initialTitle = '', initialUrl = '', initialTags = '' }: CreateLinkFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [url, setUrl] = useState(initialUrl);
  const [tags, setTags] = useState(initialTags);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 自动聚焦到标题输入框
    titleInputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && url.trim()) {
      onCreate(title.trim(), url.trim(), tags.trim());
      setTitle('');
      setUrl('');
      setTags('');
    }
  };

  return (
    <div className="fixed inset-0 bg-raycast-overlay backdrop-blur-raycast flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-raycast-bg-secondary border border-raycast-border rounded-raycast-lg p-8 w-full max-w-md mx-4 shadow-raycast-lg animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-raycast-text">创建链接</h3>
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
              网址
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-3 bg-raycast-bg-tertiary border-2 border-raycast-border rounded-raycast-sm text-raycast-text placeholder-raycast-text-tertiary focus:outline-none focus:ring-2 focus:ring-raycast-border-focus focus:border-raycast-border-focus transition-all duration-200"
              placeholder="https://example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-raycast-text-secondary mb-3">
              标签（可选）
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-3 bg-raycast-bg-tertiary border-2 border-raycast-border rounded-raycast-sm text-raycast-text placeholder-raycast-text-tertiary focus:outline-none focus:ring-2 focus:ring-raycast-border-focus focus:border-raycast-border-focus transition-all duration-200"
              placeholder="工作, 工具, 开发"
            />
          </div>
          
          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 text-raycast-text bg-raycast-bg-tertiary hover:bg-raycast-border rounded-raycast-sm transition-all duration-200 font-medium transform hover:scale-105"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 text-white bg-raycast-highlight hover:bg-raycast-highlight-hover rounded-raycast-sm transition-all duration-200 font-medium transform hover:scale-105 shadow-raycast"
            >
              创建链接
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}