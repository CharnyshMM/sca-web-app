import React, { Component } from 'react';
import {getArticlesByKeywords} from '../loaders';
import HorizontalKeywordsList from '../ReusableComponents/HorizontalKeywordsList';

import NeoContext from '../NeoContext';


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

          getArticlesByKeywords(this.state.keywords, this.props.connection)
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
    
        let row_iteration_key = 0;
        let keywordsList = this.state.keywords;

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

            <h3>keywords:</h3>
            <HorizontalKeywordsList keywords={keywordsList} onClickHandler={removeKeyword} />

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
                    <th scope="col">Name</th>
                    <th scope="col">ISBN</th> 
                    <th scope="col">year</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.result.map((row, i) => (
                    row['pub'].map(publication => (
                      <tr key={row_iteration_key++}>
                        <th scope="row">{row_iteration_key}</th>
                        <td>{row['a']['name']}</td>
                        <td>
                            {publication["name"]}
                        </td>
                        <td>
                            {publication["ISBN"]}
                        </td>
                        
                        <td>
                            {publication["year"]}
                        </td>
                      </tr>
                    ))
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
