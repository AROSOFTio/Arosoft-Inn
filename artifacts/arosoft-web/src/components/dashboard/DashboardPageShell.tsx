import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Bell, LogOut, Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  clearAuthToken,
  getAuthToken,
  getDashboardPath,
  getStoredAuthUser,
  setStoredAuthUser,
  type AuthUser,
  type UserRole,
} from "@/lib/auth";
import type { DashboardMenuItem } from "@/components/dashboard/DashboardShell";

interface DashboardPageShellProps {
  title: string;
  description: string;
  allowedRoles: UserRole[];
  menuItems: DashboardMenuItem[];
  menuItemsForUser?: (user: AuthUser) => DashboardMenuItem[];
  children: ReactNode;
}

export function DashboardPageShell({
  title,
  description,
  allowedRoles,
  menuItems,
  menuItemsForUser,
  children,
}: DashboardPageShellProps) {
  const [location, navigate] = useLocation();
  const [user, setUser] = useState<AuthUser | null>(() => getStoredAuthUser());
  const [status, setStatus] = useState<"loading" | "ready" | "forbidden">(() =>
    getStoredAuthUser() ? "ready" : "loading",
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const allowedRoleKey = allowedRoles.join("|");

  useEffect(() => {
    const token = getAuthToken();
    const storedUser = getStoredAuthUser();

    if (!token) {
      navigate("/login");
      return;
    }

    if (storedUser && !allowedRoles.includes(storedUser.role)) {
      setStatus("forbidden");
      navigate(getDashboardPath(storedUser.role));
      return;
    }

    async function loadCurrentUser() {
      const response = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        clearAuthToken();
        navigate("/login");
        return;
      }

      const data = (await response.json()) as { user: AuthUser };

      if (!allowedRoles.includes(data.user.role)) {
        setStatus("forbidden");
        navigate(getDashboardPath(data.user.role));
        return;
      }

      setStoredAuthUser(data.user);
      setUser(data.user);
      setStatus("ready");
    }

    void loadCurrentUser();
  }, [allowedRoleKey, navigate]);

  function handleLogout() {
    clearAuthToken();
    navigate("/login");
  }

  function isMenuItemActive(href: string) {
    return location === href || (href !== getDashboardPath(user?.role || allowedRoles[0]) && location.startsWith(`${href}/`));
  }

  const effectiveMenuItems = user && menuItemsForUser ? menuItemsForUser(user) : menuItems;

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-5xl text-sm text-slate-600">Loading dashboard...</div>
      </main>
    );
  }

  if (status === "forbidden") {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-5xl text-sm text-slate-600">Redirecting to your dashboard...</div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      {isSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/20 lg:hidden"
          aria-label="Close dashboard menu"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-slate-100/95 transition-transform duration-200 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <Link href={getDashboardPath(user?.role || allowedRoles[0])} className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-tight text-slate-950">AROSOFT Labs</span>
            <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-blue-600">Internal</span>
          </Link>
          <button
            type="button"
            className="rounded-md p-2 text-slate-500 hover:bg-white lg:hidden"
            aria-label="Close sidebar"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="space-y-1 px-3 py-4">
          {effectiveMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isMenuItemActive(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-white hover:text-slate-950"
                }`}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-md border border-slate-200 p-2 text-slate-600 lg:hidden"
              aria-label="Open dashboard menu"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={18} />
            </button>
            <div className="hidden items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 md:flex">
              <Search size={16} />
              Search internal workspace
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden gap-2 border-slate-200 md:inline-flex">
              <Bell size={15} />
              Alerts
            </Button>
            <div className="hidden text-right text-xs sm:block">
              <p className="font-semibold text-slate-950">{user?.name}</p>
              <p className="text-slate-500">{user?.role}</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2 border-slate-200" onClick={handleLogout}>
              <LogOut size={15} />
              Logout
            </Button>
          </div>
        </header>

        <main className="px-4 py-5 md:px-6">
          <div className="mx-auto max-w-7xl space-y-5">
            <section className="rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Internal</p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">{title}</h1>
              <p className="mt-1.5 max-w-3xl text-sm text-slate-600">{description}</p>
            </section>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
