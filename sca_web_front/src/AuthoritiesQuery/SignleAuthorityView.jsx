import React, { Component } from 'react';

import queryString from 'query-string';

import { getAuthorPublicationsInDomains } from '../verbose_loaders';
import HorizontalKeywordsList from '../ReusableComponents/HorizontalKeywordsList';
import {createPublicationLink, createAuthorLink} from '../utilities/links_creators';
import ErrorAlert from '../ReusableComponents/ErrorAlert';
import Spinner from '../ReusableComponents/Spinner';

class SingleAuthorityView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: undefined,
            domains: [],
            error: undefined,
            hasError: false,
            loading: false,
        }
    }

    componentDidMount() {
        //const authority_name = this.props.params.authority; 
        // getting author name from route parameter authority
        const queryParams = queryString.parse(this.props.location.search);

        let domains = queryParams.domain; //domain!!!!!!!!!!!
        if (!domains) {
            domains = [];
        }
        if (!Array.isArray(domains)) {
            domains = [domains];
        }
        this.setState({ domains: domains, loading: true });
        const author_name = queryParams.author;

        let status = null;
        const token = window.sessionStorage.getItem("token");
        getAuthorPublicationsInDomains(author_name, domains, token)
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
            .then(result => {
                console.log("responsed singleAuthority:", result, status);
                if (status == 200) {
                    this.setState({ result: result , loading: false});
                } else {
                    throw Error(result.error);
                }
            })
            .catch(e => {
                this.setState({ hasError: true, error: e , loading: false});
                console.log("ERROR", e);
            });
    }

    render() {
        let author = null;
        let publications = null;
        let publications_ids = null;
        let author_id = 0;

        if (this.state.loading) {
            return <Spinner />
        }

        if (this.state.result) {
            author = this.state.result[0]["a"]; //a is the key to author value in response json
            author_id = this.state.result[0]["author_id"];
            publications = this.state.result[0]["pub"];// pub for publications list
            publications_ids = this.state.result[0]["pub_ids"];
            console.log(author);
            console.log("publs:", publications);
        }

        return (
            <section className="container">
                {this.state.error &&
                   <ErrorAlert errorName={this.state.error.name} errorMessage={this.state.error.message} />
                }
                {this.state.result &&
                    <div>
                        <h1><a href={createAuthorLink(author_id)}>{author.name}</a>'s publications</h1>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">On domains:</h5>
                                <HorizontalKeywordsList keywords={this.state.domains} />
                            </div>
                        </div>

                        {publications &&
                            <table className="table ">
                                <thead>
                                    <tr>
                                        <th scope="col">Publication Name</th>
                                        <th scope="col">Year</th>
                                        <th scope="col">ISBN</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {publications.map((p, i) => (
                                        <tr key={i}>
                                            <td><a href={createPublicationLink(publications_ids[i])}>{p["name"]}</a></td>
                                            <td>{p["year"]}</td>
                                            <td>{p["ISBN"]}</td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        }


                    </div>
                }
            </section>
        );

    }
}

export default SingleAuthorityView;