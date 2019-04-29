import React, { useState } from 'react';
import './Home.css';
import Feature from './Feature';
import { createSearchLink } from '../utilities/links_creators';

const Home = (props) => {
  const [ searchInput, onSearchInputChange ] = useState("");

  const onSearchClick = e => {
    e.preventDefault();
    props.history.push(createSearchLink(searchInput, "all"));
  };

  const isAdmin = window.sessionStorage.getItem("isAdmin") == "true";

  return (
    <div className='container'>
      <h1>Dashboard</h1>

      <form onSubmit={onSearchClick}>
        <div className="search_form">
          <input
            className="search_form__input"
            value={searchInput}
            type="text"
            onChange={e => onSearchInputChange(e.target.value)}
            placeholder="Search for knowledge..."
          />
          <button className="search_form__button" type="submit">Go!</button>
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

export default Home;
