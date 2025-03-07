
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  {
    title: 'Overview',
    href: '/',
  },
  {
    title: 'Monthly Expenses',
    href: '/monthly-expenses',
  },
  {
    title: 'Analytics',
    href: '/analytics',
  },
  {
    title: 'Administration',
    href: '/administration',
  },
];

interface MainNavProps {
  className?: string;
}

export function MainNav({ className }: MainNavProps) {
  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
