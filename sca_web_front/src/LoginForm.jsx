import React from 'react';

const LoginForm = ({userName, onUserNameChange, password, onPasswordChange, onSubmit}) => (
  <form onSubmit={onSubmit}>
                <h5>Log in, please</h5>
                <div className="form-group row col-md-5">
                  <label htmlFor="user-input">User</label>
                  <input id="user-input" type="text" value={userName} onChange={onUserNameChange} className="form-control"/>
                </div>

                <div className="form-group row col-md-5">
                  <label htmlFor="password-input">Password</label>
                  <input id="password-input" type="password" value={password} onChange={onPasswordChange} className="form-control"/>
                </div>

                <button type="submit" className="btn btn-primary">Connect</button>

            </form>
);

export default LoginForm;