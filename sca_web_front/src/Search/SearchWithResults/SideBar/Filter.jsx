import React, {Component, useState, Fragment} from 'react';

import BeautifulSwitch from '../../../ReusableComponents/BeautifulSwitch/BeautifulSwitch';

import './Filter.css';


const Filter = function ({title, id, showAndOrCheckbox, selectedValues, onAddValue, onRemoveValue, enabled, onToggleFilter}) {
  const [userInput, setUserInput] = useState("");


  const onKeyDown = (e) => {
    if (e.keyCode == 13) {
      onAddValue(id, e.target.value);
      setUserInput("");
    }
  }
  return <div className="search_sidebar__filter">
        <label className="search_sidebar__filter__label">
          <h5>{title}</h5>
          <input id={id} type="checkbox" value={enabled} onChange={onToggleFilter}/>
        </label>
        {enabled && 
        <Fragment>
          <input 
            style={{width: "100%"}}
            type="text" 
            value={userInput}
            onKeyDown={onKeyDown}
            placeholder="Start typing..."
            title="Type in value you want to filter on and press Enter to add it"
            onChange={e => setUserInput(e.target.value)}
            />
          <ul className="search_sidebar__filter__list">
            {selectedValues && selectedValues.map( (v,i) =>
              <li key={v+i}>
                {v} <button onClick={() => {onRemoveValue(id, v)}} className="search_sidebar__filter__list__remove_button">X</button>
              </li>
            )
            }
          </ul>
          {showAndOrCheckbox && 
            <label htmlFor="8">
              <input id="8" type="checkbox"/>
              AND / OR
            </label>
          }
        </Fragment>
      }
      </div>;
};

export default Filter;