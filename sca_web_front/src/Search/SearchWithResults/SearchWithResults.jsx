import React, { Component } from 'react';
import queryString from 'query-string';

import { doSearchByName } from '../../verbose_loaders';
import {createSearchLink} from '../../utilities/links_creators';

import './search_and_results.css';
import PublicationResult from '../SearchResults/PublicationResult';
import AuthorResult from '../SearchResults/AuthorResult';
import DomainResult from '../SearchResults/DomainResult';


const RESULTS_ON_PAGE_LIMIT = 10;

class SearchWithResults extends Component {
    constructor(props) {
        super(props);
        this.state = {
          result: [],
          offset: 0,
          last_update_length: 0,
          search_input: "",
        };
      }

    doSearch(name) {
        const token = window.sessionStorage.getItem("token");
        let status = 0;

        this.setState({error: undefined});
        console.log("before - offset", this.state.offset);
        console.log("before - last_update_length", this.state.last_update_length);
        
        doSearchByName(name, RESULTS_ON_PAGE_LIMIT, this.state.offset, token)
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
                   // console.log('responsed_Search:', result, status);
                    if (status == 200) {
                        this.setState({
                            offset: this.state.offset + result.length,
                            last_update_length: result.length,
                            result: this.state.result.concat(result)
                          });
                        
                    } else {
                        console.log("I throwed an error");
                        throw Error(result.error);
                    }
                },
        )
            .catch(e => {
                this.setState({ error: e });
                console.log("ERROR:", e);
            });
    }

    componentDidMount() {
        const queryParams = queryString.parse(this.props.location.search);
        if (queryParams.search != undefined && queryParams.search != "") {
            this.doSearch(queryParams.search);
            this.setState({search_input: queryParams.search});
        }
    }

    render() {
        const onSearchClick = e => {
            e.preventDefault();
            this.setState({
                offset: 0,
                last_update_length: 0,
                result: []
            });
            this.props.history.push(createSearchLink(this.state.search_input));
            this.doSearch(this.state.search_input);
          };
      
          const onSearchInputChange = (e) => {
            this.setState({search_input: e.target.value});
          }

        const onUpdateClick = e => {
            const queryParams = queryString.parse(this.props.location.search);
            if (queryParams.search != undefined && queryParams.search != "") {
                this.doSearch(queryParams.search);
                this.setState({search_input: queryParams.search});
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
        if (this.state.result) {
            this.state.result.map((r,i) => {
                switch(r["type"][0]) {
                    case "Theme":
                        searchResults.push(<DomainResult key={i} id={r["id"]} domain={r["node"]} publications_count={r["publications_on_theme"]}/>);
                        break;
                    case "Author":
                        searchResults.push(<AuthorResult key={i} id={r["id"]} author={r["node"]} publications_count={r["author_pubs"]}/>);
                        break;
                    case "Publication":
                        searchResults.push(<PublicationResult key={i} id={r["id"]} publication={r["node"]} author={r["author"]} domains={r["themes"]}/>);
                        break;
               }
            });
        }

        return (
            <div>
                <form method="GET" onSubmit={onSearchClick}>
                    <div className="top_search_form">
                        
                        <input className="top_search_form__input" value={this.state.search_input} onChange={onSearchInputChange} type="text" placeholder="Search for knowledge..." />
                        <button className="top_search_form__button" type="submit">Go!</button>
                        
                    </div>
                </form>

                <div className="top_results_filter">
                    <button className="top_results_filter__button-active">All results</button>
                    <button className="top_results_filter__button">Publications</button>
                    <button className="top_results_filter__button">Authors</button>
                    <button className="top_results_filter__button">Domains</button>
                </div>

                <div className="container">
                    {searchResults}
                </div>

                <footer className="pagination_footer">
                    {this.state.last_update_length != 0 && this.state.result.length > 0 &&
                        <button className="more_button" onClick={onUpdateClick}>More!</button>
                    }
                    {this.state.last_update_length == 0 && this.state.result.length > 0 &&
                        <div className="alert">
                            You reached the bottom! (Hoping you have found the truth too:))
                        </div>
                    }
                    {this.state.last_update_length == 0 && this.state.result.length == 0 && this.state.search_input.length > 0 &&
                        <div className="alert">
                            Nothing was found on "<i>{this.state.search_input.length}</i>" so far
                            <ul>
                                <li>Maybe you didn't push Go! button?</li>
                                <li>Or, unfortunatelly, we have nothing to show you</li>
                            </ul>
                        </div>
                    }
                </footer>
            </div>
        );
    }
}

export default SearchWithResults;