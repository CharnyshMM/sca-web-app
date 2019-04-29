import React, { Component } from 'react';
import queryString from 'query-string';

import { getAuthoritiesInDomainsList } from '../verbose_loaders';
import { createAuthoritiesInDomainsLink, createSearchLink } from '../utilities/links_creators';
import Spinner from '../ReusableComponents/Spinner';
import AutocompleteInput from '../ReusableComponents/AutocompleteInput/AutocompleteInput';
import AuthoritiesQueryResult from './AuthoritiesQueryResult';
import './AuthoritiesQuery.css';
import ErrorAlert from '../ReusableComponents/ErrorAlert';

class AuthoritiesQuery extends Component {
  state = {
      domains: [],
      domainInputValue: '',
      error: undefined,
      loading: false,
  }

  componentDidMount() {
    const search = queryString.parse(this.props.location.search);
    let domains = search.domain;
    if (domains == undefined) {
      return;
    }
    if (!Array.isArray(domains)) {
      domains = [domains];
    }
    console.log("domains", domains);
    this.makeQuery(domains);
  }

  makeQuery = domains => {
    this.setState({ error: undefined, result: undefined, domains: domains, loading: true });
    const token = window.sessionStorage.getItem("token");
    let status = 0;

    getAuthoritiesInDomainsList(domains, token)
      .then(result => {
        status = result.status;
        return result.response.json();
      },
        error => {
          status = error.status;
          return error.response.json();
        })
      .then(result => {
        console.log('responsed:', result, status);
        if (status == 200) {
          this.setState({ result: result, loading: false });
        } else {
          console.log("I throwed an error");
          throw Error(result.error);
        }
      },
    )
      .catch(e => {
        this.setState({ error: e, loading: false });
        console.log("ERROR:", e);
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
    this.makeQuery(this.state.domains);
  };

  onAuthorityClick = resultItem => {
    this.props.history.push(
      createSearchLink("", "publication", {
        authorsFilter: [resultItem["author"]["name"]],
        themesFilter: this.state.domains
      })
    );
  }

  render() {

    return (
      <div className="container">
        <h1>Search for experts in particular domains</h1>
        <form onSubmit={this.handleSubmit}>
        <div className="authorities_query__form">
            <div>
              <ul className="authorities_query__form__themes">
                {this.state.domains.map((domain, i) => (
                  <li  key={i}>
                    <button type="button" className="authorities_query__form__themes__item" onClick={() => this.removeDomain(i)}>{domain}</button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="authorities_query__form__input">
            <AutocompleteInput 
              suggestions={[
                "Biology",
                "Birds",
                "Science"
              ]} 
              onSubmit={this.addDomain}
              getName={v=>v}
              />
              </div>
            {/* <div>
              <button type="button" className="authorities_query__form__plus" onClick={() => this.addDomain()}>
                <span className="oi oi-plus"></span>
              </button>
            </div> */}
            </div>
          <p><small>Start typing theme name and autocomplete will help you. Click on theme to remove it from the list.</small></p>
          <button className="btn btn-primary" type="submit">Submit</button>
        </form>
        {this.state.error && (
          <ErrorAlert errorName={this.state.error.name} errorMessage={this.state.error.message} />
        )}

        {this.state.loading &&
          <Spinner />
        }

        {this.state.result && 
          <AuthoritiesQueryResult result={this.state.result} onItemClick={this.onAuthorityClick} />
        }
      </div>
    );
  }
}


export default AuthoritiesQuery;