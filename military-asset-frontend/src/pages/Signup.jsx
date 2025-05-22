import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("https://ak-47-1.onrender.com/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Signup successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Error connecting to server");
    }
  };

  return (
    <div className="signup-page">
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSignup}>
        <label>Email:</label><br />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br />

        <label>Password:</label><br />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br />

        <label>Confirm Password:</label><br />
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /><br />

        <button type="submit">Create Account</button>
      </form>
      <p>Already have an account? <Link to="/login">Sign In</Link></p>
    </div>
  );
};

export default Signup;
