import React, { Component } from 'react';

import './search_and_results.css';
import PublicationResult from '../SearchResults/PublicationResult';
import AuthorResult from '../SearchResults/AuthorResult';

class SearchWithResults extends Component {

    render() {
        return (
            <div>
                <form method="GET">
                    <div className="top_search_form">
                        <input className="top_search_form__input" type="text" placeholder="Search for knowledge..."/>
                        <button className="top_search_form__button" type="submit">Go!</button>
                    </div>
                </form>
                
                <div className="top_results_filter">
                    <button className="top_results_filter__button-active">All results</button>
                    <button className="top_results_filter__button">Statistics</button>
                    <button className="top_results_filter__button">Publications</button>
                    <button className="top_results_filter__button">Authors</button>
                    <button className="top_results_filter__button">Domains</button>
                </div>

                <div className="container">
                    <PublicationResult />
                    <PublicationResult />
                    <PublicationResult />
                    <AuthorResult />
                </div>
            </div>
        );
    }
}

export default SearchWithResults;