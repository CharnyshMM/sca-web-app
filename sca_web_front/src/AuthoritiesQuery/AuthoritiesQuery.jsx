import React, { Component } from 'react';
import queryString from 'query-string';

import { getAuthoritiesInDomainsList } from '../verbose_loaders';
import { createAuthoritiesInDomainsLink, createAuthorPublicationsInDomainsLink } from '../utilities/links_creators';
import Spinner from '../ReusableComponents/Spinner';
import AuthoritiesQueryResult from './AuthoritiesQueryResult';
import ErrorAlert from '../ReusableComponents/ErrorAlert';

class AuthoritiesQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      domains: [],
      domainInputValue: '',
      error: undefined,
      loading: false,
    };
  }

  makeQuery(domains) {
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


  componentDidMount() {
    console.log("comp did mount");


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

  render() {
    const changeDomainInput = event => {
      if ([';', ',', '.'].includes(event.target.value[event.target.value.length - 1])) {
        addDomain(event.target.value.slice(0, -1));
      } else {
        this.setState({ domainInputValue: event.target.value });
      }
    };

    const addDomain = domain => {
      if (!domain) {
        domain = this.state.domainInputValue;
      }
      this.setState(prev => ({ domainInputValue: '', domains: [...prev.domains, domain] }));
    };

    const removeDomain = index => {
      this.setState(prev => ({
        domains: [
          ...prev.domains.slice(0, index),
          ...prev.domains.slice(index + 1),
        ]
      }));
    };

    const handleSubmit = e => {
      e.preventDefault();
      this.props.history.push(createAuthoritiesInDomainsLink(this.state.domains));
      this.makeQuery(this.state.domains);
    };

    const onAuthorityClick = (resultItem) => {
      this.props.history.push(
        createAuthorPublicationsInDomainsLink(resultItem["author"]["name"], this.state.domains)
        );
    }

    return (
      <div className="container">
        <h1>Search of experts in the domain</h1>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group input-group">
            <div className="input-group-prepend">
              <ul className="list-inline input-group-text">
                {this.state.domains.map((domain, i) => (
                  <li className="list-inline-item" key={i}>
                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeDomain(i)}>{domain}</button>
                  </li>
                ))}
              </ul>
            </div>
            <input type="text" className="form-control" placeholder="Domain" value={this.state.domainInputValue} onChange={changeDomainInput} aria-describedby="using" />
            <div className="input-group-append">
              <button type="button" className="btn btn-outline-primary" onClick={() => addDomain()}>
                <span className="oi oi-plus"></span>
              </button>
            </div>
          </div>
          <p><small id="using">Enter domain and type <kbd>;</kbd>, <kbd>,</kbd> or <kbd>.</kbd> to add it to the list. Click on domain to remove it from the list.</small></p>
          <button className="btn btn-primary" type="submit">Submit</button>
        </form>
        {this.state.error && (
          <ErrorAlert errorName={this.state.error.name} errorMessage={this.state.error.message} />
        )}

        {this.state.loading &&
          <Spinner />
        }

        {this.state.result && 
          <AuthoritiesQueryResult result={this.state.result} onItemClick={onAuthorityClick} />
        }
      </div>
    );
  }
}


export default AuthoritiesQuery;