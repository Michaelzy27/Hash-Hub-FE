import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/hash-hub-logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { Wallet, Menu, X } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import WalletPanel from "@/components/WalletPanel";
import { Skeleton } from "@/components/ui/skeleton";

const NavSkeleton = ({ className }: { className?: string }) => (
  <Skeleton className={`h-8 rounded-full ${className ?? ""}`} />
);

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isProfileLoading, userProfile, logout } = useAuth();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);

  const navItems = [
    { label: "Explore", path: "/" },
    { label: "Projects", path: "/projects" },
    { label: "My Work", path: "/my-work" },
    { label: "DeFi", path: "/defi" },
  ];

  const hederaWallet = userProfile?.hederaWalletId;

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
              <img src={logo} alt="Hash Hub" className="h-8 w-8" />
              <span className="text-lg font-semibold tracking-tight text-foreground">
                Hash Hub
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && isProfileLoading ? (
              <>
                <NavSkeleton className="w-[120px]" />
                <NavSkeleton className="w-[150px]" />
                <NavSkeleton className="w-[140px]" />
              </>
            ) : (
              <>
                {userProfile?.isSponsor ? (
                  <Link
                      to="/sponsor/dashboard"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === "/sponsor/dashboard"
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Sponsor
                  </Link>
                  
                ) : (
                  <Link to="/sponsor-info">
                    <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                      Become a Sponsor
                    </Button>
                  </Link>
                )
                }
                {isAuthenticated ? (
                  <>
                    {!userProfile.isProfileComplete && (
                      <Link to="/complete-profile">
                        <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                          Complete Your Profile
                        </Button>
                      </Link>
                    )}

                    {/* Profile button */}
                    <button
                      onClick={() => navigate("/profile")}
                      className="flex items-center gap-2 rounded-full px-3 py-1.5 border border-border bg-secondary/50 transition-colors hover:bg-secondary"
                    >
                      <span className="text-sm font-mono text-foreground">
                        {userProfile?.email || "Profile"}
                      </span>
                    </button>

                    {/* Wallet icon button */}
                    {userProfile?.isProfileComplete && (
                      <button
                        onClick={() => setWalletOpen(true)}
                        className="relative flex items-center justify-center h-9 w-9 rounded-full border border-border bg-secondary/50 transition-colors hover:bg-secondary hover:border-primary/50 group"
                        aria-label="Open wallet"
                      >
                        <Wallet className="h-4 w-4 text-primary" />
                        {/* Pulse indicator if wallet connected */}
                        {hederaWallet && (
                          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                          </span>
                        )}
                      </button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground"
                      onClick={() => { logout(); navigate("/login"); }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button size="sm">Sign Up</Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile wallet icon */}
            {isAuthenticated && (
              <button
                onClick={() => setWalletOpen(true)}
                className="relative flex items-center justify-center h-9 w-9 rounded-full border border-border bg-secondary/50 transition-colors hover:bg-secondary"
                aria-label="Open wallet"
              >
                <Wallet className="h-4 w-4 text-primary" />
                {hederaWallet && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                  </span>
                )}
              </button>
            )}
            <button
              className="p-2 text-foreground"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 pb-4 pt-2 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-border pt-2 mt-2 space-y-2">
              {isAuthenticated && isProfileLoading ? (
                <>
                  <NavSkeleton className="w-full" />
                  <NavSkeleton className="w-full" />
                  <NavSkeleton className="w-full" />
                </>
              ) : (
                <>
                  <Link to="/sponsor-info" onClick={closeMenu} className="block">
                    <Button variant="outline" size="sm" className="w-full border-primary text-primary hover:bg-primary/10">
                      Become a Sponsor
                    </Button>
                  </Link>
                  {isAuthenticated ? (
                    <>
                      {!userProfile.isProfileComplete && (
                        <Link to="/complete-profile" onClick={closeMenu} className="block">
                          <Button variant="outline" size="sm" className="w-full border-primary text-primary hover:bg-primary/10">
                            Complete Your Profile
                          </Button>
                        </Link>
                      )}
                      <button
                        onClick={() => { navigate("/profile"); closeMenu(); }}
                        className="flex items-center gap-2 w-full rounded-full px-3 py-1.5 border border-border bg-secondary/50 transition-colors hover:bg-secondary"
                      >
                        <span className="text-sm font-mono text-foreground">
                          {userProfile?.email || "Profile"}
                        </span>
                      </button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-muted-foreground"
                        onClick={() => { logout(); navigate("/login"); closeMenu(); }}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                <div className="flex gap-2">
                  <Link to="/login" onClick={closeMenu} className="flex-1">
                    <Button variant="ghost" size="sm" className="w-full text-muted-foreground">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={closeMenu} className="flex-1">
                    <Button size="sm" className="w-full">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Wallet slide-over panel */}
      <WalletPanel open={walletOpen} onClose={() => setWalletOpen(false)} />
    </>
  );
};

export default Navbar;