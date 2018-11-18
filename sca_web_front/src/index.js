import 'bootstrap';
import React from 'react';
import ReactDOM from 'react-dom';
import 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/cypher/cypher';
import { BrowserRouter } from 'react-router-dom';
import Modal from 'react-modal';

import './index.css';
import App from './App';

Modal.setAppElement('#root');

ReactDOM.render((
  <BrowserRouter>
    <App/>
  </BrowserRouter>
), document.getElementById('root'));
