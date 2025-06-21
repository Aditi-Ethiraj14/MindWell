import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

type NavItemProps = {
  href: string;
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
  external?: boolean;
};

const NavItem = ({ href, icon, label, active, onClick, external = false }: NavItemProps) => {
  if (external) {
    return (
      <div
        onClick={() => {
          window.open(href, '_blank');
          onClick();
        }}
        className={cn(
          "flex items-center space-x-3 px-4 py-3 text-sm rounded-lg transition-colors cursor-pointer",
          active
            ? "bg-primary-50 text-primary-700 font-medium"
            : "text-neutral-600 hover:bg-neutral-100"
        )}
      >
        <i className={`fas ${icon}`}></i>
        <span>{label}</span>
      </div>
    );
  }
  
  return (
    <Link href={href}>
      <div
        onClick={onClick}
        className={cn(
          "flex items-center space-x-3 px-4 py-3 text-sm rounded-lg transition-colors cursor-pointer",
          active
            ? "bg-primary-50 text-primary-700 font-medium"
            : "text-neutral-600 hover:bg-neutral-100"
        )}
      >
        <i className={`fas ${icon}`}></i>
        <span>{label}</span>
      </div>
    </Link>
  );
};

export default function MobileHeader() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
    setIsOpen(false);
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <header className="lg:hidden bg-white shadow-sm py-3 px-4 flex items-center justify-between">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button className="text-neutral-600 hover:text-neutral-800">
            <i className="fas fa-bars"></i>
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
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
                onClick={handleNavClick}
              />
              <NavItem
                href="https://adie7.app.n8n.cloud/webhook/20c1496f-e823-461b-92d9-5b36057c0b8a/chat"
                icon="fa-comment-dots"
                label="Chat"
                active={false}
                onClick={handleNavClick}
                isExternal={true}
              />
              <NavItem
                href="/journal"
                icon="fa-journal-whills"
                label="Journal"
                active={location === "/journal"}
                onClick={handleNavClick}
              />
              <NavItem
                href="/activities"
                icon="fa-spa"
                label="Self-Care Activities"
                active={location === "/activities"}
                onClick={handleNavClick}
              />
              <NavItem
                href="/progress"
                icon="fa-chart-line"
                label="Progress"
                active={location === "/progress"}
                onClick={handleNavClick}
              />
              <NavItem
                href="/rewards"
                icon="fa-medal"
                label="Rewards"
                active={location === "/rewards"}
                onClick={handleNavClick}
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
        </SheetContent>
      </Sheet>

      <div className="flex items-center space-x-2">
        <div className="h-7 w-7 rounded-full bg-primary-500 flex items-center justify-center">
          <i className="fas fa-brain text-white text-xs"></i>
        </div>
        <h1 className="text-lg font-semibold text-neutral-800">MindWell</h1>
      </div>

      <div className="h-8 w-8 rounded-full bg-neutral-300 overflow-hidden flex items-center justify-center text-neutral-500">
        <i className="fas fa-user"></i>
      </div>
    </header>
  );
}
