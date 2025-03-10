// Use default export
export default function Header() {
  return (
    <header>
      {/* Your header content */}
      <nav>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>
    </header>
  );
}