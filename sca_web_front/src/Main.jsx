import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home/Home';
import AuthoritiesQuery from './AuthoritiesQuery/AuthoritiesQuery';
import SingleAuthorityView from './AuthoritiesQuery/SignleAuthorityView';
import DomainsQuery from './DomainsQuery/DomainsQuery';
import ArticlesQuery from './ArticlesQuery/ArticlesQuery';
import CustomQuery from './CustomQuery/CustomQuery';
import Status from './Status/Status';
import SearchWithResults from './Search/SearchWithResults/SearchWithResults';
import Publication from './EntityViews/Publication';
import Author from './EntityViews/Author';
import Domain from './EntityViews/Domain';
import Test from './Test/Test';
import PublicationGraphView from './EntityViews/PublicationGraphView/PublicationGraphView';


const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/search/' component={SearchWithResults} />
      <Route path="/author/" component={Author}/>
      <Route path="/domain/" component={Domain}/>
      <Route path="/publication" component={Publication}/>
      <Route path="/authorities-query/authority/" component={SingleAuthorityView} /> 
      <Route path='/authorities-query' component={AuthoritiesQuery}/>
      <Route path='/domains-query' component={DomainsQuery}/>
      <Route path='/articles-query' component={ArticlesQuery}/>
      <Route path='/test' component={PublicationGraphView} />
      <Route path='/custom-query' component={CustomQuery}/>
      <Route path='/status' component={Status} />
    </Switch>
  </main>
);

export default Main;
