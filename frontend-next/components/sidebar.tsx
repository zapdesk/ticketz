'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  UsersIcon, 
  BuildingOfficeIcon,
  Cog6ToothIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface NavSection {
  label: string;
  icon?: React.ReactNode;
  items: NavItem[];
  collapsible?: boolean;
}

const navigation: NavSection[] = [
  {
    label: 'General',
    items: [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: <HomeIcon className="w-5 h-5 mr-3" />
      },
    ]
  },
  {
    label: 'Administration',
    icon: <Cog6ToothIcon className="w-5 h-5 mr-2" />,
    collapsible: true,
    items: [
      {
        label: 'Users',
        href: '/users',
        icon: <UsersIcon className="w-5 h-5 mr-3" />
      },
      {
        label: 'Companies',
        href: '/companies',
        icon: <BuildingOfficeIcon className="w-5 h-5 mr-3" />
      },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<string[]>(['Administration']);

  const toggleSection = (sectionLabel: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionLabel)
        ? prev.filter(label => label !== sectionLabel)
        : [...prev, sectionLabel]
    );
  };

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        <nav className="flex-1 p-4">
          <div className="space-y-6">
            {navigation.map((section) => (
              <div key={section.label}>
                <div 
                  className={`flex items-center px-3 mb-2 text-sm font-medium text-gray-500 ${section.collapsible ? 'cursor-pointer hover:text-gray-700' : ''}`}
                  onClick={() => section.collapsible && toggleSection(section.label)}
                >
                  {section.icon}
                  <span>{section.label}</span>
                  {section.collapsible && (
                    <ChevronDownIcon 
                      className={`w-4 h-4 ml-auto transition-transform ${
                        expandedSections.includes(section.label) ? 'transform rotate-180' : ''
                      }`}
                    />
                  )}
                </div>
                {(!section.collapsible || expandedSections.includes(section.label)) && (
                  <ul className="space-y-1">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className={`flex items-center px-4 py-2 text-sm rounded-lg ${
                              isActive
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
} 