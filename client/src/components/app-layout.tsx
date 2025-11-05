import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Users, QrCode, TrendingUp, User, LogOut, Settings, Sparkles } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();

  // Mock user data - will be replaced with real auth
  const currentUser = {
    displayName: "Demo User",
    email: "demo@amura.app",
    photoURL: null,
  };

  const navItems = [
    { href: "/app/rooms", label: "Circles", icon: Users },
    { href: "/app/profile", label: "Your Field", icon: User },
    { href: "/app/qr", label: "My QR", icon: QrCode },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/">
              <h1 className="text-2xl font-bold inline-flex items-center gap-2 hover:opacity-80 transition-opacity tracking-wide">
                AMURA
                <Sparkles className="w-5 h-5 text-primary" />
              </h1>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href || location.startsWith(item.href + "/");
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      data-testid={`nav-${item.label.toLowerCase()}`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-user-menu">
                <Avatar>
                  <AvatarImage src={currentUser.photoURL || undefined} />
                  <AvatarFallback>
                    {currentUser.displayName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{currentUser.displayName}</p>
                  <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/app/profile">
                <DropdownMenuItem data-testid="menu-profile">
                  <User className="w-4 h-4 mr-2" />
                  Your Field
                </DropdownMenuItem>
              </Link>
              <Link href="/app/qr">
                <DropdownMenuItem data-testid="menu-qr-code">
                  <QrCode className="w-4 h-4 mr-2" />
                  My QR Code
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem data-testid="menu-settings">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" data-testid="menu-logout">
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t px-6 py-2">
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href || location.startsWith(item.href + "/");
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    data-testid={`nav-mobile-${item.label.toLowerCase()}`}
                  >
                    <Icon className="w-4 h-4 md:mr-2" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
