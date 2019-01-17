import React, { Component } from 'react';
import { runQueryOnPythonBackend } from '../verbose_loaders';
import queryString from 'query-string';
import { Graph } from 'react-d3-graph';

import { buildSimpleGraph, getUniqueNodesAndLinks } from './graph_unilities';



class CustomQueryGraphResoponse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            queryText: '',
            node_info: [],
            unique_nodes: {},
            unique_links: {},
            result: undefined,
        };
        [this.unique_nodes, this.unique_links, this.others] = getUniqueNodesAndLinks(this.props.result);
        console.log(this.unique_nodes, this.unique_nodes);
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

        let graph = "";
        
        const onNodeClick = nodeId => {
            this.setState({node_info: this.unique_nodes[nodeId]});
        }
        
        if (this.props.result) {
            let data = buildSimpleGraph(this.unique_nodes, this.unique_links);
            try {
                graph = (<Graph
                    id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                    data={data}
                    config={myConfig}
                    onClickNode={onNodeClick}
                    style="width: 400px, height: 400px"
                />);
            } catch (error) {
                console.log(error);
            }
           
        }

        

        return (
            <section className="container">
                <h3>query {this.props.queryText}</h3>
                <div style={{"border": "1px solid black", "overflow": "scroll"}}>
                {graph}
                </div>
                <div className="node_info" style={{"width": "800px", wordBreak: "break-word"}}>
                    {JSON.stringify(this.state.node_info)}
                </div>
            </section>
        );
    }
}


export default CustomQueryGraphResoponse;