import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Moon, Sun, LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function ProfileMenu() {
  const { user, logout, theme, toggleTheme, backendUrl } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();
  const menuRef = useRef();

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${backendUrl}/papers/stats`);
      setStats(res.data);
    } catch (e) {
      console.error(e);
    }
  }, [backendUrl]);

  useEffect(() => {
    if (isOpen && !stats) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchStats();
    }
  }, [isOpen, stats, fetchStats]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="btn-icon" 
        style={{ background: 'var(--accent-primary)', color: 'var(--accent-text)', width: '40px', height: '40px', borderRadius: '50%' }}
      >
        <UserIcon size={20} />
      </button>

      {isOpen && (
        <div className="glass-panel" style={{
          position: 'absolute',
          top: '50px',
          right: '0',
          width: '250px',
          padding: '16px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '4px' }}>
            <h4 style={{ margin: 0 }}>{user.username || user.email || 'User'}</h4>
            <small style={{ color: 'var(--text-secondary)' }}>
              {user.role === 'admin' ? 'Administrator' : 'Student'}
            </small>
          </div>

          <div style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)', marginBottom: '4px' }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>Statistics</p>
            {stats ? (
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {stats.type === 'admin' ? (
                  <>
                    <div>Total Papers: {stats.totalPapers}</div>
                    <div>Uploaded by you: {stats.uploadedPapers}</div>
                  </>
                ) : (
                  <>
                    <div>Available Papers: {stats.totalPapers}</div>
                    <div>Completed: {stats.completedCount}</div>
                    <div>Progress: {stats.totalPapers ? Math.round((stats.completedCount / stats.totalPapers) * 100) : 0}%</div>
                  </>
                )}
              </div>
            ) : (
              <small>Loading...</small>
            )}
          </div>

          <button onClick={toggleTheme} className="btn-icon" style={{ width: '100%', justifyContent: 'flex-start', borderRadius: '8px', padding: '10px' }}>
            {theme === 'dark' ? <><Sun size={18} style={{marginRight: '8px'}} /> Light Mode</> : <><Moon size={18} style={{marginRight: '8px'}}/> Dark Mode</>}
          </button>

          <button onClick={handleLogout} className="btn-icon" style={{ width: '100%', justifyContent: 'flex-start', borderRadius: '8px', padding: '10px', color: 'var(--danger-color)' }}>
            <LogOut size={18} style={{marginRight: '8px'}} /> Logout
          </button>

        </div>
      )}
    </div>
  );
}

export default ProfileMenu;
