import React, { Component } from 'react';
import CodeMirror from 'codemirror';
import { runQueryOnPythonBackend } from '../utilities/verbose_loaders';

import './CustomQuery.css';

import Spinner from '../ReusableComponents/Spinner';
import ErrorAlert from '../ReusableComponents/ErrorAlert';
import CustomQueryConstructorClause from './CustomQueryConstructorClause';
import CustomQueryResult from './CustomQueryResult';
import BeautifulSwitch from '../ReusableComponents/BeautifulSwitch/BeautifulSwitch';

class CustomQuery extends Component {
  state = {
    clauses: [],
    queryText: '',
    useConstructor: false,
    loading: false,
  };


  componentDidMount() {
    this.queryEditor = CodeMirror.fromTextArea(document.querySelector('textarea'), {
      mode: 'cypher',
      lineNumbers: true,

    });
  }

  setStatePromise = (mutator) => {
    return new Promise(resolve => {
      this.setState(mutator, resolve);
    });
  }

  handleSubmit =(event) => {
    event.preventDefault();
    let status = 0;
    const token = window.sessionStorage.getItem("token");
    this.setState({ error: undefined, result: undefined, loading: true });

    let query = this.queryEditor.getValue().split("\n").join(" ");

    console.log("the query", query);
    runQueryOnPythonBackend(query, token)
      .then(
        result => {
          status = result.status;
          return result.response.json();
        },
        error => {
          status = error.status;
          return error.response.json();
        })
      .then(result => {
        console.log('responsed_Custom_query:', result, status);
        if (status === 200) {
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

  toggleConstructor = (event) => {
    this.setState({ useConstructor: event.target.checked });
    this.queryEditor.setOption('readOnly', event.target.checked);
  }

  addClause = () => {
    this.setStatePromise(prev => ({ clauses: [...prev.clauses, { type: 'match', value: '' }] }))
      .then(this.parseClauses);
  }

  removeClause = (index) => {
    return () => {
      this.setStatePromise(prev => ({
        clauses: [
          ...prev.clauses.slice(0, index),
          ...prev.clauses.slice(index + 1),
        ]
      }))
        .then(this.parseClauses);
    }
  }

  parseClauses = () => {
    const queryText = this.state.clauses.map(clause => ` ${{
      match: ' MATCH ',
      return: ' RETURN ',
      where: ' WHERE ',
      limit: ' LIMIT ',
      orderby: ' ORDER BY ',
    }[clause.type]} ${clause.value}`).join('\n');
    this.setState(prev => ({ queryText }));
    this.queryEditor.setValue(queryText);
  };

  changeQueryText = (event) => {
    this.setState({ queryText: event.target.value });
  };

  changeClauseType = (index) => {
    return e => {
      const type = e.target.value;
      this.setStatePromise(prev => ({
        clauses: [
          ...prev.clauses.slice(0, index),
          { ...prev.clauses[index], type },
          ...prev.clauses.slice(index + 1),
        ]
      }))
        .then(this.parseClauses);
    };
  }

  changeClauseValue = (index) =>  {
    return e => {
      const value = e.target.value;
      this.setStatePromise(prev => ({
        clauses: [
          ...prev.clauses.slice(0, index),
          { ...prev.clauses[index], value },
          ...prev.clauses.slice(index + 1),
        ]
      }))
        .then(this.parseClauses);
    }
  }

  render() {

    return (
      <div className="container">
        <h1>Query builder</h1>
        <form className="form" onSubmit={this.handleSubmit}>
          <div className={this.state.useConstructor ? 'form-group disabled' : 'form-group'}>
            <textarea className="form-control" style={{ "height": "200px" }} value={this.state.queryText} onChange={this.changeQueryText} />
          </div>
          <div className="form-check">
            <BeautifulSwitch label="Use constructor" onSwitchChange={this.toggleConstructor} />
          </div>

          {this.state.useConstructor && (
            <div className="form-group">
              <ul className="list-group">
                {this.state.clauses.map((clause, i) => (
                  <li className="list-group-item" key={i}>
                    <CustomQueryConstructorClause
                      index={i}
                      clauseType={clause.type}
                      clauseValue={clause.value}
                      onChangeClauseType={this.changeClauseType(i)}
                      onChangeClauseValue={this.changeClauseValue(i)}
                      onRemoveClause={this.removeClause(i)}
                    />
                  </li>
                ))}
              </ul>
              <button type="button" className="btn btn-outline-primary mt-3" onClick={this.addClause}>
                <span className="oi oi-plus mr-2"> </span>
                Add clause
              </button>
            </div>
          )}
          <button className="btn btn-primary" type="submit">Submit</button>
        </form>

        {this.state.error && (
          <ErrorAlert errorName={this.state.error.name} errorMessage={this.state.error.message} />
        )}

        {this.state.loading &&
          <Spinner />
        }

        <section style={{ "margin": "10px 0px" }}>
          {this.state.result && (
            <CustomQueryResult result={this.state.result} />
          )}
        </section>
      </div>
    );
  }
}

export default CustomQuery;
