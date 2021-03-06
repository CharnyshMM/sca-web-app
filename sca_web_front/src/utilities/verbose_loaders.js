import {
    PYTHON_BACKEND_API,
    PYTHON_BACKEND_API_NEO_STATUS,
    CASSANDRA_STATUS_PATH,
    PYTHON_BACKEND_API_AUTHORITIES_QUERY,
    PYTHON_BACKEND_API_ARTICLES_QUERY,
    PYTHON_BACKEND_API_DOMAINS_POPULARITY_QUERY,
    PYTHON_BACKEND_API_AUTHOR_PUBLICATIONS_IN_DOMAINS_QUERY,
    PYTHON_BACKEND_API_SEARCH,
    PYTHON_BACKEND_API_PUBLICATION,
    PYTHON_BACKEND_API_AUTHOR,
    PYTHON_BACKEND_API_DOMAIN,
    PYTHON_BACKEND_API_ALL_THEMES,
    PYTHON_BACKEND_API_ALL_AUTHORS,
    PYTHON_BACKEND_API_PUBLICATION_GRAPH,
    PYTHON_BACKEND_API_AUTHOR_GRAPH,
    PYTHON_BACKEND_API_PUBLICATIONS_SEARCH,
    PYTHON_BACKEND_API_AUTHORS_SEARCH,
    CONTROL_COMPONENT_API_IPS,
    PYTHON_BACKEND_API_DOMAIN_TOKENS
} from './constant_urls';

// ========================================================================
//      UTILITIES
// ========================================================================
const getLoaderPromise = function (path, requestOptions = null) {
    const FETCH_TIMEOUT = 10000;
    return new Promise((resolve, reject) => {
        // Set timeout timer
        let timer = setTimeout(
            () => reject(new Error('Request timed out')),
            FETCH_TIMEOUT
        );

        fetch(path, requestOptions).then(
            response => {
                console.log("responsed :", response);
                if (response.status >= 200 && response.status<300) {
                    console.log(`status=${response.status}, resolving promise`);
                    resolve({
                        "status": response.status,
                        "response": response,
                    });
                } else {
                    console.log(`status=${response.status}, rejecting promise`);
                    reject({
                        "status": response.status,
                        "response": response,
                    });
                }
            },
            err => {
                reject({
                    "status": err.status,
                    "response": err,
                }); 
                console.log("fetch error:", err);
            }
        ).finally(() => { clearTimeout(timer); console.log("cleared timer") });
    })
}

const authOptions = (token) => ({
    method: 'Get',
    headers: {
        'Authorization': `Token ${token}`,
    },
});

const buildQueryParametersList = (name, val_list) => {
    let query = '';
    if (!val_list) {
        return "";
    }
    for (let i = 0; i < val_list.length; i++) {
        query += `${name}=${val_list[i]}`;
        if (i + 1 < val_list.length) {
            query += '&';
        }
    }
    return query;
};

// =========================================================================================
//     REAL REQUESTS METHODS
// =========================================================================================

const runQueryOnPythonBackend = function (query, token) {
    return getLoaderPromise(`${PYTHON_BACKEND_API}/query?query=${query}`, authOptions(token));
};


