import React, { Component } from 'react';

import './domains_filter.css';


class DomainsFilter extends Component {
    state = {
        domainsSelectionKey: "",
    }

    onInputChange = e => {
        this.setState({domainsSelectionKey: e.target.value});
    }
    
    render() {
        const domainsSelectionKey = this.state.domainsSelectionKey.toLowerCase();
        const {onDomainSelectionChanged, domainsWithSelectionFlags} = this.props;

        const domainsListItems = domainsWithSelectionFlags
            .filter(v => {
                if (domainsSelectionKey.length > 0) {
                    return v.domain["name"].toLowerCase().startsWith(domainsSelectionKey);
                }
                return true;
            })
            .map((v,i) => {
                const inputId = i+v.domain["name"];
                return ( 
                    <li key={i}>
                        <input id={inputId} onChange={() => onDomainSelectionChanged(v)} type="checkbox" />
                        <label htmlFor={inputId}>{v.domain["name"]}</label>
                    </li>
                );
            });

        return (
            <div className="domains_filter">
                <input
                    className="domains_filter__input" 
                    value={domainsSelectionKey} 
                    onChange={this.onInputChange} 
                    type="text"
                    placeholder="Domain.."
                    />
                <ul className="domains_filter__list">
                    {domainsListItems}
                </ul>
            </div>
        );
    }
}

export default DomainsFilter;