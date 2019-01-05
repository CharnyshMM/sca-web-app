import React from 'react';

import './author_result.css';
import './search_result.css';

const AuthorResult = ({author}) => {
    author = {
        name: "Ray Bradberry", 
        quoting: 1.234,
        domains: ["science fiction", "text", "story"],
    };
    
    const domains_list_view = author.domains.map((d,i)=><li key={i} className="search_result__domains_list__item">{d}</li>)

    return (
        <section className="search_result">
        <div className="search_result__type"> <span className="oi oi-person"> </span> Author:</div>
            <h3 className="search_result__title"><a href="#">{author.name}</a></h3>     
            <h5 className="author_result__quoting_index">{author.quoting}</h5>
        
            <ul className="search_result__domains_list">
                <li className="search_result__domains_list__label">Majors in domains:</li>
                {domains_list_view}
            </ul>
        </section>
    );
};

export default AuthorResult;