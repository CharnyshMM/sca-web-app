import React, { Component } from 'react';

import CustomQueryGraphResponse from './CustomQueryGraphResponse';
import CustomQueryTextResponse from './CustomQueryTextResponse';
import { getUniqueNodesAndLinks, checkIfLinksAreValid } from './graph_unilities'
import ErrorAlert from '../ReusableComponents/ErrorAlert';

import './custom_query_result.css';

class CustomQueryResult extends Component {
    constructor(props) { // props.result stores result data
        super(props);
        this.state = {
            resultViewMode: "text",
        }
        this.onViewToggleChange = this.onViewToggleChange.bind(this);
    }

    onViewToggleChange(event) {
        if (event.target.checked) {
            this.setState({resultViewMode: "graph"});
        } else {
            this.setState({resultViewMode: "text"});
        }
    }

    render() {
        
        const [uniqueNodes, uniqueLinks, others] = getUniqueNodesAndLinks(this.props.result);
        const graphViewModeAllowed = checkIfLinksAreValid(uniqueLinks, uniqueNodes);
        console.log("allow grapht", graphViewModeAllowed);
        if (this.state.hasError) {
            return <ErrorAlert errorName="Error" errorMessage="Error message" />
        }
        let resultView = "";
        if (this.state.resultViewMode === "graph") {
            resultView = <CustomQueryGraphResponse unique_nodes={uniqueNodes} unique_links={uniqueLinks} />;
        } else {
            resultView = <CustomQueryTextResponse result={this.props.result} />
        }

        return (
            <section className="custom_query__result">
            {graphViewModeAllowed &&
                <div className="graph_visualisations_switch">
                    <span className="graph_visualisations_switch__label">
                        Graph visualisations 
                    </span>

                    <label className="switch">
                        <input onChange={this.onViewToggleChange} type="checkbox" />
                        <span className="slider round"></span>
                    </label>
                </div>
            }
            {resultView}
            </section>
        )
    }
}

export default CustomQueryResult;