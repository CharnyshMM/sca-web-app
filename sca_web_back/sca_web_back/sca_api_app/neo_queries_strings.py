# GET_AUTHORITIES_IN_DOMAINS is used do return authors whose publication(s) match all the domains
# specified in {domains_list} ordering by publications count

GET_AUTHORITIES_IN_DOMAINS = """
                MATCH (a:Author)-[:WROTE]-(p:Publication), (p)-[r:THEME_RELATION]-(d:Theme)
                WHERE r.probability > 0.7 AND EXISTS(a.name) 
                WITH collect(DISTINCT d.name) as domains, collect(distinct p) as pub, a 
                WHERE ALL(domain_name in {domains_list} WHERE domain_name in domains)
                RETURN a, length(pub) ORDER BY 
                size(pub) DESC 
            """

GET_AUTHORITIES_IN_DOMAINS_WITH_LINKS_COUNT = """
        MATCH (a:Author)-[:WROTE]-(p:Publication), (p)-[r:THEME_RELATION]-(d:Theme)
        WHERE r.probability>0.01 and EXISTS(a.name) 
        OPTIONAL MATCH (p)<-[:LINKS_TO]-(other_p)
        WITH collect(DISTINCT d.name) as domains,
            count(distinct p) as publications_count, 
            count(distinct other_p) as links_count, 
            a 
        WHERE ALL(domain_name in {domains_list}  WHERE domain_name in domains)
        RETURN a, publications_count, links_count 
        ORDER BY links_count DESC
"""

# GET_ARTICLES_BY_KEYWORDS returns author and publication pairs where publication node has relations with
# all keywords specified in {keywords_list}

GET_ARTICLES_BY_KEYWORDS = """
            MATCH (a:Author)-[:WROTE]-(p:Publication), (p)-[r:KEYWORDS]-(d:KeywordPhrase) 
            WHERE EXISTS(a.name) 
            WITH collect(d.phrase) as publ_keyphrases, collect(distinct p) as pub, a 
            WHERE ALL(key in {keywords_list} WHERE key in publ_keyphrases) 
            RETURN a, pub
        """

# NASCENT_DOMAINS_QUERY is used to return list of domains
# which popularity property value is greater than {popularity_index}
# ordering them by popularity value

NASCENT_DOMAINS_QUERY = """
    match (theme:Theme),
    (title:Publication)-[r:THEME_RELATION]-(theme)
    where r.probability > 0.5 
    with theme, count(title) as popularity 
    where popularity > {popularity_index} 
    return theme.name as name, popularity
    order by popularity desc
"""

# UNINTERESTING_DOMAINS_QUERY does the opposite than NASCENT_DOMAINS_QUERY

UNINTERESTING_DOMAINS_QUERY = """
    match (theme:Theme), 
    (title:Publication)-[r:THEME_RELATION]-(theme)
     where r.probability > 0.5
    with theme, count(title) as popularity 
    where popularity < {popularity_index} 
    return theme.name as name, popularity
     order by popularity
"""

# GET_AUTHOR_WITH_PUBLICATIONS_IN_DOMAINS - returns author with publications in particular
# domains from {domains_list}

GET_AUTHOR_WITH_PUBLICATIONS_IN_DOMAINS = """
    MATCH (a:Author)-[:WROTE]-(p:Publication),
    (p)-[r:THEME_RELATION]-(d:Theme) 
    WHERE a.name={author_name} AND r.probability > 0.7 WITH collect(d.name) as domains, 
    collect(distinct p) as pub, a,collect(distinct ID(p)) as pub_ids 
    WHERE ALL(domain_name in {domains_list} 
    WHERE domain_name in domains) RETURN a, ID(a) as author_id, pub, pub_ids
"""

# FIND_NODES_BY_NAME  - returns nodes which name property value contains {name}
# optionally returns:
# - author & domains for publication,
# - publications count for author node
# - publications count for domain node

FIND_NODES_BY_NAME = """
    MATCH (n)
    WHERE (EXISTS(n.name) and toLower(n.name) CONTAINS toLower({name}))
    OPTIONAL MATCH (n)-[r:THEME_RELATION]->(t:Theme)
    WHERE r.probability > 0.55
    OPTIONAL MATCH (a:Author)-[:WROTE]-(n)
    OPTIONAL MATCH (n)-[:WROTE]->(p)
    OPTIONAL MATCH (n)-[:THEME_RELATION]-(t_p)
    RETURN n as node,
    a as author, 
    collect(DISTINCT t) as themes,
    count(t_p) as publications_on_theme, 
    count(p) as author_pubs, 
    LABELS(n) as type,
    ID(n) as id
    SKIP {skip_n}
    LIMIT {limit_n}
"""

# GET_PUBLICATION_WITH_DETAILS - get publication whose ID = {pid}

GET_PUBLICATION_WITH_DETAILS = """
    MATCH (p:Publication)
    where ID(p) = {pid}
    OPTIONAL MATCH (p) -[:LINKS_TO]->(l_p)
    OPTIONAL MATCH (p)-[:WROTE]-(a)
    OPTIONAL MATCH (p)-[tr:THEME_RELATION]-(t:Theme)
    WHERE tr.probability > 0.55
    RETURN p as publication, 
    collect(DISTINCT a) as authors,
    collect(distinct ID(a)) as authors_ids,
    collect(DISTINCT l_p) as linked_publications,
    collect(DISTINCT ID(l_p)) as linked_publications_ids,
    collect(DISTINCT t) as themes,
    collect(DISTINCT ID(t)) as themes_ids
"""

AUTHOR_INFO_QUERY = """
            MATCH (a:Author)
            WHERE ID(a) = {author_id}
            RETURN a as author
        """

MAJOR_DOMAINS_FOR_AUTHOR_QUERY = """
    MATCH (a:Author)-[:WROTE]-(p:Publication)
    WHERE ID(a)={author_id}
    MATCH (p)-[tr:THEME_RELATION]-(t:Theme)
    WHERE tr.probability > 0.7 
    WITH COLLECT(t) as domains, a, p
    RETURN collect(DISTINCT p) as publications_in_domains, domains
    ORDER BY size(publications_in_domains) DESC
    LIMIT 5
"""

TOP_5_CITED_PUBLICATIONS_QUERY = """
    MATCH (a:Author)-[:WROTE]-(p:Publication)
    WHERE ID(a)={author_id}  
    MATCH (p)<-[:LINKS_TO]-(another_p:Publication)
    RETURN p as publication, ID(p) as publication_id, count(DISTINCT another_p) as links_count
    ORDER BY links_count DESC
    LIMIT 5
"""
