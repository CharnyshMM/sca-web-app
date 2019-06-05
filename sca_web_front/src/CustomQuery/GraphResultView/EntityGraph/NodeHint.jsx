import React from 'react';

import './EntityGraph.css'

const NodeHint = ({children, top, left, onMouseEnter, onMouseLeave}) => (
  <div
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    style={{
      position: "absolute",
      padding: "2px",
      zIndex: 1000,
      background: "black",
      color: "white",
      left: left, 
      top: top
    }}
  >
    {children}
  </div>
);

export default NodeHint;