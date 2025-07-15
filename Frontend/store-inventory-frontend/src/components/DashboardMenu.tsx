import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { dropdownData } from '../data/dashboardMenuData';
import LogoScroller from '../components/LogoScroller';

const DashboardMenu: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown with Escape key
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setOpenDropdown(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Focus trap inside dropdown
  useEffect(() => {
    if (!openDropdown) return;

    const dropdown = containerRef.current?.querySelector(
      `#dropdown-${openDropdown}`
    );

    const focusable = dropdown?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable?.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const trapFocus = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', trapFocus);
    first.focus();

    return () => document.removeEventListener('keydown', trapFocus);
  }, [openDropdown]);

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto px-4"
    >
      {dropdownData.map(({ name, label, logos, description, links }) => (
        <div key={name} className="relative">
          <button
            onClick={() => toggleDropdown(name)}
            aria-haspopup="true"
            aria-expanded={openDropdown === name}
            className="w-72 h-72 bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center text-gray-700 hover:shadow-xl transition"
          >
            <LogoScroller logos={logos} />
            <h3 className="text-xl font-semibold mb-2">{label}</h3>
            <p className="text-center text-gray-500 text-sm">{description}</p>
          </button>

          <ul
            id={`dropdown-${name}`}
            className={`absolute z-10 bg-white border border-gray-200 rounded shadow-lg w-48 mt-2
              overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out
              ${openDropdown === name ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}
            `}
          >
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setOpenDropdown(null)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default DashboardMenu;
