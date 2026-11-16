import React, { useMemo, useState } from "react";
// AppRouter component

import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { Roles } from "../types";

import HomePage from "../HomePage";
import LoginPage from "../pages/LoginPage";
import StudentDashboard from "../pages/student/StudentDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminHistoryPage from "../pages/admin/AdminHistoryPage";
import AdminQuizzesPage from "../pages/admin/AdminQuizzesPage";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import QuizTaker from "../pages/student/QuizTaker";
import QuizResults from "../pages/student/QuizResults";
import PollTaker from "../pages/shared/PollTaker";
import PollsAdmin from "../pages/admin/PollsAdmin";
import LeaderboardPage from "../pages/shared/LeaderboardPage";
import ResourcesPage from "../pages/shared/ResourcesPage";
import StudentListPage from "../pages/admin/StudentListPage";
import StudentProfilePage from "../pages/shared/StudentProfilePage";
import DiscussionListPage from "../pages/shared/DiscussionListPage";
import DiscussionPostPage from "../pages/shared/DiscussionPostPage";
import ClassroomsPage from "../pages/shared/ClassroomsPage";
import ClassroomDetailPage from "../pages/shared/ClassroomDetailPage";
import Learning from "../pages/shared/Learning";

import { Header } from "../components/shared/Header";
import { Spinner } from "../components/ui";
import { SmartAssistant } from "../components/shared/SmartAssistant";

const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentUser } = useAppContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const sidebarLinks = useMemo(() => {
    if (!currentUser) return [];
    const role = currentUser.role;
    return [
      { to: `/${role.toLowerCase()}`, label: 'Dashboard', icon: '📊' },
      { to: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
      ...(role === Roles.STUDENT ? [{ to: '/discussions', label: 'Discussions', icon: '💬' }] : []),
      ...(role !== Roles.ADMIN ? [{ to: '/classrooms', label: 'Classrooms', icon: '🏫' }] : []),
      ...(role === Roles.STUDENT ? [
        { to: '/learning', label: 'Learning', icon: '🧠' },
        { to: '/resources', label: 'Resources', icon: '📚' },
      ] : []),
      ...(role === Roles.TEACHER ? [
        { to: '/students', label: 'Student List', icon: '👥' },
      ] : []),
      ...(role === Roles.ADMIN ? [
        { to: '/admin/polls', label: 'Polls Admin', icon: '🗳️' },
        { to: '/students', label: 'Student List', icon: '👥' },
        { to: '/admin/quizzes', label: 'Quizzes Admin', icon: '📝' },
        { to: '/admin/history', label: 'History Logs', icon: '⏳' },
      ] : []),
    ];
  }, [currentUser]);

  return (
    <div
      className="min-h-screen bg-grid theme-transition flex flex-col"
      style={{ background: 'var(--bg)', color: 'var(--text)' }}
    >
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex flex-1 relative min-h-[calc(100vh-4rem)]">
        {/* Cyber Sidebar */}
        <aside
          className={`shrink-0 border-r-4 border-black bg-[var(--surface)] theme-transition overflow-y-auto flex flex-col z-30 sticky top-[4rem] h-[calc(100vh-4rem)] custom-scrollbar ${
            isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0'
          }`}
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="p-4 flex-1 flex flex-col gap-2">
            {sidebarLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-3 p-3 font-black uppercase text-sm border-2 border-transparent hover:border-[var(--border)] hover:bg-[var(--nb-yellow)] hover:text-black transition-all"
                title={link.label}
              >
                <span className="text-xl shrink-0">{link.icon}</span>
                <span className={`transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>{link.label}</span>
              </Link>
            ))}
          </div>
          <div className="p-4 border-t-4 border-black text-center" style={{ borderColor: 'var(--border)' }}>
            <div className="text-[10px] font-black uppercase tracking-wider text-[var(--text-subtle)] whitespace-nowrap">
              {isSidebarOpen ? "SYSTEM: ONLINE" : "SYS: ON"}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden min-w-0">
          {children}
        </main>
      </div>

      <SmartAssistant />
    </div>
  );
};

// Protected route component that wraps authenticated content in Layout
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles,
}) => {
  const { currentUser } = useAppContext();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return <Layout>{children}</Layout>;
};

const AppRouter = () => {
  const { currentUser } = useAppContext();

  React.useEffect(() => {
    // If the browser directly accessed a sub-route on load, redirect to home page
    if (window.location.hash.includes("student") || window.location.hash.includes("teacher") || window.location.hash.includes("admin")) {
      window.location.hash = "#/";
    }
  }, []);

  const userDashboardPath = useMemo(() => {
    if (!currentUser) return "/";
    switch (currentUser.role) {
      case Roles.ADMIN:
        return "/admin";
      case Roles.TEACHER:
        return "/teacher";
      case Roles.STUDENT:
        return "/student";
      default:
        return "/";
    }
  }, [currentUser]);

  // A simple check to see if context is ready
  if (useAppContext() === null) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        {/* Public Landing & Marketing Pages - Users always land on Landing Page at "/" */}
        <Route path="/" element={<HomePage />} />
        <Route path="/how-to-use" element={<HomePage />} />
        <Route path="/about-us" element={<HomePage />} />

        {/* Login Page */}
        <Route
          path="/login"
          element={
            currentUser ? <Navigate to={userDashboardPath} replace /> : <LoginPage />
          }
        />

        {/* Authenticated Dashboard Pages wrapped in Layout */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={[Roles.STUDENT]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={[Roles.TEACHER]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[Roles.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/quizzes"
          element={
            <ProtectedRoute allowedRoles={[Roles.ADMIN]}>
              <AdminQuizzesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/history"
          element={
            <ProtectedRoute allowedRoles={[Roles.ADMIN]}>
              <AdminHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/polls"
          element={
            <ProtectedRoute allowedRoles={[Roles.ADMIN]}>
              <PollsAdmin />
            </ProtectedRoute>
          }
        />

        {/* Quiz & Poll execution */}
        <Route
          path="/quiz/:assignmentId"
          element={
            <ProtectedRoute>
              <QuizTaker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/poll/:pollId"
          element={
            <ProtectedRoute>
              <PollTaker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results/:quizId"
          element={
            <ProtectedRoute>
              <QuizResults />
            </ProtectedRoute>
          }
        />

        {/* Leaderboard & Shared Pages */}
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <LeaderboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard/:quizId"
          element={
            <ProtectedRoute>
              <LeaderboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources"
          element={
            <ProtectedRoute allowedRoles={[Roles.STUDENT]}>
              <ResourcesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learning"
          element={
            <ProtectedRoute allowedRoles={[Roles.STUDENT]}>
              <Learning />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students"
          element={
            <ProtectedRoute allowedRoles={[Roles.TEACHER, Roles.ADMIN]}>
              <StudentListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/:studentId"
          element={
            <ProtectedRoute>
              <StudentProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/discussions"
          element={
            <ProtectedRoute>
              <DiscussionListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/discussions/:postId"
          element={
            <ProtectedRoute>
              <DiscussionPostPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/classrooms"
          element={
            <ProtectedRoute allowedRoles={[Roles.STUDENT, Roles.TEACHER]}>
              <ClassroomsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/classrooms/:id"
          element={
            <ProtectedRoute allowedRoles={[Roles.STUDENT, Roles.TEACHER]}>
              <ClassroomDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirects to the landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default AppRouter;
