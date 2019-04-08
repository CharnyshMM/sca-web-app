import React, { Component } from 'react';

import './BeautifulPopOver.css';

const BeautifulPopOver = ({children, onSideClick}) => (
  <div className="beautiful_pop_over" onClick={onSideClick} title="click to close">
    <div className="beautiful_pop_over__content" onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

export default BeautifulPopOver;