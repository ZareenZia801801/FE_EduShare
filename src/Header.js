import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import './Header.css';

function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      // 🔁 Replace with your actual logout API call
      await fetch('/api/logout', { method: 'POST', credentials: 'include' });
      navigate('/login'); // or wherever you redirect after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="branding">
        <div className="logo-container">
          <img src="/logo1.png" alt="UIU Logo" className="logo" />
          <h1 className="site-title">EduShare</h1>
        </div>
      </div>

      <nav className="nav-links">
        <Link to="/">Upload</Link>
        <Link to="/files">View Files</Link>

        <div
          className="profile-dropdown-container"
          ref={dropdownRef}
        >
          <div
            className="profile-icon"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            title="Profile Options"
          >
            <FaUserCircle size={32} />
          </div>

          {dropdownOpen && (
            <div className="profile-dropdown">
              <div onClick={() => { navigate('/profile'); setDropdownOpen(false); }}>
                View Profile
              </div>
              <div onClick={handleLogout}>Logout</div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;


// import React from 'react';
// import { Link } from 'react-router-dom';
// import './Header.css';
// import { FaUserCircle } from 'react-icons/fa'; // import profile icon

// function Header() {
//     return (
//         <header className="header">
//             <div className="branding">
//                 <div className="logo-container">
//                     <img src="/logo1.png" alt="UIU Logo" className="logo" />
//                     <h1 className="site-title">EduShare</h1>
//                 </div>
//             </div>

//             <nav className="nav-links">
//                 <Link to="/">Upload</Link>
//                 <Link to="/files">View Files</Link>
//                 <Link to="/profile" className="profile-icon" title="View Profile">
//                     <FaUserCircle size={32} />
//                 </Link>
//             </nav>
//         </header>
//     );
// }

// export default Header;
