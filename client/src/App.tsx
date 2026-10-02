import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/ui/Toast';
import { CommandPalette } from './components/shared/CommandPalette';
import { AIMentorDrawer } from './components/shared/AIMentorDrawer';
import { LiveActivityBanner } from './components/shared/LiveActivityBanner';
import { useAuthStore } from './store/authStore';

const Landing = React.lazy(() => import('./pages/Landing'));
const Explore = React.lazy(() => import('./pages/Explore'));
const Heroes = React.lazy(() => import('./pages/Heroes'));
const HeroProfile = React.lazy(() => import('./pages/HeroProfile'));
const Achievements = React.lazy(() => import('./pages/Achievements'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Login = React.lazy(() => import('./pages/Auth/Login'));
const Register = React.lazy(() => import('./pages/Auth/Register'));
const CodeDuel = React.lazy(() => import('./pages/CodeDuel'));
const GolfCoach = React.lazy(() => import('./pages/GolfCoach'));
const ImpactMap = React.lazy(() => import('./pages/ImpactMap'));
const DrawEngine = React.lazy(() => import('./pages/DrawEngine'));
const AdminCopilot = React.lazy(() => import('./pages/AdminCopilot'));
const TrustCenter = React.lazy(() => import('./pages/TrustCenter'));
const CharityExplorer = React.lazy(() => import('./pages/CharityExplorer'));
const YourMonthStory = React.lazy(() => import('./pages/YourMonthStory'));
import { MobileNav } from './components/layout/MobileNav';

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 animate-pulse" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen((p) => !p); }
    };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 transition-colors duration-300 pb-16 lg:pb-0">
      <LiveActivityBanner />
      <Navbar />
      <main>
        <React.Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/heroes" element={<Heroes />} />
            <Route path="/heroes/:username" element={<HeroProfile />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/codeduel" element={<ProtectedRoute><CodeDuel /></ProtectedRoute>} />
            <Route path="/golf-coach" element={<ProtectedRoute><GolfCoach /></ProtectedRoute>} />
            <Route path="/impact-map" element={<ImpactMap />} />
            <Route path="/charities" element={<CharityExplorer />} />
            <Route path="/draw-engine" element={<DrawEngine />} />
            <Route path="/admin-copilot" element={<ProtectedRoute><AdminCopilot /></ProtectedRoute>} />
            <Route path="/trust" element={<TrustCenter />} />
            <Route path="/month-story" element={<ProtectedRoute><YourMonthStory /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </main>
      <Footer />
      <MobileNav />
      <ToastContainer />
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
      <AIMentorDrawer />
    </div>
  );
}
