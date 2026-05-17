import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "./Button";

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
              <span className="text-xs text-(--muted) md:hidden">
                {user?.first_name} {user?.last_name}
              </span>
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
              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <span className="hidden md:inline text-sm text-(--muted)">
                  {user?.first_name} {user?.last_name}
                </span>
                <Button className="w-full sm:w-auto" variant="danger" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </nav>
      ) : null}
    </>
  );
}
