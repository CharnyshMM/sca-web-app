import React, { Component } from 'react';

import { getDomainsList } from '../../utilities/verbose_loaders';
import DomainsFilter from './DomainsFilter/DomainsFilter';


class ArticlesQueryAdvancedOptions extends Component {
    state = {
        domainsFilterEnabled: false,
        domainsDict: {},
        yearsFilterEnabled: false,
        yearsFilterAfter: -1,
        yearsFilterBefore: -1,
        error: undefined,
        hasError: false,
    }

    componentDidMount() {
        const token = window.sessionStorage.getItem("token");
        let status = 0;

        this.setState({ hasError: false });
        getDomainsList(token)
            .then(
                result => {
                    status = result.status;
                    return result.response.json();
                },
                error => {
                    status = error.status;
                    return error.response.json();
                })
            .then(result => {
                if (status === 200) {
                    const domainsDict = {};
                    for (let i = 0; i < result.length; i++) {
                        domainsDict[result[i]["id"]] = {domain: result[i]["theme"], selected: false, id: result[i]["id"]};
                    }
                    this.setState({
                        domainsDict: domainsDict
                    });
                } else {
                    console.log("I throwed an error");
                    throw Error(result.error);
                }
            },
            )
            .catch(e => {
                this.setState({ error: e, hasError: true });
                console.log("ERROR:", e);
            });
    }

    onDomainSelectionChanged = domain => {
        domain["selected"] = !domain["selected"];
        this.setState({
            domainsDict: {
                ...this.state.domainsDict,
                [domain["id"]]: domain
            }
        });
    }

    onDomainsFilterToggleClick = e => {
        this.setState({domainsFilterEnabled: e.target.checked})
    }

    onSearchClick = () => {
        const selectedDomains = Object.values(this.state.domainsDict).filter(v => v.selected);

        this.props.onSearchSubmit({
            filterByDomains: this.state.domainsFilterEnabled,
            selectedDomains: selectedDomains,
            filterByYears: this.state.yearsFilterEnabled,
            yearsFilterBefore: this.state.yearsFilterBefore,
            yearsFilterAfter: this.state.yearsFilterAfter
        });
    }

    render() {
        const { domainsFilterEnabled, domainsDict } = this.state;
        
        return (
            <section>
                <h4>Advanced options:</h4>
                <div>
                    <label htmlFor="onDomainsCheckBox">On Domains</label>
                    <input id="onDomainsCheckBox" type="checkbox" onChange={this.onDomainsFilterToggleClick}/>
                    {domainsFilterEnabled &&
                        <DomainsFilter 
                            domainsWithSelectionFlags={Object.values(domainsDict)} 
                            onDomainSelectionChanged={this.onDomainSelectionChanged}
                            />
                    }
                </div>
                <button onClick={this.onSearchClick}>Search</button>
            </section>
        );
    }
}

export default ArticlesQueryAdvancedOptions;