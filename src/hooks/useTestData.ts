import { useState, useEffect } from 'react';
import { Link } from '../types/link';
import { useLinkStore } from '../store/linkStore';

/**
 * 测试数据生成Hook
 */
export function useTestData() {
  const { links, setLinks } = useLinkStore();
  const [testDataGenerated, setTestDataGenerated] = useState(false);

  useEffect(() => {
    // 只在浏览器模式下且没有数据时生成测试数据
    if (!window.electronAPI && links.length <= 1 && !testDataGenerated) {
      const testLinks: Link[] = [
        {
          id: Date.now() + 1,
          title: 'GitHub',
          url: 'https://github.com',
          favicon: 'https://github.com/favicon.ico',
          tags: '开发,代码,git',
          visit_count: 15,
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2天前
          updated_at: new Date()
        },
        {
          id: Date.now() + 2,
          title: 'Stack Overflow',
          url: 'https://stackoverflow.com',
          favicon: 'https://stackoverflow.com/favicon.ico',
          tags: '开发,问答,编程',
          visit_count: 8,
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5天前
          updated_at: new Date()
        },
        {
          id: Date.now() + 3,
          title: 'MDN Web Docs',
          url: 'https://developer.mozilla.org',
          favicon: 'https://developer.mozilla.org/favicon.ico',
          tags: '开发,文档,前端',
          visit_count: 12,
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1天前
          updated_at: new Date()
        },
        {
          id: Date.now() + 4,
          title: 'React 官方文档',
          url: 'https://react.dev',
          favicon: 'https://react.dev/favicon.ico',
          tags: '开发,前端,react',
          visit_count: 25,
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3天前
          updated_at: new Date()
        },
        {
          id: Date.now() + 5,
          title: 'Vue.js',
          url: 'https://vuejs.org',
          favicon: 'https://vuejs.org/favicon.ico',
          tags: '开发,前端,vue',
          visit_count: 3,
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10天前
          updated_at: new Date()
        },
        {
          id: Date.now() + 6,
          title: 'YouTube',
          url: 'https://youtube.com',
          favicon: 'https://youtube.com/favicon.ico',
          tags: '视频,娱乐',
          visit_count: 0,
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15天前
          updated_at: new Date()
        },
        {
          id: Date.now() + 7,
          title: 'Twitter',
          url: 'https://twitter.com',
          favicon: 'https://twitter.com/favicon.ico',
          tags: '社交,新闻',
          visit_count: 6,
          created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8天前
          updated_at: new Date()
        }
      ];

      const allLinks = [...links, ...testLinks];
      setLinks(allLinks);
      localStorage.setItem('kjump_links', JSON.stringify(allLinks));
      setTestDataGenerated(true);
    }
  }, [links.length, testDataGenerated, setLinks]);

  return { testDataGenerated };
}