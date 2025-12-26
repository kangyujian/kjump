import { useEffect, useMemo, useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { Task } from '../types/task';
import { CheckCircle2, Circle, Calendar, Trash2, Pencil, Plus } from 'lucide-react';

/**
 * 渲染任务项
 */
function TaskItem({
  task,
  selected,
  onToggle,
  onDelete,
  onEdit,
}: {
  task: Task;
  selected: boolean;
  onToggle: (id: number, done: boolean) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
}) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 rounded-raycast-sm ${
        selected ? 'bg-raycast-bg-secondary' : 'bg-raycast-bg-tertiary'
      }`}
    >
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onToggle(task.id, !task.completed)}
          className="p-1 rounded hover:bg-raycast-bg-secondary"
        >
          {task.completed ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : (
            <Circle className="w-5 h-5 text-raycast-text-secondary" />
          )}
        </button>
        <div>
          <div className={`text-sm ${task.completed ? 'line-through text-raycast-text-tertiary' : ''}`}>
            {task.title}
          </div>
          {task.notes && (
            <div className="text-xs text-raycast-text-tertiary">{task.notes}</div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={() => onEdit(task)} className="p-2 rounded hover:bg-raycast-bg-secondary">
          <Pencil className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(task.id)} className="p-2 rounded hover:bg-raycast-bg-secondary">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/**
 * 任务编辑表单
 */
function TaskEditor({
  initial,
  date,
  onSave,
  onCancel,
}: {
  initial?: Task;
  date: string;
  onSave: (title: string, notes?: string, date?: string) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [targetDate, setTargetDate] = useState(date);
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-raycast-bg rounded-raycast p-6 w-full max-w-md">
        <div className="text-lg font-medium mb-4">{initial ? '编辑任务' : '新建任务'}</div>
        <div className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-raycast-sm bg-raycast-bg-secondary outline-none"
            placeholder="任务标题"
          />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 rounded-raycast-sm bg-raycast-bg-secondary outline-none"
            placeholder="备注（可选）"
          />
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="px-3 py-2 rounded-raycast-sm bg-raycast-bg-secondary outline-none"
          />
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onCancel} className="px-3 py-2 rounded-raycast-sm bg-raycast-bg-secondary">
            取消
          </button>
          <button
            onClick={() => onSave(title.trim(), notes.trim() || undefined, targetDate)}
            className="px-3 py-2 rounded-raycast-sm bg-raycast-highlight hover:bg-raycast-highlight-hover"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * 任务管理页面
 */
export default function TaskManager() {
  const { tasks, selectedDate, selectedIndex, isCreating, setTasks, setSelectedDate, setIsCreating } =
    useTaskStore();
  const [editing, setEditing] = useState<Task | null>(null);
  const [onlyIncomplete, setOnlyIncomplete] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (window.electronAPI) {
        const result = await window.electronAPI.getTasksByDate(selectedDate);
        setTasks(result);
      } else {
        setTasks([]);
      }
    };
    load();
  }, [selectedDate, setTasks]);

  const displayTasks = useMemo(() => {
    const base = tasks.slice();
    return onlyIncomplete ? base.filter((t) => !t.completed) : base;
  }, [tasks, onlyIncomplete]);

  const onToggle = async (id: number, done: boolean) => {
    if (window.electronAPI) {
      await window.electronAPI.toggleTaskCompleted(id, done);
    }
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: done ? 1 : 0 } : t)));
  };

  const onDelete = async (id: number) => {
    if (window.electronAPI) {
      await window.electronAPI.deleteTask(id);
    }
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const onCreate = async (title: string, notes?: string, date?: string) => {
    const d = date || selectedDate;
    if (window.electronAPI) {
      const created = await window.electronAPI.createTask({ title, notes, date: d });
      setTasks([created, ...tasks]);
    } else {
      setTasks([
        {
          id: Date.now(),
          title,
          notes,
          date: d,
          completed: 0,
          created_at: new Date(),
          updated_at: new Date(),
        },
        ...tasks,
      ]);
    }
    setIsCreating(false);
  };

  const onUpdate = async (id: number, title: string, notes?: string, date?: string) => {
    if (window.electronAPI) {
      await window.electronAPI.updateTask(id, { title, notes, date });
    }
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, title, notes, date: date || t.date, updated_at: new Date() } : t)),
    );
    setEditing(null);
  };

  return (
    <div className="min-h-screen bg-raycast-bg text-raycast-text font-sf-pro animate-fade-in">
      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-raycast-highlight to-blue-600 rounded-raycast flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-semibold">任务管理</h1>
          </div>
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={onlyIncomplete}
                onChange={(e) => setOnlyIncomplete(e.target.checked)}
              />
              <span>仅看未完成</span>
            </label>
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-raycast-highlight hover:bg-raycast-highlight-hover rounded-raycast-sm transition-all duration-200 transform hover:scale-105 shadow-raycast"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">新建</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3 mb-6">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 rounded-raycast-sm bg-raycast-bg-secondary outline-none"
          />
        </div>

        <div className="space-y-3">
          {displayTasks.length === 0 ? (
            <div className="text-center text-raycast-text-secondary py-12">该日期暂无任务</div>
          ) : (
            displayTasks.map((task, idx) => (
              <TaskItem
                key={task.id}
                task={task}
                selected={idx === selectedIndex}
                onToggle={onToggle}
                onDelete={onDelete}
                onEdit={setEditing}
              />
            ))
          )}
        </div>
      </div>

      {isCreating && (
        <TaskEditor
          date={selectedDate}
          onSave={(title, notes, date) => onCreate(title, notes, date)}
          onCancel={() => setIsCreating(false)}
        />
      )}

      {editing && (
        <TaskEditor
          initial={editing}
          date={editing.date}
          onSave={(title, notes, date) => onUpdate(editing.id, title, notes, date)}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}

