import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";

export default function Dashboard() {
  const { logoutUser, user } = useAuth();

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Welcome {user?.email || "User"}</h1>

      <Button variant="danger" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}
