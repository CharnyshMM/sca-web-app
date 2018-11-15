import React, { Component } from 'react';
import { connect } from 'react-redux';


class LayoutContainer extends Component {
    render() {
        return (
            <Layout />
        );
    }
}

const mapStateToProps = store => ({
    loading: false,
    authorized: false,
});

export default connect(mapStateToProps)(LayoutContainer);