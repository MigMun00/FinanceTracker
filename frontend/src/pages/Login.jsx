import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Button from "../components/Button";
import Input from "../components/Input";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-(--bg) text-(--text)">
      <div className="w-1/2 h-1/2 bg-(--surface) border border-(--border) rounded-2xl overflow-hidden flex">
        {/* Left */}
        <div className="w-1/2 flex flex-col items-center justify-center px-12">
          <h1 className="text-3xl font-semibold mb-6">Log In</h1>

          <div className="flex flex-col gap-4 w-3/4">
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />

            <Button
              disabled={true}
              variant="ghost"
              className=" w-auto self-center text-sm"
            >
              Forgot password?
            </Button>

            <Button
              className="w-1/2 self-center"
              onClick={handleSubmit}
              loading={loading}
            >
              Log In
            </Button>
          </div>
        </div>

        {/* Right */}
        <div className="w-1/2 bg-(--elevated) flex flex-col items-center justify-center px-10 text-center">
          <img className="w-1/4 mb-5" src="/logo.png" alt="Logo" />

          <h2 className="text-2xl font-semibold mb-2">Welcome back!</h2>

          <p className="text-(--muted) mb-12">
            Enter your credentials to access your account
          </p>

          <p className="text-sm text-(--muted) mb-2">Don't have an account?</p>

          <Link to="/register">
            <Button variant="outline">Sign Up</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
