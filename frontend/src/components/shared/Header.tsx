import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { Roles } from '../../types';
import { Button } from '../ui';
import { TrophyIcon } from '../Icons';

const SunIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
);

const MoonIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
);

export const Header = () => {
    const { currentUser, logout } = useAppContext();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const homePath = currentUser ? `/${currentUser.role.toLowerCase()}` : '/';

    return (
        <header
            className="sticky top-0 z-40 transition-all duration-300 backdrop-blur-md"
            style={{
                background: isDark ? 'rgba(9, 10, 15, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                borderBottom: `1px solid var(--border-subtle)`,
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 min-h-[4rem] flex flex-wrap lg:flex-nowrap items-center justify-between gap-y-3 gap-x-2 sm:gap-x-4">
                <div className="flex items-center justify-between w-full lg:w-auto lg:basis-0 lg:flex-1 shrink-0 gap-2">
                    {/* Logo */}
                    <div
                        className="flex items-center gap-2.5 cursor-pointer shrink-0"
                        onClick={() => navigate(homePath)}
                    >
                        <img src="/favicon.svg" alt="ClassPure Logo" className="w-8 h-8 object-contain drop-shadow-sm" />
                        <span
                            className="text-xl sm:text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-[var(--nb-blue)]"
                        >
                            ClassPure
                        </span>
                    </div>

                    {/* Right side (Mobile) */}
                    <div className="flex items-center gap-2 shrink-0 lg:hidden">
                        <button
                            onClick={toggleTheme}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-[var(--surface-2)] border border-[var(--border)] shadow-sm hover:bg-[var(--surface-3)]"
                            aria-label="Toggle theme"
                        >
                            {isDark ? <SunIcon /> : <MoonIcon />}
                        </button>
                        {currentUser && (
                            <Button onClick={logout} variant="secondary" className="text-xs px-2 py-1 h-8 rounded-md">
                                Logout
                            </Button>
                        )}
                    </div>
                </div>

                {/* Nav links */}
                {currentUser && (
                    <nav className="flex flex-wrap items-center justify-center lg:justify-center gap-x-2 gap-y-1.5 w-full lg:basis-0 lg:flex-1 lg:min-w-0 pb-2 lg:pb-0">
                        {[
                            { to: '/leaderboard', label: 'Leaderboard' },
                            ...(currentUser.role === Roles.STUDENT ? [{ to: '/discussions', label: 'Discussions' }] : []),
                            ...(currentUser.role !== Roles.ADMIN ? [{ to: '/classrooms', label: 'Classrooms' }] : []),
                            ...(currentUser.role === Roles.STUDENT ? [
                                { to: '/learning', label: 'Learning' },
                                { to: '/resources', label: 'Resources' },
                            ] : []),
                        ].map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                className="px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg uppercase transition-all duration-200 whitespace-nowrap text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>
                )}

                {/* Right side (Desktop) */}
                <div className="hidden lg:flex items-center justify-end gap-3 lg:basis-0 lg:flex-1 shrink-0">
                    {/* Points */}
                    {currentUser?.role === Roles.STUDENT && (
                        <div className="flex items-center gap-1.5 font-bold text-yellow-500 text-sm px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-2)]">
                            <TrophyIcon className="w-4 h-4" />
                            <span>{currentUser.points}</span>
                        </div>
                    )}

                    {/* User name */}
                    {currentUser && (
                        <Link
                            to={`/${currentUser.role.toLowerCase()}/${currentUser._id || currentUser.id}`}
                            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-[var(--accent-light)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all duration-200"
                        >
                            <span>{currentUser.name}</span>
                            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-black/10">
                                {currentUser.role}
                            </span>
                        </Link>
                    )}

                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 text-[var(--text)] bg-[var(--surface-2)] border border-[var(--border)] shadow-sm hover:bg-[var(--surface-3)]"
                        aria-label="Toggle theme"
                    >
                        {isDark ? <SunIcon /> : <MoonIcon />}
                    </button>

                    {/* Logout */}
                    {currentUser && (
                        <Button onClick={logout} variant="secondary" className="text-sm px-4 py-2 h-10 rounded-lg">
                            Logout
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
};
