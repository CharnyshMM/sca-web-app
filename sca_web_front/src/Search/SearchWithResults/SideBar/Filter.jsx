import React, {Component, useState, Fragment} from 'react';

import AutocompleteInput from '../../../ReusableComponents/AutocompleteInput/AutocompleteInput';

import './Filter.css';


const Filter = function ({title, id, selectedValues, onAddValue, onRemoveValue, enabled, onToggleFilter, suggestions}) {

  return <div className="search_sidebar__filter">
        <label className="search_sidebar__filter__label">
          <h5>{title}</h5>
          <input id={id} type="checkbox" checked={enabled} onChange={onToggleFilter}/>
        </label>
        {enabled && 
        <Fragment>
          <AutocompleteInput
            onSubmit={v => onAddValue(id, v)}
            suggestions={suggestions}
            getName={v => v}
            />
          <ul className="search_sidebar__filter__list">
            {selectedValues && selectedValues.map( v =>
              <li key={v}>
                {v} <button onClick={() => {onRemoveValue(id, v)}} className="search_sidebar__filter__list__remove_button">X</button>
              </li>
            )
            }
          </ul>
        </Fragment>
      }
      </div>;
};

export default Filter;