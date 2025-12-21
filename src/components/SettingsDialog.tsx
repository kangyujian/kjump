import { X } from 'lucide-react';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onClearData: () => void;
}

export function SettingsDialog({ isOpen, onClose, onClearData }: SettingsDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-raycast-overlay backdrop-blur-raycast animate-fade-in">
      <div className="w-full max-w-md bg-raycast-bg-secondary border border-raycast-border rounded-raycast-lg shadow-raycast-lg overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-raycast-border bg-raycast-bg-tertiary">
          <h2 className="text-lg font-semibold text-raycast-text">设置</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-raycast-sm bg-raycast-bg-tertiary hover:bg-raycast-border transition-all duration-200 transform hover:scale-105"
          >
            <X className="w-5 h-5 text-raycast-text-secondary" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-raycast-text-secondary mb-3 uppercase tracking-wider">数据管理</h3>
            <button
              onClick={() => {
                if (confirm('确定要清空所有链接吗？此操作不可恢复。')) {
                  onClearData();
                  onClose();
                }
              }}
              className="w-full flex items-center justify-center px-4 py-3 bg-raycast-error hover:bg-opacity-80 text-white text-sm font-medium rounded-raycast-sm transition-all duration-200 transform hover:scale-105 shadow-raycast"
            >
              清空所有数据
            </button>
            <p className="mt-3 text-xs text-raycast-text-tertiary text-center">
              这将永久删除所有已保存的链接，操作无法撤销。
            </p>
          </div>
          
          <div className="pt-6 border-t border-raycast-border">
            <div className="flex justify-between items-center text-sm text-raycast-text-secondary">
              <span>应用版本</span>
              <span className="font-mono bg-raycast-bg-tertiary px-2 py-1 rounded-raycast-sm">v0.1.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
