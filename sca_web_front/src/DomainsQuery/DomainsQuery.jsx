import React, { Component } from 'react';

import { getDomainsByPopularity } from '../loaders';
import queryString from 'query-string';
import { createAuthoritiesInDomainsLink, createDomainsPopularityLink, createDomainLink } from '../utilities/links_creators';
import HorizontalKeywordsList from '../ReusableComponents/HorizontalKeywordsList';
import NeoContext from '../NeoContext';
import Spinner from '../ReusableComponents/Spinner';
import DomainsQueryResultItem from './DomainsQueryResultItem';

class DomainsQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 'publications',
      domains: [],
      loading: false,
    };
  }

  loadData(popularityKey) {
    const token = window.sessionStorage.getItem("token");
    this.setState({error: undefined, result: undefined, selected: popularityKey, loading: true});
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
        this.setState({ error: e, loading: false });
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
        let domain = this.state.result[index]["theme"]["name"];
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

    const onNameClick = (i) => {
      const link = createDomainLink(this.state.result[i]["theme_id"]);
      this.props.history.push(link);
    }

    const handleSubmit = e => {
      e.preventDefault();
      const link = createDomainsPopularityLink(this.state.selected);
      this.props.history.push(link);
      this.loadData(this.state.selected);
    };

    const result = [];
    if (this.state.result) {
      const sortedResult = this.state.result.sort((a, b)=>{
        if (this.state.selected == "publications") {
          return b["publications_count"] - a["publications_count"];
        } else if (this.state.selected == "after_2000") {
          return b["dynamics"]["after_2000"] - a["dynamics"]["after_2000"];
        } else if (this.state.selected == "between_1950_and_2000") {
          return b["dynamics"]["between_1950_and_2000"] - a["dynamics"]["between_1950_and_2000"];
        } else if (this.state.selected == "before_1950") {
          return b["dynamics"]["before_1950"] - a["dynamics"]["before_1950"];
        }
      })
      for (let i=0; i < this.state.result.length; i++) {
        result.push(<DomainsQueryResultItem 
            key={i}
            domainInfo={this.state.result[i]}
            onAddClick={()=>onAddDomainToListClick(i)} 
            onNameClick={()=>onNameClick(i)}
            />);
      }
    }

    return (
      <div className="container">
        <h1>Search for domains by dynamics</h1>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group row align-items-center">
            <div className="form-group col-md-12">
              <select className="form-control" onChange={changeSelected} value={this.state.selected}>
                  <option value="publications">Most publications first</option>
                  <option value="after_2000" >Most publications after 2000 year</option>
                  <option value="between_1950_and_2000">Most publications between 1950 and 2000</option>
                  <option value="before_1950" >Most publications before 1950 year</option>
              </select>
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
        {this.state.loading &&
          <Spinner />
        }
        {result}
      </div>
    );
  }
}

// export default props => (
//   <NeoContext.Consumer>
//     {({ connection }) => <DomainsQuery {...props} connection={connection}/>}
//   </NeoContext.Consumer>
// );


export default DomainsQuery;