import React, { useState } from 'react';
import { ActivePage, FieldTestConfig } from '../types';
import { 
  Home, 
  GraduationCap, 
  Building2, 
  Database, 
  BarChart3, 
  BookOpen, 
  FlaskConical, 
  FileText, 
  Menu, 
  X, 
  Lock, 
  Unlock,
  Code2 
} from 'lucide-react';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  fieldTestConfig: FieldTestConfig;
  recordsCount: number;
  syntheticCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  fieldTestConfig,
  recordsCount,
  syntheticCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home' as ActivePage, label: 'Home', icon: Home },
    { 
      id: 'gov_test' as ActivePage, 
      label: 'Gov School Test', 
      icon: Building2, 
      tag: 'G001+' 
    },
    { 
      id: 'pvt_test' as ActivePage, 
      label: 'Private School Test', 
      icon: GraduationCap, 
      tag: 'P001+' 
    },
    { 
      id: 'data_center' as ActivePage, 
      label: 'Data Center', 
      icon: Database,
      badge: recordsCount > 0 ? recordsCount : undefined 
    },
    { 
      id: 'comparison_dashboard' as ActivePage, 
      label: 'Dashboard (5 Visuals)', 
      icon: BarChart3 
    },
    { 
      id: 'streamlit_python' as ActivePage, 
      label: 'Streamlit Python', 
      icon: Code2 
    },
    { 
      id: 'question_bank' as ActivePage, 
      label: 'Question Bank', 
      icon: BookOpen,
      locked: fieldTestConfig.isLocked
    },
    { 
      id: 'demo_mode' as ActivePage, 
      label: 'Demo Mode', 
      icon: FlaskConical,
      syntheticCount: syntheticCount > 0 ? syntheticCount : undefined
    },
    { 
      id: 'methodology' as ActivePage, 
      label: 'Methodology', 
      icon: FileText 
    }
  ];

  const handleNavClick = (id: ActivePage) => {
    setActivePage(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div 
            id="nav-brand"
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => handleNavClick('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              CEP
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm sm:text-base leading-tight tracking-tight">
                CEP Learning Outcomes
              </div>
              <div className="text-xs text-slate-500 font-medium hidden sm:block">
                Data Collection &amp; Comparison System
              </div>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-indigo-600 text-white">
                      {item.badge}
                    </span>
                  )}
                  {item.syntheticCount !== undefined && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500 text-white">
                      {item.syntheticCount}
                    </span>
                  )}
                  {item.locked !== undefined && (
                    item.locked ? (
                      <Lock className="w-2.5 h-2.5 text-emerald-600 ml-0.5" />
                    ) : (
                      <Unlock className="w-2.5 h-2.5 text-slate-400 ml-0.5" />
                    )
                  )}
                </button>
              );
            })}
          </nav>

          {/* Status Chips */}
          <div className="hidden sm:flex items-center gap-2">
            <div 
              title={fieldTestConfig.isLocked ? "Field Test Locked" : "Field Test Unlocked"}
              className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                fieldTestConfig.isLocked
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {fieldTestConfig.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              <span>{fieldTestConfig.isLocked ? '9Q Locked' : '9Q Draft'}</span>
            </div>
            {syntheticCount > 0 && (
              <div 
                title="Synthetic records currently in memory"
                className="text-[11px] font-semibold px-2 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200"
              >
                Simulated: {syntheticCount}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <div className="py-1 px-2 mb-2 flex items-center justify-between text-xs text-slate-500 font-medium bg-slate-50 rounded-md">
            <span>Status: {fieldTestConfig.isLocked ? '🔒 Field Test Locked' : '🔓 Field Test Unlocked'}</span>
            <span>Target: {fieldTestConfig.targetClass}</span>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-indigo-600 text-white">
                      {item.badge}
                    </span>
                  )}
                  {item.syntheticCount !== undefined && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500 text-white">
                      {item.syntheticCount}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
