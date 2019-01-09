#  These methods are used for running required queries in neo4j base.
#  All methods except run_cypher_query contain Cypher language strings hardcoded
#  You can edit them here.

from py2neo import Graph
from .neo_config import neo_password, neo_user, neo_port, neo_host, neo_scheme


class NeoQuerier:
    AUTHOR_NODE_LABEL = "Author"
    PUBLICATION_NODE_LABEL = "Publication"
    THEME_NODE_LABEL = "Theme"

    def __init__(self):
        self.graph = Graph(host=neo_host, port=neo_port, scheme=neo_scheme, user=neo_user, password=neo_password)

    def run_cypher_query(self, query):
        # graph = Graph(host=neo_host, port=neo_port, scheme=neo_scheme, user=neo_user, password=neo_password)
        # c = graph.run(query)
        c = self.graph.run(query)
        return c.data()

    def get_nodes_count(self, label=None):
        if not label:
            query = "MATCH(c) RETURN COUNT(c)"
        else:
            query = "MATCH(a:{}) RETURN COUNT(a)".format(label)
        c = self.graph.evaluate(query)
        return c

    def get_authorities_in_domains(self, domains_list):
        query = """
                MATCH (a:Author)-[:WROTE]-(p:Publication), (p)-[r:THEME_RELATION]-(d:Theme)
                WHERE r.probability > 0.7 AND EXISTS(a.name) 
                WITH collect(DISTINCT d.name) as domains, collect(distinct p) as pub, a 
                WHERE ALL(domain_name in {domains_list} WHERE domain_name in domains)
                RETURN a, length(pub) ORDER BY 
                size(pub) DESC 
            """

        #using deprecated length(pub) in front_EndQ!!!!!!!
        result = self.graph.run(query, domains_list=domains_list)
        return result.data()

    def get_articles_by_keywords(self, keywords_list):
        query = """
            MATCH (a:Author)-[:WROTE]-(p:Publication), (p)-[r:KEYWORDS]-(d:KeywordPhrase) 
            WHERE EXISTS(a.name) 
            WITH collect(d.phrase) as publ_keyphrases, collect(distinct p) as pub, a 
            WHERE ALL(key in {keywords_list} WHERE key in publ_keyphrases) 
            RETURN a, pub
        """

        print(keywords_list)
        result = self.graph.run(query, keywords_list=keywords_list)
        return result.data()

    def get_domains_by_popularity_index(self, popularity_index, higher=True):
        nascent_query = 'match (theme:Theme),(title:Publication)-[r:THEME_RELATION]-(theme) where r.probability > 0.5 with theme, count(title) as popularity where popularity > {popularity_index} return theme.name as name, popularity order by popularity desc'
        uninteresting_query = 'match (theme:Theme), (title:Publication)-[r:THEME_RELATION]-(theme) where r.probability > 0.5 with theme, count(title) as popularity where popularity < {popularity_index} return theme.name as name, popularity order by popularity'
        query = ''
        if higher:
            query = nascent_query
        else:
            query = uninteresting_query
        # graph = Graph(host=neo_host, port=neo_port, scheme=neo_scheme, user=neo_user, password=neo_password)
        return self.graph.run(query, popularity_index=popularity_index).data()

    def get_author_with_publications_in_domais(self, author_name, domains_list):

        query = """
            MATCH (a:Author)-[:WROTE]-(p:Publication),
            (p)-[r:THEME_RELATION]-(d:Theme) 
            WHERE a.name={author_name} AND r.probability > 0.7 WITH collect(d.name) as domains, 
            collect(distinct p) as pub, a,collect(distinct ID(p)) as pub_ids 
            WHERE ALL(domain_name in {domains_list} 
            WHERE domain_name in domains) RETURN a, ID(a) as author_id, pub, pub_ids
        """


        result = self.graph.run(query, author_name=author_name, domains_list=domains_list)
        return result.data()

    def find_nodes_by_name(self, name, skip=0, limit=10):
        query = """MATCH (n)
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
                LIMIT {limit_n}"""
        print(limit, skip)
        result = self.graph.run(query, name=name, skip_n=skip, limit_n=limit)
        return result.data()

    def get_publication_with_details(self, pid):
        query = """
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

        result = self.graph.run(query, pid=pid)
        return result.data()

    def get_author_with_details(self, author_id):
        author_info_query = """
            MATCH (a:Author)
            WHERE ID(a) = {author_id}
            RETURN a as author
        """

        major_domains_for_author_query = """
            MATCH (a:Author)-[:WROTE]-(p:Publication)
            WHERE ID(a)={author_id}
            MATCH (p)-[tr:THEME_RELATION]-(t:Theme)
            WHERE tr.probability > 0.7 
            WITH COLLECT(t) as domains, a, p
            RETURN collect(DISTINCT p) as publications_in_domains, domains
            ORDER BY size(publications_in_domains) DESC
            LIMIT 5
        """

        top_5_cited_publications_query = """
            MATCH (a:Author)-[:WROTE]-(p:Publication)
            WHERE ID(a)={author_id}  
            MATCH (p)<-[:LINKS_TO]-(another_p:Publication)
            RETURN p as publication, ID(p) as publication_id, count(DISTINCT another_p) as links_count
            ORDER BY links_count DESC
            LIMIT 5
        """

        author = self.graph.run(author_info_query, author_id=author_id).data()[0]["author"]
        major_domains = self.graph.run(major_domains_for_author_query, author_id=author_id).data()
        top_cited_publications = self.graph.run(top_5_cited_publications_query, author_id=author_id).data()
        return {"author": author, "major_domains": major_domains, "top_cited_publications": top_cited_publications}
