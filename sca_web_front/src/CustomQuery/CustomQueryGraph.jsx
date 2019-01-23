import React, { Component } from 'react';
import { runQueryOnPythonBackend } from '../verbose_loaders';
import queryString from 'query-string';
import { Graph } from 'react-d3-graph';

import { buildSimpleGraph, getUniqueNodesAndLinks } from './graph_unilities';
import ErrorAlert from '../ReusableComponents/ErrorAlert';



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

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        console.log("derived state from error",error);
        let errorMessage = error.message;
        if (error.message.includes("react-d3-graph")) {
            errorMessage = "Can't draw a beautiful graph for these results :'("
        }
        return {hasError: true, errorMessage};
    }

    componentDidCatch(e){
        console.log(e);
    }

    componentDidMount() {
        const queryStr = queryString.parse(this.props.location.search);

        let status = 0;
        const token = window.sessionStorage.getItem("token");
        this.setState({ error: undefined, result: undefined, queryText: queryStr.query });
        runQueryOnPythonBackend("match (c)-[r]-() return c,r limit 10", token)
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
        
        if (this.state.hasError) {
            console.log("no errors so far");
        }

        if (this.state.result && !this.state.hasError) {
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
                {!this.state.hasError && <div>
                   
                
                    {graph}
                    <div className="node_info" style={{"width": "800px", wordBreak: "break-word"}}>
                        {JSON.stringify(this.state.node_info)}
                    </div>
                    </div>
                }
                {this.state.hasError && <h1>Erroor</h1>}
            </section>
        );
    }
}


export default CustomQueryGraph;