import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
    return (
        <header className="header" style={{ paddingLeft: '20px', paddingRight: '20px' }}>

            <div className="branding">
                <div className="logo-container">
                    <img src="/logo1.png" alt="UIU Logo" className="logo" />
                </div>
                <h1>EduShare</h1>
            </div>

            <nav style={{ paddingLeft: '20px', paddingRight: '100px' }}>
                <Link to="/">Upload</Link>
                <Link to="/files">View Files</Link>
            </nav>

        </header>
    );
}

export default Header;
