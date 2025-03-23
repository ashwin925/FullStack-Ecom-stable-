import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header>
      <nav>
        <Link to="/">Home</Link>
        {user ? (
          <>
            <button onClick={logout}>Logout</button>
            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
            {user.role === 'seller' && <Link to="/seller">Seller</Link>}
            {user.role === 'buyer' && <Link to="/cart">Cart</Link>}
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}