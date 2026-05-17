import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-(--bg) text-(--text) px-4 py-6 sm:py-8">
      <div className="w-full max-w-225 min-h-[560px] md:h-125 flex flex-col md:flex-row rounded-xl md:rounded-2xl overflow-hidden border border-(--border)">
        <Outlet />
      </div>
    </div>
  );
}
