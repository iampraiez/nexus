"use client";

import { useState } from "react";
import { useNexus } from "../use-nexus";

interface UserDemoCardProps {
  onEventTracked: () => void;
}

export default function UserDemoCard({ onEventTracked }: UserDemoCardProps) {
  const { track } = useNexus();
  const [email, setEmail] = useState("demo@example.com");
  const [source, setSource] = useState("landing-page");

  const handleSignup = () => {
    track("user_signup", {
      email,
      source,
    });
    onEventTracked();
  };

  const handleLogin = () => {
    track("user_login", {
      email,
    });
    onEventTracked();
  };

  return (
    <div className="card">
      <h2>👤 User Events</h2>
      <p>Track user signup and login events with email and source information.</p>

      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="source">Signup Source</label>
        <select value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="landing-page">Landing Page</option>
          <option value="google-ads">Google Ads</option>
          <option value="organic-search">Organic Search</option>
          <option value="social-media">Social Media</option>
          <option value="referral">Referral</option>
        </select>
      </div>

      <div className="button-group">
        <button className="btn-success" onClick={handleSignup}>
          ✓ Track user_signup
        </button>
        <button className="btn-primary" onClick={handleLogin}>
          → Track user_login
        </button>
      </div>

      <div className="status-box" style={{ marginTop: "1rem" }}>
        <div className="status-label">Sample Request Body</div>
        <div className="status-value">
          {`{
  "type": "user_signup",
  "email": "${email}",
  "source": "${source}"
}`}
        </div>
      </div>
    </div>
  );
}
