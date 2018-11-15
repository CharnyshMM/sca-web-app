import { createStore } from 'redux';
import reducer from './reducer';

const initialState = {
    value: 0,
    count: 0
};
export default createStore(reducer, initialState);