import React from "react";

type User = {
  name: string;
  age: number;
  email: string;
  bio: string;
  role: "user";
};

type ProfileProps = {
  user: User;
};

const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>Age: {user.age}</p>
      <p>Email: {user.email}</p>
      <p>Bio: {user.bio}</p>
      <p>Role: {user.role}</p>
    </div>
  );
};

export default Profile;
