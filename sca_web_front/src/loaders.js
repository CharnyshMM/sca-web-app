import { PYTHON_BACKENT_API, PYTHON_BACKENT_API_NEO_STATUS, HBASE_STATUS_PATH } from './components_urls';

// ========================================================================
//      UTILITIES
// ========================================================================
const getLoaderPromise = function (path, requestOptions=null) {
    const FETCH_TIMEOUT = 5000; 
    return new Promise( (resolve, reject) => {
        // Set timeout timer
        let timer = setTimeout(
            () => reject( new Error('Request timed out') ),
            FETCH_TIMEOUT
        );

        fetch( path , requestOptions).then(
            response => { 
                console.log("responsed :", response);
                if (response.status == 200) {
                    console.log("status=200, resolving promise");
                    resolve(response); 
                } else {
                    console.log(`status=${response.status}, rejecting promise`);
                    reject(response);
                }
            },
            err => {reject(err); console.log("fetch error: ", err);}
        ).finally( () => { clearTimeout(timer); console.log("cleared timer") });
    })
}

const authOptions =(token) => ({
    method: 'Get',
    headers: {
        'Authorization': `Token ${token}`,
    },
});

// =========================================================================================
//     REAL REQUESTS METHODS
// =========================================================================================

const runQueryOnPythonBackend = function(query, token) {
    return getLoaderPromise(`${PYTHON_BACKENT_API}/query?query=${query}`,authOptions(token) );
}


const authorizeOnPythonBackend = function(username, password) {
    const requestOptions = {
        method: 'Post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    };
    return getLoaderPromise(`${PYTHON_BACKENT_API}/login/`, requestOptions);
}


const getNeoStatus = function(token) {
    return getLoaderPromise(PYTHON_BACKENT_API_NEO_STATUS, authOptions(token));
}

const getHBaseStatus = function() {
    return getLoaderPromise(HBASE_STATUS_PATH);
}

export {
    getLoaderPromise,
    runQueryOnPythonBackend,
    authorizeOnPythonBackend,
    getNeoStatus,
    getHBaseStatus,
};