import React, { Component } from 'react';

import CustomQueryGraphResponse from './CustomQueryGraphResponse';
import CustomQueryTextResponse from './CustomQueryTextResponse';
import { getUniqueNodesAndLinks, checkIfLinksAreValid } from './graph_unilities'
import ErrorAlert from '../ReusableComponents/ErrorAlert';

class CustomQueryResult extends Component {
    constructor(props) { // props.result stores result data
        super(props);
        this.state = {
            resultViewMode: "text",
        }
    }

    render() {
        
        const [uniqueNodes, uniqueLinks, others] = getUniqueNodesAndLinks(this.props.result);
        const graphViewModeAllowed = checkIfLinksAreValid(uniqueLinks, uniqueNodes);
        console.log("allow grapht", graphViewModeAllowed);
        if (this.state.hasError) {
            return <ErrorAlert errorName="Error" errorMessage="Error message" />
        }
        return (
            <section className="custom_query__result">
                {graphViewModeAllowed && (
                    <CustomQueryGraphResponse unique_nodes={uniqueNodes} unique_links={uniqueLinks} />
                )}

                {(
                    <CustomQueryTextResponse result={this.props.result} />
                )}
            </section>
        )
    }
}

export default CustomQueryResult;