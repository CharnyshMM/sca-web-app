import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home/Home';
import AuthoritiesQuery from './AuthoritiesQuery/AuthoritiesQuery';
import DomainsQuery from './DomainsQuery/DomainsQuery';
import ArticlesQuery from './ArticlesQuery/ArticlesQueryDeprecated';
import CustomQuery from './CustomQuery/CustomQuery';
import Status from './AdminTools/Status/Status';
import SearchWithResults from './Search/SearchWithResults/SearchWithResults';

import Domain from './EntityViews/Domain';
import Test from './Test/Test';
import PublicationGraphView from './EntityViews/PublicationGraphView';
import AuthorGraphView from './EntityViews/AuthorGraphView';
import {
  AUTHORITIES_QUERY, 
  DOMAINS_POPULARITY_QUERY,
  CUSTOM_QUERY,
  SEARCH,
  AUTHOR,
  DOMAIN,
  PUBLICATION,
  STATUS,
  TEST
} from './utilities/routes_constants';
import AdminTools from './AdminTools/AdminTools';

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path={SEARCH} component={SearchWithResults} />
      <Route path={AUTHOR} component={AuthorGraphView}/>
      <Route path={DOMAIN} component={Domain}/>
      <Route path={PUBLICATION} component={PublicationGraphView}/>
      <Route path={AUTHORITIES_QUERY} component={AuthoritiesQuery}/>
      <Route path={DOMAINS_POPULARITY_QUERY} component={DomainsQuery}/>
      <Route path={TEST} component={Test} />
      <Route path={CUSTOM_QUERY} component={CustomQuery}/>
      <Route path={STATUS} component={AdminTools} />
    </Switch>
  </main>
);

export default Main;
