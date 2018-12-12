import React, { Component } from 'react';
import CodeMirror from 'codemirror';
import { runQueryOnPythonBackend } from '../verbose_loaders';

import NeoContext from '../NeoContext';

import './CustomQuery.css';

class CustomQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clauses: [],
      queryText: '',
      useConstructor: false,
    };
  }

  componentDidMount() {
    this.queryEditor = CodeMirror.fromTextArea(document.querySelector('textarea'), {
      mode: 'cypher',
      lineNumbers: true,
    });
  }

  setStatePromise(mutator) {
    return new Promise(resolve => {
      this.setState(mutator, resolve);
    });
  }

  render() {

    const parseClauses = () => {
      const queryText = this.state.clauses.map(clause => `${{
        match: 'MATCH',
        return: 'RETURN',
        where: 'WHERE',
        limit: 'LIMIT',
        orderby: 'ORDER BY',
      }[clause.type]} ${clause.value}`).join('\n');
      this.setState(prev => ({ queryText }));
      this.queryEditor.setValue(queryText);
    };

    const addClause = () => {
      this.setStatePromise(prev => ({ clauses: [...prev.clauses, { type: 'match', value: '' }] }))
        .then(parseClauses);
    }

    const removeClause = index => () => {
      this.setStatePromise(prev => ({ clauses: [
        ...prev.clauses.slice(0, index),
        ...prev.clauses.slice(index + 1),
      ] }))
        .then(parseClauses);
    }

    const changeClauseType = index => e => {
      const type = e.target.value;
      this.setStatePromise(prev => ({ clauses: [
        ...prev.clauses.slice(0, index),
        { ...prev.clauses[index], type },
        ...prev.clauses.slice(index + 1),
      ] }))
        .then(parseClauses);
    }

    const changeClauseValue = index => e => {
      const value = e.target.value;
      this.setStatePromise(prev => ({ clauses: [
        ...prev.clauses.slice(0, index),
        { ...prev.clauses[index], value },
        ...prev.clauses.slice(index + 1),
      ] }))
        .then(parseClauses);
    }
    
    const changeQueryText = event => {
        this.setState({ queryText: event.target.value });
    };

    const handleSubmit = e => {
        e.preventDefault();
        let status = 0;
        const token = window.sessionStorage.getItem("token");
        this.setState({ error: undefined, result: undefined });
        runQueryOnPythonBackend(this.queryEditor.getValue(), token)
          .then(result => {
                status = result.status;
                return result.response.json();
              },
              error => {
                status = error.status;
                return error.response.json();
              }) 
          .then(result => {
                console.log('responsed_Custom_query:', result, status);
                  if (status == 200) {
                      this.setState({ result: result });
                  } else {
                      console.log("I throwed an error");
                      throw Error(result.error);
                  }
              },
          )
          .catch(e => {
            this.setState({ error: e});
            console.log("ERROR:", e);
          });
    }
    
    const toggleConstructor = e => {
        this.setState({ useConstructor: e.target.checked });
        this.queryEditor.setOption('readOnly', e.target.checked);
    }

    return (
      <div className="container">
        <h1>Query builder</h1>
        <form className="form" onSubmit={handleSubmit}>
          <div className={this.state.useConstructor ? 'form-group disabled' : 'form-group'}>
            <textarea className="form-control" value={this.state.queryText} onChange={changeQueryText}/>
          </div>
          <div className="form-check">
            <input type="checkbox" checked={this.state.useConstructor} onChange={toggleConstructor} className="form-check-input" id="use-constructor"/>
            <label htmlFor="use-constructor" className="form-check-label">Use Constructor</label>
          </div>
          {this.state.useConstructor && (
            <div className="form-group">
              <ul className="list-group">
                {this.state.clauses.map((clause, i) => (
                  <li className="list-group-item" key={i}>
                    <div className="row">
                      <div className="d-flex align-items-center">[{i}]:</div>
                      <div className="col">
                        <div className="input-group">
                          <select className="form-control" value={clause.type} onChange={changeClauseType(i)}>
                            <option value="match">MATCH</option>
                            <option value="return">RETURN</option>
                            <option value="where">WHERE</option>
                            <option value="limit">LIMIT</option>
                            <option value="orderby">ORDER BY</option>
                          </select>
                        </div>
                        <div className="input-group">
                          <input type="text" value={clause.value} onChange={changeClauseValue(i)} className="form-control"/>
                        </div>
                      </div>
                      <button type="button" className="close" onClick={removeClause(i)}>
                        <span className="oi oi-x"></span>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <button type="button" className="btn btn-outline-primary mt-3" onClick={addClause}><span className="oi oi-plus mr-2"></span>Add clause</button>
            </div>
          )}
          <button className="btn btn-primary" type="submit">Submit</button>
        </form>
        {this.state.error && (
          <div className="alert alert-warning mt-3" role="alert">
            <h4 className="alert-heading">{this.state.error.name}</h4>
            <pre><code>{this.state.error.message}</code></pre>
          </div>
        )}
        {this.state.result && (
          <ul className="list-group mt-3">
            {(this.state.result).map((record, i) => (
              <li className="list-group-item" key={i}>
                <table className="table table-sm">
                  <tbody>
                    {Object.keys(record).map((key, j) => (
                      <tr key={j}><th scope="row" style={{ width: '50%' }}>{key}</th><td>{JSON.stringify(record[key])}</td></tr>
                    ))}
                  </tbody>
                </table>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export default props => (
  <NeoContext.Consumer>
    {({ connection, is_admin }) => <CustomQuery {...props} connection={connection} is_admin={is_admin}/>}
  </NeoContext.Consumer>
);
