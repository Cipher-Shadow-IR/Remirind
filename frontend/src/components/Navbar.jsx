import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, GraduationCap, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#d4ccbd] bg-[#f7f4ec]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-85"
          >
            <img src="/Remirind_Logo.png" alt="Remirind" className="h-7 w-7 object-contain" />
            <span className="font-serif text-2xl font-normal tracking-tight text-[#29271f]">
              Remirind
            </span>
          </Link>

          {user ? (
            <div className="flex items-center gap-1 sm:gap-4">
              <Link
                to="/dashboard"
                className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs uppercase tracking-wider transition-colors ${
                  isActive('/dashboard')
                    ? 'border-b-2 border-[#8b713a] font-semibold text-[#29271f]'
                    : 'text-[#514d44] hover:text-[#29271f]'
                }`}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Tasks</span>
              </Link>

              <Link
                to="/exams"
                className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs uppercase tracking-wider transition-colors ${
                  isActive('/exams')
                    ? 'border-b-2 border-[#8b713a] font-semibold text-[#29271f]'
                    : 'text-[#514d44] hover:text-[#29271f]'
                }`}
              >
                <GraduationCap className="h-3.5 w-3.5" />
                <span>Assessments</span>
              </Link>
            </div>
          ) : null}
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-[#514d44]">
              <div className="flex h-6 w-6 items-center justify-center rounded-[2px] border border-[#d4ccbd] bg-[#fcfaf5] font-serif text-xs text-[#29271f]">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden md:inline font-sans font-medium tracking-wide text-[#29271f]">
                {user.name}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-[3px] border border-[#d4ccbd] px-2.5 py-1 text-xs uppercase tracking-wider text-[#514d44] transition-colors hover:border-[#8b713a] hover:bg-[#eae3d5] hover:text-[#29271f]"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
