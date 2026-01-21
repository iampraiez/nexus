"use client";

import { useState } from "react";
import { useNexus } from "../use-nexus";

interface ProductDemoCardProps {
  onEventTracked: () => void;
}

const PRODUCTS = [
  {
    id: "prod-001",
    name: "Wireless Headphones",
    category: "Electronics",
    price: 79.99,
  },
  {
    id: "prod-002",
    name: "USB-C Cable",
    category: "Accessories",
    price: 12.99,
  },
  {
    id: "prod-003",
    name: "Phone Stand",
    category: "Accessories",
    price: 24.99,
  },
  {
    id: "prod-004",
    name: "Screen Protector",
    category: "Protection",
    price: 9.99,
  },
];

export default function ProductDemoCard({
  onEventTracked,
}: ProductDemoCardProps) {
  const { track } = useNexus();
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [quantity, setQuantity] = useState(1);

  const handleProductView = () => {
    track("product_viewed", {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      category: selectedProduct.category,
    });
    onEventTracked();
  };

  const handleAddToCart = () => {
    track("product_added_to_cart", {
      productId: selectedProduct.id,
      quantity,
      price: selectedProduct.price,
    });
    onEventTracked();
  };

  const handleRemoveFromCart = () => {
    track("product_removed_from_cart", {
      productId: selectedProduct.id,
      quantity,
    });
    onEventTracked();
  };

  return (
    <div className="card">
      <h2>🛍️ Product Events</h2>
      <p>Track product views, additions, and removals from shopping cart.</p>

      <div className="form-group">
        <label htmlFor="product">Product</label>
        <select
          id="product"
          value={selectedProduct.id}
          onChange={(e) => {
            const product = PRODUCTS.find((p) => p.id === e.target.value);
            if (product) setSelectedProduct(product);
          }}
        >
          {PRODUCTS.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} - ${product.price}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="quantity">Quantity</label>
        <input
          id="quantity"
          type="number"
          min="1"
          max="10"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
        />
      </div>

      <div className="button-group">
        <button className="btn-primary" onClick={handleProductView}>
          👁️ Track product_viewed
        </button>
        <button className="btn-success" onClick={handleAddToCart}>
          ➕ Track product_added_to_cart
        </button>
        <button className="btn-danger" onClick={handleRemoveFromCart}>
          ➖ Track product_removed_from_cart
        </button>
      </div>

      <div className="status-box" style={{ marginTop: "1rem" }}>
        <div className="status-label">Selected Product</div>
        <div className="status-value">
          {selectedProduct.name} ({selectedProduct.category})
          <br />
          Price: ${selectedProduct.price.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
