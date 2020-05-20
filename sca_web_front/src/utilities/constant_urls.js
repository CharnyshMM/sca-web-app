const CASSANDRA_STATUS_PATH = "http://172.20.225.7:8080/v1/state/";

const PYTHON_BACKEND_API = "http://127.0.0.1:8000"//"http://fe32276e.ngrok.io/";
const PYTHON_BACKEND_API_CUSTOM_QUERY = `${PYTHON_BACKEND_API}/query/`;
const PYTHON_BACKEND_API_NEO_STATUS = `${PYTHON_BACKEND_API}/status/`;
const PYTHON_BACKEND_API_AUTHORITIES_QUERY = `${PYTHON_BACKEND_API}/query/authorities/`;
const PYTHON_BACKEND_API_ARTICLES_QUERY = `${PYTHON_BACKEND_API}/query/articles/`;
const PYTHON_BACKEND_API_DOMAINS_POPULARITY_QUERY = `${PYTHON_BACKEND_API}/query/domains_popularity/`;
const PYTHON_BACKEND_API_AUTHOR_PUBLICATIONS_IN_DOMAINS_QUERY = `${PYTHON_BACKEND_API}/query/author/domains/`;
const PYTHON_BACKEND_API_SEARCH = `${PYTHON_BACKEND_API}/search/`;
const PYTHON_BACKEND_API_PUBLICATIONS_SEARCH = `${PYTHON_BACKEND_API_SEARCH}publications/`;
const PYTHON_BACKEND_API_AUTHORS_SEARCH = `${PYTHON_BACKEND_API_SEARCH}authors/`;
const PYTHON_BACKEND_API_AUTHOR = `${PYTHON_BACKEND_API}/author/`;
const PYTHON_BACKEND_API_DOMAIN = `${PYTHON_BACKEND_API}/domain/`;
const PYTHON_BACKEND_API_PUBLICATION = `${PYTHON_BACKEND_API}/publication/`;
const PYTHON_BACKEND_API_THEMES_LIST = `${PYTHON_BACKEND_API}/themes-list/`;
const PYTHON_BACKEND_API_PUBLICATION_GRAPH = `${PYTHON_BACKEND_API}/publicationgraph`;
const PYTHON_BACKEND_API_AUTHOR_GRAPH = `${PYTHON_BACKEND_API}/authorgraph`;
const PYTHON_BACKEND_API_ALL_THEMES = `${PYTHON_BACKEND_API_DOMAIN}all/`;
const PYTHON_BACKEND_API_DOMAIN_TOKENS = `${PYTHON_BACKEND_API_DOMAIN}tokens/`;
const PYTHON_BACKEND_API_ALL_AUTHORS = `${PYTHON_BACKEND_API_AUTHOR}all/`;

const CONTROL_COMPONENT_API = "localhost:8123";
const CONTROL_COMPONENT_API_IPS = `${CONTROL_COMPONENT_API}/address_controller/`; // GET
const CONTROL_COMPONENT_API_PUT_FILTER_IP = `${CONTROL_COMPONENT_API_IPS}FILTER_IP/`; // PUT
const CONTROL_COMPONENT_API_PUT_PARSER_IP = `${CONTROL_COMPONENT_API_IPS}PARSER_IP/`; // PUT
const CONTROL_COMPONENT_API_PUT_STORAGE_IP = `${CONTROL_COMPONENT_API_IPS}STORAGE_IP/`; // PUT
const CONTROL_COMPONENT_API_PUT_GRAPH_IP = `${CONTROL_COMPONENT_API_IPS}GRAPH_IP/`; // PUT



export {
    CASSANDRA_STATUS_PATH,
    PYTHON_BACKEND_API,
    PYTHON_BACKEND_API_NEO_STATUS,
    PYTHON_BACKEND_API_CUSTOM_QUERY,
    PYTHON_BACKEND_API_AUTHORITIES_QUERY,
    PYTHON_BACKEND_API_ARTICLES_QUERY,
    PYTHON_BACKEND_API_DOMAINS_POPULARITY_QUERY,
    PYTHON_BACKEND_API_AUTHOR_PUBLICATIONS_IN_DOMAINS_QUERY,
    PYTHON_BACKEND_API_SEARCH,
    PYTHON_BACKEND_API_PUBLICATIONS_SEARCH,
    PYTHON_BACKEND_API_AUTHORS_SEARCH,
    PYTHON_BACKEND_API_AUTHOR,
    PYTHON_BACKEND_API_DOMAIN,
    PYTHON_BACKEND_API_PUBLICATION,
    PYTHON_BACKEND_API_THEMES_LIST,
    PYTHON_BACKEND_API_PUBLICATION_GRAPH,
    PYTHON_BACKEND_API_AUTHOR_GRAPH,
    PYTHON_BACKEND_API_DOMAIN_TOKENS,
    PYTHON_BACKEND_API_ALL_THEMES,
    PYTHON_BACKEND_API_ALL_AUTHORS,
    CONTROL_COMPONENT_API,
    CONTROL_COMPONENT_API_IPS,
    CONTROL_COMPONENT_API_PUT_FILTER_IP,
    CONTROL_COMPONENT_API_PUT_PARSER_IP,
    CONTROL_COMPONENT_API_PUT_STORAGE_IP,
    CONTROL_COMPONENT_API_PUT_GRAPH_IP
};
