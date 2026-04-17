import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProfileMenu from './ProfileMenu';

function Navbar() {
  const { user } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <h2><Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>ExamNidhi</Link></h2>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            {user.role !== 'admin' && (
              <Link to="/contribute" className="nav-link">Contribute PYQ</Link>
            )}
            {user.role === 'admin' && (
              <Link to="/admin" className="nav-link">Admin Panel</Link>
            )}
            <ProfileMenu />
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
