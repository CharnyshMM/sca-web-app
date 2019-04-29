import React, { Component } from 'react';
import './Home.css';
import Feature from './Feature';
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

        <section className="features">
          <Feature 
            name="FIND EXPERTS"
            iconClassName="oi oi-person"
            href="/authorities-query"
            >
            in particular domains by selecting authors
              with most cited publications
          </Feature>
          <Feature 
            name="EXPLORE DOMAINS"
            iconClassName="oi oi-bar-chart"
            href="/domains-query"
            >
            their popularity and publicing dynamics through the time
          </Feature>
          {isAdmin && 
          <Feature 
            name="MAKE QUERIES"
            iconClassName="oi oi-terminal"
            href="/custom-query"
            >
            to the Graph of knowledge in Neo4j&trade; database by writing your own queries in CYPHER
          </Feature>
          }
          {isAdmin == false && 
          <Feature 
          name="ABOUT CAS"
          iconClassName="oi oi-flag"
          href="/custom-query"
          >
          to the Graph of knowledge in Neo4j&trade; database by writing your own queries in CYPHER
        </Feature>
          }
        </section>
      </div>
    );
  }
}

export default Home;
