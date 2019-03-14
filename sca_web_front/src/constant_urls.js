const HBASE_STATUS_PATH = "http://192.168.128.135:8080/v1/status/";
const PYTHON_BACKEND_API = "http://127.0.0.1:8000";
const PYTHON_BACKEND_API_CUSTOM_QUERY = `${PYTHON_BACKEND_API}/query/`;
const PYTHON_BACKEND_API_NEO_STATUS = `${PYTHON_BACKEND_API}/status/`;
const PYTHON_BACKEND_API_AUTHORITIES_QUERY = `${PYTHON_BACKEND_API}/query/authorities/`;
const PYTHON_BACKEND_API_ARTICLES_QUERY = `${PYTHON_BACKEND_API}/query/articles/`;
const PYTHON_BACKEND_API_DOMAINS_POPULARITY_QUERY = `${PYTHON_BACKEND_API}/query/domains_popularity/`;
const PYTHON_BACKEND_API_AUTHOR_PUBLICATIONS_IN_DOMAINS_QUERY = `${PYTHON_BACKEND_API}/query/author/domains/`;
const PYTHON_BACKEND_API_SEARCH = `${PYTHON_BACKEND_API}/search/`;
const PYTHON_BACKEND_API_AUTHOR = `${PYTHON_BACKEND_API}/author/`;
const PYTHON_BACKEND_API_DOMAIN = `${PYTHON_BACKEND_API}/domain/`;
const PYTHON_BACKEND_API_PUBLICATION = `${PYTHON_BACKEND_API}/publication/`;
const PYTHON_BACKEND_API_THEMES_LIST = `${PYTHON_BACKEND_API}/themes-list/`;
const PYTHON_BACKEND_API_PUBLICATION_GRAPH = `${PYTHON_BACKEND_API}/publicationgraph`;

export {
    HBASE_STATUS_PATH,
    PYTHON_BACKEND_API,
    PYTHON_BACKEND_API_NEO_STATUS,
    PYTHON_BACKEND_API_CUSTOM_QUERY,
    PYTHON_BACKEND_API_AUTHORITIES_QUERY,
    PYTHON_BACKEND_API_ARTICLES_QUERY,
    PYTHON_BACKEND_API_DOMAINS_POPULARITY_QUERY,
    PYTHON_BACKEND_API_AUTHOR_PUBLICATIONS_IN_DOMAINS_QUERY,
    PYTHON_BACKEND_API_SEARCH,
    PYTHON_BACKEND_API_AUTHOR,
    PYTHON_BACKEND_API_DOMAIN,
    PYTHON_BACKEND_API_PUBLICATION,
    PYTHON_BACKEND_API_THEMES_LIST,
    PYTHON_BACKEND_API_PUBLICATION_GRAPH,
};
