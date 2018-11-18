import React, { Component } from 'react';
import { parse } from 'parse-neo4j';

import NeoContext from './NeoContext';

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
      if (this.props.connection) {
        const session = this.props.connection.session();
        new Promise((resolve, reject) => {
          session.run(
            this.state.selected == 'nascent'
            ? 'match (theme:Theme), (title:Publication)-[r:THEME_RELATION]-(theme) where r.probability > 0.5 with theme, count(title) as popularity where popularity > 150 return theme.name as name, popularity order by popularity desc'
            : 'match (theme:Theme), (title:Publication)-[r:THEME_RELATION]-(theme) where r.probability > 0.5 with theme, count(title) as popularity where popularity <= 150 return theme.name as name, popularity order by popularity',
          )
            .then(resolve, reject)
        })
          .catch(e => {
            this.setState({ error: e });
            console.log("ERROR:", e);
          })
          .then(parse)
          .then(result => {
            this.setState({ result });
          })
          .finally(() => {
            session.close();
          });
      } 
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
