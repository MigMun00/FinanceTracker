import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
        <nav className="w-full px-6 py-3 border-b border-(--border) bg-(--elevated) flex items-center justify-between">
          <div className="max-w-300 mx-auto flex items-center justify-between w-full">
            {/* Left */}
            <div className="flex items-center gap-6">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : ""}`
                }
              >
                Dashboard
              </NavLink>
              <div className="flex items-center gap-5">
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
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-(--muted)">
                {user?.first_name} {user?.last_name}
              </span>

              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </nav>
      ) : null}
    </>
  );
}
