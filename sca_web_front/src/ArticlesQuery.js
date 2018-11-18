import React, { Component } from 'react';
import { parse } from 'parse-neo4j';

import NeoContext from './NeoContext';


class ArticlesQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keywords: [],
      keywordInputValue: '',
      error: undefined,
    };
  }
      render() {
        const changeKeywordInput = event => {
          if ([';', ',', '.'].includes(event.target.value[event.target.value.length - 1])) {
            addKeyword(event.target.value.slice(0, -1));
          } else {
            this.setState({ keywordInputValue: event.target.value });
          }
        };
        const addKeyword = keyword => {
          if (!this.state.keywordInputValue && !keyword) {
              return;
          }
          if (!keyword) {
            keyword = this.state.keywordInputValue;
          }
          if (this.state.keywords.includes(keyword)) {
            alert(`"${keyword}" already in keywords`);
            return;
          } 
          this.setState(prev => ({ keywordInputValue: '', keywords: [...prev.keywords, keyword.toLowerCase()] }));
        }
        const removeKeyword = index => {
          this.setState(prev => ({ keywords: [
            ...prev.keywords.slice(0, index),
            ...prev.keywords.slice(index + 1),
          ] }));

          console.log("onRemove: ",this.state.keywords);
        };

        const handleSubmit = e => {
          e.preventDefault();
          console.log("onSubmit: ",this.state.keywords);
          this.setState({ error: undefined, result: undefined });
          if (this.props.connection) {
            const session = this.props.connection.session();
            new Promise((resolve, reject) => {
              session.run('MATCH (a:Author)-[:WROTE]-(p:Publication), (p)-[r:KEYWORDS]-(d:KeywordPhrase) WITH collect(d.phrase) as domains, collect(distinct p) as pub, a WHERE ALL(domain_name in $keyws WHERE domain_name in domains) RETURN a, size(pub)', {
                keyws: this.state.keywords,
              })
                .then(resolve, reject)
            })
            .catch(e => {
              this.setState({ error: e });
              console.log("ERROR:", e);
            })
              .then(parse)
              .then(result => {
                this.setState({ result });
                console.log("RESULT:", result);
              })
              .finally(() => {
                session.close();
              });
          }
        };
    
        return (
          <div className="container">
            <h1>Search for articles by keywords</h1>
            <form className="form" onSubmit={handleSubmit}>
              <div className="form-group input-group">
                <input type="text" className="form-control" placeholder="Domain" value={this.state.keywordInputValue} onChange={changeKeywordInput} aria-describedby="using"/>
                <div className="input-group-append">
                  <button type="button" className="btn btn-outline-primary" onClick={() => addKeyword()}>
                    <span className="oi oi-plus"></span>
                  </button>
                </div>
              </div>
              <p><small id="using">Enter a keyword and type <kbd>;</kbd>, <kbd>,</kbd> or <kbd>.</kbd> to add it to the list. Click on keyword to remove it from the list.</small></p>
              <button className="btn btn-primary" type="submit">Submit</button>
            </form>

             <div className="border-bottom">
                <h3 >keywords:</h3>
                  <ul className="list-inline">
                    {this.state.keywords.map((keyword, i) => (
                      <li className="list-inline-item" key={i}>
                        <button type="button" className="btn btn-outline-danger btn-sm" title="Click to remove this keyword" onClick={() => removeKeyword(i)}>{keyword}</button>
                      </li>
                    ))}
                  </ul>
                </div>
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
                      <td>{row['a']['properties']['name']}</td>
                      <td>{row['length(pub)']}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
  }
};

export default props => (
  <NeoContext.Consumer>
    {({ connection }) => <ArticlesQuery {...props} connection={connection}/>}
  </NeoContext.Consumer>
);
