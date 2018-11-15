import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Login extends Component {
    constructor(props) {
        super(props);

        // reset login status
        this.state = {
            username: '',
            password: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        console.log('on Change!: ', name, ': ', value);
        this.setState({ [name]: value });
    }

    handleLogin() {
        const { username, password } = this.state;
        console.log('handle submit: ', username, ' :* ', password);
        if (username) {
            this.props.loginAction(username, password);
        }
    }

    render() {
        const { user } = this.props;
        return (
            <div className="Login">
                
                {!user.loggedIn && !user.loggingIn && (
                    <div>
                        <h3>Please, Log In</h3>
                        <label htmlFor="username">Username: </label>
                        <br />
                        <input type="text" required="true" className="form-control" name="username" onChange={this.handleChange} />
                        <br />
                        <label htmlFor="password">Password</label>
                        <br />
                        <input type="password" required="true"  className="form-control" name="password" onChange={this.handleChange} />
                        <br />
                        <button type="submit" onClick={this.handleLogin}>Log in</button>
                    </div>
                )
                }              
            </div>
        );
    }
}

Login.propTypes = {
    user: PropTypes.object.isRequired,
    loginAction: PropTypes.func.isRequired,
};
