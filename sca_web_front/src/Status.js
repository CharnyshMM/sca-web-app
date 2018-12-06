import React, { Component } from 'react';

import NeoContext from './NeoContext';
import { getNeoStatus, getHBaseStatus } from './loaders';


class Status extends Component {
    constructor(props) {
        super(props);
        this.state = {
           hBaseStatus: null,
           neoStatus: null,
        }
    }

    componentDidMount() {
        getHBaseStatus()
            .then(result => result.json()) // getting the response text
            .then(result => {
                
                this.setState({hBaseStatus: {
                    hbasePublications: result.hbasePublications, // getting publications count from recieved text 
                    documents: result.documents,
                    texts: result.texts,
                    filteredTexts: result.filteredTexts,
                }
                });
            },
                error => {
                    console.log("fetch error")
                    this.setState({hBaseStatus: undefined});
            });
        getNeoStatus(this.props.connection)
            .then(result=> result.json())
            .then(res => {
                    console.log("result OK:", res);
                    this.setState({neoStatus: 
                        {
                            nodesCount: res.nodesCount,
                            authorsCount: res.authorsCount,
                            publicationsCount: res.publicationsCount, 
                        }    
                    });
                },
                  err => {
                      console.log("err : ", err);
                      this.setState({neoStatus: undefined}); 
            });
    }

    render() {
        
        const getStringStatus = function (isOk) {
            if (isOk) {
                return <span className="text-success">"OK"</span>;
            } else {
                return <span className="text-danger">"No connection"</span>
            }
        }

        const hbaseConnectionStatus = getStringStatus(this.state.hBaseStatus);
        const neo4jConnectionStatus = getStringStatus(this.state.neoStatus);
        return (
            <div className='container'>
            <h1>Components Status:</h1>
            <table className="table">
            <thead>
                <tr className="row">
                    <th className="col">Component</th>
                    <th className="col">Status</th>
                    <th className="col">Info</th>
                </tr>
            </thead>

            <tbody>
                <tr className="row">
                    <td className="col">
                        HBase
                    </td>
                    <td className="col">
                        {hbaseConnectionStatus}
                    </td>

                    <td className="col">
                        <ul className="list-group">
                            <li className="list-group-item">
                                Publications Count: {this.state.hBaseStatus ? this.state.hBaseStatus.hbasePublications : "-"}
                            </li>
                            <li className="list-group-item">
                                Documents: {this.state.hBaseStatus ? this.state.hBaseStatus.documents : "-"}
                            </li>
                            
                            <li className="list-group-item">
                                Texts: {this.state.hBaseStatus ? this.state.hBaseStatus.texts : "-"}
                            </li>

                            
                            <li className="list-group-item">
                                Filtered Texts: {this.state.hBaseStatus ? this.state.hBaseStatus.filteredTexts : "-"}
                            </li>
                        </ul>
                    </td>
                </tr>
                <tr className="row">
                    <td className="col">
                        Neo4j
                    </td>
                    <td className="col">
                        {neo4jConnectionStatus}
                    </td>

                    <td className="col">
                        <ul className="list-group">
                            <li className="list-group-item">
                                Nodes Count: {this.state.neoStatus ? this.state.neoStatus.nodesCount : "-"}
                            </li>
                            <li className="list-group-item">
                                Authors Count: {this.state.neoStatus ? this.state.neoStatus.authorsCount : "-"}
                            </li>
                            <li className="list-group-item">
                                Publications Count: {this.state.neoStatus ? this.state.neoStatus.publicationsCount : "-"}
                            </li>
                        </ul>
                    </td>
                </tr>

            </tbody>
            </table>
            </div>
        )
    }
}

export default props => (
    <NeoContext.Consumer>
      {({ connection }) => <Status {...props} connection={connection}/>}
    </NeoContext.Consumer>
  );
