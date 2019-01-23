import React from 'react'

const SearchResultsFilter = ({selected_value, onResultTypeClick}) => {
    const valuesAndLabels = {
        all: "All results",
        publication: "Publications",
        author: "Authors",
        theme: "Themes",
    };
    const generalClassName = "top_results_filter__button";
    const activeClassName = `${generalClassName}-active`;

    const buttons = [];

    for(const key in valuesAndLabels) {
        if (key === selected_value) {
            buttons.push(<button className={activeClassName} value={key}>{valuesAndLabels[key]}</button>);
        } else {
            buttons.push(<button className={generalClassName} value={key}>{valuesAndLabels[key]}</button>);
        }
    }

    return(
        <div className="top_results_filter" onClick={onResultTypeClick}>
            {buttons}
        </div>
    );
}

export default SearchResultsFilter;