import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { SquarePen, LogOut, User, Sparkles } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="app-header">
      <div className="container header-content">
        <Link to="/" className="logo">
          InkFlow
        </Link>
        <nav className="nav-links">
          <Link to="/" className="nav-link">
            Explore
          </Link>
          {user ? (
            <>
              <Link to="/create-post" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }}>
                <SquarePen size={16} />
                Write Post
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '15px', fontWeight: 500 }}>
                <User size={16} />
                <span>{user.username}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-text" style={{ padding: '8px 12px' }}>
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '14px' }}>
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
