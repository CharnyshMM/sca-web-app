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
        # query = 'MATCH (a:Author)-[:WROTE]-(p:Publication), '\
        #                    '(p)-[r:THEME_RELATION]-(d:Theme) '\
        #                    'WHERE r.probability > 0.5 WITH collect(d.name) as domains, '\
        #                    'collect(distinct p) as pub, a '\
        #                    'WHERE ALL(domain_name in {domains_list} '\
        #                    'WHERE domain_name in domains) RETURN a, length(pub) ' \
        #                     'ORDER BY length(pub) DESC'

        query = 'MATCH (a:Author)-[:WROTE]-(p:Publication), (p)-[r:THEME_RELATION]-(d:Theme)' \
                ' WHERE r.probability > 0.7 AND EXISTS(a.name) ' \
                'WITH collect(d.name) as domains, collect(distinct p) as pub, a ' \
                'WHERE ALL(domain_name in {domains_list} WHERE domain_name in domains)' \
                ' RETURN a, length(pub) ORDER BY ' \
                'size(pub) DESC '

        #using deprecated length(pub) in front_EndQ!!!!!!!
        result = self.graph.run(query, domains_list=domains_list)
        return result.data()

    def get_articles_by_keywords(self, keywords_list):
        query = 'MATCH (a:Author)-[:WROTE]-(p:Publication), (p)-[r:KEYWORDS]-(d:KeywordPhrase) ' \
                'WHERE EXISTS(a.name) ' \
                'WITH collect(d.phrase) as publ_keyphrases, collect(distinct p) as pub, a ' \
                'WHERE ALL(key in {keywords_list} WHERE key in publ_keyphrases) ' \
                'RETURN a, pub'

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

        query = 'MATCH (a:Author)-[:WROTE]-(p:Publication), ' \
                '(p)-[r:THEME_RELATION]-(d:Theme) ' \
                'WHERE a.name={author_name} AND r.probability > 0.7 WITH collect(d.name) as domains, ' \
                'collect(distinct p) as pub, a ' \
                'WHERE ALL(domain_name in {domains_list} ' \
                'WHERE domain_name in domains) RETURN a, pub'


        result = self.graph.run(query, author_name=author_name, domains_list=domains_list)
        return result.data()