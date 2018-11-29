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
      authenticated: false,
      token: undefined,
      is_admin: false,
      user: '',
      password: '',
      // connection: undefined,
    }
  }

  render() {
    const changeUser = (e) => {
      this.setState({ user: e.target.value });
    };

    const changePassword = (e) => {
      this.setState({ password: e.target.value });
    };

    const doLogout = () => {
       this.setState({ authenticated: false, token: undefined});
    }

    const setupConnection = (e) => {
      e.preventDefault();
      this.setState({token: undefined, authenticated: false});
      authorizeOnPythonBackend(this.state.user, this.state.password)
      .then(resolve => {
           return resolve.json();
        }
    )
      .then(
        response => {
          console.log("successfully authenticated");
          this.setState({token: response.token, authenticated: true, is_admin: response.is_admin});
        }
      ) 
      .catch(e => {
        this.setState({ error: e });
        console.log("ERROR:", e);
        alert("Cannot authorize you with these credentials");
      });    
    }


    return (
        <NeoContext.Provider value={{ connection: this.state.token, is_admin: this.state.is_admin }}>
          <Header doLogout={doLogout} authenticated={this.state.authenticated} is_admin={this.state.is_admin}/>
          
          {this.state.authenticated && <Main />}
          { (!this.state.authenticated) && 
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
