"use client";

import React, { useState } from "react";

export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    
    // Simulate API call to save email
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      {/* Semantic HTML for SEO */}
      <main className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Something awesome is in the works.
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            We're building a powerful new utility to simplify your workflow. Drop your email below to get early access and be the first to know when we launch.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your email address"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="group relative w-full sm:w-auto flex justify-center py-3 px-6 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition-colors"
            >
              {status === "loading" ? "Sending..." : "Notify Me"}
            </button>
          </div>
          
          {status === "success" && (
            <p className="text-sm text-green-600 font-medium transition-opacity">
              Thanks! We'll reach out as soon as we're live.
            </p>
          )}
        </form>

        <div className="mt-10">
          <p className="text-sm text-gray-500">
            Expected launch: <span className="font-semibold text-gray-700">Coming soon</span>
          </p>
        </div>
      </main>
    </div>
  );
}