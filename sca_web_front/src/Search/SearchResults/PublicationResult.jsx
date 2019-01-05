import React from 'react';

import './publication_result.css';
import './search_result.css';

const PublicationResult = ({publication, domains}) => {
    publication = {
        title: "451 по Фарингейту",
        author: "Рэй Брадберри",
        year: "1960"
    };

    domains = ["science fiction", "text", "story"];
    
    const domains_list_view = domains.map((d,i)=><li key={i} className="search_result__domains_list__item">{d}</li>)

    return (
        <section className="search_result">
        <span className="oi oi-book"> </span> publication:
            <h3 className="search_result__title"><a href="#">{publication.title}</a></h3>
            <span className="publication_result__year"><i>published:</i> {publication.year}</span>
            <h5 className="publication_result__author">{publication.author}</h5>
            <ul className="search_result__domains_list">
                <li className="search_result__domains_list__label">On Domains:</li>
                {domains_list_view}
            </ul>
        </section>
    );
};

export default PublicationResult;
