"use client";

import { useState, useCallback } from "react";
import { useNexus } from "./use-nexus";
import UserDemoCard from "./components/UserDemoCard";
import ProductDemoCard from "./components/ProductDemoCard";
import CheckoutDemoCard from "./components/CheckoutDemoCard";
import OrderDemoCard from "./components/OrderDemoCard";

interface EventLog {
  id: string;
  type: string;
  timestamp: number;
}

export default function Home() {
  const { isInitialized, sessionId, flush } = useNexus();
  const [events, setEvents] = useState<EventLog[]>([]);

  const addEvent = useCallback((type: string) => {
    const event: EventLog = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      timestamp: Date.now(),
    };
    setEvents((prev) => [event, ...prev].slice(0, 20));
  }, []);

  return (
    <main>
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1>🚀 Nexus Analytics SDK Demo</h1>
          <p>
            Interactive demonstration of all Nexus SDK event types. Open your
            browser console to see tracking details.
          </p>
        </div>

        {/* Status */}
        <div className="grid" style={{ marginBottom: "2rem" }}>
          <div className="card">
            <h2>📊 SDK Status</h2>
            <div
              className={`status-box ${isInitialized ? "success" : "warning"}`}
            >
              <div className="status-label">Initialization</div>
              <div className="status-value">
                {isInitialized ? "✓ Initialized" : "⚠ Not Initialized"}
              </div>
            </div>
            <div className="status-box">
              <div className="status-label">Session ID</div>
              <div className="status-value">
                {sessionId || "Loading..."}
              </div>
            </div>
            <button
              className="btn-primary"
              onClick={flush}
              style={{ marginTop: "1rem" }}
            >
              📤 Flush Events
            </button>
          </div>

          {/* Event Log */}
          <div className="card">
            <h2>📋 Event Log</h2>
            <p style={{ marginBottom: "1rem" }}>
              Last {events.length} events tracked:
            </p>
            {events.length === 0 ? (
              <div className="status-box">
                <p style={{ color: "#999", margin: 0 }}>
                  No events tracked yet. Try tracking some below!
                </p>
              </div>
            ) : (
              <div className="event-list">
                {events.map((event) => (
                  <div key={event.id} className="event-item">
                    <span className="event-item-type">{event.type}</span>
                    <br />
                    <span className="event-item-time">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Event Demo Cards */}
        <div className="grid">
          <UserDemoCard
            onEventTracked={() => addEvent("user_signup/login")}
          />
          <ProductDemoCard
            onEventTracked={() => addEvent("product_*")}
          />
          <CheckoutDemoCard
            onEventTracked={() => addEvent("checkout_*")}
          />
          <OrderDemoCard onEventTracked={() => addEvent("order_*")} />
        </div>

        {/* Footer */}
        <div className="footer">
          <p>
            📚 Read the{" "}
            <a href="#" onClick={(e) => e.preventDefault()}>
              full documentation
            </a>{" "}
            to learn more about the Nexus SDK.
          </p>
          <p style={{ marginTop: "1rem", color: "#999", fontSize: "0.85rem" }}>
            This demo uses development mode with a batch size of 5 events and
            3-second flush interval.
          </p>
        </div>
      </div>
    </main>
  );
}
