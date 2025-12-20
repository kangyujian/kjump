import { useState, useEffect } from 'react';
import { Link } from '../types/link';

/**
 * 搜索链接的Hook
 */
export function useSearchLinks(query: string, sourceLinks: Link[] = []) {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchLinks = async () => {
      if (!query.trim()) {
        setLinks([]);
        return;
      }

      setLoading(true);
      try {
        if (window.electronAPI) {
          // 使用IPC通信调用主进程的数据库服务
          const result = await window.electronAPI.searchLinks(query);
          setLinks(result);
        } else {
          // 浏览器模式：本地过滤
          const lowerQuery = query.toLowerCase();
          const filtered = sourceLinks.filter(link => 
            link.title.toLowerCase().includes(lowerQuery) || 
            link.url.toLowerCase().includes(lowerQuery) ||
            (link.tags && link.tags.toLowerCase().includes(lowerQuery))
          );
          setLinks(filtered);
        }
      } catch (error) {
        console.error('搜索链接失败:', error);
        setLinks([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchLinks, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, sourceLinks]);

  return { links, loading };
}