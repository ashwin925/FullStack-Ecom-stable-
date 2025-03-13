import { useAuth } from '../context/AuthContext';

const SellerPanel = () => {
  const { user } = useAuth();

  return (
    <div className="seller-panel">
      <h1>Seller Dashboard</h1>
      <p>Welcome, {user?.name}</p>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      {/* Add seller-specific content here */}
    </div>
  );
};

export default SellerPanel;