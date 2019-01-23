import React from 'react';

import {createPublicationLink} from '../../utilities/links_creators';

import './publication_result.css';
import './search_result.css';

const PublicationResult = ({id, publication, author, domains}) => {
    
    const domains_list_view = domains.map((d,i)=><li key={i} className="search_result__domains_list__item">{d["name"]}</li>);

    return (
        <section key={id} className="search_result">
            <div className="search_result__header" title="Publication">
                <span className="oi oi-book search_result__type"> </span>
                <h3 className="search_result__title"><a href={createPublicationLink(id)}>{publication.name}</a></h3>
            </div>
            <span className="publication_result__year"><i>published:</i> {publication.year}</span>
            <h5 className="publication_result__author">{author["name"]}</h5>
            <ul className="search_result__domains_list">
                <li key="-1" className="search_result__domains_list__label">On Domains:</li>
                {domains_list_view}
            </ul>
        </section>
    );
};

export default PublicationResult;
