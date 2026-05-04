import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";
import { Moon, Sun, LogOut, LayoutDashboard, Shield, Heart } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const { user, isAdmin, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-hero shadow-soft">
            <span className="text-base font-bold text-primary-foreground">S</span>
          </div>
          <div className="leading-tight">
            <div className="text-base font-bold text-foreground">ServiceLink</div>
            <div className="-mt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Tanzania</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" end className={({ isActive }) => `text-sm font-medium transition-smooth hover:text-primary ${isActive ? "text-primary" : "text-muted-foreground"}`}>Home</NavLink>
          <NavLink to="/search" className={({ isActive }) => `text-sm font-medium transition-smooth hover:text-primary ${isActive ? "text-primary" : "text-muted-foreground"}`}>Browse</NavLink>
          {user && (
            <NavLink to="/dashboard" className={({ isActive }) => `text-sm font-medium transition-smooth hover:text-primary ${isActive ? "text-primary" : "text-muted-foreground"}`}>Dashboard</NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {(user.user_metadata?.full_name || user.email || "U").slice(0,1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem asChild><Link to="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/favorites"><Heart className="mr-2 h-4 w-4" />Favorites</Link></DropdownMenuItem>
                {isAdmin && <DropdownMenuItem asChild><Link to="/admin"><Shield className="mr-2 h-4 w-4" />Admin</Link></DropdownMenuItem>}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}><LogOut className="mr-2 h-4 w-4" />Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" variant="default"><Link to="/auth">Sign in</Link></Button>
          )}
        </div>
      </div>
    </header>
  );
}
