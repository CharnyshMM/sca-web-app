import {
    PYTHON_BACKEND_API,
    PYTHON_BACKEND_API_NEO_STATUS,
    HBASE_STATUS_PATH,
    PYTHON_BACKEND_API_AUTHORITIES_QUERY,
    PYTHON_BACKEND_API_ARTICLES_QUERY,
    PYTHON_BACKEND_API_DOMAINS_POPULARITY_QUERY,
    PYTHON_BACKEND_API_AUTHOR_PUBLICATIONS_IN_DOMAINS_QUERY,
    PYTHON_BACKEND_API_SEARCH,
} from './constant_urls';

// ========================================================================
//      UTILITIES
// ========================================================================
const getLoaderPromise = function (path, requestOptions = null) {
    const FETCH_TIMEOUT = 5000;
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
                    console.log("status=200, resolving promise");
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

    for (let i = 0; i < val_list.length; i++) {
        query += `${name}=${val_list[i]}`;
        if (i + 1 < val_list.length) {
            query += '&';
        }
    }
    return query;
}

// =========================================================================================
//     REAL REQUESTS METHODS
// =========================================================================================

const runQueryOnPythonBackend = function (query, token) {
    return getLoaderPromise(`${PYTHON_BACKEND_API}/query?query=${query}`, authOptions(token));
}


const authorizeOnPythonBackend = function (username, password) {
    const requestOptions = {
        method: 'Post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    };
    return getLoaderPromise(`${PYTHON_BACKEND_API}/login/`, requestOptions);
}

const doSearchByName = (name, token) => {
    let query = PYTHON_BACKEND_API_SEARCH + `?search=${name}`;
    return getLoaderPromise(query, authOptions(token));
};

const getAuthoritiesInDomainsList = (domains_list, token) => {
    let query = buildQueryParametersList('domain', domains_list);
    return getLoaderPromise(PYTHON_BACKEND_API_AUTHORITIES_QUERY + `?${query}`, authOptions(token));
}

const getArticlesByKeywords = (keywords_list, token) => {
    let query = buildQueryParametersList('keyword', keywords_list);
    return getLoaderPromise(PYTHON_BACKEND_API_ARTICLES_QUERY + `?${query}`, authOptions(token));
}


const getDomainsByPopularity = (popularity, token) => {
    return getLoaderPromise(PYTHON_BACKEND_API_DOMAINS_POPULARITY_QUERY + `?popularity=${popularity}`, authOptions(token))
}


const getAuthorPublicationsInDomains = (author_name, domains_list, token) => {
    let query = buildQueryParametersList('domain', domains_list);
    query += `&author=${author_name}`;
    return getLoaderPromise(`${PYTHON_BACKEND_API_AUTHOR_PUBLICATIONS_IN_DOMAINS_QUERY}?${query}`, authOptions(token))
}

const getNeoStatus = (token) => {
    return getLoaderPromise(PYTHON_BACKEND_API_NEO_STATUS, authOptions(token));
}

const getHBaseStatus = () => {
    return getLoaderPromise(HBASE_STATUS_PATH);
}

export {
    getLoaderPromise,
    runQueryOnPythonBackend,
    authorizeOnPythonBackend,
    getNeoStatus,
    getHBaseStatus,
    getAuthoritiesInDomainsList,
    getArticlesByKeywords,
    getDomainsByPopularity,
    getAuthorPublicationsInDomains,
    doSearchByName,
};