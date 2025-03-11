import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.name}</h1>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      {/* Add role-specific content here */}
    </div>
  );
};

export default Dashboard;