import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { useAuthStore } from '../stores/authStore';
import { Code, Menu, X, LogOut, User, Settings } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (profileMenuOpen) setProfileMenuOpen(false);
  };
  
  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };
  
  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex mx-auto px-4 h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Code className="h-6 w-6 text-primary" />
            <span>CodeHub</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/problems" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/problems') ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            Problems
          </Link>
          <Link 
            to="/submissions" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/submissions') ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            Submissions
          </Link>
          <Link 
            to="/leaderboard" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/leaderboard') ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            Leaderboard
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {user ? (
            <div className="relative">
              <button
                onClick={toggleProfileMenu}
                className="flex items-center gap-2 rounded-full bg-muted p-1.5 text-sm focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              </button>
              
              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 py-2 bg-card rounded-md shadow-lg border z-50"
                  >
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium">{user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                    {user.isAdmin && (
                      <Link
                        to="/admin"
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-muted"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-medium hover:text-primary"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
              >
                Register
              </Link>
            </div>
          )}
          
          <button
            onClick={toggleMobileMenu}
            className="md:hidden rounded-md p-2 text-muted-foreground hover:bg-muted transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="mx-auto px-4 py-4 flex flex-col gap-4">
              <Link
                to="/problems"
                className="flex py-2 text-base font-medium hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Problems
              </Link>
              <Link
                to="/submissions"
                className="flex py-2 text-base font-medium hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Submissions
              </Link>
              <Link
                to="/leaderboard"
                className="flex py-2 text-base font-medium hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Leaderboard
              </Link>
              {!user && (
                <div className="flex flex-col gap-2 pt-2 border-t">
                  <Link
                    to="/login"
                    className="w-full rounded-md bg-muted py-2 text-center text-sm font-medium hover:bg-muted/80"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="w-full rounded-md bg-primary py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}