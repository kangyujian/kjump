import { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface CreateLinkFormProps {
  onCreate: (title: string, url: string, tags?: string) => void;
  onCancel: () => void;
}

/**
 * 创建链接表单组件
 */
export function CreateLinkForm({ onCreate, onCancel }: CreateLinkFormProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-raycast-bg border border-raycast-border rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-raycast-text">创建链接</h3>
          <button
            onClick={onCancel}
            className="p-1 rounded hover:bg-raycast-border transition-colors"
          >
            <X className="w-5 h-5 text-raycast-secondary" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-raycast-secondary mb-2">
              标题
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-raycast-border border border-raycast-border rounded-lg text-raycast-text placeholder-raycast-secondary focus:outline-none focus:ring-2 focus:ring-raycast-highlight"
              placeholder="输入链接标题"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-raycast-secondary mb-2">
              网址
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 bg-raycast-border border border-raycast-border rounded-lg text-raycast-text placeholder-raycast-secondary focus:outline-none focus:ring-2 focus:ring-raycast-highlight"
              placeholder="https://example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-raycast-secondary mb-2">
              标签（可选）
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 bg-raycast-border border border-raycast-border rounded-lg text-raycast-text placeholder-raycast-secondary focus:outline-none focus:ring-2 focus:ring-raycast-highlight"
              placeholder="工作, 工具, 开发"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-raycast-text bg-raycast-border hover:bg-opacity-80 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-raycast-highlight hover:bg-opacity-80 rounded-lg transition-colors"
            >
              创建
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}