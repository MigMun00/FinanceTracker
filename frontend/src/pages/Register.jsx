import { Link } from "react-router-dom";

import Button from "../components/Button";
import Input from "../components/Input";

export default function Register() {
  return (
    <div className="h-screen flex items-center justify-center bg-(--bg) text-(--text)">
      <div className="w-1/2 h-1/2 bg-(--surface) border border-(--border) rounded-2xl overflow-hidden flex">
        {/* Left */}
        <div className="w-1/2 flex flex-col items-center justify-center px-12">
          <h1 className="text-3xl font-semibold mb-6">Sign Up</h1>

          <div className="flex flex-col gap-4 w-3/4">
            <Input type="text" placeholder="First Name" />
            <Input type="text" placeholder="Last Name" />
            <Input type="email" placeholder="Email" />
            <Input type="password" placeholder="Password" />
            <Button className="w-1/2 self-center">Sign Up</Button>
          </div>
        </div>

        {/* Right */}
        <div className="w-1/2 bg-(--elevated) flex flex-col items-center justify-center px-10 text-center">
          <img className="w-1/4 mb-5" src="/logo.png" alt="Logo" />

          <h2 className="text-2xl font-semibold mb-2">Get Started!</h2>

          <p className="text-(--muted) mb-12">
            Enter your credentials to create your account
          </p>

          <p className="text-sm text-(--muted) mb-2">
            Already have an account?
          </p>

          <Link to="/login">
            <Button variant="outline">Log In</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
