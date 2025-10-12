import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

const About: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch users (simulated async)
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 500));
      setUsers([
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' },
        { id: 3, name: 'Charlie', email: 'charlie@example.com' },
      ]);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Filter users by search term
  const filteredUsers = () => users.filter(u => u.name.includes(searchTerm));

  // Count users with email
  const countUsersWithEmail = () => users.filter(u => u.email).length;

  // Lifecycle effect (we can skip for minimal coverage)
  useEffect(() => {
    // Commenting out fetchUsers call so minimal test won't execute it
    // fetchUsers();
  }, []);

  // Add new user (won't be called in minimal test)
  const addUser = (name: string, email: string) => {
    const newUser: User = { id: users.length + 1, name, email };
    setUsers([...users, newUser]);
  };

  // Unused helper for AI to improve coverage
  const computeStats = () => {
    return users.length > 0 ? users.length * 2 : 0;
  };

  return (
    <div>
      <h1>About Page</h1>
      <p>Minimal rendering to keep coverage low</p>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={() => addUser('New User', 'newuser@example.com')}>
        Add User
      </button>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
      <p>Total users with email: {countUsersWithEmail()}</p>
    </div>
  );
};

export default About;
