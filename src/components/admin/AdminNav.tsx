'use client';

import React from 'react';
import { LayoutDashboard, Package, PlusCircle, ShoppingBag, ExternalLink, LogOut, ShieldCheck } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminNav() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vv_admin_auth');
      sessionStorage.removeItem('vv_admin_auth');
    }
    router.push('/admin/login');
  };

  const navItems = [
    { label: 'Financial Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Inventory & Stock', href: '/admin/inventory', icon: Package },
    { label: 'Add New Saree / Dress', href: '/admin/inventory/new', icon: PlusCircle },
    { label: 'Sales History', href: '/admin/sales', icon: ShoppingBag },
  ];

  return (
    <header className="bg-[#3B0610] border-b border-[#D4AF37]/30 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <a href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border border-[#D4AF37] flex items-center justify-center bg-[#4D0917]">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-sm font-bold text-[#F9E29D] tracking-wider">
                  VAARAHI VAAGDEVI
                </span>
                <span className="text-[9px] tracking-[0.25em] text-[#D4AF37]">
                  BOUTIQUE PORTAL
                </span>
              </div>
            </a>
            <span className="hidden sm:inline bg-[#4D0917] border border-[#D4AF37]/30 text-[10px] text-[#F9E29D] px-2 py-0.5 rounded uppercase font-semibold">
              Admin
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#4D0917] text-[#F9E29D] border border-[#D4AF37]/50 shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-[#D4AF37] hover:text-[#F9E29D] bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors border border-white/10"
              title="Preview Public Storefront"
            >
              <span>View Store</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-xs text-red-300 hover:text-red-100 bg-red-950/50 hover:bg-red-900/50 px-3 py-1.5 rounded-lg transition-colors border border-red-800/40"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary tab strip */}
        <div className="md:hidden flex items-center gap-2 overflow-x-auto py-2 border-t border-white/10 text-xs">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap px-3 py-1 rounded-md text-xs font-medium ${
                  isActive ? 'bg-[#4D0917] text-[#F9E29D]' : 'text-white/70'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </div>
    </header>
  );
}
