import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loginAction } from '../actions/authorizationActions';
import Login from '../components/Login';

class LoginContainer extends Component {
    render() {
        return (
            <Login
                user={this.props.login}
                loginAction={this.props.loginAction}
            />
        );
    }
}

const mapStateToProps = store => ({
    login: store.login,
});

const mapDispatchToProps = dispatch => ({
    loginAction: (username, password) => dispatch(loginAction(username, password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
