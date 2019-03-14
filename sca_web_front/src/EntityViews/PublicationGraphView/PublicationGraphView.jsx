import React, {Component} from 'react';
import queryString from 'query-string';
import { Graph } from 'react-d3-graph';

import Spinner from '../../ReusableComponents/Spinner';
import EntityTitle from '../EntityTitle/EntityTitle';
import EntityInfo from '../EntityInfo/EntityInfo';

import './PublicationGraphView.css';
import '../EntityView.css'

import {
    createAuthorLink, 
    createPublicationLink,
    createAuthoritiesInDomainsLink,
} from '../../utilities/links_creators';

import {getPublication} from '../../verbose_loaders';
import ErrorAlert from '../../ReusableComponents/ErrorAlert';

const p = {
    id: "p",
    label:"Mathematical models in biology. An introduction",
    "extension": "pdf",
    "pages": 385,
    "sha256": "057F92698B4A58A298667F470936D4E4358F2DD923C543F9B7105BB6244549A7",
    "ISBN": 1,
    "year": 2003,
    "name": "Mathematical models in biology. An introduction",
    "publisher": "Cambridge University Press",
    "language": "English",
    "tags": [
      ""
    ]
  };
  
  const a = {
    id: "a",
    cx: 20,
    cy: 0,
    size: "2000",
    color: "green",
    label: "Elizabeth",
    "name": "Elizabeth S. Allman, John A. Rhodes",
    "quote": -1.0097665327249443
  };
  
  const themes = [
    {
      "id": "1",
      "label": "Clinics",
      "name": "Clinics"
    }
    ,
    {
      "id": "2",
      "label": "Intelligence",
      "name": "Intelligence"
    }
    ,
    {
      id: "3",
      "label": "Molecular",
      "name": "Molecular analysis"
    }
    ,
    {
      id: "4",
      "label": "Molecular",
      "name": "Biology"
    }
    ,
    {
      id: "5",
      "name": "Programming"
    }
    ,
    {
      id: "6",
      "name": "Statistical learning"
    }
    ,
    {
      id: "7",
      "name": "Computer science"
    }
    ];
  
  const relations = [
    {
      source: "a",
      target: "p"
    },
    {
      source: "p",
      target: "1",
    },
    {
      source: "p",
      target: "2",
    },
    {
      source: "p",
      target: "3",
    },
    {
      source: "p",
      target: "4",
    }
  ];
  
  const GraphConfig = {
    node: {
        color: 'red',
        
        highlightStrokeColor: 'blue',
        labelProperty: n => {
          if (n.label)
            return n.label;
          else
            return n.name;
        }
  
    },
    link: {
        highlightColor: 'red'
    },
    nodeHighlightBehavior: true,
    highlightDegree: 0,
    directed: true,
    linkHighlightBehavior:true
  };

class PublicationGraphView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            result: undefined,
            error: undefined,
            hasError: false,
        };
        
    }

    
    // componentDidMount() {
    //     this.setState({loading: true, result: undefined, error: undefined, hasError: false});
    //     const token = window.sessionStorage.getItem("token");
    //     const queryParams = queryString.parse(this.props.location.search);
    //     let status = 0;
    //     getPublication(queryParams.publication, token)
    //         .then(
    //             result => {
    //                 status = result.status;
    //                 return result.response.json();
    //             },
    //             error => {
    //                 status = error.status;
    //                 return error.response.json();
    //             }
    //         )
    //         .then(
    //             response => {
    //                 if (status != 200) {
    //                     throw new Error(response.error);
    //                 }
    //                 console.log('responsed:', response);
    //                 this.setState({ result: response, loading: false });
    //               },
    //         )
    //         .catch(
    //             e => {
    //                 this.setState({ error: e, hasError: true, loading: false });

    
    // componentDidMount() {
    //     this.setState({loading: true, result: undefined, error: undefined, hasError: false});
    //     const token = window.sessionStorage.getItem("token");
    //     const queryParams = queryString.parse(this.props.location.search);
    //     let status = 0;
    //     getPublication(queryParams.publication, token)
    //         .then(
    //             result => {
    //                 status = result.status;
    //                 return result.response.json();
    //             },
    //             error => {
    //                 status = error.status;
    //                 return error.response.json();
    //             }
    //         )
    //         .then(
    //             response => {
    //                 if (status != 200) {
    //                     throw new Error(response.error);
    //                 }
    //                 console.log('responsed:', response);
    //                 this.setState({ result: response, loading: false });
    //               },
    //         )
    //         .catch(
    //             e => {
    //                 this.setState({ error: e, hasError: true, loading: false });
    //                 console.log("ERROR:", e);
    //             }
    //         );
    // }

    onClickedNode = nodeId => {

    }

    render() {
        const {result, error, hasError, loading} = this.state; 

        if (hasError) {
            return <ErrorAlert errorName={error.name} errorMessage={error.message} />
        }
        if (loading) {
            return <Spinner /> 
        }

        const data = {
            nodes: [a, p, ...themes],
            links: relations
          };

        GraphConfig.height = window.innerHeight*0.8;
        GraphConfig.width = window.innerWidth;
        return (
            <section style={{position: "relative", padding: "1% 10%"}}>
                <EntityTitle title={p.name}/>
                <EntityInfo>
                    <ul>
                        <li>
                            year <b>{p.year}</b>
                        </li>
                        <li>
                            language <b>{p.language}</b>
                        </li>   
                    </ul>
                </EntityInfo>

            
                <div style={{position: "absolute", left: 0}}>
                    <Graph id="graph" data={data} config={GraphConfig} />
                    
                </div>
            </section>
        );
    }
}

export default PublicationGraphView;