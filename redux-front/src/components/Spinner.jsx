import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
// import '../styles/styles.less';

class Spinner extends Component {
    render() {
        return (
            <CircularProgress className="spinner" size={50} />
        );
    }
}

export default Spinner;
