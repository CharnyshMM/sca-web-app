import React, { Component } from 'react';

import CustomQueryGraphResponse from './CustomQueryGraphResultView';
import CustomQueryTextResultView from './CustomQueryTextResultView';
import { getUniqueNodesAndLinks, checkIfLinksAreValid } from './graph_unilities'
import ErrorAlert from '../ReusableComponents/ErrorAlert';
import BeautifulSwitch from '../ReusableComponents/BeautifulSwitch/BeautifulSwitch';

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
            this.setState({ resultViewMode: "graph" });
        } else {
            this.setState({ resultViewMode: "text" });
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
            resultView = <CustomQueryTextResultView result={this.props.result} />
        }

        return (
            <section className="custom_query__result">
                {graphViewModeAllowed &&
                    <BeautifulSwitch label="Graph visualizations " onSwitchChange={this.onViewToggleChange} />
                }
                {resultView}
            </section>
        )
    }
}

export default CustomQueryResult;