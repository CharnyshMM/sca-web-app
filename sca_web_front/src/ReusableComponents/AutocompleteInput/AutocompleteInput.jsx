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
    // Update the user input and reset the rest of the state
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

    // User pressed the enter key, update the input and close the
    // suggestions
    if (e.keyCode === 13) {
      // on Enter press
      console.log("ON SUBMIT",activeSuggestion);
      this.props.onSubmit(this.state.userInput);
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
      if (activeSuggestion <= 0) {
        return;
      }

      this.setState({ 
        activeSuggestion: activeSuggestion - 1,
        userInput: this.props.getName(filteredSuggestions[activeSuggestion - 1])
       });
    }
    // User pressed the down arrow, increment the index
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

              // Flag the active suggestion with a class
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