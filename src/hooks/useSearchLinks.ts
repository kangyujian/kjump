import { useState, useEffect } from 'react';
import { Link } from '../types/link';

/**
 * 浏览器模式下的本地搜索
 */
function localSearch(query: string, sourceLinks: Link[], tag?: string): Link[] {
  const lowerQuery = query.toLowerCase();
  
  let targets = sourceLinks;
  if (tag) {
     targets = targets.filter(link => (link.tags || '').split(',').map(t => t.trim()).includes(tag));
  }
  
  return targets.filter(link => {
    const matchTitle = link.title.toLowerCase().includes(lowerQuery);
    const matchUrl = link.url.toLowerCase().includes(lowerQuery);
    const matchTags = link.tags && link.tags.toLowerCase().includes(lowerQuery);
    return matchTitle || matchUrl || matchTags;
  });
}

/**
 * 搜索链接的Hook
 */
export function useSearchLinks(query: string, sourceLinks: Link[] = [], tag?: string) {
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
          const result = await window.electronAPI.searchLinks(query, tag);
          setLinks(result);
        } else {
          setLinks(localSearch(query, sourceLinks, tag));
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
  }, [query, sourceLinks, tag]);

  return { links, loading };
}