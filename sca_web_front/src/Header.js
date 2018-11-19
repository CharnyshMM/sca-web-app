import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ doLogout, authenticated }) => (
  <nav className='navbar navbar-dark bg-dark'>
    <div className="container">
      <Link to='/' className='navbar-brand'>CAS</Link>
      <div className="d-flex justify-content-end">
      {authenticated && (
        <div>
        <Link to="/status" className="btn btn-outline-primary">Status</Link>
        <button type="button" className="btn btn-outline-primary" onClick={doLogout}>
          <span className="oi oi-link-broken md-2"></span>Logout
        </button>
        </div>
          )
      }
      </div>
    </div>
  </nav>
);

export default Header;
