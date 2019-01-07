import React from 'react';

import './search_result.css';

const DomainResult = ({key, domain, publications_count}) => {
    
    return (
        <section eky={key} className="search_result">
            <div className="search_result__header" title="Domain">
                <span className="oi oi-puzzle-piece search_result__type"> </span>
                <h3 className="search_result__title"><a href="#">{domain.name}</a></h3>   
            </div> 
              
            <div className="domain_result__publications_count">
                <p><b>{publications_count}</b> publications found</p>
                
            </div>

            <div className="domain_result__authors_count">
               
            </div>
        </section>
    );
};

export default DomainResult;