import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import AuthoritiesQuery from './AuthoritiesQuery/AuthoritiesQuery';
import SingleAuthorityView from './AuthoritiesQuery/SignleAuthorityView';
import DomainsQuery from './DomainsQuery/DomainsQuery';
import ArticlesQuery from './ArticlesQuery/ArticlesQuery';
import CustomQuery from './CustomQuery/CustomQuery';
import Status from './Status/Status';
import SearchStart from './Search/StartSearch/StartSearch';
import SearchAndResults from './Search/SearchWithResults/SearchWithResults';


const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/search/start/' component={SearchStart} />
      <Route path='/search/' component={SearchAndResults} />
      <Route path="/authorities-query/authority/" component={SingleAuthorityView} /> 
      <Route path='/authorities-query' component={AuthoritiesQuery}/>
          
      <Route path='/domains-query' component={DomainsQuery}/>
      <Route path='/articles-query' component={ArticlesQuery}/>
      <Route path='/custom-query' component={CustomQuery}/>
      <Route path='/status' component={Status} />
      
    </Switch>
  </main>
);

export default Main;
