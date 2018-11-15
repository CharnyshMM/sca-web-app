import * as React from 'react';
import {
    BrowserRouter as Router,
    HashRouter,
    Route,
    Link
} from 'react-router-dom';
import { connect } from 'react-redux';
import { action } from '../action';

function mapStateToProps(state) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        increase: (num) => { dispatch(action.increase(num)) },
        decrease: (num) => { dispatch(action.decrease(num)) }
    }
  }

export class MyCom extends React.Component {
    render() {
        return(
            <div>
                <p>value: {this.props.value}</p>
                <p>clickCount: {this.props.count}</p>
                <button onClick={() => this.props.increase(3)}>Increment 3</button>
                <button onClick={() => this.props.decrease(2)}>Decrement 2</button>
            </div>
        )
    }
}

const AA = () => (
    <div>
        <h2>AA</h2>
    </div>
)

export const Home = connect(mapStateToProps, mapDispatchToProps)(MyCom);

const Routers = () => (
    <HashRouter>
        <div>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/aa">aa</Link></li>
            </ul>
            <hr/>
            <Route exact path="/" component={Home}/>
            <Route path="/aa" component={AA}/>
        </div>
    </HashRouter>
);

export default Routers;

