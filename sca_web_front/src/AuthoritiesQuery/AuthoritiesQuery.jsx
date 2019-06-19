import React, { Component } from 'react';
import queryString from 'query-string';

import { getAuthoritiesInDomainsList } from '../utilities/verbose_loaders';
import { createAuthoritiesInDomainsLink, createSearchLink } from '../utilities/links_creators';
import Spinner from '../ReusableComponents/Spinner';
import AutocompleteInput from '../ReusableComponents/AutocompleteInput/AutocompleteInput';
import AuthoritiesQueryResult from './AuthoritiesQueryResult';
import './AuthoritiesQuery.css';
import ErrorAlert from '../ReusableComponents/ErrorAlert';
import { getThemesList } from '../utilities/verbose_loaders';

const RESULTS_ON_PAGE_LIMIT = 10;

class AuthoritiesQuery extends Component {
  state = {
      domains: [],
      domainInputValue: '',
      error: undefined,
      loading: false,
      offset: 0,
      lastUpdateLength: 0,
      mayBeMore: false,
      allThemes: [],
      result: []
  }

  componentDidMount() {
    const search = queryString.parse(this.props.location.search);
    let domains = search.domain;
    if (domains == undefined) {
      this.loadThemesList();
      return;
    }
    if (!Array.isArray(domains)) {
      domains = [domains];
    }
    this.makeQuery(domains, 0);
    this.loadThemesList();
  }

  loadThemesList = () => {
    const token = window.sessionStorage.getItem("token");
    this.setState({themesLoading: true});
    let status = 0;
    getThemesList(token)
    .then(
      result => {
        status = result.status;
        return result.response.json();
      },
      error => {
        status = error.status;
        return status;
      }
    )
    .then(
      result => {
        if (status == 200) {
          this.setState({
            allThemes: result.map(v => v["name"]),
            themesLoading: false,
          });
          console.log(result);
        } else {
          throw Error(result.error);
        }
      }
    )
    .catch(e => {
      this.setState({themesLoading: false});
      console.log("ERROR:", e);
    });
  }

  makeQuery = (domains, offset) => {
    this.setState({ error: undefined, domains: domains, loading: true });
    if (offset === 0) {
      this.setState({result: []});
    }
    const token = window.sessionStorage.getItem("token");
    let status = 0;

    getAuthoritiesInDomainsList(domains, RESULTS_ON_PAGE_LIMIT, offset, token)
      .then(result => {
        status = result.status;
        return result.response.json();
      },
        error => {
          status = error.status;
          return error.response.json();
        })
      .then(result => {
        if (status == 200) {
          this.setState({ 
            loading: false,
            mayBeMore: true ,
            offset: offset + result.length,
            lastUpdateLength: result.length
          });
          if (offset != 0) {
            this.setState(state => ({ result: state.result.concat(result)}));
          } else {
              this.setState({ result: result});
          }
        } else {
          throw Error(result.error);
        }
      },
    )
      .catch(e => {
        this.setState({ error: e, loading: false });
        console.log("AQ   ERROR:", e);
      });
  }

  addDomain = domain => {
    if (!domain) {
      domain = this.state.domainInputValue;
    }
    if (domain.length == 0) {
      return;
    }
    if (this.state.domains.includes(domain)){
      return;
    }
    this.setState(prev => ({ domainInputValue: '', domains: [...prev.domains, domain] }));
  };

  removeDomain = index => {
    this.setState(prev => ({
      domains: [
        ...prev.domains.slice(0, index),
        ...prev.domains.slice(index + 1),
      ]
    }));
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.history.push(createAuthoritiesInDomainsLink(this.state.domains));
    this.makeQuery(this.state.domains, 0); // offset 0
  };


  onMoreClick = () => {
    const {domains, offset, lastUpdateLength} = this.state;
    if (lastUpdateLength < RESULTS_ON_PAGE_LIMIT) {
      this.setState({
        mayBeMore: false
      });
      return;
    }
    this.makeQuery(domains, offset);
  }

  onAuthorityClick = resultItem => {
    this.props.history.push(
      createSearchLink("", "publication", {
        authorsFilter: [resultItem["author"]["name"]],
        themesFilter: this.state.domains
      })
    );
  }

  render() {
    const {mayBeMore, domains, allThemes, error, loading, result} = this.state;
    return (
      <div className="container">
        <h1>Search for experts in particular domains</h1>
        <form>
        <div className="authorities_query__form">
            <div>
              <ul className="authorities_query__form__themes">
                {domains.map((domain, i) => (
                  <li  key={i}>
                    <button 
                      type="button" 
                      className="authorities_query__form__themes__item" 
                      onClick={() => this.removeDomain(i)}>
                      {domain}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="authorities_query__form__input">
            <AutocompleteInput 
              suggestions={
                allThemes
              } 
              onSubmit={this.addDomain}
              getName={v=>v}
              />
              </div>
            
            </div>
          <p><small>Start typing theme name and autocomplete will help you. Click on theme to remove it from the list.</small></p>
          <button onClick={this.handleSubmit} className="btn btn-primary">Submit</button>
        </form>
        {error && (
          <ErrorAlert errorName={error.name} errorMessage={error.message} />
        )}

        {result && result.length == 0 && domains && domains.length > 0 && 
          <ErrorAlert errorName="Not found" errorMessage="Sorry, no reliable results found for you :(" />
        }
        {result && result.length > 0 && 
          <AuthoritiesQueryResult 
            result={result}
            loading={loading}
            onItemClick={this.onAuthorityClick} 
            mayBeMore={mayBeMore}
            onMoreClick={this.onMoreClick}
            />
        }
        {loading &&
          <Spinner />
        }
      </div>
    );
  }
}


export default AuthoritiesQuery;