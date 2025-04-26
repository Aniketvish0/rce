import { useEffect, lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { useAuthStore } from './stores/authStore';

const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const ProblemsPage = lazy(() => import('./pages/ProblemsPage').then(module => ({ default: module.ProblemsPage })));
const ProblemPage = lazy(() => import('./pages/ProblemPage').then(module => ({ default: module.ProblemPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then(module => ({ default: module.RegisterPage })));
const SubmissionsPage = lazy(() => import('./pages/SubmissionsPage').then(module => ({ default: module.SubmissionsPage })));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage').then(module => ({ default: module.LeaderboardPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(module => ({ default: module.ProfilePage })));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage').then(module => ({ default: module.AdminDashboardPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })));

import { RequireAuth } from './components/RequireAuth';
import { RequireAdmin } from './components/RequireAdmin';

function App() {
  const location = useLocation();
  const { user } = useAuthStore();

  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    let title = 'CodeHub';
    
    if (pathSegments.length > 0) {
      const page = pathSegments[0];
      title = `${page.charAt(0).toUpperCase() + page.slice(1)} | CodeHub`;
    }
    
    document.title = title;
  }, [location]);

  const noFooterRoutes = ['/problems/[id]'];
  const shouldShowFooter = !noFooterRoutes.some(route => {
    const pattern = new RegExp(route.replace('[id]', '[^/]+'));
    return pattern.test(location.pathname);
  });

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Suspense fallback={
            <div className="flex items-center justify-center h-[calc(100vh-64px)]">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/problems" element={<ProblemsPage />} />
              <Route path="/problems/:id" element={<ProblemPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/submissions" element={
                <RequireAuth>
                  <SubmissionsPage />
                </RequireAuth>
              } />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/profile" element={
                <RequireAuth>
                  <ProfilePage />
                </RequireAuth>
              } />
              <Route path="/admin/*" element={
                <RequireAdmin>
                  <AdminDashboardPage />
                </RequireAdmin>
              } />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </motion.div>
      </AnimatePresence>
      {shouldShowFooter && <Footer />}
    </>
  );
}

export default App;