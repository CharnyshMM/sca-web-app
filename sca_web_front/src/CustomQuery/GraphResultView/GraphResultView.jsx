import React, { Component } from 'react';
import { Graph, Node } from 'react-d3-graph';
import ErrorAlert from '../../ReusableComponents/ErrorAlert';

import CustomQueryObjectTextView from '../../ReusableComponents/ObjectTextView';
import FullScreenGraph from './FullscreenGraph';

import './GraphResultView.css';

const GraphConfig = {
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
    
    height: 450,
    width: 620,
    highlightDegree: 0,
    directed: true,
    linkHighlightBehavior:true
};

class GraphResultView extends Component {
    state = {
        nodeInfo: undefined,
        nodeInfoLock: false,
        lastNodeClickedId: undefined,
        hasError: false,
        errorMessage: "",
        isFullScreen: false,
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        
        let errorMessage = error.message;
        if (error.message.includes("react-d3-graph")) {
            errorMessage = "Can't draw a beautiful graph for these results :'("
        }
        return {hasError: true, errorMessage};
    }

    onNodeClick = nodeId => {
        if (nodeId === this.state.lastNodeClickedId) {
            this.setState({
                nodeInfoLock: true,
                nodeInfo: this.props.uniqueNodes[nodeId],
            });
            
        } else {
            this.setState({
                nodeInfo: this.props.uniqueNodes[nodeId],
                lastNodeClickedId: nodeId,
            });
        }   
    }

    onMouseOutNode = () => {
        if (!this.state.nodeInfoLock) {
           this.setState({
                nodeInfo: null,
                data: {...this.state.data}
            });
        }
    }

    onLockClick = () => {
        this.setState({
            nodeInfoLock: false,
            nodeInfo: null
        });
    }

    onFullScreenClick = () => {
        this.setState({isFullScreen: !this.state.isFullScreen});
    }

    

    render() {
        if (this.state.hasError) {
            return (<ErrorAlert errorName="Error" errorMessage={this.state.errorMessage} />);
        }

        if (this.state.isFullScreen) {
            return (<FullScreenGraph
                      uniqueNodes={this.props.uniqueNodes}
                      uniqueLinks={this.props.uniqueLinks}
                      onClick={this.onFullScreenClick}
                    />);
        }
        
        let graph = "";
        //const data =  buildSimpleGraph(this.props.unique_nodes, this.props.unique_links);
        console.log("graph_result_View nodes",this.props.uniqueNodes);
        graph = (<Graph
            id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
            data={
                {nodes: Object.values(this.props.uniqueNodes),
                links: Object.values(this.props.uniqueLinks)
                }
            }
            config={GraphConfig}
            onClickNode={this.onNodeClick}
            onMouseOutNode={this.onMouseOutNode}
        />);
        
        return (           
            <section className="container graph_container">
                <div className="graph_container__graph">
                    <button 
                        className="graph_container__graph__fullscreen_button" 
                        onClick={this.onFullScreenClick}
                        title="Click to enter fullscreen mode"
                        >
                        <span className="oi oi-zoom-in"> </span>
                    </button>
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


export default GraphResultView;