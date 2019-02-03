import React, { Component } from 'react';

import './domains_query_result_sorting_selector.css';

class DomainsQueryResultSortingSelector extends Component{ 
    constructor(props) {
        super(props);
        this.state = {
            sortingMode: "mostPublicationsFirst",
            showPeriodsSelector: false,
            fixedPeriodsSortingMode: "after_2010",
            showPeriodsEdits: false,
        }
    }

    onSortingOptionsChanged = (e) => {
        const value = e.target.value;
        switch(value) {
            case "mostPublicationsFirst":
                this.setState({
                    sortingMode: value,
                    showPeriodsSelector: false,
                    showPeriodsEdits: false,
                });
                this.props.onSortingModeChanged({sortingMode: value});
                return;
            case "fixedPeriods":
                this.setState({
                    sortingMode: value,
                    showPeriodsSelector: true,
                    showPeriodsEdits: false,
                });
                this.props.onSortingModeChanged({sortingMode: value, period: this.fixedPeriodsSortingMode});
                return;
        };
    }

    onPeriodsOptionsChanged = (e) => {
        this.setState({fixedPeriodsSortingMode: e.target.value});
        this.props.onSortingModeChanged({sortingMode: this.state.sortingMode, period: e.target.value});
    }

    render() {
        const {sortingMode, showPeriodsSelector, fixedPeriodsSortingMode} = this.state;
        return (
            <section className="domainsQueryResultSortingSelector">
                
                <label className="sortModeSelectLabel">
                    Sorting options:  
                </label>
                <select className="sortModeSelect" value={sortingMode} onChange={this.onSortingOptionsChanged}>
                    <option value="mostPublicationsFirst">Most publications first</option>
                    <option value="fixedPeriods">Publishing periods from 1950 to nowadays</option>
                    <option value="customPeriod">Specify your Custom Period</option>
                </select>
            
                {showPeriodsSelector && 
                    <React.Fragment>
                        <label className="periodsSelectLabel">
                            Most publications in:  
                        </label>
                        <select className="periodsSelect" value={fixedPeriodsSortingMode} onChange={this.onPeriodsOptionsChanged}>
                            <option value="before_1950">&lt; 1950</option>
                            <option value="between_1950_and_1970">1950 - 1970</option>
                            <option value="between_1970_and_1990">1970 - 1990</option>
                            <option value="between_1990_and_2010">1990 - 2010</option>
                            <option value="after_2010">&gt; 2010</option>
                        </select>
                    </React.Fragment>
                }
            </section>
        );
    }
}

export default DomainsQueryResultSortingSelector;