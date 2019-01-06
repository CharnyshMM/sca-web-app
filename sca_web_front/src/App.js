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
      authorized: false, //!!!!!!!!!!!!
      is_admin: false,  // !!!!!!!!!!!!!!
      user: '',
      password: '',
    }
  }

  componentDidMount() {
    this.setState({
      authorized: true, // window.sessionStorage.getItem("isAuthorized"),
      is_admin: true, //window.sessionStorage.getItem("isAdmin")
    })
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
      this.setState({is_admin: false, authorized: false});
      authorizeOnPythonBackend(this.state.user, this.state.password)
      .then(resolve => {
           return resolve.json();
        }
    )
      .then(
        response => {
          console.log("successfully authorized");
          window.sessionStorage.setItem("token", response.token);
          window.sessionStorage.setItem("isAuthorized", true);
          window.sessionStorage.setItem("isAdmin", response.is_admin);
          this.setState({authorized: true, is_admin: response.is_admin})
        }
      ) 
      .catch(e => {
        this.setState({ error: e });
        console.log("ERROR:", e);
        alert("Cannot authorize you with these credentials");
      });    
    }
    var isAuthorized = true ;//window.sessionStorage.getItem("isAuthorized");
    var isAdmin = true; // window.sessionStorage.getItem("isAdmin");

    return (
        <NeoContext.Provider value={{ connection: this.state.token, is_admin: isAdmin }}>
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
        </NeoContext.Provider>
    );
  }
}

export default App;
