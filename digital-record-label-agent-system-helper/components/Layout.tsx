
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NavItem } from '../types';
import { DashboardIcon, VerificationIcon, ConfigIcon, DeploymentIcon, AiIcon } from './icons';

const navigationItems: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
  { name: 'Verification', path: '/verification', icon: VerificationIcon },
  { name: 'Configuration', path: '/configuration', icon: ConfigIcon },
  { name: 'Deployment', path: '/deployment', icon: DeploymentIcon },
  { name: 'AI Assistant', path: '/ai-assistant', icon: AiIcon },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const getPageTitle = () => {
    const currentNavItem = navigationItems.find(item => location.pathname.startsWith(item.path));
    return currentNavItem ? currentNavItem.name : 'Digital Record Label System';
  };

  return (
    <div className="flex h-screen bg-surface-dark text-text-dark-primary">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-dark p-4 space-y-4 border-r border-gray-700 flex flex-col">
        <div className="text-2xl font-semibold text-primary-light mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 mr-2 text-secondary-light">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v8.313M15 14.25v2.25l-2.219-2.219M5.25 9.75L3 12m0 0l2.25 2.25M5.25 12H21" />
          </svg>
          DRL Agents
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700 transition-colors duration-150 ease-in-out ${
                      isActive ? 'bg-primary-dark text-white font-semibold' : 'text-gray-300 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto text-center text-xs text-gray-500">
          Abacus.AI Platform Helper
          <br />
          &copy; {new Date().getFullYear()}
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-neutral-dark shadow-md p-4 border-b border-gray-700">
          <h1 className="text-xl font-semibold text-text-dark-primary">{getPageTitle()}</h1>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 bg-surface-dark">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;