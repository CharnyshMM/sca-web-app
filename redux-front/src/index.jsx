import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import AppCom from './components/mycom';

const App = () => {
    return(
        <Provider store={store}>
            <AppCom />
        </Provider>
    )
}

ReactDOM.render(<App />, document.getElementById('app'));
