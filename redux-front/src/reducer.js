import {action, actionName} from './action';

export default function reducer(state = {value: 0, count: 0}, action) {
    switch (action.type) {
        case actionName.INC:
            console.log(state)
            return {value: state.value+action.plusAmount, count: state.count+1}
        case actionName.DEC:
            return {value: state.value-action.minusAmount, count: state.count+1}
        default:
            return state;
    }
}