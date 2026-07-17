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

interface HeaderProps {
    toggleSidebar?: () => void;
    isSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
    const { currentUser, logout } = useAppContext();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const homePath = currentUser ? `/${currentUser.role.toLowerCase()}` : '/';

    return (
        <header
            className="sticky top-0 z-40 transition-all duration-300 border-b-4 border-black"
            style={{
                background: 'var(--surface)',
                borderColor: 'var(--border)',
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 min-h-[4rem] flex items-center justify-between gap-4">
                
                {/* Logo and Menu Toggle */}
                <div className="flex items-center gap-3 lg:basis-0 lg:flex-1 shrink-0">
                    {currentUser && toggleSidebar && (
                        <button
                            onClick={toggleSidebar}
                            className="w-10 h-10 flex items-center justify-center font-black text-xl border-4 border-black bg-[var(--surface-2)] text-[var(--text)] cursor-pointer hover:bg-[var(--nb-yellow)] transition-colors shadow-[var(--shadow-sm)]"
                            style={{ borderColor: 'var(--border)' }}
                            aria-label="Toggle sidebar"
                        >
                            {isSidebarOpen ? '✕' : '☰'}
                        </button>
                    )}

                    <div
                        className="flex items-center gap-2.5 cursor-pointer shrink-0"
                        onClick={() => navigate(homePath)}
                    >
                        <img src="/favicon.svg" alt="ClassPure Logo" className="w-8 h-8 object-contain" />
                        <span
                            className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[var(--text)]"
                            style={{ textShadow: isDark ? '2px 2px 0px #ff007f' : '2px 2px 0px var(--nb-yellow)' }}
                        >
                            ClassPure
                        </span>
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center justify-end gap-2.5 lg:basis-0 lg:flex-1 shrink-0">
                    {/* Points (Desktop/Tablet) */}
                    {currentUser?.role === Roles.STUDENT && (
                        <div className="hidden sm:flex items-center gap-1.5 font-black text-yellow-500 text-sm px-3 py-1.5 border-4 border-black bg-[var(--surface-2)] shadow-[var(--shadow-sm)]" style={{ borderColor: 'var(--border)' }}>
                            <TrophyIcon className="w-4 h-4" />
                            <span>{currentUser.points}</span>
                        </div>
                    )}

                    {/* User profile (Desktop/Tablet) */}
                    {currentUser && (
                        <Link
                            to={`/${currentUser.role.toLowerCase()}/${currentUser._id || currentUser.id}`}
                            className="hidden md:inline-flex items-center gap-2 text-sm font-black px-4 py-2 border-4 border-black bg-[var(--nb-yellow)] text-black hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all shadow-[var(--shadow-sm)]"
                            style={{ borderColor: 'var(--border)' }}
                        >
                            <span>{currentUser.name}</span>
                            <span className="text-[10px] uppercase font-black px-1.5 py-0.5 border-2 border-black bg-white text-black">
                                {currentUser.role}
                            </span>
                        </Link>
                    )}

                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        className="w-10 h-10 flex items-center justify-center transition-all text-[var(--text)] bg-[var(--surface-2)] border-4 border-black shadow-[var(--shadow-sm)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none cursor-pointer"
                        style={{ borderColor: 'var(--border)' }}
                        aria-label="Toggle theme"
                    >
                        {isDark ? <SunIcon /> : <MoonIcon />}
                    </button>

                    {/* Logout */}
                    {currentUser && (
                        <Button onClick={logout} variant="secondary" className="text-sm px-4 py-2 h-10">
                            Logout
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
};
