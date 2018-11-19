import React, { Component } from 'react';
import {getAuthoritiesInDomainsList} from './loaders';

import NeoContext from './NeoContext';

class AuthoritiesQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      domains: [],
      domainInputValue: '',
      error: undefined,
      // result: [],
    };
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
    }
    const removeDomain = index => {
      this.setState(prev => ({ domains: [
        ...prev.domains.slice(0, index),
        ...prev.domains.slice(index + 1),
      ] }));
    };
    const handleSubmit = e => {
      e.preventDefault();
      this.setState({ error: undefined, result: undefined });
      
      getAuthoritiesInDomainsList(this.state.domains, this.props.connection)
        .then(
          resolve => {
            return resolve.json();
          },
          reject => {
            throw new Error("Error in request");
          }
        )
        .then(response => {
              console.log('responsed_Custom_query:', response);
              this.setState({ result: response });
              },
        )
        .catch(e => {
          this.setState({ error: e });
          console.log("ERROR:", e);
        });

    };

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
            <input type="text" className="form-control" placeholder="Domain" value={this.state.domainInputValue} onChange={changeDomainInput} aria-describedby="using"/>
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
          <div className="alert alert-warning mt-3" role="alert">
            <h4 className="alert-heading">{this.state.error.name}</h4>
            <pre><code>{this.state.error.message}</code></pre>
          </div>
        )}
        {this.state.result && (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Author</th>
                <th scope="col">Publications count</th>
              </tr>
            </thead>
            <tbody>
              {this.state.result.map((row, i) => (
                <tr key={i}>
                  <th scope="row">{i}</th>
                  <td>{row['a']['name']}</td>  {/*hardcoded ['a']!!!!!!! If the backend uses different format, it crashes*/}
                  <td>{row['length(pub)']}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}

export default props => (
  <NeoContext.Consumer>
    {({ connection }) => <AuthoritiesQuery {...props} connection={connection}/>}
  </NeoContext.Consumer>
);
