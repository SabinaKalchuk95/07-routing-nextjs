'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import css from './SidebarNotes.module.css';

const tags = ['All', 'Todo', 'Work', 'Personal', 'Shopping', 'Meeting'];

const DefaultSidebar = () => {
  const pathname = usePathname();
  const activeTag = pathname.split('/').pop()?.toLowerCase();

  return (
    <ul className={css.menuList}>
      {tags.map((tag) => {
        const href = `/notes/filter/${tag === 'All' ? 'all' : tag}`;
        const isActive = activeTag === tag.toLowerCase();

        return (
          <li key={tag} className={css.menuItem}>
            <Link href={href} className={`${css.menuLink} ${isActive ? css.active : ''}`}>
              {tag}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default DefaultSidebar;
