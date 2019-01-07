import {
    AUTHORITIES_QUERY__AUTHORITY,
    AUTHORITIES_QUERY,
    DOMAINS_POPULARITY_QUERY,
    ARTICLES_QUERY,
    SEARCH,
} from '../routes_constants';

function buildQueryParametersList(name, val_list) {
    let query = '';

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

function createSearchLink(name) {
    return `${SEARCH}?search=${name.toLowerCase()}`;
}

export {
    buildQueryParametersList,
    createAuthorPublicationsInDomainsLink,
    createAuthoritiesInDomainsLink,
    createDomainsPopularityLink,
    createKeywordsQueryLink,
    createSearchLink,
};