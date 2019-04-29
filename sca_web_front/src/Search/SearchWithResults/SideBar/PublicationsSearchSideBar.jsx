import React, {Component} from 'react';

import {getThemesList, getAuthorsList} from '../../../verbose_loaders';
import Filter from './Filter';


import './SideBar.css';

class PublicationsSearchSideBar extends Component {
  state = {
    authorsFilterEnabled: this.props.authorsFilterValues.length > 0,
    themesFilterEnabled: this.props.themesFilterValues.length > 0,
    themesLoading: false,
    authorsLoading: false,
    authorsFilter: [],
    themesFilter: [],
  }


  loadAutocompleteList = filterName => {
    const token = window.sessionStorage.getItem("token");
    this.setState({themesLoading: true});
    
    let promise = null;
    switch(filterName) {
      case "authorsFilter": {
        promise = getAuthorsList(token);
        break;
      }
      case "themesFilter": {
        promise = getThemesList(token);
        break;
      }
    }

    let status = 0;
    promise.then(
      result => {
        status = result.status;
        return result.response.json();
      },
      error => {
        status = error.status;
        return status;
      }
    )
    .then(
      result => {
        if (status == 200) {
          this.setState({
            [filterName]: result.map(v => v["name"]),
            themesLoading: false,
          })
        } else {
          throw Error(result.error);
        }
      }
    )
    .catch(e => {
      this.setState({ themesLoading: false});
      console.log("ERROR:", e);
    });
  }


  onToggleFilter = e => {
    if (this.state[e.target.id].length == 0) {
      this.loadAutocompleteList(e.target.id);
    }
    const key = `${e.target.id}Enabled`;
    const enabled = this.state[key];
    this.setState({[key]: !enabled});
    if (!enabled == false) {
      this.props.onFilterDisabled(e.target.id);
    }
  }

  render() {
    const {
      authorsFilterEnabled, 
      themesFilterEnabled,
      authorsFilter,
      themesFilter,
     } = this.state;

    return (
      <div className="sidebar search_sidebar">
        <Filter 
          id="authorsFilter"
          title="Filter by authors"
          selectedValues={this.props.authorsFilterValues}
          enabled={authorsFilterEnabled}
          onToggleFilter={this.onToggleFilter}
          onAddValue={this.props.onAddFilterValue}
          onRemoveValue={this.props.onRemoveFilterValue}
          suggestions={authorsFilter}
          />

        <Filter 
          id="themesFilter"
          title="Filter by themes"
          selectedValues={this.props.themesFilterValues}
          enabled={themesFilterEnabled}
          onToggleFilter={this.onToggleFilter}
          onAddValue={this.props.onAddFilterValue}
          onRemoveValue={this.props.onRemoveFilterValue}
          suggestions={themesFilter}
          />

      </div>
    )
  }
};

export default PublicationsSearchSideBar;