import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Button from "../components/Button";
import Input from "../components/Input";
import AuthSplit from "../components/AuthSplit";

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
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplit
      left={
        <>
          <h1 className="text-3xl font-semibold mb-6 text-center">Log In</h1>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-full max-w-75 mx-auto"
          >
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
              type="button"
              variant="ghost"
              className="text-sm self-center"
            >
              Forgot password?
            </Button>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <Button loading={loading} type="submit">
              Log In
            </Button>
          </form>
        </>
      }
      right={
        <>
          <img className="w-16 mb-6" src="/logo.png" alt="Logo" />

          <h2 className="text-2xl font-semibold mb-2">Welcome back!</h2>

          <p className="text-(--muted) mb-10">
            Enter your credentials to access your account
          </p>

          <p className="text-sm text-(--muted) mb-2">Don't have an account?</p>

          <Link to="/register">
            <Button variant="outline">Sign Up</Button>
          </Link>
        </>
      }
    />
  );
}
