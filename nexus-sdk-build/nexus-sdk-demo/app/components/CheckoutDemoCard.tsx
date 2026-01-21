"use client";

import { useState } from "react";
import { useNexus } from "../use-nexus";

interface CheckoutDemoCardProps {
  onEventTracked: () => void;
}

export default function CheckoutDemoCard({
  onEventTracked,
}: CheckoutDemoCardProps) {
  const { track } = useNexus();
  const [cartValue, setCartValue] = useState(149.97);
  const [itemCount, setItemCount] = useState(3);

  const handleCheckoutStarted = () => {
    track("checkout_started", {
      cartValue,
      itemCount,
    });
    onEventTracked();
  };

  const handleCheckoutCompleted = () => {
    const orderId = `order-${Date.now()}`;
    track("checkout_completed", {
      orderId,
      cartValue,
    });
    onEventTracked();
  };

  return (
    <div className="card">
      <h2>🛒 Checkout Events</h2>
      <p>Track checkout process from start to completion.</p>

      <div className="form-group">
        <label htmlFor="cartValue">Cart Value ($)</label>
        <input
          id="cartValue"
          type="number"
          step="0.01"
          min="0"
          value={cartValue}
          onChange={(e) => setCartValue(parseFloat(e.target.value))}
        />
      </div>

      <div className="form-group">
        <label htmlFor="itemCount">Item Count</label>
        <input
          id="itemCount"
          type="number"
          min="1"
          max="100"
          value={itemCount}
          onChange={(e) => setItemCount(Math.max(1, parseInt(e.target.value)))}
        />
      </div>

      <div className="button-group">
        <div>
          <button className="btn-primary" onClick={handleCheckoutStarted}>
            🔓 Track checkout_started
          </button>
        </div>

        <div>
          <button className="btn-success" onClick={handleCheckoutCompleted}>
            ✓ Track checkout_completed
          </button>
        </div>
      </div>

      <div className="status-box" style={{ marginTop: "1rem" }}>
        <div className="status-label">Cart Summary</div>
        <div className="status-value">
          Items: {itemCount}
          <br />
          Total: ${cartValue.toFixed(2)}
        </div>
      </div>

      <div className="status-box">
        <div className="status-label">Generated Order ID</div>
        <div className="status-value">{`order-${Date.now()}`}</div>
      </div>
    </div>
  );
}
