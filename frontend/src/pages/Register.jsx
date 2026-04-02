import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../components/Button";
import Input from "../components/Input";
import AuthSplit from "../components/AuthSplit";
import { register } from "../services/auth";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      await register(form);

      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Error creating account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplit
      left={
        <>
          <h1 className="text-3xl font-semibold mb-6 text-center">Sign Up</h1>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-full max-w-[320px] mx-auto"
          >
            <Input
              name="first_name"
              type="text"
              placeholder="First Name"
              value={form.first_name}
              onChange={handleChange}
            />

            <Input
              name="last_name"
              type="text"
              placeholder="Last Name"
              value={form.last_name}
              onChange={handleChange}
            />

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

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <Button loading={loading} type="submit">
              Sign Up
            </Button>
          </form>
        </>
      }
      right={
        <>
          <img className="w-16 mb-6" src="/logo.png" alt="Logo" />

          <h2 className="text-2xl font-semibold mb-2">Get Started!</h2>

          <p className="text-(--muted) mb-10">
            Enter your credentials to create your account
          </p>

          <p className="text-sm text-(--muted) mb-2">
            Already have an account?
          </p>

          <Link to="/login">
            <Button variant="outline">Log In</Button>
          </Link>
        </>
      }
    />
  );
}
