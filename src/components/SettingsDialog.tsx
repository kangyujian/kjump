import { X } from 'lucide-react';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onClearData: () => void;
}

export function SettingsDialog({ isOpen, onClose, onClearData }: SettingsDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md bg-raycast-bg border border-raycast-border rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-raycast-border bg-raycast-secondary bg-opacity-10">
          <h2 className="text-sm font-semibold text-raycast-text">设置</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-raycast-border transition-colors text-raycast-secondary hover:text-raycast-text"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <h3 className="text-xs font-medium text-raycast-secondary mb-2 uppercase tracking-wider">数据管理</h3>
            <button
              onClick={() => {
                if (confirm('确定要清空所有链接吗？此操作不可恢复。')) {
                  onClearData();
                  onClose();
                }
              }}
              className="w-full flex items-center justify-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              清空所有数据
            </button>
            <p className="mt-2 text-xs text-raycast-secondary text-center">
              这将删除所有已保存的链接。
            </p>
          </div>
          
          <div className="pt-4 border-t border-raycast-border">
            <div className="flex justify-between items-center text-xs text-raycast-secondary">
              <span>版本</span>
              <span>v0.1.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
