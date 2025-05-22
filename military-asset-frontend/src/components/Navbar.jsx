import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav style={{ padding: '10px', background: '#333', color: '#fff' }}>
      <Link to="/dashboard" style={{ margin: '0 15px', color: 'white' }}>Dashboard</Link>
      <Link to="/purchases" style={{ margin: '0 15px', color: 'white' }}>Purchases</Link>
      <Link to="/transfers" style={{ margin: '0 15px', color: 'white' }}>Transfers</Link>
      <Link to="/assignments" style={{ margin: '0 15px', color: 'white' }}>Assignments</Link>

      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          style={{ float: 'right', color: 'white', background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          Logout
        </button>
      ) : (
        <Link to="/login" style={{ float: 'right', color: 'white' }}>Login</Link>
      )}
    </nav>
  );
};

export default Navbar;
