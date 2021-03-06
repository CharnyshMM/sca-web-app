import React from 'react';

import {createAuthorLink} from '../../utilities/links_creators';

import './author_result.css';
import './search_result.css';

const AuthorResult = ({id, author, publications_count}) => {
    return (
        <section key={id} className="search_result">
            <div className="search_result__header" title="Author">
                <span className="oi oi-person search_result__type"> </span>
                <h3 className="search_result__title"><a href={createAuthorLink(id)}>{author.name}</a></h3>   
            </div> 
              
            <div className="author_result__quoting">
                <p><b>{publications_count}</b> publications </p>
            </div>
        </section>
    );
};

export default AuthorResult;