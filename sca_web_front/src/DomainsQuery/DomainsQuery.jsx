import React, { Component } from 'react';

import { getDomainsByPopularity } from '../loaders';
import queryString from 'query-string';
import { createAuthoritiesInDomainsLink, createDomainsPopularityLink } from '../utilities/links_creators';
import HorizontalKeywordsList from '../ReusableComponents/HorizontalKeywordsList';
import NeoContext from '../NeoContext';

class DomainsQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 'nascent',
      domains: [],
    };
  }

  loadData(popularityKey) {
    const token = window.sessionStorage.getItem("token");
    this.setState({error: undefined, result: undefined, selected: popularityKey});
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
              this.setState({ result: response });
            },
      )
      .catch(e => {
        this.setState({ error: e });
        console.log("ERROR:", e);
    });
  }

  componentDidMount() {
    
    const queryParams = queryString.parse(this.props.location.search);
    console.log("qP", queryParams);

    let popularityKey = queryParams.popularity;
    if (!popularityKey) {
        popularityKey = this.state.selected;
    }
    console.log("pK", popularityKey);
    this.loadData(popularityKey);
  }

  render() {
    const changeSelected = e => {
      console.log(e.target.value);
      this.setState({ selected: e.target.value });
    };

    const onAddDomainToListClick = (index) => {
        let domain = this.state.result[index]["name"];
        if (this.state.domains && this.state.domains.includes(domain)) {
            return;
        }
        this.setState(prev => ({ domainInputValue: '', domains: [...prev.domains, domain] }));
    };

    const onRemoveDomainFromListClick = (index) => {
      this.setState(prev => ({ domains: [
        ...prev.domains.slice(0, index),
        ...prev.domains.slice(index + 1),
      ] }));
    }

    const onSearchAuthoritiesClick = () => {
      if (!this.state.domains || this.state.domains.length == 0) {
        return;
      }

      const link = createAuthoritiesInDomainsLink(this.state.domains);
      this.props.history.push(link);
    }

    const handleSubmit = e => {
      e.preventDefault();
      const link = createDomainsPopularityLink(this.state.selected);
      this.props.history.push(link);
      this.loadData(this.state.selected);
    };

    return (
      <div className="container">
        <h1>Search for domains by dynamics</h1>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group row align-items-center">
            <div className="form-group col-md-10">
              <select className="form-control" onChange={changeSelected} value={this.state.selected}>
                  <option value="nascent">Nascent Domains</option>
                  <option value="uninteresting" >Uninteresting Domains</option>
              </select>
            </div>
            <div className="form-group col-md-2">
            <button className="btn btn-primary" type="submit">Search</button>
            </div>
          </div>
        </form>
        {this.state.error && (
          <div className="alert alert-warning mt-3" role="alert">
            <h4 className="alert-heading">{this.state.error.name}</h4>
            <pre><code>{this.state.error.message}</code></pre>
          </div>
        )}

        {this.state.domains && this.state.domains.length > 0 &&
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Selected domains:</h5>
              <HorizontalKeywordsList keywords={this.state.domains} onClickHandler={onRemoveDomainFromListClick} />
              <button className="btn btn-primary" onClick={onSearchAuthoritiesClick}>Search for authorities</button>
            </div>
          </div>
        }
        {this.state.result && (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Domain</th>
                <th scope="col">Popularity Index</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {this.state.result.map((row, i) => (
                <tr key={i}>
                  <td scope="row">{i}</td>
                  <th>{row['name']}</th>
                  <td>{row['popularity']}</td>
                  <td>
                    <button className="btn btn-outline" onClick={()=>onAddDomainToListClick(i)}>
                      <span className="oi oi-plus"> </span>
                    </button>
                  </td>
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
    {({ connection }) => <DomainsQuery {...props} connection={connection}/>}
  </NeoContext.Consumer>
);
