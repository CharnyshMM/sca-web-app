import React, {Component, Fragment} from 'react';
// import PropTypes from "prop-types";


import './AutocompleteInput.css';

class AutocompleteInput extends Component {
  state = {
    activeSuggestion: -1,
    filteredSuggestions: [],
    showSuggestions: false,
    userInput: ""
  };

  onInputChange = e => {
    const userInput = e.target.value;

    const filteredSuggestions = this.props.suggestions.filter(
      value =>
        this.props.getName(value).toLowerCase().startsWith(userInput.toLowerCase())
    );

    this.setState({
      activeSuggestion: -1,
      filteredSuggestions,
      showSuggestions: true,
      userInput: userInput
    });
  }

  onSuggestionListItemClick = index => {
    this.props.onSubmit(this.state.filteredSuggestions[index]);
    this.setState({
      activeSuggestion: -1,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: ""
    });
  };


  onKeyDown = e => {
    const { activeSuggestion, filteredSuggestions } = this.state;

    if (e.keyCode === 13) {
      // on Enter press
      this.props.onSubmit(this.state.userInput);
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: ""
      });
      return;
    }
    else if (e.keyCode === 38) {
      // on UP ARROW
      if (activeSuggestion <= 0) {
        return;
      }

      this.setState({ 
        activeSuggestion: activeSuggestion - 1,
        userInput: this.props.getName(filteredSuggestions[activeSuggestion - 1])
       });
    }
    else if (e.keyCode === 40) {
      // on DOWN ARROW
      if (activeSuggestion + 1 >= filteredSuggestions.length) {
        return;
      }
      
      this.setState({ 
        activeSuggestion: activeSuggestion + 1,
        userInput: this.props.getName(filteredSuggestions[activeSuggestion+1])
      });
    }
  }

  render() {
    const {showSuggestions, userInput, activeSuggestion, filteredSuggestions} = this.state;

    let suggestionsListComponent = null;
    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul className="suggestions" ref={this.scrollableSuggestionsList}>
            {filteredSuggestions.map((suggestion, index) => {
              let className;

              if (index === activeSuggestion) {
                className = "suggestion-active";
              }

              return (
                <li
                  className={className}
                  key={this.props.getName(suggestion)}
                  onClick={() => this.onSuggestionListItemClick(index)}
                >
                  {this.props.getName(suggestion)}
                </li>
              );
            })}
          </ul>
        );
      }
    }

    return ( 
    <Fragment>
      <input
          type="text"
          className="autocomplete_input" placeholder="Start typing"
          onChange={this.onInputChange}
          onKeyDown={this.onKeyDown}
          value={userInput}
        />
        {suggestionsListComponent}
    </Fragment>
    );
  }
};

export default AutocompleteInput;