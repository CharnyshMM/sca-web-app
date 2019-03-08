import React, { Component } from 'react';
import { Graph, Node } from 'react-d3-graph';
import ErrorAlert from '../ReusableComponents/ErrorAlert';

import { buildSimpleGraph } from './graph_unilities';
import CustomQueryObjectTextView from './CustomQueryObjectTextView';

import './CustomQueryGraphResultView.css';


const myConfig = {
    
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
    nodeHighlightBehavior: true,
    
    
    highlightDegree: 0,
    directed: true,
    linkHighlightBehavior:true,
};

class CustomQueryGraphResultView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nodeInfo: undefined,
            nodeInfoLock: false,
            lastNodeClickedId: undefined,
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

    onNodeClick = (nodeId) => {
        if (nodeId === this.state.lastNodeClickedId) {
            this.setState({
                nodeInfoLock: true,
                nodeInfo: this.props.unique_nodes[nodeId]
            });
        } else {
            this.setState({
                nodeInfo: this.props.unique_nodes[nodeId],
                lastNodeClickedId: nodeId,
            });
        }   
    }

    onMouseOutNode = () => {
        if (!this.state.nodeInfoLock) {
           this.setState({
                nodeInfo: null
            });
        }
    }

    onLockClick = () => {
        this.setState({
            nodeInfoLock: false,
            nodeInfo: null
        });
        
    }

    render() {
        if (this.state.hasError) {
            return (<ErrorAlert errorName="Error" errorMessage={this.state.errorMessage} />);
        }

        
        let graph = "";
        const data = buildSimpleGraph(this.props.unique_nodes, this.props.unique_links);
        graph = (<Graph
            id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
            data={data}
            config={myConfig}
            onClickNode={this.onNodeClick}
            onMouseOutNode={this.onMouseOutNode}
            style="width: 400px, height: 400px"
        />);
        
        return (
            <section className="container graph_container">
                <div className="graph_container__graph">
                {graph}
                </div>
                <div className="graph_container__node_info">
                    {this.state.nodeInfo && 
                        <React.Fragment>
                            <h3>Node info:</h3>
                            {this.state.nodeInfoLock &&
                                <span 
                                    className="graph_container__node_info__lock" 
                                    title="press to unlock &amp; clear definition"
                                    onClick={this.onLockClick}
                                    >
                                    &#128274; Locked
                                </span>
                            }
                            <CustomQueryObjectTextView object={this.state.nodeInfo} />
                        </React.Fragment>
                    }
                    {!this.state.nodeInfo &&
                        <ul className="graph_container__node_info__help">
                            <li>Click on the node to view its properties</li>
                            <li>Click on the node twice to make its definition stay here even if your mouse leaves the node</li>
                        </ul>
                    }
                </div>
            </section>
        );
    }
}


export default CustomQueryGraphResultView;