import React, { Component } from 'react';
import queryString from 'query-string';

import {
    createPublicationLink,
    createAuthoritiesInDomainsLink,
} from '../utilities/links_creators';

import { getAuthor } from '../verbose_loaders';

import './author.css';


class Author extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            result: undefined,
            error: undefined,
        };
    }

    componentDidMount() {
        const token = window.sessionStorage.getItem("token")
        const queryStr = queryString.parse(this.props.location.search);
        let status = 0;
        getAuthor(queryStr.author, token)
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
                    this.setState({ result: response });
                },
        )
            .catch(
                e => {
                    this.setState({ error: e });
                    console.log("ERROR:", e);
                }
            );

    }

    render() {
        /*
            result structure:
             {
                 author: {neo_author},
                 major_domains: {[{domains:[], publications_in_domains}]}
                 top_cited_publications: [{publication, publication_id, links_count}]
             }
        */

        let content = null;
        if (this.state.result) {

            let domains_listItems = this.state.result["major_domains"].map((p,i) => (
                <li key={i}>
                    {p["publications_in_domains"].length} publication(s) on {p["domains"].map(v =><span className="author__domain_item">{v["name"]}</span>)}
                     
                    <a href={createAuthoritiesInDomainsLink(p["domains"].map(v=>v["name"]))}>Find experts</a>
                </li>
            ));

            let top_cited_publications_listItems = this.state.result["top_cited_publications"].map((v,i)=>(
                <li><a href={createPublicationLink(v["publication_id"])}>{v["publication"]["name"]}</a></li>
            ));
            content = (
                <section className="container">
                    <h1>{this.state.result["author"]["name"]}</h1>
                   
                    <h5 className="card-title">Majors in domains:</h5>
                    {domains_listItems && domains_listItems.length > 0 &&
                        <ul>
                            {domains_listItems}
                        </ul>
                    }
                    {top_cited_publications_listItems && top_cited_publications_listItems.length > 0 && 
                    (<section>
                        <h3>TOP CITED PUBLICATIONS:</h3>
                        <ul>
                            {top_cited_publications_listItems}
                        </ul>
                    </section>
                    )
                    }
                    
                </section>
            );
        } else if (this.state.error) {
            content = (
                <div className="alert alert-warning mt-3" role="alert">
                    <h4 className="alert-heading">{this.state.error.name}</h4>
                    <pre><code>{this.state.error.message}</code></pre>
                </div>
            );
        }
        return (
            <section>
                {content}
            </section>
        );
    }
}

export default Author;