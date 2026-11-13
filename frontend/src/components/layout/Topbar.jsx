import React from "react";
import { Menu, LogOut, Bell, Shield, User } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export const Topbar = ({ onOpenSidebar }) => {
  const { user, logoutUser, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-sm border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:block">
          <p className="text-xs font-medium text-slate-400">
            Smart Inventory & Billing Management
          </p>
          <h2 className="text-sm font-semibold text-slate-800">
            Welcome back, {user?.name || "Partner"}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Role Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100/80">
          <Shield className="w-3.5 h-3.5" />
          <span className="capitalize">{user?.role || "Staff"}</span>
        </div>

        {/* User Dropdown / Logout Button */}
        <button
          onClick={logoutUser}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
          title="Sign out of your account"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;

