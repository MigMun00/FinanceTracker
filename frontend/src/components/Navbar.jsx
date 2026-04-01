import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="w-full px-6 py-3 border-b border-(--border) bg-(--surface) flex items-center justify-between">
      {/* Left */}
      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="font-semibold">
          FinanceTracker
        </Link>

        {isAuthenticated && (
          <>
            <Link to="/transactions">Transactions</Link>
            <Link to="/categories">Categories</Link>
          </>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <span className="text-sm text-(--muted)">{user?.first_name}</span>
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
