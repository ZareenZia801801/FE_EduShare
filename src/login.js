import React, { useState } from 'react';
import './Auth.css';

const Login = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://your-backend-url.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, password })
      });

      if (!response.ok) {
        throw new Error('Invalid credentials or server error');
      }

      const data = await response.json();
      // Assume backend returns { token: '...', student: { ... } }

      // Store token for future requests
      localStorage.setItem('authToken', data.token);
      alert('Login Successful!');
      // Redirect or update app state here, e.g.:
      // navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <img src="/uiu-logo.png" alt="UIU Logo" className="logo-img" />

      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {error && <p className="error-message">{error}</p>}

        <p className="forgot-password">
          Forgot password? <span className="reset-link">Reset</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
