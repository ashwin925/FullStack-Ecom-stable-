import { useAuth } from '../context/AuthContext';

const UserPanel = () => {
  const { user } = useAuth();

  return (
    <div className="user-panel">
      <h1>User Dashboard</h1>
      <p>Welcome, {user?.name}</p>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      {/* Add user-specific content here */}
    </div>
  );
};

export default UserPanel;