import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
 
const SignIn = () => {
  const navigate = useNavigate();
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone: email, password }), // ✅ Fixed here
      });
 
      const data = await response.json();
 
      if (response.ok) {
        localStorage.setItem("token", data.token); // ✅ Store token
        navigate("/expenses"); // ✅ Go to protected page
      } else {
        alert(data.error || "Login failed"); // ✅ Use 'error' field
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed");
    }
  };
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex shadow-lg rounded-2xl overflow-hidden max-w-4xl w-full">
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
          <p className="text-sm text-gray-500 mb-6">It's time to check Your business</p>
 
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
            <div className="text-right text-sm">
              <button type="button" className="text-green-600 hover:underline">
                Forgot your password?
              </button>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
            >
              Sign In
            </button>
          </form>
 
          <p className="mt-4 text-sm text-gray-600 text-center">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-green-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
 
        <div className="hidden md:flex md:w-1/2 bg-green-200 items-center justify-center p-8">
          <div className="text-white text-left space-y-4">
            <h3 className="text-xl font-bold">FEATURES</h3>
            <ul className="space-y-2">
              <li>✔️ 100% Free Sign Up</li>
              <li>✔️ Real-Time Expense Tracking</li>
              <li>✔️ Financial Health Score</li>
              <li>✔️ Debt Payoff Planner</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default SignIn;
 