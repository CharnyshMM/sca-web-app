import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home/Home';
import AuthoritiesQuery from './AuthoritiesQuery/AuthoritiesQuery';
import DomainsQuery from './DomainsQuery/DomainsQuery';
import ArticlesQuery from './ArticlesQuery/ArticlesQueryDeprecated';
import CustomQuery from './CustomQuery/CustomQuery';
import Status from './Status/Status';
import SearchWithResults from './Search/SearchWithResults/SearchWithResults';
import Publication from './EntityViews/Publication';
import Author from './EntityViews/Author';
import Domain from './EntityViews/Domain';
import Test from './Test/Test';
import PublicationGraphView from './EntityViews/PublicationGraphView/PublicationGraphView';
import AuthorGraphView from './EntityViews/AuthorGraphView';


const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/search/' component={SearchWithResults} />
      <Route path="/author/" component={AuthorGraphView}/>
      <Route path="/domain/" component={Domain}/>
      <Route path="/publication" component={PublicationGraphView}/>
      <Route path='/authorities-query' component={AuthoritiesQuery}/>
      <Route path='/domains-query' component={DomainsQuery}/>
      <Route path='/articles-query' component={ArticlesQuery}/>
      <Route path='/test' component={AuthorGraphView} />
      <Route path='/custom-query' component={CustomQuery}/>
      <Route path='/status' component={Status} />
    </Switch>
  </main>
);

export default Main;
