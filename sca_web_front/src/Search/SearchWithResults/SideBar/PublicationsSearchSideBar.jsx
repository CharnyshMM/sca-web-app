import React, {Component} from 'react';

import Filter from './Filter';

import './SideBar.css';

class PublicationsSearchSideBar extends Component {
  state = {
    authorsFilterEnabled: false,
    authorsFilterSelections: [],
    themesFilterEnabled: false,
    themesFilterSelections: [],
    incomingRefsFilterEnabled: false,
    incomingRefsFilterSelections: []
  }

  onToggleFilter = e => {
    const key = `${e.target.id}Enabled`;
    const enabled = this.state[key];
    this.setState({[key]: !enabled});
  }

  onAddFilterItem = (id, value) => {
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
      incomingRefsFilterSelections
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
          />

        <Filter 
          id="incomingRefsFilter"
          title="Filter by incoming references"
          selectedValues={incomingRefsFilterSelections}
          enabled={incomingRefsFilterEnabled}
          onToggleFilter={this.onToggleFilter}
          onAddValue={this.onAddFilterItem}
          onRemoveValue={this.onRemoveFilterItem}
          showAndOrCheckbox={true}
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