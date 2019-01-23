#  These methods are used for running required queries in neo4j base.
#  All methods except run_cypher_query contain Cypher language strings hardcoded
#  You can edit them here.

from py2neo import Graph
from .neo_config import neo_password, neo_user, neo_port, neo_host, neo_scheme


class NeoQuerier:
    AUTHOR_NODE_LABEL = "Author"
    PUBLICATION_NODE_LABEL = "Publication"
    THEME_NODE_LABEL = "Theme"
    KEYWORD_PHRASE_NODE_LABEL = "KeywordPhrase"

    WROTE_RELATION_LABEL = "WROTE"
    THEME_RELATION_LABEL = "THEME_RELATION"
    KEYWORDS_RELATION_LABEL = "KEYWORDS"
    LINKS_TO_RELATION_LABEL = "LINKS_TO"
    THEME_RELATION_PROBABILITY = 0.4

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
        query = f"""
                MATCH (a:{self.AUTHOR_NODE_LABEL})-[:{self.WROTE_RELATION_LABEL}]-(p:{self.PUBLICATION_NODE_LABEL}),
                 (p)-[r:{self.THEME_RELATION_LABEL}]-(d:{self.THEME_NODE_LABEL})
                WHERE r.probability > {self.THEME_RELATION_PROBABILITY} AND EXISTS(a.name) 
                WITH collect(DISTINCT d.name) as domains, collect(distinct p) as pub, a 
                WHERE ALL(domain_name in {domains_list} WHERE domain_name in domains)
                RETURN a, length(pub) ORDER BY 
                size(pub) DESC 
            """

        #using deprecated length(pub) in front_EndQ!!!!!!!
        result = self.graph.run(
            query,
        )
        return result.data()

    def get_articles_by_keywords(self, keywords_list):
        query = f"""
            MATCH (a:{self.AUTHOR_NODE_LABEL})-[:{self.WROTE_RELATION_LABEL}]-(p:{self.PUBLICATION_NODE_LABEL}),
             (p)-[r:{self.KEYWORDS_RELATION_LABEL}]-(d:{self.KEYWORD_PHRASE_NODE_LABEL}) 
            WHERE EXISTS(a.name)
            WITH collect(d.phrase) as publ_keyphrases, collect(distinct p) as pub, a 
            WHERE ALL(key in {keywords_list} WHERE key in publ_keyphrases) 
            RETURN a, pub
        """

        print(keywords_list)
        result = self.graph.run(query, keywords_list=keywords_list)
        return result.data()

    def get_domains_by_popularity_index(self, popularity_index, higher=True):
        nascent_query = f"""
            match (theme:{self.THEME_NODE_LABEL}),
            (title:{self.PUBLICATION_NODE_LABEL})-[r:{self.THEME_RELATION_LABEL}]-(theme) 
            where r.probability > 0.5 
            with theme, count(title) as popularity 
                where popularity > {popularity_index} 
            return theme.name as name, popularity order by popularity desc
            """
        uninteresting_query = f"""
            match (theme:{self.THEME_NODE_LABEL}), 
            (title:{self.PUBLICATION_NODE_LABEL})-[r:{self.THEME_RELATION_LABEL}]-(theme) 
            where r.probability > 0.5 with theme, count(title) as popularity 
            where popularity < {popularity_index} 
            return theme.name as name, popularity order by popularity
        """
        query = ''
        if higher:
            query = nascent_query
        else:
            query = uninteresting_query
        # graph = Graph(host=neo_host, port=neo_port, scheme=neo_scheme, user=neo_user, password=neo_password)
        return self.graph.run(query
                              #popularity_index=popularity_index
        ).data()

    def get_author_with_publications_in_domais(self, author_name, domains_list):

        query = f"""
            MATCH (a:{self.AUTHOR_NODE_LABEL})-[:{self.WROTE_RELATION_LABEL}]-(p:{self.PUBLICATION_NODE_LABEL}),
            (p)-[r:{self.THEME_RELATION_LABEL}]-(d:{self.THEME_NODE_LABEL}) 
            WHERE a.name="{author_name}" AND r.probability > {self.THEME_RELATION_PROBABILITY}
             WITH collect(d.name) as domains, 
            collect(distinct p) as pub, a,collect(distinct ID(p)) as pub_ids 
            WHERE ALL(domain_name in {domains_list} WHERE domain_name in domains)
            RETURN a, ID(a) as author_id, pub, pub_ids
        """

        result = self.graph.run(
            query
            # theme_relation_probability=NeoQuerier.THEME_RELATION_PROBABILITY,
            # author_name=author_name,
            # domains_list=domains_list
        )
        return result.data()

    def find_nodes_by_name(self, name, node_type=None, skip_n=0, limit_n=10):
        match_type = "MATCH (n:{}) "
        match = "MATCH (n) "

        query = f"""
            WHERE (EXISTS(n.name) 
                    and toLower(n.name) STARTS WITH toLower("{name}")) 
                    and (
                        "{self.AUTHOR_NODE_LABEL}" in LABELS(n) 
                        or "{self.PUBLICATION_NODE_LABEL}" in LABELS(n) 
                        or "{self.THEME_NODE_LABEL}" in LABELS(n)
                    )
                OPTIONAL MATCH (n)-[r:{self.THEME_RELATION_LABEL}]->(t:Theme)
                    WHERE r.probability > {self.THEME_RELATION_PROBABILITY}
                OPTIONAL MATCH (a:{self.AUTHOR_NODE_LABEL})-[:{self.WROTE_RELATION_LABEL}]-(n)
                OPTIONAL MATCH (n)-[:{self.WROTE_RELATION_LABEL}]->(p)
                OPTIONAL MATCH (n)<-[t_r:{self.THEME_RELATION_LABEL}]-(t_p)
                    WHERE t_r.probability > {self.THEME_RELATION_PROBABILITY}
                OPTIONAL MATCH (n)<-[:{self.LINKS_TO_RELATION_LABEL}]-(l_p:{self.PUBLICATION_NODE_LABEL})
                    WITH n, 
                        a,
                        count(p) as author_pubs,
                        collect(DISTINCT t) as themes, 
                        count(t_p) as publications_on_theme, 
                        count(l_p) as links_to_pub
                    UNWIND [author_pubs,publications_on_theme, links_to_pub] as coeff
                RETURN 
                    n as node,
                    LABELS(n) as type,
                    ID(n) as id,
                    a as author, 
                    author_pubs, 
                    publications_on_theme,
                    links_to_pub,
                    themes
                ORDER BY coeff DESC
                SKIP {skip_n}
                LIMIT {limit_n}
        """

        print(query)
        if node_type is not None and node_type.lower() != "all":
            query = match_type.format(node_type.capitalize()) + query
        else:
            query = match + query
        print(limit_n, skip_n)
        result = self.graph.run(
            query,
            # name=name,
            # theme_relation_probability=NeoQuerier.THEME_RELATION_PROBABILITY,
            # skip_n=skip_n,
            # limit_n=limit_n
        )
        return result.data()

    def get_publication_with_details(self, publication_id):
        query = f"""
            MATCH (p:{self.PUBLICATION_NODE_LABEL})
                where ID(p) = {publication_id}
                OPTIONAL MATCH (p) -[:{self.LINKS_TO_RELATION_LABEL}]->(l_p)
                OPTIONAL MATCH (p)-[:{self.WROTE_RELATION_LABEL}]-(a)
                OPTIONAL MATCH (p)-[tr:{self.THEME_RELATION_LABEL}]-(t:{self.THEME_NODE_LABEL})
                WHERE tr.probability > {self.THEME_RELATION_PROBABILITY}
                RETURN p as publication, 
                collect(DISTINCT a) as authors,
                collect(distinct ID(a)) as authors_ids,
                collect(DISTINCT l_p) as linked_publications,
                collect(DISTINCT ID(l_p)) as linked_publications_ids,
                collect(DISTINCT t) as themes,
                collect(DISTINCT ID(t)) as themes_ids
        """

        result = self.graph.run(
            query,
            # pid=publication_id,
            # theme_relation_probability=NeoQuerier.THEME_RELATION_PROBABILITY
        )
        return result.data()

    def get_author_with_details(self, author_id):
        author_info_query = f"""
            MATCH (a:{self.AUTHOR_NODE_LABEL})
            WHERE ID(a) = {author_id}
            RETURN a as author
        """

        major_domains_for_author_query = f"""
            MATCH (a:{self.AUTHOR_NODE_LABEL})-[:{self.WROTE_RELATION_LABEL}]-(p:{self.PUBLICATION_NODE_LABEL})
            WHERE ID(a)={author_id}
            MATCH (p)-[tr:{self.THEME_RELATION_LABEL}]-(t:{self.THEME_NODE_LABEL})
            WHERE tr.probability > {self.THEME_RELATION_PROBABILITY}
            WITH COLLECT(t) as domains, a, p
            RETURN collect(DISTINCT p) as publications_in_domains, domains
            ORDER BY size(publications_in_domains) DESC
            LIMIT 5
        """

        top_5_cited_publications_query = f"""
            MATCH (a:{self.AUTHOR_NODE_LABEL})-[:{self.WROTE_RELATION_LABEL}]-(p:{self.PUBLICATION_NODE_LABEL})
            WHERE ID(a)={author_id}  
            MATCH (p)<-[:{self.LINKS_TO_RELATION_LABEL}]-(another_p:{self.PUBLICATION_NODE_LABEL})
            RETURN p as publication, ID(p) as publication_id, count(DISTINCT another_p) as links_count
            ORDER BY links_count DESC
            LIMIT 5
        """

        author = self.graph.run(author_info_query,
                                # author_id=author_id
                                ).data()[0]["author"] # [0] because matching by ID still returns list
        major_domains = self.graph.run(
            major_domains_for_author_query,
            # author_id=author_id,
            # theme_relation_probability=NeoQuerier.THEME_RELATION_PROBABILITY
        ).data()
        top_cited_publications = self.graph.run(top_5_cited_publications_query,
                                                # author_id=author_id
                                                ).data()
        return {"author": author, "major_domains": major_domains, "top_cited_publications": top_cited_publications}

    def get_domain_with_details(self, domain_id):
        domain_and_publications_count_query = f"""
            MATCH (t:{self.THEME_NODE_LABEL})
            WHERE ID(t)={domain_id}
            OPTIONAL MATCH (t)-[tr:{self.THEME_RELATION_LABEL}]-(p:{self.PUBLICATION_NODE_LABEL})
            WHERE tr.probability > {self.THEME_RELATION_PROBABILITY}
            RETURN t as domain, count(p) as publications_count
        """

        top_10_cited_publications_query = f"""
            MATCH (t:{self.THEME_NODE_LABEL})-[tr:{self.THEME_RELATION_LABEL}]-(p:{self.PUBLICATION_NODE_LABEL})
            WHERE ID(t)={domain_id} AND tr.probability>{self.THEME_RELATION_PROBABILITY}
            MATCH (p)<-[:{self.LINKS_TO_RELATION_LABEL}]-(another_p:{self.PUBLICATION_NODE_LABEL})
            RETURN p as publication, ID(p) as publication_id, count(DISTINCT another_p) as links_count
            ORDER BY links_count
            DESC
            LIMIT 10
        """

        top_10_authors_in_domain_by_publications_count_query = f"""
            MATCH 
            (a:{self.AUTHOR_NODE_LABEL})-[:{self.WROTE_RELATION_LABEL}]-(p:{self.PUBLICATION_NODE_LABEL})-[tr:{self.THEME_RELATION_LABEL}]-(t:{self.THEME_NODE_LABEL})
            WHERE ID(t)={domain_id} AND tr.probability > {self.THEME_RELATION_PROBABILITY}
            RETURN a as author, ID(a) as author_id, count(DISTINCT p) as publications_count
            ORDER BY publications_count
            DESC
            LIMIT 10
        """

        domain_and_publications_count = self.graph.run(
            domain_and_publications_count_query,
            # theme_id=domain_id,
            # theme_relation_probability=NeoQuerier.THEME_RELATION_PROBABILITY
            ).data()[0]  # because I match theme by ID

        top_10_authors_in_domain_by_publications_count = self.graph.run(
            top_10_authors_in_domain_by_publications_count_query,
            # theme_id=domain_id,
            # theme_relation_probability=NeoQuerier.THEME_RELATION_PROBABILITY
        ).data()

        top_10_cited_publications = self.graph.run(
            top_10_cited_publications_query,
            # theme_id=domain_id,
            # theme_relation_probability=NeoQuerier.THEME_RELATION_PROBABILITY
        ).data()

        return {
            **domain_and_publications_count,
            "top_10_authors_in_domain": top_10_authors_in_domain_by_publications_count,
            "top_10_cited_publications": top_10_cited_publications
        }
