import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, User, LogOut, LayoutDashboard, Heart, Calendar } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="glass" style={{ position: 'sticky', top: 0, zIndex: 100, padding: '15px 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5rem', fontWeight: 800 }}>
          <Car size={32} className="gradient-text" style={{ color: 'var(--primary)' }} />
          <span>Drive<span className="gradient-text">Elite</span></span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <Link to="/browse">Browse</Link>
          
          {user ? (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin" className="btn-primary" style={{ padding: '8px 16px' }}>
                  <LayoutDashboard size={18} /> Admin
                </Link>
              ) : (
                <>
                  <Link to="/favorites" title="Favorites"><Heart size={20} /></Link>
                  <Link to="/mybookings" title="My Bookings"><Calendar size={20} /></Link>
                  <Link to="/profile" title="Profile"><User size={20} /></Link>
                </>
              )}
              <button onClick={handleLogout} className="glass" style={{ padding: '8px', borderRadius: '50%', display: 'flex' }}>
                <LogOut size={20} color="var(--danger)" />
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '15px' }}>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 20px' }}>Join</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
