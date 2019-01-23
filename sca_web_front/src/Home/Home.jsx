import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import {createSearchLink} from '../utilities/links_creators';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search_input: "",
    };
  }

  render() {
    const isAdmin = window.sessionStorage.getItem("isAdmin") == "true";

    const onSearchClick = e => {
      e.preventDefault();
      this.props.history.push(createSearchLink(this.state.search_input, "all"));
    };

    const onSearchInputChange = (e) => {
      this.setState({search_input: e.target.value});
    }

    return (
      <div className='container'>
        <h1>Dashboard</h1>

        <form method="GET" onSubmit={onSearchClick}>
          <div className="search_form">
            <input className="search_form__input" value={this.state.search_input} type="text" onChange={onSearchInputChange} placeholder="Search for knowledge..." />
            <button className="search_form__button btn btn-primary" type="submit">Go!</button>
          </div>
        </form>

        <div className="row">
          <div className="col-6 vertical-margin">
            <div className="card h-100">
              <div className="card-body">
                <div className="media">
                  <span className="oi oi-person primary-icon"></span>
                  <div className="media-body">
                    <h5 className="card-title">Search of experts in the domain</h5>
                    <p className="card-text">Search for the most cited experts (authorities) in the domain.</p>
                    <Link to="/authorities-query" className="btn btn-primary">Make query</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6 vertical-margin">
            <div className="card h-100">
              <div className="card-body">
                <div className="media">
                  <span className="oi oi-graph primary-icon"></span>
                  <div className="media-body">
                    <h5 className="card-title">Search for domains by dynamics</h5>
                    <p className="card-text">Search for new nascent domains, as well as those to which interest has already disappeared.</p>
                    <Link to="/domains-query" className="btn btn-primary">Make query</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center mb-5">
          <div className="col-6 vertical-margin">
            <div className="card h-100">
              <div className="card-body">
                <div className="media">
                  <span className="oi oi-book primary-icon"></span>
                  <div className="media-body">
                    <h5 className="card-title">Search articles</h5>
                    <p className="card-text">Search for articles on particular parameters.</p>
                    <Link to="/articles-query" className="btn btn-primary">Make query</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isAdmin &&
            <div className="col-6 vertical-margin ">
              <div className="card h-100">
                <div className="card-body">
                  <div className="media">
                    <span className="oi oi-spreadsheet primary-icon"></span>
                    <div className="media-body">
                      <h5 className="card-title">Query builder</h5>
                      <p className="card-text">Compose and execute complex queries to the graph database using the query designer.</p>
                      <Link to="/custom-query" className="btn btn-primary">Make query</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default Home;
