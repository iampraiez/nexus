# Event Schema Reference

All events include automatic fields:
- `timestamp`: Event timestamp (milliseconds)
- `sessionId`: Unique session identifier

## User Events

### user_signup
Track when a new user signs up.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User's email address |
| source | string | No | Signup source (e.g., landing-page, google-ads) |

**Example:**
```typescript
Nexus.track("user_signup", {
  email: "john@example.com",
  source: "organic-search"
});
```

---

### user_login
Track when a user logs in.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User's email address |

**Example:**
```typescript
Nexus.track("user_login", {
  email: "john@example.com"
});
```

---

## Product Events

### product_viewed
Track when a product is viewed.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| productId | string | Yes | Unique product identifier |
| productName | string | No | Human-readable product name |
| category | string | No | Product category |

**Example:**
```typescript
Nexus.track("product_viewed", {
  productId: "prod-12345",
  productName: "Wireless Headphones",
  category: "Electronics"
});
```

---

### product_added_to_cart
Track when a product is added to cart.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| productId | string | Yes | Unique product identifier |
| quantity | number | Yes | Quantity added |
| price | number | No | Price per unit |

**Example:**
```typescript
Nexus.track("product_added_to_cart", {
  productId: "prod-12345",
  quantity: 2,
  price: 49.99
});
```

---

### product_removed_from_cart
Track when a product is removed from cart.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| productId | string | Yes | Unique product identifier |
| quantity | number | Yes | Quantity removed |

**Example:**
```typescript
Nexus.track("product_removed_from_cart", {
  productId: "prod-12345",
  quantity: 1
});
```

---

## Checkout Events

### checkout_started
Track when checkout process begins.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| cartValue | number | Yes | Total cart value |
| itemCount | number | Yes | Number of items in cart |

**Example:**
```typescript
Nexus.track("checkout_started", {
  cartValue: 149.97,
  itemCount: 3
});
```

---

### checkout_completed
Track when checkout is completed.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| orderId | string | Yes | Unique order identifier |
| cartValue | number | Yes | Total order value |

**Example:**
```typescript
Nexus.track("checkout_completed", {
  orderId: "order-98765",
  cartValue: 149.97
});
```

---

## Order Events

### order_created
Track when an order is created.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| orderId | string | Yes | Unique order identifier |
| userId | string | Yes | User identifier |
| amount | number | Yes | Order total amount |
| currency | string | Yes | Currency code (e.g., USD, EUR) |
| items | Array | Yes | Array of order items |
| items[].productId | string | Yes | Product identifier |
| items[].qty | number | Yes | Quantity ordered |

**Example:**
```typescript
Nexus.track("order_created", {
  orderId: "order-98765",
  userId: "user-54321",
  amount: 149.97,
  currency: "USD",
  items: [
    { productId: "prod-12345", qty: 2 },
    { productId: "prod-67890", qty: 1 }
  ]
});
```

---

### order_cancelled
Track when an order is cancelled.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| orderId | string | Yes | Unique order identifier |
| reason | string | No | Cancellation reason |

**Example:**
```typescript
Nexus.track("order_cancelled", {
  orderId: "order-98765",
  reason: "Customer requested cancellation"
});
```

---

## Payment Events

### payment_failed
Track when a payment fails.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| orderId | string | Yes | Unique order identifier |
| error | string | Yes | Error message |

**Example:**
```typescript
Nexus.track("payment_failed", {
  orderId: "order-98765",
  error: "Card declined by issuer"
});
```

---

## Event Flow Examples

### Typical E-Commerce Flow

```typescript
// 1. User signs up
Nexus.track("user_signup", {
  email: "customer@example.com",
  source: "landing-page"
});

// 2. User browses products
Nexus.track("product_viewed", {
  productId: "prod-12345",
  productName: "Laptop",
  category: "Electronics"
});

Nexus.track("product_viewed", {
  productId: "prod-67890",
  productName: "Mouse",
  category: "Accessories"
});

// 3. User adds items to cart
Nexus.track("product_added_to_cart", {
  productId: "prod-12345",
  quantity: 1,
  price: 999.99
});

Nexus.track("product_added_to_cart", {
  productId: "prod-67890",
  quantity: 2,
  price: 29.99
});

// 4. User starts checkout
Nexus.track("checkout_started", {
  cartValue: 1059.97,
  itemCount: 3
});

// 5. Order is created
Nexus.track("order_created", {
  orderId: "order-001",
  userId: "user-123",
  amount: 1059.97,
  currency: "USD",
  items: [
    { productId: "prod-12345", qty: 1 },
    { productId: "prod-67890", qty: 2 }
  ]
});

// 6. Checkout completes
Nexus.track("checkout_completed", {
  orderId: "order-001",
  cartValue: 1059.97
});
```

### User Authentication Flow

```typescript
// First visit - sign up
Nexus.track("user_signup", {
  email: "newuser@example.com",
  source: "google-ads"
});

// Subsequent visits - login
Nexus.track("user_login", {
  email: "user@example.com"
});
```

### Payment Issues Flow

```typescript
// User attempts order
Nexus.track("order_created", {
  orderId: "order-002",
  userId: "user-456",
  amount: 299.99,
  currency: "USD",
  items: [{ productId: "prod-11111", qty: 1 }]
});

// Payment fails
Nexus.track("payment_failed", {
  orderId: "order-002",
  error: "Insufficient funds"
});

// User cancels order
Nexus.track("order_cancelled", {
  orderId: "order-002",
  reason: "Payment failed"
});
```

---

## Best Practices

1. **Use Consistent IDs**: Use the same `userId` and `orderId` across all related events
2. **Include Optional Fields**: Include optional fields when available for better analytics
3. **Track In Sequence**: Track events in logical order matching user actions
4. **Error Details**: Include specific error messages in `payment_failed` events
5. **Cart States**: Track both `product_added_to_cart` and `product_removed_from_cart`
6. **Categories**: Use consistent category names across `product_viewed` events
