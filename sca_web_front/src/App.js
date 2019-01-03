 import React, { Component } from 'react';

import Header from './Header';
import Main from './Main';
import NeoContext from './NeoContext';
import { authorizeOnPythonBackend } from './loaders';

import './App.css';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {

      authorized: false,
      isAdmin: false,

      user: '',
      password: '',
    }
  }

  componentDidMount() {
    this.setState({
      authorized: window.sessionStorage.getItem("isAuthorized"),
      isAdmin: window.sessionStorage.getItem("isAdmin")
    })
    console.log("isAdmins in SS", window.sessionStorage.getItem("isAdmin"));
  }

  render() {
    const changeUser = (e) => {
      this.setState({ user: e.target.value });
    };

    const changePassword = (e) => {
      this.setState({ password: e.target.value });
    };

    const doLogout = () => {
       window.sessionStorage.removeItem('token');
       window.sessionStorage.removeItem('isAuthorized');
       window.sessionStorage.removeItem('isAdmin');
       this.setState({ authorized: false, token: undefined});
    }

    const setupConnection = (e) => {
      e.preventDefault();
      this.setState({isAdmin: false, authorized: false});
      authorizeOnPythonBackend(this.state.user, this.state.password)
      .then(resolve => {
           return resolve.json();
        }
    )
      .then(
        response => {
          console.log("successfully authorized", response);
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
    var isAuthorized = window.sessionStorage.getItem("isAuthorized")== "true" ||  window.sessionStorage.getItem("isAuthorized") === true;
    var isAdmin = window.sessionStorage.getItem("isAdmin") == "true" ||  window.sessionStorage.getItem("isAdmin") === true;
    console.log("isAdmin", isAdmin);
    return (
        <div>
          <Header doLogout={doLogout} authenticated={isAuthorized} is_admin={isAdmin}/>
          
          {this.state.authorized && <Main />}
          {!this.state.authorized && 
            <div className="container">
            <form onSubmit={setupConnection}>
                <h5>Log in, please</h5>
                <div className="form-group row col-md-5">
                  <label htmlFor="user-input">User</label>
                  <input id="user-input" type="text" value={this.state.user} onChange={changeUser} className="form-control"/>
                </div>

                <div className="form-group row col-md-5">
                  <label htmlFor="password-input">Password</label>
                  <input id="password-input" type="password" value={this.state.password} onChange={changePassword} className="form-control"/>
                </div>

                <button type="submit" className="btn btn-primary">Connect</button>

            </form>
            </div>
            }       
        </div>
    );
  }
}

export default App;
