import React, { Component } from 'react';
import { runQueryOnPythonBackend } from '../verbose_loaders';
import queryString from 'query-string';
import { Graph } from 'react-d3-graph';

import { buildSimpleGraph, getUniqueNodesAndLinks } from './graph_unilities';



class CustomQueryGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            queryText: '',
            node_info: [],
            unique_nodes: {},
            unique_links: {},
            result: undefined,
        };
    }


    componentDidMount() {
        const queryStr = queryString.parse(this.props.location.search);

        let status = 0;
        const token = window.sessionStorage.getItem("token");
        this.setState({ error: undefined, result: undefined, queryText: queryStr.query });
        runQueryOnPythonBackend(queryStr.query, token)
            .then(result => {
                status = result.status;
                return result.response.json();
            },
                error => {
                    status = error.status;
                    return error.response.json();
                })
            .then(result => {
                console.log('responsed_Custom_query:', result, status);
                if (status == 200) {
                    const [unique_nodes, unique_links, others] = getUniqueNodesAndLinks(result);
                    this.setState({
                        result: result,
                        loading: false,
                        unique_nodes: unique_nodes,
                        unique_links: unique_links,
                        others: others
                    });

                } else {
                    console.log("I throwed an error");
                    throw Error(result.error);
                }
            },
            )
            .catch(e => {
                this.setState({ error: e, loading: false });
                console.log("ERROR:", e);
            });
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
            this.setState({node_info: this.state.unique_nodes[nodeId]});
        }
        
        if (this.state.result) {
            let data = buildSimpleGraph(this.state.unique_nodes, this.state.unique_links);
            graph = (<Graph
                id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                data={data}
                config={myConfig}
                onClickNode={onNodeClick}
                style="width: 400px, height: 400px"
            />);
        }


        return (
            <section className="container">
                <h3>query {this.state.queryText}</h3>
               
                {graph}
                <div className="node_info" style={{"width": "800px", wordBreak: "break-word"}}>
                    {JSON.stringify(this.state.node_info)}
                </div>
            </section>
        );
    }
}


export default CustomQueryGraph;