import { shell } from 'electron';

/**
 * 打开URL
 */
export function openUrl(url: string): void {
  // 确保URL有协议前缀
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  
  shell.openExternal(url);
}