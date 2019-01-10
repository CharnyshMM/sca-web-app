import React from 'react'

const SearchResultsFilter = ({selected_value, onResultTypeClick}) => {
    const buttons = [
        <button className="top_results_filter__button" value="all">All results</button>,
        <button className="top_results_filter__button" value="publication">Publications</button>,
        <button className="top_results_filter__button" value="author">Authors</button>,
        <button className="top_results_filter__button" value="theme">Domains</button>
    ];

    return(
        <div id="top_results_filter" className="top_results_filter" onClick={onResultTypeClick}>
            {buttons.map((v, i)=> {
                if (v.value == selected_value) {
                    v.className = "top_results_filter__button-active";
                    return v;
                }
                return v;
            })
            }
        </div>
    );
}

export default SearchResultsFilter;