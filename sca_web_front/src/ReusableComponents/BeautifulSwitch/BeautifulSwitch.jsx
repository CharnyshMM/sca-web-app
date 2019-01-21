import React from 'react';

import './beautiful_switch.css';

const BeautifulSwitch = ({label, onSwitchChange}) => (
    <div className="beautiful_switch">
        <span className="beautiful_switch__label">
            {label}
        </span>

        <label className="switch">
            <input onChange={onSwitchChange} type="checkbox" />
            <span className="slider round"></span>
        </label>
    </div>
);

export default BeautifulSwitch;