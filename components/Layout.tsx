"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { LogOut, LayoutDashboard, ShoppingCart, Package, Users, BarChart3, Settings, Menu, UserCog, Calculator } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getNavItems = () => {
    const baseItems = [
      { name: "Terminal", href: "/pos", icon: ShoppingCart },
    ];
    
    // If not a cashier, show full menu
    if (user?.role !== 'Cajero') {
      baseItems.push(
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Inventory", href: "/inventory", icon: Package },
        { name: "Clients", href: "/clients", icon: Users },
        { name: "Analytics", href: "/reports", icon: BarChart3 },
        { name: "Accounting", href: "/accounting", icon: Calculator },
        { name: "Staff", href: "/users", icon: UserCog },
        { name: "Settings", href: "/settings", icon: Settings }
      );
    }
    return baseItems;
  };

  const navItems = getNavItems();

  // Exclude Layout on login page
  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8F9FA] text-[#141414] font-sans selection:bg-[#141414] selection:text-white select-none">
      {/* Top Navigation Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#141414] bg-white px-4 md:px-6 relative z-10">
        <div className="flex items-center h-full">
          {/* Logo */}
          <div className="font-bold tracking-tighter flex items-center gap-3 mr-8">
            <div className="w-8 h-8 bg-[#141414] text-white flex items-center justify-center text-[11px] rounded-sm">BWP</div>
            <div className="flex flex-col leading-none">
              <span className="text-sm">RETAIL POS</span>
              <span className="text-[9px] font-mono opacity-50 uppercase tracking-widest mt-0.5">Enterprise</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex h-full items-end gap-2 text-[11px] font-bold uppercase tracking-widest">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-3 border-b-4 transition-all ${
                    isActive
                      ? "border-[#141414] text-[#141414]"
                      : "border-transparent text-[#141414] opacity-60 hover:opacity-100 hover:bg-[#F8F7F4]"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-5 h-full">
          {/* User Info & Actions - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex flex-col text-right justify-center">
              <span className="font-bold text-[11px] uppercase leading-tight">{user?.username || 'GUEST USER'}</span>
              <span className="opacity-50 text-[9px] font-mono">{user?.role || 'CASHIER'}</span>
            </div>
            <Button variant="outline" className="text-[#FF6B6B] border-[#141414] hover:bg-[#141414] hover:text-[#FF6B6B] text-[10px] font-bold uppercase h-8 px-3 rounded-md" onClick={logout}>
              <LogOut className="mr-2 h-3 w-3" />
              SIGN OUT
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Mobile Sidebar overlay */}
        {sidebarOpen && (
           <div className="fixed inset-0 z-40 flex md:hidden">
              <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
              <div className="relative flex w-64 flex-col bg-white border-r border-[#141414]">
                <div className="flex h-16 items-center border-b border-[#141414] px-4 font-bold text-lg tracking-tighter">
                   BWP RETAIL POS
                </div>
                <div className="flex-1 overflow-y-auto px-2 py-4">
                  <nav className="flex flex-col gap-1 text-[11px] font-bold uppercase tracking-widest">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-3 border ${
                          pathname.startsWith(item.href)
                            ? "bg-[#141414] text-white border-[#141414]"
                            : "border-transparent text-[#141414]"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
                <div className="border-t border-[#141414] p-4 bg-[#F8F7F4]">
                  <div className="mb-4 flex flex-col">
                    <span className="font-bold text-[11px] uppercase">{user?.username || 'GUEST USER'}</span>
                    <span className="opacity-50 text-[10px] font-mono">{user?.role || 'CASHIER'}</span>
                  </div>
                  <Button variant="outline" className="w-full justify-start text-[#FF6B6B] border-[#141414] hover:bg-[#141414]" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    SIGN OUT
                  </Button>
                </div>
              </div>
           </div>
        )}

        <main className="flex-1 overflow-y-auto bg-[#F8F9FA] p-4 pb-14 md:pb-8 flex flex-col relative z-0">
          {children}
        </main>

        <footer className="h-6 border-t border-[#141414] bg-[#141414] text-[#E4E3E0] px-4 flex items-center justify-between text-[9px] font-mono uppercase tracking-widest absolute bottom-0 left-0 right-0 z-10">
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[#2ECC71] rounded-full animate-pulse"></span> SYSTEM ONLINE</span>
            <span className="hidden sm:inline opacity-70">SYNC: JUST NOW</span>
          </div>
          <div className="flex gap-4">
            <span className="hidden sm:inline opacity-70">ID: POS-A01</span>
            <span className="font-bold text-[#FFD166]">V 2.1.4</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
