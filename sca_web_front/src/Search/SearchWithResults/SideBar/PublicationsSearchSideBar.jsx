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
    allThemes: [],
    allAuthors: [],
  }

  loadAuthorsList = () => {
    const token = window.sessionStorage.getItem("token");
    this.setState({authorsLoading: true});
    let status = 0;
    getAuthorsList(token)
    .then(
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
            allAuthors: result.map(v => v["name"]),
            authorsAreLoading: false,
          })
        } else {
          throw Error(result.error);
        }
      }
    )
    .catch(e => {
      this.setState({authorsLoading: false});
      console.log("ERROR:", e);
    });
  }

  loadThemesList = () => {
    const token = window.sessionStorage.getItem("token");
    this.setState({themesLoading: true});
    let status = 0;
    getThemesList(token)
    .then(
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
            allThemes: result.map(v => v["name"]),
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
    switch(e.target.id) {
      case "authorsFilter": {
        if (this.state.allAuthors.length == 0) {
          this.loadAuthorsList();
        }
        break;
      }
      case "themesFilter": {
        if (this.state.allThemes.length == 0) {
          this.loadThemesList();
        }
        break;
      }
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
      allAuthors,
      allThemes,
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
          suggestions={allAuthors}
          />

        <Filter 
          id="themesFilter"
          title="Filter by themes"
          selectedValues={this.props.themesFilterValues}
          enabled={themesFilterEnabled}
          onToggleFilter={this.onToggleFilter}
          onAddValue={this.props.onAddFilterValue}
          onRemoveValue={this.props.onRemoveFilterValue}
          suggestions={allThemes}
          />

      </div>
    )
  }
};

export default PublicationsSearchSideBar;