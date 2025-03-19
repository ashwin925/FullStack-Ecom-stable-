  import { useAuth } from '../context/AuthContext';

  const AdminPanel = () => {
    const { user } = useAuth();

    return (
      <div className="admin-panel">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user?.name}</p>
        {/* Add admin-specific content here */}
      </div>
    );
  };

  export default AdminPanel;