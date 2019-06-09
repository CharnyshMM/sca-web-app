import React, { Component } from 'react';
import queryString from 'query-string';

import BeautifulChart from '../ReusableComponents/BeautifulChart/BeautifulChart';

import {
    createPublicationLink,
    createAuthorLink,
} from '../utilities/links_creators';

import { getDomain } from '../utilities/verbose_loaders';

import './author.css';


class Domain extends Component {
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
        getDomain(queryStr.domain, token)
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
                domain: {name: "13133",...}
                publications_count: 12312,
                "top_10_authors_in_domain": top_10_authors_in_domain_by_publications_count,
                "top_10_cited_publications": top_10_cited_publications
            }
        */

        let content = null;
        if (this.state.result) {

            const topCitedPublications_listItems = this.state.result["top_10_cited_publications"].map((p,i) => (
                <li key={i}>
                    <a href={createPublicationLink(p["publication_id"])}> {p["publication"]["name"]} ({p["publication"]["year"]})</a>
                </li>
            ));

            const topAuthorsByPublicationsCount = this.state.result["top_10_authors_in_domain"].map((v,i)=>(
                <li key={i}>
                    <a href={createAuthorLink(v["author_id"])}>{v["author"]["name"]}</a> has <b>{v["publications_count"]} publications</b>
                </li>
            ));

            const yearlyDynamicsChart = Object.keys(this.state.result["yearly_dynamics"])
                .map(year => ({
                    x:year,
                    y:this.state.result["yearly_dynamics"][year]
                }));
            console.log(yearlyDynamicsChart);
            content = (
                <section className="container">
                    <h1>{this.state.result["domain"]["name"]}</h1>
                   
                    <p>{this.state.result["publications_count"]} publications</p>
                    
                    {topCitedPublications_listItems && topCitedPublications_listItems.length > 0 &&
                        <React.Fragment>
                            <h5 className="card-title">
                                Most cited publications on <b>{this.state.result["domain"]["name"]}</b>:
                            </h5>
                            <ul>
                                {topCitedPublications_listItems}
                            </ul>
                        </React.Fragment>
                    }
                    {topAuthorsByPublicationsCount && topAuthorsByPublicationsCount.length > 0 && 
                        <React.Fragment>
                            <h5>Authors who majors in <b>{this.state.result["domain"]["name"]}</b>:
                            </h5>
                            <ul>
                                {topAuthorsByPublicationsCount}
                            </ul>
                        </React.Fragment>
                    }
                    <div>
                        <h5>Publications dynamics</h5>
                        <BeautifulChart data={yearlyDynamicsChart} />
                    </div>
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

export default Domain;