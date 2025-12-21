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
        console.log('搜索查询为空，显示所有链接');
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
          console.log('搜索过滤 - 原始链接数:', sourceLinks.length, '查询:', lowerQuery);
          const filtered = sourceLinks.filter(link => {
            const matchTitle = link.title.toLowerCase().includes(lowerQuery);
            const matchUrl = link.url.toLowerCase().includes(lowerQuery);
            const matchTags = link.tags && link.tags.toLowerCase().includes(lowerQuery);
            const hasMatch = matchTitle || matchUrl || matchTags;
            if (hasMatch) {
              console.log('匹配链接:', link.title, '标签:', link.tags);
            }
            return hasMatch;
          });
          console.log('搜索结果数:', filtered.length);
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