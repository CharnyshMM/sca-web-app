import React, { Component } from 'react';

import { getDomainsByPopularity } from '../loaders';
import NeoContext from '../NeoContext';

class DomainsQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 'nascent',
    };
  }

  render() {
    const changeSelected = e => {
      this.setState({ selected: e.target.value });
    };

    const handleSubmit = e => {
      e.preventDefault();
      this.setState({error: undefined,});
      getDomainsByPopularity(this.state.selected, this.props.connection)
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
    };

    return (
      <div className="container">
        <h1>Search for domains by dynamics</h1>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-check">
            <input type="radio" className="form-check-input" name="dynamic" value="nascent" id="dynamic-nascent" checked={this.state.selected == 'nascent'} onChange={changeSelected}/>
            <label htmlFor="dynamic-nascent" className="form-check-label">Nascent domain</label>
          </div>
          <div className="form-check">
            <input type="radio" className="form-check-input" name="dynamic" value="uninteresting" id="dynamic-uninteresting" checked={this.state.selected == 'uninteresting'} onChange={changeSelected}/>
            <label htmlFor="dynamic-uninteresting" className="form-check-label">Uninteresting domain</label>
          </div>
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
                <th scope="col">Domain</th>
                <th scope="col">Popularity Index</th>
              </tr>
            </thead>
            <tbody>
              {this.state.result.map((row, i) => (
                <tr key={i}>
                  <th scope="row">{i}</th>
                  <td>{row['name']}</td>
                  <td>{row['popularity']}</td>
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
