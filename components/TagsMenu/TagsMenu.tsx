'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './TagsMenu.module.css';

const TAGS = ['All', 'Todo', 'Work', 'Personal', 'Shopping', 'Meeting'];

export default function TagsMenu() {
  const [menuVisible, setMenuVisible] = useState(false);
  const pathname = usePathname();
  const activeTag = pathname.split('/').pop() || 'All';

  const closeMenu = useCallback(() => setMenuVisible(false), []);
  const toggleMenu = () => setMenuVisible((prev) => !prev);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [closeMenu]);

  return (
    <div className={styles.menuContainer}>
      <button
        className={styles.menuButton}
        onClick={toggleMenu}
        aria-expanded={menuVisible}
        aria-label="Toggle tags menu"
      >
        Notes ▾
      </button>

      {menuVisible && (
        <ul className={styles.menuList}>
          {TAGS.map((tag) => {
            const href = `/notes/filter/${tag === 'All' ? 'all' : tag}`;
            const isActive = activeTag?.toLowerCase() === tag.toLowerCase();

            return (
              <li key={tag} className={styles.menuItem}>
                <Link
                  href={href}
                  className={`${styles.menuLink} ${isActive ? styles.active : ''}`}
                  onClick={closeMenu}
                >
                  {tag}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
