import {
    AUTHORITIES_QUERY__AUTHORITY,
    AUTHORITIES_QUERY,
    DOMAINS_POPULARITY_QUERY,
    ARTICLES_QUERY,
    SEARCH,
    AUTHOR,
    DOMAIN,
    PUBLICATION
} from '../routes_constants';

function buildQueryParametersList(name, val_list) {
    let query = '';

    if (val_list.length == 0) {
        return "";
    }
    for (let i = 0; i < val_list.length; i++) {
        query += `${name}=${val_list[i]}`;
        if (i + 1 < val_list.length) {
            query += '&';
        }
    }
    return query;
}

function createAuthorPublicationsInDomainsLink(author, domains) {
    return `${AUTHORITIES_QUERY__AUTHORITY}?${buildQueryParametersList("domain", domains)}&author=${author}`;
}

function createAuthoritiesInDomainsLink(domains) {
    return `${AUTHORITIES_QUERY}?${buildQueryParametersList("domain", domains)}`;
}

function createDomainsPopularityLink(popularity_key) {
    return `${DOMAINS_POPULARITY_QUERY}?popularity=${popularity_key}`;
}

function createKeywordsQueryLink(keywords) {
    return `${ARTICLES_QUERY}?${buildQueryParametersList("keyword", keywords)}`;
}

function createSearchLink(name, type, filters) {
    let query = `${SEARCH}?search=${name.toLowerCase()}&type=${type}`;

    const themesFilter = buildQueryParametersList('theme',filters["themesFilter"]);
    const authorsFilter = buildQueryParametersList('author', filters["authorsFilter"]);
    // query = `${PYTHON_BACKEND_API_PUBLICATIONS_SEARCH}?search=${name}&limit=${limit}&offset=${offset}`;
    if (themesFilter.length > 0 ) {
        query += '&' + themesFilter;
    }
    if (authorsFilter.length > 0) {
        query += '&' + authorsFilter;
    }
    return query;
}

function createAuthorLink(id) {
    return `${AUTHOR}?author=${id}`;
}
function createDomainLink(id) {
    return `${DOMAIN}?domain=${id}`;
}
function createPublicationLink(id) {
    return `${PUBLICATION}?publication=${id}`;
}

export {
    buildQueryParametersList,
    createAuthorPublicationsInDomainsLink,
    createAuthoritiesInDomainsLink,
    createDomainsPopularityLink,
    createKeywordsQueryLink,
    createSearchLink,
    createAuthorLink,
    createDomainLink,
    createPublicationLink,
};