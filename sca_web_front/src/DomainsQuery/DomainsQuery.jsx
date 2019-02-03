import React, { Component } from 'react';

import { getDomainsByPopularity } from '../loaders';
import queryString from 'query-string';
import { createAuthoritiesInDomainsLink, createDomainsPopularityLink, createDomainLink } from '../utilities/links_creators';
import HorizontalKeywordsList from '../ReusableComponents/HorizontalKeywordsList';
import ErrorAlert from '../ReusableComponents/ErrorAlert';
import Spinner from '../ReusableComponents/Spinner';
import DomainsQueryResultItem from './DomainsQueryResultItem';
import DomainsQueryResultSortingSelector from './DomainsQueryResultSortingSelector';


class DomainsQuery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: undefined,
            sortingMode: "mostPublicationsFirst",
            period: undefined,
            selectedDomains: [],
            loading: false,
            error: undefined,
            hasError: false
        };
    }

    loadData = (popularityKey) => {
        const token = window.sessionStorage.getItem("token");
        this.setState({ hasError: false, error: undefined, result: undefined, selected: popularityKey, loading: true });
        getDomainsByPopularity(popularityKey, token)
            .then(
                resolve => {
                    return resolve.json();
                },
                reject => {
                    throw new Error("Error in request");
                }
            )
            .then(response => {
                console.log('responsed_query:', response);
                this.setState({ result: response, loading: false });
            },
            )
            .catch(e => {
                this.setState({ hasError: true, error: e, loading: false });
                console.log("ERROR:", e);
            });
    }

    changeSelected = e => {
        console.log(e.target.value);
        this.setState({ sortBy: e.target.value });
    };

    onAddDomainToListClick = (domainName) => {
        if (this.state.selectedDomains && this.state.selectedDomains.includes(domainName)) {
            return;
        }
        this.setState(prev => ({ domainInputValue: '', selectedDomains: [...prev.selectedDomains, domainName] }));
    };

    onRemoveDomainFromListClick = (index) => {
        this.setState(prev => ({
            selectedDomains: [
                ...prev.selectedDomains.slice(0, index),
                ...prev.selectedDomains.slice(index + 1),
            ]
        }));
    }

    onSearchAuthoritiesClick = () => {
        if (!this.state.selectedDomains || this.state.selectedDomains.length == 0) {
            return;
        }

        const link = createAuthoritiesInDomainsLink(this.state.selectedDomains);
        this.props.history.push(link);
    }

    onSortingModeChanged = ({ sortingMode, period }) => {
        this.setState({ sortingMode: sortingMode, period: period });
    }

    componentDidMount() {
        const queryParams = queryString.parse(this.props.location.search);

        let popularityKey = queryParams.popularity;
        if (!popularityKey) {
            popularityKey = this.state.sortBy;
        }

        this.loadData(popularityKey);
    }

    render() {
        const { result, loading, hasError, error, selectedDomains, sortingMode, period } = this.state;
        if (hasError) {
            return <ErrorAlert errorName={error.name} errorMessage={error.message} />
        }

        if (!result || loading) {
            return <Spinner />;
        }

        // rather weak place: 
        // the constant keys are binding data from backend, DomainsQueryResultSortingSelector options values and this sorting 
        // sorry for that :(
        const maximum_publications_in_period_count  = result["maximum_publications_in_period_count"]
        const themes = result["themes"]


        const sortedMappedResult = Array.prototype.slice.call(themes)
            .sort((a, b) => {
                switch (sortingMode) {
                    case "fixedPeriods":
                        switch (period) {
                            case "before_1950":
                                return b["dynamics"]["before_1950"] - a["dynamics"]["before_1950"];

                            case "between_1950_and_1970":
                                return b["dynamics"]["between_1950_and_1970"] - a["dynamics"]["between_1950_and_1970"];

                            case "between_1970_and_1990":
                                return b["dynamics"]["between_1970_and_1990"] - a["dynamics"]["between_1970_and_1990"];
                           
                            case "between_1990_and_2010":
                                return b["dynamics"]["between_1990_and_2010"] - a["dynamics"]["between_1990_and_2010"];
                            
                            case "after_2010":
                            default:
                                return b["dynamics"]["after_2010"] - a["dynamics"]["after_2010"];     
                        }

                    case "mostPublicationsFirst":
                    default:
                        return b["publications_count"] - a["publications_count"];
                }
            }).map((d, i) => (
                <DomainsQueryResultItem
                    key={i}
                    domainInfo={d}
                    onAddClick={() => this.onAddDomainToListClick(d["theme"]["name"])}
                    domainLink={createDomainLink(d["theme_id"])}
                    maxPublicationsInPeriodsTick={maximum_publications_in_period_count}
                />
            ));


        return (
            <div className="container">
                <h1>Search for domains by dynamics</h1>

                
                    <DomainsQueryResultSortingSelector onSortingModeChanged={this.onSortingModeChanged} />
               

                {selectedDomains && selectedDomains.length > 0 &&
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Selected domains:</h5>
                            <HorizontalKeywordsList keywords={selectedDomains} onClickHandler={this.onRemoveDomainFromListClick} />
                            <button className="btn btn-primary" onClick={this.onSearchAuthoritiesClick}>Search for authorities</button>
                        </div>
                    </div>
                }
                {this.state.loading &&
                    <Spinner />
                }
                {sortedMappedResult}
            </div>
        );
    }
}

export default DomainsQuery;