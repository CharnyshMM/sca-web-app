import {
    USER_LOGGINGIN,
    USER_LOGGEDIN,
    USER_LOGIN_FAILED,
    USER_LOGGEDOUT,
} from '../actions/authorizationActions';

const initialState = {
    user: null,
    loggingIn: false,
    loggedIn: false,
    token: null,
};

export default function loginReducer(state = initialState, action) {
    console.log('loginReducer');
    console.log(' - state: ', state);
    console.log(' - action: ', action);
    switch (action.type) {
    case USER_LOGGINGIN:
        return {
            loggingIn: true,
            loggedIn: false,
            user: null,
            token: null,
        };

    case USER_LOGGEDIN:
        return {
            loggingIn: false,
            loggedIn: true,
            user: action.payload.user,
            token: action.payload.token,
        };

    case USER_LOGIN_FAILED:
    case USER_LOGGEDOUT:
        return initialState;

    default:
        return state;
    }
}
