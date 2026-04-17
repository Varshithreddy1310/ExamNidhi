import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: ''
  });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email && !formData.phone) {
      setError("Please provide either email or phone number.");
      return;
    }
    
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container glass-panel">
      <h2>Create Account</h2>
      {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input 
            name="username" type="text" className="input-glass"
            onChange={handleChange} placeholder="John Doe"
          />
        </div>
        <div className="form-group">
          <label>Email (Optional if phone is provided)</label>
          <input 
            name="email" type="email" className="input-glass"
            onChange={handleChange} placeholder="john@example.com"
          />
        </div>
        <div className="form-group">
          <label>Phone Line (Optional if email is provided)</label>
          <input 
            name="phone" type="text" className="input-glass"
            onChange={handleChange} placeholder="+123456789"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            name="password" type="password" className="input-glass"
            onChange={handleChange} required 
          />
        </div>
        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Register</button>
      </form>
      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        Already have an account? <Link to="/login" style={{color: 'var(--accent-primary)'}}>Login here</Link>
      </div>
    </div>
  );
}

export default Register;
