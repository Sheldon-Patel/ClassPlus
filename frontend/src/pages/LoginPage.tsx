import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Roles, type Role } from "../types";
import { useAppContext } from "../context/AppContext";
import { useToast } from "../components/ui";
import { Button } from "../components/ui";

import axios from "axios";
import { BASE } from "../services/api";
import { Navbar } from "../components/Navbar";

const inputClass = `w-full px-4 py-3 text-sm font-semibold rounded-lg border border-[var(--border)] text-[var(--text)] bg-[var(--surface)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-light)] transition-all duration-200`;

const LoginPage = () => {
  const { login } = useAppContext();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [activeRole, setActiveRole] = useState<Role>(Roles.STUDENT);
  const [studentMode, setStudentMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => { setName(""); setEmail(""); setPassword(""); };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await axios.post(`${BASE}/api/user/student-login`, { name, password });
      login(user.data);
      addToast(`Welcome back, ${user.data.user.name}!`, "success");
      navigate("/student");
    } catch (error: any) {
      if (error.response?.data?.error) {
        addToast(error.response.data.error, "error");
      } else {
        addToast("Invalid credentials or an error occurred.", "error");
      }
    } finally { setIsLoading(false); }
  };

  const handleStudentSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { addToast("Please enter a name.", "error"); return; }
    setIsLoading(true);
    try {
      const user = await axios.post(`${BASE}/api/user/signup`, { username: name, email, password });
      addToast(`Welcome, ${name}! Your account has been created.`, "success");
      login(user.data);
      navigate("/student");
    } catch (error: any) {
      if (error.response?.data?.error) {
        addToast(error.response.data.error, "error");
      } else if (error.response?.data?.message) {
        addToast(error.response.data.message, "error");
      } else {
        addToast("Failed to create account.", "error");
      }
    } finally { setIsLoading(false); }
  };

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await axios.post(`${BASE}/api/user/teacher-login`, { name, password });
      login(user.data);
      addToast(`Welcome, ${user.data.user.name}!`, "success");
      navigate(user.data.user.role === Roles.ADMIN ? "/admin" : "/teacher");
    } catch (error: any) {
      if (error.response?.data?.error) {
        addToast(error.response.data.error, "error");
      } else {
        addToast("Invalid credentials or an error occurred.", "error");
      }
    } finally { setIsLoading(false); }
  };

  const renderStudentForm = () => (
    <div>
      <div className="flex p-1 gap-1 mb-6 bg-[var(--surface-2)] rounded-xl border border-[var(--border-subtle)]">
        {(["login", "signup"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => {
              setStudentMode(mode);
              resetForm();
            }}
            className={`flex-1 py-2 font-bold uppercase text-xs rounded-lg transition-all duration-200 cursor-pointer ${
              studentMode === mode
                ? "bg-[var(--surface)] text-[var(--text)] shadow-sm border border-[var(--border-subtle)]"
                : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-3)]/50"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      <form
        onSubmit={
          studentMode === "login"
            ? handleStudentLogin
            : handleStudentSignUp
        }
        className="space-y-4"
      >
        <div>
          <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            className={inputClass}
          />
        </div>

        {studentMode === "signup" && (
          <div>
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@gmail.com"
              required
              className={inputClass}
            />
          </div>
        )}

        <div>
          <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className={inputClass}
          />
        </div>

        {studentMode === "login" && (
          <div className="border border-[var(--border-subtle)] bg-[var(--surface-2)] p-4 rounded-xl text-sm">
            <p className="font-bold uppercase tracking-wider text-xs mb-2 text-[var(--text-muted)]">Demo Credentials</p>
            <p className="text-[var(--text-muted)]">
              <span className="font-bold text-[var(--text)]">Username:</span> Sheldon
            </p>
            <p className="text-[var(--text-muted)]">
              <span className="font-bold text-[var(--text)]">Password:</span> 123456
            </p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 text-base font-bold mt-4 rounded-lg"
        >
          {isLoading
            ? "Please wait..."
            : studentMode === "login"
            ? "Sign In →"
            : "Create Account →"}
        </Button>
      </form>
    </div>
  );

  const renderStaffForm = () => (
    <div>
      <form onSubmit={handleStaffLogin} className="space-y-4">
        <div>
          <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Username
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your username"
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className={inputClass}
          />
        </div>

        <div className="border border-[var(--border-subtle)] bg-[var(--surface-2)] p-4 rounded-xl text-sm">
          <p className="font-bold uppercase tracking-wider text-xs mb-2 text-[var(--text-muted)]">Demo Credentials</p>

          {activeRole === Roles.TEACHER ? (
            <>
              <p className="text-[var(--text-muted)]">
                <span className="font-bold text-[var(--text)]">Username:</span> teacher
              </p>
              <p className="text-[var(--text-muted)]">
                <span className="font-bold text-[var(--text)]">Password:</span> 123456
              </p>
            </>
          ) : (
            <>
              <p className="text-[var(--text-muted)]">
                <span className="font-bold text-[var(--text)]">Username:</span> admin
              </p>
              <p className="text-[var(--text-muted)]">
                <span className="font-bold text-[var(--text)]">Password:</span> admin
              </p>
            </>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 text-base font-bold mt-4 rounded-lg"
        >
          {isLoading ? "Please wait..." : "Sign In →"}
        </Button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-grid flex flex-col theme-transition" style={{ background: "var(--bg)" }}>
      <Navbar />

      <div className="flex flex-col items-center justify-center p-4 py-16 sm:py-32 flex-1">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-center text-[var(--text)] leading-tight">Welcome Back</h1>
        <p className="mb-8 text-sm text-center px-4 text-[var(--text-subtle)]">CHOOSE YOUR ROLE TO ACCESS YOUR DASHBOARD</p>

        {/* Card */}
        <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xl theme-transition flex flex-col overflow-hidden">
          {/* Role tabs */}
          <div className="flex p-1 gap-1 border-b border-[var(--border-subtle)] bg-[var(--surface-2)] rounded-t-2xl">
            {(["STUDENT", "TEACHER", "ADMIN"] as const).map((role) => (
              <button
                key={role}
                onClick={() => { setActiveRole(role as Role); resetForm(); }}
                className={`flex-1 py-3 text-xs sm:text-sm font-bold uppercase transition-all duration-200 rounded-xl cursor-pointer ${
                  activeRole === role
                    ? "bg-[var(--surface)] text-[var(--accent)] shadow-sm border border-[var(--border-subtle)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-3)]/50"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="p-6">
            {activeRole === Roles.STUDENT && renderStudentForm()}
            {activeRole === Roles.TEACHER && renderStaffForm()}
            {activeRole === Roles.ADMIN && renderStaffForm()}
          </div>
        </div>

        <p className="mt-6 text-xs text-[var(--text-subtle)]">
          © {new Date().getFullYear()} ClassPure
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
