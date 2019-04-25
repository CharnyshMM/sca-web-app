import React, { Component } from 'react';
import queryString from 'query-string';

import { doSearchByName } from '../../verbose_loaders';
import { createSearchLink } from '../../utilities/links_creators';

import './SearchWithResults.css';

import PublicationResult from '../SearchResults/PublicationResult';
import AuthorResult from '../SearchResults/AuthorResult';
import DomainResult from '../SearchResults/DomainResult';
import SearchResultsFilter from './SearchResultsFilter';
import Spinner from '../../ReusableComponents/Spinner';
import ErrorAlert from '../../ReusableComponents/ErrorAlert';
import PublicationsSideBar from './SideBar/PublicationsSearchSideBar';
import PublicationsSearchSideBar from './SideBar/PublicationsSearchSideBar';


const RESULTS_ON_PAGE_LIMIT = 10;

class SearchWithResults extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: [],
            offset: 0,
            last_update_length: 0,
            searchInput: "",
            type: "all",
            loading: false,
            hasError: false,
            error: "",
            filters: {
                authorsFilter: [],
                themesFilter: []
            }
        }; 
    }

    componentDidMount() {
        const queryParams = queryString.parse(this.props.location.search);
        if (queryParams.search != undefined && queryParams.search != "") {
            this.doSearch(queryParams.search, 0, queryParams.type, {});
            this.setState({ searchInput: queryParams.search, type: queryParams.type });
        }
    }

    doSearch = (name, offset, type, filters) => {
        const token = window.sessionStorage.getItem("token");

        this.setState({ hasError: false, error: undefined, loading: true, type: type });
        let status = 0;
        doSearchByName(name, RESULTS_ON_PAGE_LIMIT, offset, token, filters, type)
            .then(
                result => {
                    status = result.status;
                    return result.response.json();
                },
                error => {
                    status = error.status;
                    return error.response.json();
                }
            )
            .then(
                result => {
                    if (status == 200) {
                        this.setState({
                            offset: offset + result.length,
                            last_update_length: result.length,
                            loading: false,
                        });
                        if (offset != 0) {
                            this.setState({ result: this.state.result.concat(result)});
                        } else {
                            this.setState({ result: result});
                        }
                    } else {
                        console.log("I throwed an error");
                        throw Error(result.error);
                    }
                },
            )
            .catch(e => {
                this.setState({ hasError: true, error: e, loading: false });
                console.log("ERROR:", e);
            });

    }

    onSidebarFilterAddValue = (filterId, value) => {
        const filters = this.state.filters;
        const previousValues = filters[filterId];
        this.setState({
            filters: {
                ...filters,
                [filterId]: [...previousValues, value]
            }
        });
    }

    onSidebarFilterRemoveValue = (filterId, value) => {
        const filters = this.state.filters;
        const previousValues = filters[filterId];
        this.setState({
            filters: {
                ...filters,
                [filterId]: previousValues.filter(v => v != value)
            }
        });
    }

    onSidebarFilterDisabled = filterId => {
        const filters = this.state.filters;
        this.setState({
            filters: {
                ...filters,
                [filterId]: []
            }
        });
    }

    onSearchClick = e => {
        e.preventDefault();
        const {searchInput, type, filters} = this.state;
        this.props.history.push(createSearchLink(searchInput, type));
        console.log(filters); 
        this.doSearch(searchInput, 0, type, filters);
    };

    render() {
        const {result, loading, error, hasError, last_update_length, offset, type} = this.state;

        const onSearchInputChange = (e) => {
            this.setState({ searchInput: e.target.value });
        }

        const onResultTypeClick = (e) => {
            e.preventDefault();
            if (e.target.value) {
                this.props.history.push(createSearchLink(this.state.searchInput, e.target.value));
                this.setState({ type: e.target.value });
                this.doSearch(this.state.searchInput, 0, e.target.value, this.state.filters);
            }
        }

        const onMoreClick = e => {
            const queryParams = queryString.parse(this.props.location.search);
            if (queryParams.search != undefined && queryParams.search != "") {
                this.doSearch(queryParams.search, this.state.offset, this.state.type, this.state.filters);

                this.setState({ searchInput: queryParams.search });
            }
        }
        /*
        RETURN n as node,
                a as author, 
                collect(t) as themes,
                count(t_p) as publications_on_theme, 
                count(p) as author_pubs, 
                LABELS(n) as type
                SKIP {skip}
                LIMIT {limit},
                ID(n) as id
        */
        let searchResults = [];
        if (result) {
            result.map((r, i) => {
                switch (r["type"][0]) {
                    case "Theme":
                        searchResults.push(<DomainResult key={i} id={r["id"]} domain={r["node"]} publications_count={r["publications_on_theme"]} />);
                        break;
                    case "Author":
                        searchResults.push(<AuthorResult key={i} id={r["id"]} author={r["node"]} publications_count={r["author_pubs"]} />);
                        break;
                    case "Publication":
                        searchResults.push(<PublicationResult key={i} id={r["id"]} publication={r["node"]} author={r["author"]} domains={r["themes"]} />);
                        break;
                }
            });
        }

        let sideBar = null;
        switch(type){
            case "publication":
                sideBar = (
                    <PublicationsSearchSideBar 
                        onAddFilterValue={this.onSidebarFilterAddValue}
                        onRemoveFilterValue={this.onSidebarFilterRemoveValue}
                        onFilterDisabled={this.onSidebarFilterDisabled}
                        authorsFilterValues={this.state.filters["authorsFilter"]}
                        themesFilterValues={this.state.filters["themesFilter"]}
                    />
                );
                break;
            default:
                break;
        }
        return (
            <div>
                <form method="GET" onSubmit={this.onSearchClick}>
                    <div className="top_search_form">

                        <input className="top_search_form__input" value={this.state.searchInput} onChange={onSearchInputChange} type="text" placeholder="Search for knowledge..." />
                        <button className="top_search_form__button" type="submit">Go!</button>

                    </div>
                </form>

                <SearchResultsFilter selected_value={type} onResultTypeClick={onResultTypeClick} />
                
                <div className="filters_and_results_container">
                    {sideBar}
                    
                    <div className="results_container">
                        {!loading && hasError && 
                            <ErrorAlert errorName="Search Error" errorMessage={error.message} />
                        }
                        {!hasError &&
                            searchResults
                        }
                        {loading && 
                            <Spinner />
                        }
                    </div>
                </div>

                <footer className="pagination_footer">
                    {last_update_length != 0 && result.length > 0 && last_update_length == RESULTS_ON_PAGE_LIMIT &&
                        <button className="more_button" onClick={onMoreClick}>More!</button>
                    }
                    {last_update_length == 0 && result.length > 0 &&
                        <div>
                            You reached the bottom! (Hoping you have found the truth too:))
                        </div>
                    }
                    {!loading && last_update_length == 0 && result.length == 0 && this.state.searchInput.length > 0 &&
                        <div>
                            Nothing was found on "<i>{this.state.searchInput}</i>" so far
                            <br />
                            Maybe you didn't push Go! button?
                            <br />
                            Or, unfortunatelly, we have nothing to show you
                           
                        </div>
                    }
                </footer>
            </div>
        );
    }
}

export default SearchWithResults;