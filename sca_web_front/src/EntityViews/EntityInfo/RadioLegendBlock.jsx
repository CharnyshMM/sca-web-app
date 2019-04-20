import React from 'react'

import './RadioLegendBlock.css';

const RadioLegendBlock = ({children, color, onChange, value, name, id}) => {
  
  let bgColor = value ? color : "rgba(0,0,0,0)";
  return (
  <div className="radio_legend_block">
    <label className="radio_legend_block__label" htmlFor={id}>
      <input className="radio_legend_block__input" type="checkbox" id={id} name={name} value={value} onChange={onChange} />
      <span className="radio_legend_block__checkmark" style={{backgroundColor: bgColor}}> </span>
      {children}
    </label>
  </div>
  );
};

export default RadioLegendBlock;