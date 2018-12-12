import React, { Component } from 'react';

import queryString from 'query-string';

import NeoContext from '../NeoContext';
import {getAuthorPublicationsInDomains} from '../verbose_loaders';
import HorizontalKeywordsList from '../ReusableComponents/HorizontalKeywordsList';


class SingleAuthorityView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: undefined,
            domains: [],
            error: undefined,
        }
    }

    componentDidMount () {
        //const authority_name = this.props.params.authority; // getting author name from route parameter authority
        const queryParams = queryString.parse(this.props.location.search);
        
        const domains = queryParams.domains;
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
                    this.setState ({result: result});
                } else {
                    console.log("singleAuthority throwing error", status);
                    throw Error(result.error);
                }
            })
            .catch(e => {
                this.setState({ error: e});
                console.log("ERROR", e);
            });
    }

    render() {
        const author = this.state.result["a"]; //a is the key to author value in response json
        const publications = this.state.result["pub"];// pub for publications list

        console.log(publications);
        console.log(author);

        return (
            <div className="container">
                <h1>{author["name"]}'s publications</h1>
                <h2>On domains:</h2>
                <HorizontalKeywordsList keywords={this.state.domains} /> {/*add onCLickHandler*/}

                <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>ISBN</th>
                        <th>year</th>
                    </tr>
                </thead>
                <tbody>
                {publications.map((publication, i)=> {
                    <tr>
                        <td>
                        {publication.name}
                        </td>
                        <td>
                        {publication.ISBN}
                        </td>
                        <td>
                        {publication.year}
                        </td>
                    </tr>
                })}
                </tbody>
                </table>
            </div>
        );
    }
}

export default SingleAuthorityView;