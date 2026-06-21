import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { 
  Menu, 
  X, 
  Leaf, 
  LayoutDashboard, 
  PlusCircle, 
  LineChart, 
  Lightbulb, 
  MapPin, 
  Target, 
  Users, 
  Settings as SettingsIcon, 
  LogOut 
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Log Activity', path: '/log', icon: PlusCircle },
    { name: 'Trends', path: '/trends', icon: LineChart },
    { name: 'Tips', path: '/tips', icon: Lightbulb },
    { name: 'Nearby Map', path: '/map', icon: MapPin },
    { name: 'Goals', path: '/goals', icon: Target },
    { name: 'Community', path: '/community', icon: Users },
    { name: 'Settings', path: '/settings', icon: SettingsIcon }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="border-b border-border bg-card/85 backdrop-blur-md sticky top-0 z-40 w-full" aria-label="Main Navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={user ? '/dashboard' : '/'} className="flex items-center space-x-2 text-primary focus-ring rounded-md p-1" aria-label="EcoTrack Home">
              <Leaf className="h-6 w-6" />
              <span className="font-heading font-extrabold text-xl tracking-tight text-foreground">
                Eco<span className="text-primary">Track</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {user ? (
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all focus-ring ${
                      active 
                        ? 'bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/25' 
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 focus-ring"
                aria-label="Log Out"
                id="logout-btn"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center space-x-4">
              <Link
                to="/login"
                className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium focus-ring"
                id="nav-login-link"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="bg-primary text-primary-foreground hover:bg-primary/95 px-4 py-2 rounded-lg text-sm font-semibold shadow-md shadow-primary/25 transition-all focus-ring"
                id="nav-signup-link"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus-ring"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
              id="mobile-menu-toggle"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden animate-fade-in-up" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card border-b border-border shadow-lg">
            {user ? (
              <>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-2 px-3 py-2.5 rounded-lg text-base font-medium focus-ring ${
                        active 
                          ? 'bg-primary text-primary-foreground font-semibold' 
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                      aria-current={active ? 'page' : undefined}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center space-x-2 px-3 py-2.5 rounded-lg text-base font-medium text-destructive hover:bg-destructive/10 text-left focus-ring"
                  aria-label="Log Out"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 p-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-center text-muted-foreground hover:bg-muted hover:text-foreground px-3 py-2.5 rounded-lg text-base font-medium border border-border focus-ring"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="text-center bg-primary text-primary-foreground hover:bg-primary/95 px-3 py-2.5 rounded-lg text-base font-semibold focus-ring"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
