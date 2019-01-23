import React, {Component} from 'react';
import queryString from 'query-string';

import {
    createAuthorLink, 
    createPublicationLink,
    createAuthoritiesInDomainsLink,
} from '../utilities/links_creators';

import {getPublication} from '../verbose_loaders';
import HorizontalKeywordsList from '../ReusableComponents/HorizontalKeywordsList';

class Publication extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            result: undefined,
            error: undefined,
        };
    }
    
    componentDidMount() {
        this.setState({loading: true, result: undefined, error: undefined});
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
        let content = null;
        if (this.state.result) {
            
            let linked_pubs = this.state.result["linked_publications"].map((v, i)=> 
                    <li key={i}><a href={createPublicationLink(this.state.result["linked_publications_ids"][i])}>{v["name"]}</a></li>
                );

            let domains = this.state.result["themes"].map(v => v["name"]);

            console.log(linked_pubs);
            content = (
                <section className="container">
                    <h1>{this.state.result["publication"]["name"]}</h1>
                    <h3>by <a href={createAuthorLink(this.state.result["authors_ids"][0])}>{this.state.result["authors"][0]["name"]}</a></h3>
                    
                    <hr/>
                    <h5 className="card-title">On Domains:</h5> 
                    <HorizontalKeywordsList keywords={domains} />
                    {domains && domains.length > 0 &&
                        <span><a href={createAuthoritiesInDomainsLink(domains)}>Find experts in those domains</a></span>
                    }
                    <hr/>
                    <p>year <b>{this.state.result["publication"]["year"]}</b></p>
                    <p>ISBN: <b>{this.state.result["publication"]["ISBN"]}</b></p>
                    <p>in <b>{this.state.result["publication"]["language"]}</b> language</p>
                    <p>{this.state.result["publication"]["pages"]} pages</p>
                    {linked_pubs && linked_pubs.length > 0 && 
                    <section>
                        <h3>REFERS PUBLICATIONS</h3>
                        <ul>
                            {linked_pubs}
                        </ul>
                    </section>
                    }
                </section>
            )
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

export default Publication;