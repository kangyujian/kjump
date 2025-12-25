import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
import { Link } from '../types/link';
import { Task } from '../types/task';

let db: Database.Database | null = null;

/**
 * 初始化数据库连接
 */
export function initDatabase(): void {
  const dbPath = path.join(app.getPath('userData'), 'links.db');
  db = new Database(dbPath);
  
  createTables();
  insertDefaultSettings();
  insertSampleTasks();
}

/**
 * 创建数据库表
 */
function createTables(): void {
  const createLinksTable = `
    CREATE TABLE IF NOT EXISTS links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      url TEXT NOT NULL UNIQUE,
      favicon TEXT,
      tags TEXT,
      visit_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createSettingsTable = `
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createTasksTable = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      notes TEXT,
      date TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createLinksIndexes = `
    CREATE INDEX IF NOT EXISTS idx_links_title ON links(title);
    CREATE INDEX IF NOT EXISTS idx_links_url ON links(url);
    CREATE INDEX IF NOT EXISTS idx_links_created_at ON links(created_at DESC);
  `;

  const createTasksIndexes = `
    CREATE INDEX IF NOT EXISTS idx_tasks_date ON tasks(date);
    CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
    CREATE INDEX IF NOT EXISTS idx_tasks_updated_at ON tasks(updated_at DESC);
  `;

  db!.exec(createLinksTable);
  db!.exec(createSettingsTable);
  db!.exec(createTasksTable);
  db!.exec(createLinksIndexes);
  db!.exec(createTasksIndexes);
}

/**
 * 插入默认设置
 */
function insertDefaultSettings(): void {
  const defaultSettings = [
    { key: 'global_shortcut', value: 'Command+Shift+L' },
    { key: 'theme', value: 'dark' },
    { key: 'window_width', value: '600' },
    { key: 'window_height', value: '400' }
  ];

  const stmt = db!.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  
  for (const setting of defaultSettings) {
    stmt.run(setting.key, setting.value);
  }
}

/**
 * 若任务表为空，则插入示例任务
 */
function insertSampleTasks(): void {
  const count = db!.prepare('SELECT COUNT(1) as c FROM tasks').get() as { c: number };
  if (count.c > 0) return;
  const today = new Date().toISOString().slice(0, 10);
  const stmt = db!.prepare('INSERT INTO tasks (title, notes, date) VALUES (?, ?, ?)');
  stmt.run('了解项目结构', '浏览并熟悉现有链接管理模块', today);
  stmt.run('设计任务管理PRD', '明确按天归档与交互', today);
  stmt.run('实现任务页UI', '美观、简洁且键盘友好', today);
}
/**
 * 获取所有链接
 */
export function getAllLinks(): Link[] {
  const stmt = db!.prepare(`
    SELECT * FROM links 
    ORDER BY visit_count DESC, created_at DESC
  `);
  return stmt.all() as Link[];
}

/**
 * 搜索链接
 */
export function searchLinks(query: string, tag?: string): Link[] {
  let searchQuery = `
    SELECT * FROM links 
    WHERE (title LIKE ? OR url LIKE ? OR tags LIKE ?)
  `;
  
  const searchTerm = `%${query}%`;
  const params: any[] = [searchTerm, searchTerm, searchTerm];

  if (tag) {
    searchQuery += ` AND tags LIKE ?`;
    params.push(`%${tag}%`);
  }

  searchQuery += ` ORDER BY visit_count DESC, created_at DESC`;
  
  const stmt = db!.prepare(searchQuery);
  
  return stmt.all(...params) as Link[];
}

/**
 * 创建链接
 */
export function createLink(link: Omit<Link, 'id' | 'visit_count' | 'created_at' | 'updated_at'>): Link {
  const stmt = db!.prepare(`
    INSERT INTO links (title, url, favicon, tags)
    VALUES (?, ?, ?, ?)
  `);
  
  const result = stmt.run(link.title, link.url, link.favicon || null, link.tags || null);
  
  return {
    id: result.lastInsertRowid as number,
    title: link.title,
    url: link.url,
    favicon: link.favicon,
    tags: link.tags,
    visit_count: 0,
    created_at: new Date(),
    updated_at: new Date()
  };
}

/**
 * 更新链接
 */
export function updateLink(id: number, title: string, url: string, tags?: string): void {
  const stmt = db!.prepare(`
    UPDATE links 
    SET title = ?, url = ?, tags = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  
  stmt.run(title, url, tags || null, id);
}

/**
 * 更新访问计数
 */
export function incrementVisitCount(id: number): void {
  const stmt = db!.prepare(`
    UPDATE links 
    SET visit_count = visit_count + 1, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  
  stmt.run(id);
}

/**
 * 删除链接
 */
export function deleteLink(id: number): void {
  const stmt = db!.prepare('DELETE FROM links WHERE id = ?');
  stmt.run(id);
}

/**
 * 获取某一天的任务列表
 */
export function getTasksByDate(date: string): Task[] {
  const stmt = db!.prepare(`
    SELECT * FROM tasks
    WHERE date = ?
    ORDER BY completed ASC, updated_at DESC
  `);
  return stmt.all(date) as Task[];
}

/**
 * 创建任务
 */
export function createTask(input: Omit<Task, 'id' | 'completed' | 'created_at' | 'updated_at'>): Task {
  const stmt = db!.prepare(`
    INSERT INTO tasks (title, notes, date)
    VALUES (?, ?, ?)
  `);
  const result = stmt.run(input.title, input.notes || null, input.date);
  return {
    id: result.lastInsertRowid as number,
    title: input.title,
    notes: input.notes,
    date: input.date,
    completed: 0,
    created_at: new Date(),
    updated_at: new Date(),
  };
}

/**
 * 更新任务内容
 */
export function updateTask(
  id: number,
  fields: { title?: string; notes?: string; date?: string }
): void {
  const current = db!.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as Task | undefined;
  if (!current) return;
  const title = fields.title ?? current.title;
  const notes = fields.notes ?? current.notes ?? null;
  const date = fields.date ?? current.date;
  const stmt = db!.prepare(`
    UPDATE tasks
    SET title = ?, notes = ?, date = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(title, notes, date, id);
}

/**
 * 勾选/取消完成状态
 */
export function toggleTaskCompleted(id: number, completed: boolean): void {
  const stmt = db!.prepare(`
    UPDATE tasks
    SET completed = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(completed ? 1 : 0, id);
}

/**
 * 删除任务
 */
export function deleteTask(id: number): void {
  const stmt = db!.prepare('DELETE FROM tasks WHERE id = ?');
  stmt.run(id);
}

/**
 * 获取设置
 */
export function getSettings(): Record<string, string> {
  const stmt = db!.prepare('SELECT key, value FROM settings');
  const rows = stmt.all() as { key: string; value: string }[];
  
  const settings: Record<string, string> = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  
  return settings;
}

/**
 * 更新设置
 */
export function updateSetting(key: string, value: string): void {
  const stmt = db!.prepare('UPDATE settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?');
  stmt.run(value, key);
}

/**
 * 关闭数据库连接
 */
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}
