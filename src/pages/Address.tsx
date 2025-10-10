import React from "react";

// Minimal change: allow showMessage as a prop for testing purposes with default false
interface AddressProps {
  showMessage?: boolean;
}

const Address: React.FC<AddressProps> = ({ showMessage = false }) => {
  const getMessage = () => {
    if (showMessage) {
      return "This line is never executed in default.";
    }
    return "Fallback";
  };

  return (
    <div data-testid="address-component">
      <h1>Hello World</h1>
      <p>This is the Address component.</p>
      <p>{getMessage()}</p>
    </div>
  );
};

export default Address;
