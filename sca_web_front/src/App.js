 import React, { Component } from 'react';

import Header from './Header';
import Main from './Main';
import AutocompleteContext from './AutocompleteContext';
import { authorizeOnPythonBackend } from './loaders';

import './App.css';
import ErrorBoundary from './ReusableComponents/ErrorBoundary';
import LoginForm from './LoginForm';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authorized: false,
      isAdmin: false,
      user: '',
      password: '',
      allAuthors: [],
      allThemes: [],
    }
  }

  componentDidMount() {
    this.setState({
      authorized: window.sessionStorage.getItem("isAuthorized"),
      isAdmin: window.sessionStorage.getItem("isAdmin")
    })
    console.log("isAdmins in SS", window.sessionStorage.getItem("isAdmin"));
  }

  onUserNameChange = e => {
    this.setState({ user: e.target.value });
  };

  onPasswordChange = e => {
    this.setState({ password: e.target.value });
  };

  doLogout = () => {
    window.sessionStorage.removeItem('token');
    window.sessionStorage.removeItem('isAuthorized');
    window.sessionStorage.removeItem('isAdmin');
    this.setState({ authorized: false, token: undefined});
  }

  onLoginClick = e => {
    e.preventDefault();
    this.setState({isAdmin: false, authorized: false});
    authorizeOnPythonBackend(this.state.user, this.state.password)
    .then(resolve => {
         return resolve.json();
      }
  )
    .then(
      response => {
        window.sessionStorage.setItem("token", response.token);
        window.sessionStorage.setItem("isAuthorized", true);
        window.sessionStorage.setItem("isAdmin", response.is_admin);
        this.setState({authorized: true, isAdmin: response.is_admin})
      }
    ) 
    .catch(e => {
      this.setState({ error: e , authorized: false, isAdmin: false});
      console.log("ERROR:", e);
      alert("Cannot authorize you with these credentials");
    });    
  }

  render() {
    var isAuthorized = window.sessionStorage.getItem("isAuthorized")== "true" ||  window.sessionStorage.getItem("isAuthorized") === true;
    var isAdmin = window.sessionStorage.getItem("isAdmin") == "true" ||  window.sessionStorage.getItem("isAdmin") === true;
    
    const {userName, password} = this.state;
    
    console.log("isAdmin", isAdmin);
    return (
        <div>
          <Header doLogout={this.doLogout} authenticated={isAuthorized} is_admin={isAdmin}/>
          
          {this.state.authorized && 
            <ErrorBoundary>
              <Main />
            </ErrorBoundary>
          }
          {!this.state.authorized && 
            <div className="container">
              <LoginForm 
                onSubmit={this.onLoginClick}
                userName={userName} 
                onUserNameChange={this.onUserNameChange} 
                password={password} 
                onPasswordChange={this.onPasswordChange} 
                />
            </div>
            }       
        </div>
    );
  }
}

export default App;
