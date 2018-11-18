import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header = ({ openConnectionSetup, isConnectionSetupOpen, connected }) => (
  <nav className='navbar navbar-dark bg-dark'>
    <div className="container">
      <Link to='/' className='navbar-brand'>CAS</Link>
      <div className="d-flex justify-content-end">
      <Link to="/status" className="btn btn-outline-primary">Status</Link>
      <button type="button" className="btn btn-outline-primary" onClick={openConnectionSetup} disabled={isConnectionSetupOpen}>
         <span className={`oi oi-link-${connected ? 'intact' : 'broken'} mr-2`}></span>Login
      </button>
      </div>
    </div>
  </nav>
);

export default Header;
