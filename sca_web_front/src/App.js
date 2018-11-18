 import React, { Component } from 'react';
import Modal from 'react-modal';
import neo4j from "neo4j-driver/lib/browser/neo4j-web";

import Header from './Header';
import Main from './Main';
import NeoContext from './NeoContext';
import { path, user, password } from './neo_connection_config';
import { authorizeOnPythonBackend } from './loaders';

import './App.css';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      authenticated: false,
      token: undefined,
      user: '',
      password: '',
      // connection: undefined,
    }
  }

  render() {
    const closeModal = () => {
      this.setState({ isModalOpen: false });
    };

    const openModal = () => {
      this.setState({ isModalOpen: true });
    };

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
        },
        reject => {
          throw new Error("Error. Check your request & Status");
      })
      .then(
        response => {
          console.log("successfully authenticated");
          this.setState({token: response.token, authenticated: true});
        }
      ) 
      .catch(e => {
        this.setState({ error: e });
        console.log("ERROR:", e);
        alert("Cannot authorize you with these credentials");
      })    
      //this.setState({connection: neo_connection});
       this.setState(closeModal);
    }


    return (
      <div>
        <NeoContext.Provider value={{ connection: this.state.token }}>
                  <Header doLogout={doLogout} authenticated={this.state.authenticated}/>
                  {/* <Header connected={this.state.connection}/> */}
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
        {/* <Modal isOpen={this.state.isModalOpen} onRequestClose={closeModal} style={{
            content : {
              top                   : '50%',
              left                  : '50%',
              right                 : 'auto',
              bottom                : 'auto',
              marginRight           : '-50%',
              transform             : 'translate(-50%, -50%)'
            }
          }}> */}
          
        {/* </Modal> */}
      </div>
    );
  }
}

export default App;
