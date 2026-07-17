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

const AppRouter = () => {
  const { currentUser } = useAppContext();

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
      {currentUser ? (
        <Layout>
          <Routes>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/quizzes" element={<AdminQuizzesPage />} />
            <Route path="/admin/history" element={<AdminHistoryPage />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/quiz/:assignmentId" element={<QuizTaker />} />
            <Route path="/poll/:pollId" element={<PollTaker />} />
            <Route path="/admin/polls" element={<PollsAdmin />} />
            <Route path="/results/:quizId" element={<QuizResults />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/leaderboard/:quizId" element={<LeaderboardPage />} />
            {currentUser.role === Roles.STUDENT && (
              <>
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/learning" element={<Learning />} />
              </>
            )}
            <Route path="/how-to-use" element={<HomePage />} />
            <Route path="/about-us" element={<HomePage />} />
            <Route path="/students" element={<StudentListPage />} />
            <Route
              path="/student/:studentId"
              element={<StudentProfilePage />}
            />
            <Route path="/discussions" element={<DiscussionListPage />} />
            <Route
              path="/discussions/:postId"
              element={<DiscussionPostPage />}
            />
            {currentUser.role !== Roles.ADMIN && (
              <>
                <Route path="/classrooms" element={<ClassroomsPage />} />
                <Route path="/classrooms/:id" element={<ClassroomDetailPage />} />
              </>
            )}
            <Route path="*" element={<Navigate to={userDashboardPath} />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </HashRouter>
  );
};

export default AppRouter;
