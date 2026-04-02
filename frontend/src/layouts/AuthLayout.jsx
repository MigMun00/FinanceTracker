import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-(--bg) text-(--text)">
      <div className="w-full max-w-225 h-125 flex rounded-2xl overflow-hidden border border-(--border)">
        <Outlet />
      </div>
    </div>
  );
}
