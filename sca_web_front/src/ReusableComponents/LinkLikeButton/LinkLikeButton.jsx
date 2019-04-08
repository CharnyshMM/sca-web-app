import React from 'react';

import './LinkLikeButton.css';

const LinkLikeButton = ({children, onClick}) => (
  <button className="link_like_button" onClick={onClick}>
    {children}
  </button>
);

export default LinkLikeButton;