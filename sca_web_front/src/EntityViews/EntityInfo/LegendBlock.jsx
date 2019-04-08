import React from 'react';

import './LegendBlock.css';

const LegendBlock = ({children, color})=> (
  <div>
    <span className="legend_block__square" style={{backgroundColor: color}}> </span>
    {children}
  </div>
);

export default LegendBlock;