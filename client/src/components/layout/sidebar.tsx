import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

type NavItemProps = {
  href: string;
  icon: string;
  label: string;
  active: boolean;
  external?: boolean;
};

const NavItem = ({ href, icon, label, active, isExternal = false }: {
  href: string;
  icon: string;
  label: string;
  active: boolean;
  isExternal?: boolean;
}) => {
  const baseClasses = `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group cursor-pointer ${
    active 
      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-md'
  }`;

  if (isExternal) {
    return (
      <div
        onClick={() => window.open(href, '_blank')}
        className={cn(baseClasses)}
      >
        <i className={`fas ${icon}`}></i>
        <span>{label}</span>
      </div>
    );
  }

  return (
    <Link href={href}>
      <div className={cn(baseClasses)}>
        <i className={`fas ${icon}`}></i>
        <span>{label}</span>
      </div>
    </Link>
  );
};

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!user) return null;

  return (
    <aside className="hidden lg:block w-64 bg-white shadow-md">
      <div className="p-4 h-full flex flex-col">
        <div className="mb-8 mt-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
              <i className="fas fa-brain text-white text-sm"></i>
            </div>
            <h1 className="text-xl font-semibold text-neutral-800">MindWell</h1>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          <NavItem
            href="/"
            icon="fa-home"
            label="Dashboard"
            active={location === "/"}
          />
          <NavItem
            href="https://adie7.app.n8n.cloud/webhook/20c1496f-e823-461b-92d9-5b36057c0b8a/chat"
            icon="fa-comment-dots"
            label="Chat"
            active={false}
            isExternal={true}
          />
          <NavItem
            href="/journal"
            icon="fa-journal-whills"
            label="Journal"
            active={location === "/journal"}
          />
          <NavItem
            href="/activities"
            icon="fa-spa"
            label="Self-Care Activities"
            active={location === "/activities"}
          />
          <NavItem
            href="/progress"
            icon="fa-chart-line"
            label="Progress"
            active={location === "/progress"}
          />
          <NavItem
            href="/rewards"
            icon="fa-medal"
            label="Rewards"
            active={location === "/rewards"}
          />
        </nav>

        <div className="mt-auto pt-4">
          <div className="bg-neutral-100 rounded-lg p-3">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-neutral-300 overflow-hidden flex items-center justify-center text-neutral-500">
                <i className="fas fa-user text-lg"></i>
              </div>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <div className="flex items-center mt-0.5">
                  <div className="h-3 w-3 rounded-full bg-secondary-500 mr-1.5"></div>
                  <p className="text-xs text-neutral-500">Level {user.level}</p>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 mt-4 px-4 py-2 text-sm rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}