import React, { useState } from "react";

interface CheckoutProps {
  onSubmit?: (data: { name: string; address: string; payment: string }) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("credit");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ name, address, payment });
    }
  };

  const resetForm = () => {
    setName("");
    setAddress("");
    setPayment("");
  };

  const validate = () => {
    if (!name.trim() || !address.trim()) {
      return false;
    }
    return true;
  };

  return (
    <form onSubmit={handleSubmit} data-testid="checkout-form">
      <h2>Checkout</h2>
      <input
        data-testid="name"
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        data-testid="address"
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <select
        data-testid="payment"
        value={payment}
        onChange={(e) => setPayment(e.target.value)}
      >
        <option value="credit">Credit Card</option>
        <option value="paypal">PayPal</option>
      </select>

      <button type="submit" data-testid="submit-btn">
        Place Order
      </button>
      <button type="button" onClick={resetForm} data-testid="reset-btn">
        Reset
      </button>
    </form>
  );
};

export default Checkout;
