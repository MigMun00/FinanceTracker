import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const linkBase =
    "text-sm font-medium text-(--muted) hover:text-(--text) transition";
  const linkActive = "text-(--text)";
  const userName = [user?.first_name, user?.last_name].filter(Boolean).join(" ");

  return (
    <>
      {isAuthenticated ? (
        <nav className="w-full px-4 py-3 sm:px-6 border-b border-(--border) bg-(--elevated)">
          <div className="max-w-300 mx-auto w-full flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center justify-between w-full md:w-auto">
              <NavLink
                to="/dashboard"
                className="flex items-center gap-2 hover:opacity-80 transition"
              >
                <img className="w-9 h-9 sm:w-10 sm:h-10" src="/logo.png" alt="Logo" />
                <h1 className="text-lg sm:text-xl font-bold">Finance Tracker</h1>
              </NavLink>
              <div className="flex items-center gap-2 md:hidden">
                <span className="max-w-28 truncate text-xs text-(--muted)">
                  {userName}
                </span>
                <button
                  type="button"
                  aria-label="Log out"
                  title="Log out"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-(--border) text-(--muted) transition hover:border-(--danger) hover:bg-(--danger) hover:text-white"
                  onClick={handleLogout}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M12 2v10" />
                    <path d="M18.36 5.64a9 9 0 1 1-12.72 0" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:justify-end md:flex-1">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 md:mr-6">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : ""}`
                  }
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/transactions"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : ""}`
                  }
                >
                  Transactions
                </NavLink>

                <NavLink
                  to="/categories"
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : ""}`
                  }
                >
                  Categories
                </NavLink>
              </div>
              <div className="hidden md:flex items-center justify-between gap-3 sm:justify-end">
                <span className="max-w-48 truncate text-sm text-(--muted)">
                  {userName}
                </span>
                <button
                  type="button"
                  aria-label="Log out"
                  title="Log out"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-(--border) text-(--muted) transition hover:border-(--danger) hover:bg-(--danger) hover:text-white"
                  onClick={handleLogout}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M12 2v10" />
                    <path d="M18.36 5.64a9 9 0 1 1-12.72 0" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>
      ) : null}
    </>
  );
}
