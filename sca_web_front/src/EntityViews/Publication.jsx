import React, {Component} from 'react';
import queryString from 'query-string';

import {
    createAuthorLink, 
    createPublicationLink,
    createAuthoritiesInDomainsLink,
} from '../utilities/links_creators';

import { getPublication } from '../utilities/verbose_loaders';
import HorizontalKeywordsList from '../ReusableComponents/HorizontalKeywordsList';
import ErrorAlert from '../ReusableComponents/ErrorAlert';
import GraphResultView from '../ReusableComponents/GraphResultView/GraphResultView';
import { getUniqueNodesAndLinksPlainList, checkIfLinksAreValid } from '../ReusableComponents/GraphResultView/graph_unilities';

class Publication extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            result: undefined,
            error: undefined,
            hasError: false,
        };
    }
    
    componentDidMount() {
        this.setState({loading: true, result: undefined, error: undefined, hasError: false});
        const token = window.sessionStorage.getItem("token");
        const queryParams = queryString.parse(this.props.location.search);
        let status = 0;
        getPublication(queryParams.publication, token)
            .then(
                result => {
                    status = result.status;
                    return result.response.json();
                },
                error => {
                    status = error.status;
                    return error.response.json();
                }
            )
            .then(
                response => {
                    if (status != 200) {
                        throw new Error(response.error);
                    }
                    console.log('responsed:', response);
                    this.setState({ result: response, loading: false });
                  },
            )
            .catch(
                e => {
                    this.setState({ error: e, hasError: true, loading: false });
                    console.log("ERROR:", e);
                }
            );
    }

    render() {
        let {result, error, hasError} = this.state; 
        
        let content = null;
        if (result) {
            
            const [uniqueNodes, uniqueLinks, others] = getUniqueNodesAndLinksPlainList(result["linked_publications_graph"]);
            result = result["general"];

            const graphViewModeAllowed = checkIfLinksAreValid(uniqueLinks, uniqueNodes);
            
            const linked_pubs = result["linked_publications"].map((v, i)=> 
                    <li key={i}><a href={createPublicationLink(result["linked_publications_ids"][i])}>{v["name"]}</a></li>
                );

            const domains = result["themes"].map(v => v["name"]);

            const authors = [];
            for(let i = 0; i < result["authors"].length; i++) {
                const author = result["authors"][i];
                if (author != null) {
                    authors.push( <a href={createAuthorLink(result["authors_ids"][i])}>{result["authors"][i]["name"]}</a>);
                    authors.push(<br />);
                }
            }


            content = (
                <section className="container">
                    <h1>{result["publication"]["name"]}</h1>
                    {authors.length > 0 &&
                        <h3>by {authors}</h3>
                    }
                    <hr/>
                    {domains.length > 0 &&
                        <React.Fragment>
                            <h5 className="card-title">On Domains:</h5> 
                            <HorizontalKeywordsList keywords={domains} />                          
                            <span><a href={createAuthoritiesInDomainsLink(domains)}>Find experts in those domains</a></span>
                            <hr/>
                        </React.Fragment>
                    }
                    
                    <p>year <b>{result["publication"]["year"]}</b></p>
                    <p>ISBN: <b>{result["publication"]["ISBN"]}</b></p>
                    <p>in <b>{result["publication"]["language"]}</b> language</p>
                    <p>{result["publication"]["pages"]} pages</p>
                    {linked_pubs && linked_pubs.length > 0 && 
                        <React.Fragment>
                            <h3>Refers publications</h3>
                            <ul>
                                {linked_pubs}
                            </ul>
                        </React.Fragment>
                    }

                    {graphViewModeAllowed &&
                        <React.Fragment>
                        <h3>Citation graph</h3>
                        <GraphResultView unique_nodes={uniqueNodes} unique_links={uniqueLinks} />
                        </React.Fragment>
                    }
                </section>
            )
        } else if (hasError) {
            content = (
                <ErrorAlert errorName={error.name} errorMessage={error.message} />
                );
        }
        return (
            <React.Fragment>
                {content}
            </React.Fragment>
        );
    }
}

export default Publication;