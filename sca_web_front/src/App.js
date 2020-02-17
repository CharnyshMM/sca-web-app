import React, { Component } from 'react';

import Header from './Header';
import Main from './Main';

import { authorizeOnPythonBackend } from './utilities/verbose_loaders';

import './App.css';
import ErrorBoundary from './ReusableComponents/ErrorBoundary';
import LoginForm from './LoginForm';


class App extends Component {
 
  state = {
      user: '',
      password: '',
      authorized: false
  }


  componentDidMount() {
    this.setState({
      authorized: window.sessionStorage.getItem("isAuthorized")
    })

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
    this.setState({ authorized: false, token: undefined });
  }

  onLoginClick = e => {
    e.preventDefault();
    this.setState({ isAdmin: false, authorized: false, error: undefined });
    let status = 0;
    authorizeOnPythonBackend(this.state.user, this.state.password)
      .then(result => {
        status = result.status;
        return result.response.json();
      },
      error => {
        status = error.status;
        console.log('some error');
        throw Error();
      }
      )
      .then(
        response => {
          window.sessionStorage.setItem("token", response.token);
          window.sessionStorage.setItem("isAuthorized", true);
          window.sessionStorage.setItem("isAdmin", response.is_admin);
          this.setState({authorized: true});
        },
        err => {
          throw(err);
        }
      )
      .catch(e => {
        this.setState({ error: e, authorized: false, isAdmin: false });
        console.log("ERROR:", e);
        if (status == 404) {
          alert("Cannot authorize you with these credentials");
        } else {
          alert("Server error, sorry");
        }
      });
  }

  render() {
    var isAuthorized = window.sessionStorage.getItem("isAuthorized") == "true" || window.sessionStorage.getItem("isAuthorized") === true;
    var isAdmin = window.sessionStorage.getItem("isAdmin") == "true" || window.sessionStorage.getItem("isAdmin") === true;

    const { userName, password } = this.state;

    console.log("isAdmin", isAdmin);
    return (
      <div>
        <Header doLogout={this.doLogout} authenticated={isAuthorized} is_admin={isAdmin} />

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
