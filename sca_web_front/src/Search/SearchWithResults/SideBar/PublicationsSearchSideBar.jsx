import React, {Component} from 'react';

import {getThemesList, getAuthorsList} from '../../../verbose_loaders';
import Filter from './Filter';


import './SideBar.css';

class PublicationsSearchSideBar extends Component {
  state = {
    authorsFilterEnabled: false,
    authorsFilterSelections: [],
    themesFilterEnabled: false,
    themesFilterSelections: [],
    incomingRefsFilterEnabled: false,
    incomingRefsFilterSelections: [],
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
            allAuthors: result,
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
            allThemes: result,
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
    this.setState({[key]: !enabled})
  }

  onAddFilterItem = (id, value) => {
    console.log("onAddFilter", id, value);
    const key = `${id}Selections`;
    const selections = this.state[key];
    this.setState({[key]: [ ...selections, value]})
  }

  onRemoveFilterItem = (id, value) => {
    const key = `${id}Selections`;
    const selections = this.state[key];
    this.setState({[key]: selections.filter(s => s != value)});
  }

  render() {
    const {
      authorsFilterEnabled, 
      authorsFilterSelections,
      themesFilterEnabled,
      themesFilterSelections,
      incomingRefsFilterEnabled,
      incomingRefsFilterSelections,
      allAuthors,
      allThemes,
     } = this.state;

    const anyFilterNotEmpty = (authorsFilterEnabled && authorsFilterSelections && authorsFilterSelections.length > 0) ||
     (themesFilterEnabled && themesFilterSelections && themesFilterSelections.length > 0) ||
     (incomingRefsFilterEnabled && incomingRefsFilterSelections && incomingRefsFilterSelections.length > 0);
    return (
      <div className="sidebar search_sidebar">
        <Filter 
          id="authorsFilter"
          title="Filter by authors"
          selectedValues={authorsFilterSelections}
          enabled={authorsFilterEnabled}
          onToggleFilter={this.onToggleFilter}
          onAddValue={this.onAddFilterItem}
          onRemoveValue={this.onRemoveFilterItem}
          showAndOrCheckbox={true}
          suggestions={allAuthors}
          />

        <Filter 
          id="themesFilter"
          title="Filter by themes"
          selectedValues={themesFilterSelections}
          enabled={themesFilterEnabled}
          onToggleFilter={this.onToggleFilter}
          onAddValue={this.onAddFilterItem}
          onRemoveValue={this.onRemoveFilterItem}
          showAndOrCheckbox={true}
          suggestions={allThemes}
          />

        

        {anyFilterNotEmpty && 
        <button className="search_sidebar__find_button">
          Find
        </button>
        }
      </div>
    )
  }
};

export default PublicationsSearchSideBar;