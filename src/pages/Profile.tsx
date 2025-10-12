import React, { useState } from "react";

export interface UserProfile {
  name: string;
  age: number;
  email: string;
  bio?: string;
  role?: "user" | "admin" | "guest";
}

export const isAdult = (age: number): boolean => {
  return age >= 18;
};

export const getGreeting = (name: string): string => {
  if (!name) return "Hello, Guest!";
  return `Hello, ${name}!`;
};

export const formatUserName = (name: string): string => {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

export const calculateProfileCompletion = (user: UserProfile): number => {
  let filled = 0;
  const total = 4; // name, age, email, bio

  if (user.name) filled++;
  if (user.age) filled++;
  if (user.email) filled++;
  if (user.bio) filled++;

  return Math.round((filled / total) * 100);
};

export const getUserRole = (role?: string): string => {
  if (!role) return "guest";
  if (role === "admin") return "admin";
  if (role === "user") return "user";
  return "guest";
};

const Profile: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [showBio, setShowBio] = useState(false);
  const [status, setStatus] = useState("");
  const [upgraded, setUpgraded] = useState(false);

  const handleToggleBio = () => {
    setShowBio(prev => !prev);
  };

  const handleSendMessage = () => {
    if (!user.email) {
      setStatus("Email not available");
    } else {
      setStatus(`Message sent to ${user.email}`);
    }
  };

  const handleUpgrade = () => {
    const role = getUserRole(user.role);
    if (role === "admin") {
      setStatus("You already have admin access");
    } else if (role === "user") {
      setUpgraded(true);
      setStatus("Profile upgraded to premium");
    } else {
      setStatus("Guests cannot be upgraded");
    }
  };

  return (
    <div>
      <h2 data-testid="greeting">{getGreeting(formatUserName(user.name))}</h2>
      <p>Age: {user.age}</p>
      <p>Completion: {calculateProfileCompletion(user)}%</p>

      <button onClick={handleToggleBio}>
        {showBio ? "Hide Bio" : "Show Bio"}
      </button>
      {showBio && user.bio && <p data-testid="bio">{user.bio}</p>}

      <button onClick={handleSendMessage}>Send Message</button>
      <button onClick={handleUpgrade}>Update</button>

      {upgraded && <span data-testid="premium-badge"> Premium User</span>}
      <p data-testid="status">{status}</p>
    </div>
  );
};

export default Profile;
