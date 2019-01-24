import React from 'react';

import './beautiful_select.css';

const BeautifulSelect = ({label, optionsValuesLabelsDict, onSelectionChanged}) => {
    const options = [];
    let i = 0;
    for (const val in optionsValuesLabelsDict) {
        options.push(<option key={i} value={val}>{optionsValuesLabelsDict[val]}</option>);
        i++;
    };
    return (
        <div className="beautiful_select">
            {label}
            <select className="beautiful_select__select" onChange={onSelectionChanged}>
                {options}
            </select>
        </div>
    )
}

export default BeautifulSelect;