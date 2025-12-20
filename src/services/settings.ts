import { getSettings } from './database'

/**
 * 获取所有设置
 */
export async function getAllSettings(): Promise<Record<string, string>> {
  return getSettings()
}