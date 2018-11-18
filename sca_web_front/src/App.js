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
      token: '',
      user: '',
      password: '',
      // connection: undefined,
    }
  }

  componentDidMount() { 
    // NeoContext.connection setting 
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

    const setupConnection = (e) => {
      e.preventDefault();
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
          this.setState({token: response.token});
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
                  <Header openConnectionSetup={openModal} isConnectionSetupOpen={this.state.isModalOpen} connected={this.state.connection}/>
                  {/* <Header connected={this.state.connection}/> */}
                  <Main/>
        </NeoContext.Provider>
        <Modal isOpen={this.state.isModalOpen} onRequestClose={closeModal} style={{
            content : {
              top                   : '50%',
              left                  : '50%',
              right                 : 'auto',
              bottom                : 'auto',
              marginRight           : '-50%',
              transform             : 'translate(-50%, -50%)'
            }
          }}>
          <form onSubmit={setupConnection}>
            <div className="modal-header">
              <h5 className="modal-title">Connection setup</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModal}>
                <span className="oi oi-x" aria-hidden="true"></span>
              </button>
            </div>
            <div className="modal-body">
              
              <div className="form-group">
                <label htmlFor="user-input">User</label>
                <input id="user-input" type="text" value={this.state.user} onChange={changeUser} className="form-control"/>
              </div>
              <div className="form-group">
                <label htmlFor="password-input">Password</label>
                <input id="password-input" type="password" value={this.state.password} onChange={changePassword} className="form-control"/>
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">Connect</button>
              <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={closeModal}>Close</button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }
}

export default App;
