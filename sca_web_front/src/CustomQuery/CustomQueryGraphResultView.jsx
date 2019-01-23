import React, { Component } from 'react';
import { Graph } from 'react-d3-graph';
import ErrorAlert from '../ReusableComponents/ErrorAlert';

import { buildSimpleGraph } from './graph_unilities';
import CustomQueryObjectTextView from './CustomQueryObjectTextView';



class CustomQueryGraphResultView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            node_info: undefined,
            hasError: false,
            errorMessage: "",
        };
        
    }

    componentDidCatch(error, errorInfo) {
        console.log("componentDidCatchv");
        console.log("EEERORR", error.message);
        console.log("descr", errorInfo);
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        console.log("derived state from error",error);
        let errorMessage = error.message;
        if (error.message.includes("react-d3-graph")) {
            errorMessage = "Can't draw a beautiful graph for these results :'("
        }
        return {hasError: true, errorMessage};
    }

    render() {
        const myConfig = {
            nodeHighlightBehavior: true,
            node: {
                color: 'red',
                
                highlightStrokeColor: 'blue',
                labelProperty: n => {
                    return n.label;
                }

            },
            link: {
                highlightColor: 'red'
            },
            
            highlightDegree: 0,
            directed: true,
            linkHighlightBehavior:true,
        };

        if (this.state.hasError) {
            return (<ErrorAlert errorName="Error" errorMessage={this.state.errorMessage} />);
        }
        
        const onNodeClick = nodeId => {
            this.setState({node_info: this.props.unique_nodes[nodeId]});
        }

        let graph = "";
        const data = buildSimpleGraph(this.props.unique_nodes, this.props.unique_links);
        graph = (<Graph
            id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
            data={data}
            config={myConfig}
            onClickNode={onNodeClick}
            style="width: 400px, height: 400px"
        />);
        
        return (
            <section className="container">
                <div style={{"border": "1px solid black", "overflow": "scroll"}}>
                {graph}
                </div>
                <div className="node_info" style={{"width": "800px", wordBreak: "break-word"}}>
                    {this.state.node_info && 
                        <div>
                            <h3>Node info:</h3>
                            <CustomQueryObjectTextView object={this.state.node_info} />
                        </div>
                    }
                </div>
            </section>
        );
    }
}


export default CustomQueryGraphResultView;