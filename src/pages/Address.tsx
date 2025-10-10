import React from "react";

const Address: React.FC = () => {
  const showMessage = false; // not touched by test

  const getMessage = () => {
    // this function is never called in the test
    if (showMessage) {
      return "This line is never executed";
    }
    return "Fallback";
  };

  return (
    <div data-testid="address-component">
      <h1>Hello World</h1>
      <p>This is the Address component.</p>
    </div>
  );
};

export default Address;
