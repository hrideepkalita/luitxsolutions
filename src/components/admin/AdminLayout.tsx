import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Star,
  User,
  MessageSquare,
  Image as ImageIcon,
  Settings,
  Search,
  Activity,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/luitx-logo-new.webp";

const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/testimonials", label: "Testimonials", icon: Star },
  { to: "/admin/founder", label: "Founder", icon: User },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare },
  { to: "/admin/media", label: "Media", icon: ImageIcon },
  { to: "/admin/settings", label: "Settings", icon: Settings },
  { to: "/admin/seo", label: "SEO", icon: Search },
  { to: "/admin/activity", label: "Activity", icon: Activity },
];

export function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const nav = useNavigate();

  async function handleLogout() {
    await signOut();
    nav("/admin/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 inset-y-0 left-0 z-40 w-64 glass border-r border-border/40 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } flex flex-col h-screen`}
      >
        <Link to="/admin" className="flex items-center gap-2.5 p-5 border-b border-border/40">
          <span className="h-10 w-10 rounded-xl grid place-items-center bg-background/60 ring-1 ring-primary/40 shadow-glow p-1.5">
            <img src={logo} alt="LuitX" className="h-full w-full object-contain" />
          </span>
          <div>
            <div className="font-bold text-sm text-gradient">LuitX Admin</div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">v1.0</div>
          </div>
        </Link>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/30 shadow-glow"
                    : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                }`
              }
            >
              <it.icon className="h-4 w-4 shrink-0" />
              <span>{it.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-border/40">
          <div className="px-3 py-2 text-xs text-muted-foreground truncate">{user?.email}</div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 glass border-b border-border/40 px-4 lg:px-6 py-3 flex items-center justify-between">
          <button
            className="lg:hidden p-2 -ml-2"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <button className="glass h-9 w-9 rounded-full grid place-items-center hover:border-primary/60 transition-colors">
              <Bell className="h-4 w-4" />
            </button>
            <Link
              to="/"
              target="_blank"
              className="hidden sm:inline-flex glass rounded-full px-3 py-1.5 text-xs hover:border-primary/60 transition-colors"
            >
              View site →
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
