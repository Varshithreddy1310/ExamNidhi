import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(identifier, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container glass-panel">
      <h2>Welcome Back</h2>
      {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email or Phone Number</label>
          <input 
            type="text" 
            className="input-glass"
            value={identifier} 
            onChange={(e) => setIdentifier(e.target.value)} 
            required 
            placeholder="Enter email or phone"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            className="input-glass"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Login</button>
      </form>
      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        Don't have an account? <Link to="/register" style={{color: 'var(--accent-primary)'}}>Register here</Link>
      </div>
    </div>
  );
}

export default Login;
