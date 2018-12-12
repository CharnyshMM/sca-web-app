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
        
        let domains = queryParams.domain; //domain!!!!!!!!!!!
        if (!Array.isArray(domains)) {
            domains = [domains];
        }
        this.setState({domains: domains});
        console.log(domains);
        const author_name = queryParams.author;

        console.log(author_name);

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
                    console.log("result", result);
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
        let author = null;
        let publications = null;
        

        if (this.state.result) {
            author = this.state.result[0]["a"]; //a is the key to author value in response json
            publications = this.state.result[0]["pub"];// pub for publications list
           
            console.log(author);
            console.log("publs:", publications);
        }
        

        return (
            <section className="container">
            {this.state.result && 
                <div>
                    <h1>{author.name}'s publications</h1>
                    <h3>On domains:</h3>
                    <HorizontalKeywordsList keywords={this.state.domains} />
                    
                    {publications && 
                        <table className="table ">
                            <thead>
                                <tr>
                                    <th  scope="col">Publication Name</th>
                                    <th  scope="col">Year</th>
                                    <th  scope="col">ISBN</th>
                                </tr>
                            </thead>
                            <tbody>
                                {publications.map((p, i)=>(
                                    <tr key={i}>
                                        <td>{p["name"]}</td>
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