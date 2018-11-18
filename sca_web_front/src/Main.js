import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import AuthoritiesQuery from './AuthoritiesQuery';
import DomainsQuery from './DomainsQuery';
import ArticlesQuery from './ArticlesQuery';
import CustomQuery from './CustomQuery';
import Status from './Status';

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/authorities-query' component={AuthoritiesQuery}/>
      <Route path='/domains-query' component={DomainsQuery}/>
      <Route path='/articles-query' component={ArticlesQuery}/>
      <Route path='/custom-query' component={CustomQuery}/>
      <Route path='/status' component={Status} />
    </Switch>
  </main>
);

export default Main;
