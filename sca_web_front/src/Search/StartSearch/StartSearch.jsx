import React, { Component } from 'react';
import './start_search.css';


class StartSearch extends Component {

    render() {
        return (
            <div className="container">
                <form method="GET">
                    <div className="search_form">
                        <input className="search_form__input" type="text" placeholder="Search for knowledge..."/>
                        <button className="search_form__button btn btn-primary" type="submit">Go!</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default StartSearch;