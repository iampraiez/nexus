"use client";

import { useState } from "react";
import { useNexus } from "../use-nexus";

interface OrderDemoCardProps {
  onEventTracked: () => void;
}

export default function OrderDemoCard({ onEventTracked }: OrderDemoCardProps) {
  const { track } = useNexus();
  const [orderId, setOrderId] = useState(`order-${Date.now()}`);
  const [userId, setUserId] = useState("user-123456");
  const [amount, setAmount] = useState(299.97);
  const [currency, setCurrency] = useState("USD");
  const [errorMsg, setErrorMsg] = useState("Card declined");

  const handleOrderCreated = () => {
    track("order_created", {
      orderId,
      userId,
      amount,
      currency,
      items: [
        { productId: "prod-001", qty: 2 },
        { productId: "prod-002", qty: 1 },
      ],
    });
    onEventTracked();
  };

  const handleOrderCancelled = () => {
    track("order_cancelled", {
      orderId,
      reason: "Customer request",
    });
    onEventTracked();
  };

  const handlePaymentFailed = () => {
    track("payment_failed", {
      orderId,
      error: errorMsg,
    });
    onEventTracked();
  };

  return (
    <div className="card">
      <h2>📦 Order Events</h2>
      <p>Track order creation, cancellation, and payment failures.</p>

      <div className="form-group">
        <label htmlFor="orderId">Order ID</label>
        <input
          id="orderId"
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="order-123456"
        />
      </div>

      <div className="form-group">
        <label htmlFor="userId">User ID</label>
        <input
          id="userId"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="user-123456"
        />
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount ($)</label>
        <input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />
      </div>

      <div className="form-group">
        <label htmlFor="currency">Currency</label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="errorMsg">Payment Error Message</label>
        <input
          id="errorMsg"
          type="text"
          value={errorMsg}
          onChange={(e) => setErrorMsg(e.target.value)}
          placeholder="Card declined"
        />
      </div>

      <div className="button-group">
        <button className="btn-success" onClick={handleOrderCreated}>
          ✓ Track order_created
        </button>
        <button className="btn-secondary" onClick={handleOrderCancelled}>
          ✗ Track order_cancelled
        </button>
        <button className="btn-danger" onClick={handlePaymentFailed}>
          ⚠️ Track payment_failed
        </button>
      </div>

      <div className="status-box" style={{ marginTop: "1rem" }}>
        <div className="status-label">Order Summary</div>
        <div className="status-value">
          Order: {orderId}
          <br />
          User: {userId}
          <br />
          Amount: {currency} {amount.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
