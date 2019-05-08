import React, {Component} from 'react';

import { getThemesList } from '../../../utilities/verbose_loaders';
import Filter from './Filter';


import './SideBar.css';

class AuthorsSearchSideBar extends Component {
  state = {
    themesFilterEnabled: this.props.themesFilterValues.length > 0,
    themesLoading: false,
    allThemes: [],
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
      this.setState({themesLoading: false});
      console.log("ERROR:", e);
    });
  }

  onToggleFilter = e => {
    
    if (this.state.allThemes.length == 0) {
      this.loadThemesList();
    }
  
    const enabled = this.state.themesFilterEnabled;
    this.setState({themesFilterEnabled: !enabled});
    if (!enabled == false) {
      this.props.onFilterDisabled(e.target.id);
    }
  }

  render() {
    const {
      themesFilterEnabled,
      allThemes,
     } = this.state;

    return (
      <div className="sidebar search_sidebar">

        <Filter 
          id="themesFilter"
          title="Filter by themes authors contribute to"
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

export default AuthorsSearchSideBar;