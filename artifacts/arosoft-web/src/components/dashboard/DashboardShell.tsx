import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  BarChart3,
  Bell,
  ChevronRight,
  LogOut,
  Menu,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  clearAuthToken,
  getAuthToken,
  getDashboardPath,
  type AuthUser,
  type UserRole,
} from "@/lib/auth";

export interface DashboardMenuItem {
  label: string;
  icon: LucideIcon;
}

export interface DashboardStat {
  label: string;
  value: string;
  detail: string;
}

export interface DashboardAction {
  label: string;
  description: string;
}

export interface DashboardPanel {
  title: string;
  items: string[];
}

interface DashboardShellProps {
  title: string;
  description: string;
  allowedRoles: UserRole[];
  menuItems: DashboardMenuItem[];
  stats: DashboardStat[];
  actions: DashboardAction[];
  panels: DashboardPanel[];
}

export function DashboardShell({
  title,
  description,
  allowedRoles,
  menuItems,
  stats,
  actions,
  panels,
}: DashboardShellProps) {
  const [location, navigate] = useLocation();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "forbidden">("loading");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      navigate("/login");
      return;
    }

    async function loadCurrentUser() {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

      setUser(data.user);
      setStatus("ready");
    }

    void loadCurrentUser();
  }, [allowedRoles, navigate]);

  function handleLogout() {
    clearAuthToken();
    navigate("/login");
  }

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
          <Link href={location} className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-tight text-slate-950">AROSOFT</span>
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
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = index === 0;

            return (
              <button
                key={item.label}
                type="button"
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-white hover:text-slate-950"
                }`}
              >
                <Icon size={17} />
                {item.label}
              </button>
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

        <main className="px-4 py-6 md:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <section className="rounded-lg border border-slate-200 bg-white px-5 py-5 shadow-sm md:px-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Dashboard</p>
                  <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">{title}</h1>
                  <p className="mt-2 max-w-3xl text-sm text-slate-600">{description}</p>
                </div>
                <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 md:w-auto">
                  New action
                  <ChevronRight size={16} />
                </Button>
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <Card key={stat.label} className="border-slate-200 bg-white shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                        <p className="mt-2 text-2xl font-bold text-slate-950">{stat.value}</p>
                      </div>
                      <div className="rounded-md bg-blue-50 p-2 text-blue-600">
                        <BarChart3 size={18} />
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">{stat.detail}</p>
                  </CardContent>
                </Card>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common work for this role.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                  {actions.map((action) => (
                    <button
                      key={action.label}
                      type="button"
                      className="rounded-lg border border-slate-200 bg-white p-4 text-left transition-colors hover:border-blue-200 hover:bg-blue-50/50"
                    >
                      <p className="font-semibold text-slate-950">{action.label}</p>
                      <p className="mt-1 text-sm text-slate-600">{action.description}</p>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest operational updates.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {panels[0]?.items.map((item) => (
                    <div key={item} className="rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                      {item}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              {panels.slice(1).map((panel) => (
                <Card key={panel.title} className="border-slate-200 bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>{panel.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {panel.items.map((item) => (
                      <div key={item} className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2 text-sm">
                        <span className="text-slate-700">{item}</span>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">Open</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