const authorizeOnPythonBackend = function (username, password) {
    const requestOptions = {
        method: 'Post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    };
    return getLoaderPromise(`${PYTHON_BACKEND_API}/login/`, requestOptions);
};

const getAuthoritiesInDomainsList = (domains_list, limit, offset, token) => {
    let query = buildQueryParametersList('domain', domains_list);
    return getLoaderPromise(
        `${PYTHON_BACKEND_API_AUTHORITIES_QUERY}?${query}&limit=${limit}&offset=${offset}`, 
        authOptions(token)
    );
};

const getDomainTokens = (domain_id, token) => {
    return getLoaderPromise(`${PYTHON_BACKEND_API_DOMAIN_TOKENS}?domain_id=${domain_id}`, authOptions(token))
}

const getArticlesByKeywords = (keywords_list, token) => {
    let query = buildQueryParametersList('keyword', keywords_list);
    return getLoaderPromise(PYTHON_BACKEND_API_ARTICLES_QUERY + `?${query}`, authOptions(token));
};


const getDomainsByPopularity = (popularity, token) => {
    return getLoaderPromise(PYTHON_BACKEND_API_DOMAINS_POPULARITY_QUERY + `?popularity=${popularity}`, authOptions(token))
};


const getAuthorPublicationsInDomains = (author_name, domains_list, token) => {
    let query = buildQueryParametersList('domain', domains_list);
    query += `&author=${author_name}`;
    return getLoaderPromise(`${PYTHON_BACKEND_API_AUTHOR_PUBLICATIONS_IN_DOMAINS_QUERY}?${query}`, authOptions(token))
};

const getNeoStatus = (token, signal=null) => {
    return getLoaderPromise(PYTHON_BACKEND_API_NEO_STATUS, {...authOptions(token), 'signal': signal});
};

const getCassandraStatus = (signal=null) => {
    return getLoaderPromise(CASSANDRA_STATUS_PATH, {'signal': signal});
}

// const doSearchByName = (name, limit, offset, token, type=undefined) => {
//     if (type !== "all" && type !== "author" && type !== "publication" && type !== "theme") {
//         type = "all"
//     }

//     const query = `${PYTHON_BACKEND_API_SEARCH}?search=${name}&limit=${limit}&offset=${offset}&type=${type}`;
//     return getLoaderPromise(query, authOptions(token));
// };

const doSearchByName = (name, limit, offset, token, filters, type=undefined) => {
    if (type !== "all" && type !== "author" && type !== "publication" && type !== "theme") {
        type = "all"
    }
    console.log(filters);
    
    
    let query = `?search=${encodeURIComponent(name)}&limit=${limit}&offset=${offset}&type=${type}`;
    switch(type){
        case "publication": {
            query  = PYTHON_BACKEND_API_PUBLICATIONS_SEARCH + query;
            const themesFilter = buildQueryParametersList('theme',filters["themesFilter"]);
            const authorsFilter = buildQueryParametersList('author', filters["authorsFilter"]);
            if (themesFilter.length > 0 ) {
                query += '&' + themesFilter;
            }
            if (authorsFilter.length > 0) {
                query += '&' + authorsFilter;
            }
            break;
        }
        case "author": {
            query = PYTHON_BACKEND_API_AUTHORS_SEARCH + query;
            const themesFilter = buildQueryParametersList('theme',filters["themesFilter"]);
            if (themesFilter.length > 0 ) {
                query += '&' + themesFilter;
            }
            break;
        }
        case "theme": 
        default:
            query = PYTHON_BACKEND_API_SEARCH + query;
            break;
    }
    return getLoaderPromise(query, authOptions(token));
};

const getPublication = (id, token) => {
    const query = `${PYTHON_BACKEND_API_PUBLICATION}?id=${id}`;
    return getLoaderPromise(query, authOptions(token));
};

const getPublicationGraph = (id, token) => {
    const query = `${PYTHON_BACKEND_API_PUBLICATION_GRAPH}?id=${id}`;
    return getLoaderPromise(query, authOptions(token));
}

const getAuthorGraph = (id, token) => {
    const query = `${PYTHON_BACKEND_API_AUTHOR_GRAPH}?id=${id}`;
    return getLoaderPromise(query, authOptions(token));
}

const getAuthor = (id, token) => {
    const query = `${PYTHON_BACKEND_API_AUTHOR}?id=${id}`;
    return getLoaderPromise(query, authOptions(token));
}

const getDomain = (id, token) => {
    const query = `${PYTHON_BACKEND_API_DOMAIN}?id=${id}`;
    return getLoaderPromise(query, authOptions(token));
}

const getThemesList = (token) => {
    return getLoaderPromise(PYTHON_BACKEND_API_ALL_THEMES, authOptions(token));
}

const getAuthorsList = (token) => {
    return getLoaderPromise(PYTHON_BACKEND_API_ALL_AUTHORS, authOptions(token));
}

const getComponentsIPs = () => {
    return getLoaderPromise(CONTROL_COMPONENT_API_IPS);
}

export {
    getLoaderPromise,
    runQueryOnPythonBackend,
    authorizeOnPythonBackend,
    getNeoStatus,
    getCassandraStatus,
    getAuthoritiesInDomainsList,
    getArticlesByKeywords,
    getDomainsByPopularity,
    getAuthorPublicationsInDomains,
    doSearchByName,
    getPublication,
    getAuthor,
    getDomain,
    getThemesList,
    getAuthorsList,
    getPublicationGraph,
    getAuthorGraph,
    getComponentsIPs,
    getDomainTokens
};