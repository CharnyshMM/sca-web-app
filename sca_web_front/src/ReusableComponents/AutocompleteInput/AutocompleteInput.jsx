import React, {Component, Fragment} from 'react';
// import PropTypes from "prop-types";


import './AutocompleteInput.css';

class AutocompleteInput extends Component {
  state = {
    // The active selection's index
    activeSuggestion: 0,
    // The suggestions that match the user's input
    filteredSuggestions: [],
    // Whether or not the suggestion list is shown
    showSuggestions: false,
    // What the user has entered
    userInput: ""
  };

  onInputChange = e => {
    const userInput = e.target.value;
    
    if ([';', ',', '.'].includes(userInput[userInput.length - 1])) {
      this.props.onSubmit(userInput.slice(0, -1));
      this.setState({userInput: ""});
      return;
    }

    const filteredSuggestions = this.props.suggestions.filter(
      value =>
        value.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput: userInput
    });
  }

  onSuggestionListItemClick = e => {
    // Update the user input and reset the rest of the state
    this.setState({
      activeSuggestion: -1,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e.currentTarget.innerText
    });
  };


  onKeyDown = e => {
    const { activeSuggestion, filteredSuggestions } = this.state;

    // User pressed the enter key, update the input and close the
    // suggestions
    if (e.keyCode === 13) {
      // on Enter press
      this.props.onSubmit(filteredSuggestions[activeSuggestion]);
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: ""
      });
      return;
    }
    // User pressed the up arrow, decrement the index
    else if (e.keyCode === 38) {
      // on UP ARROW
      if (activeSuggestion === 0) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion - 1 });
    }
    // User pressed the down arrow, increment the index
    else if (e.keyCode === 40) {
      // on DOWN ARROW
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  }

  render() {
    const {showSuggestions, userInput, activeSuggestion, filteredSuggestions} = this.state;

    let suggestionsListComponent = null;
    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul className="suggestions">
            {filteredSuggestions.map((suggestion, index) => {
              let className;

              // Flag the active suggestion with a class
              if (index === activeSuggestion) {
                className = "suggestion-active";
              }

              return (
                <li
                  className={className}
                  key={suggestion}
                  onClick={this.onSuggestionListItemClick}
                >
                  {suggestion}
                </li>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          <div class="no-suggestions">
            <em>No suggestions, you're on your own!</em>
          </div>
        );
      }
    }

    return ( 
    <Fragment>
      <input
          type="text"
          className="form-control" placeholder="Domain"
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