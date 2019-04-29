import React from 'react';
import { Link } from 'react-router-dom';
import './Feature.css';

const Feature = ({ name, iconClassName, href, children }) => (
  <div className="feature">
    <header className="feature__header">
      <span className={`feature__header__icon ${iconClassName}`}> </span>
      <Link to={href}><h3>{name}</h3></Link>
    </header>
    <p className="feature__description">
      {children}
    </p>
  </div>
);

export default Feature;