import React, { Component } from 'react';
import { getNeoStatus, getCassandraStatus } from '../../utilities/verbose_loaders';


class Status extends Component {
    constructor(props) {
        super(props);
        this.state = {
           cassandraStatus: null,
           neoStatus: null,
           neoStatusLoading: false,
           cassandraStatusLoading: false,
        }
        this.abortController = new window.AbortController();
    }

    

    updateStatus() {
        this.setState({cassandraStatusLoading: true});
        getCassandraStatus(this.abortController.signal)
            .then(result => result.response.json()) // getting the response text
            .then(result => {
                console.log("cassandra result", result);
                this.setState({cassandraStatus: {
                    publicationsCount: result.publicationsCount,
                    responsesCount: result.responsesCount,
                    documentsCount: result.documentsCount
                },
                cassandraStatusLoading: false,
                });
            },
                error => {
                    if (error.name === 'AbortError') { return; } 
                    console.log("fetch error")
                    this.setState({hBaseStatus: undefined, cassandraStatusLoading: false,});
            });

        this.setState({neoStatusLoading: true});
        const token = window.sessionStorage.getItem("token");
        getNeoStatus(token, this.abortController.signal)
            .then(result=> result.response.json())
            .then(res => {
                    console.log("result OK:", res);
                    this.setState({neoStatus: 
                        {
                            nodesCount: res.nodesCount,
                            authorsCount: res.authorsCount,
                            publicationsCount: res.publicationsCount, 
                        },
                        neoStatusLoading: false,    
                    });
                },
                  error => {
                      if (error.name === 'AbortError') { return; } 
                      console.log("err : ", error);
                      this.setState({neoStatus: undefined, neoStatusLoading: false,}); 
            });
    }

    componentDidMount() {
        this.updateStatus();
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    render() {
       
        const getStringStatus = function (isOk, isLoading) {           
            if (isLoading) {
                return (
                    <div>
                        <span className="spinner-grow spinner-grow-sm" role="status"> </span>
                         Loading...
                    </div>
                );
            }

            if (isOk) {
                return <span className="text-success">OK</span>;
            } else {
                return <span className="text-danger">
                <span className="spinner-grow spinner-grow-sm" role="status"> </span>
                 No connection
                </span>
            }
        }

        const hbaseConnectionStatus = getStringStatus(this.state.cassandraStatus, this.state.cassandraStatusLoading);
        const neo4jConnectionStatus = getStringStatus(this.state.neoStatus, this.state.neoStatusLoading);
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
                        Cassandra
                    </td>
                    <td className="col">
                        {hbaseConnectionStatus}
                    </td>

                    <td className="col">
                        <ul className="list-group">
                            <li className="list-group-item">
                                Publications Count: {this.state.cassandraStatus ? this.state.cassandraStatus.publicationsCount : "-"}
                            </li>
                            <li className="list-group-item">
                                Responses Count: {this.state.cassandraStatus ? this.state.cassandraStatus.responsesCount : "-"}
                            </li>
                            <li className="list-group-item">
                                Documents Count: {this.state.cassandraStatus ? this.state.cassandraStatus.documentsCount : "-"}
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

// export default props => (
//     <NeoContext.Consumer>
//       {({ connection }) => <Status {...props} connection={connection}/>}
//     </NeoContext.Consumer>
//   );


export default Status;