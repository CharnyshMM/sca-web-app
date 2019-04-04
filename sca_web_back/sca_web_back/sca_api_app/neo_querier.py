#  These methods are used for running required queries in neo4j base.
#  All methods except run_cypher_query contain Cypher language strings hardcoded
#  You can edit them here.

from py2neo import Graph, Node
from .neo_config import neo_password, neo_user, neo_port, neo_host, neo_scheme


class NeoQuerier:
    AUTHOR_NODE_LABEL = "Author"
    PUBLICATION_NODE_LABEL = "Publication"
    THEME_NODE_LABEL = "Theme"
    KEYWORD_PHRASE_NODE_LABEL = "Token"

    WROTE_RELATION_LABEL = "WROTE"
    THEME_RELATION_LABEL = "THEME_RELATION"
    KEYWORDS_RELATION_LABEL = "KEYWORDS"
    LINKS_TO_RELATION_LABEL = "LINKS_TO"
    THEME_RELATION_PROBABILITY = 0.02

    def __init__(self):
        self.graph = Graph(host=neo_host, port=neo_port, scheme=neo_scheme, user=neo_user, password=neo_password)

    def run_cypher_query(self, query):
        c = self.graph.run(query)
        return c.data()

    def get_nodes_count(self, label=None):
        if not label:
            query = "MATCH(c) RETURN COUNT(c)"
        else:
            query = "MATCH(a:{}) RETURN COUNT(a)".format(label)
        c = self.graph.evaluate(query)
        return c

    def get_themes_list(self):
        query = """
            MATCH (t:Theme)
            RETURN t AS theme, ID(t) as id
        """

        themes = self.graph.run(query).data()
        return themes

    def get_authorities_in_domains(self, domains_list):
        lower_domains = [d.lower() for d in domains_list]   # that's important to send low_case domains name!
        query = f"""
                MATCH (a:{self.AUTHOR_NODE_LABEL})-[:{self.WROTE_RELATION_LABEL}]-(p:{self.PUBLICATION_NODE_LABEL}),
                 (p)-[r:{self.THEME_RELATION_LABEL}]-(d:{self.THEME_NODE_LABEL})
                WHERE r.probability > {self.THEME_RELATION_PROBABILITY} AND EXISTS(a.name) 
                OPTIONAL MATCH (p)<-[l:{self.LINKS_TO_RELATION_LABEL}]-()
                WITH collect(DISTINCT toLower(d.name)) as domains, 
                    count(distinct p) as publications_count, 
                    count(distinct l) as links_count,
                    a 
                WHERE ALL(domain_name in {lower_domains} WHERE domain_name in domains)
                RETURN a as author,
                    publications_count,
                    links_count 
                ORDER BY publications_count DESC 
            """

        result = self.graph.run(
            query,
        )
        return result.data()

    def get_author_with_publications_in_domains(self, author_name, domains_list):
        domains_list = [d.lower() for d in domains_list]
        query = f"""
            MATCH (a:{self.AUTHOR_NODE_LABEL})-[:{self.WROTE_RELATION_LABEL}]-(p:{self.PUBLICATION_NODE_LABEL}),
            (p)-[r:{self.THEME_RELATION_LABEL}]-(d:{self.THEME_NODE_LABEL}) 
            WHERE a.name="{author_name}" AND r.probability > {self.THEME_RELATION_PROBABILITY}
             WITH collect( toLower(d.name)) as domains, 
            collect(distinct p) as pub, a,collect(distinct ID(p)) as pub_ids 
            WHERE ALL(domain_name in {domains_list} WHERE domain_name in domains)
            RETURN a, ID(a) as author_id, pub, pub_ids
        """
        print(query)
        result = self.graph.run(query)
        rd = result.data()
        print(rd)
        return rd

    def get_articles_by_keywords(self, keywords_list):
        keywords_list = [k.lower() for k in keywords_list]
        query = f"""
            MATCH (a:{self.AUTHOR_NODE_LABEL})-[:{self.WROTE_RELATION_LABEL}]-(p:{self.PUBLICATION_NODE_LABEL}),
             (p)-[r:{self.KEYWORDS_RELATION_LABEL}]-(d:{self.KEYWORD_PHRASE_NODE_LABEL}) 
            WHERE EXISTS(a.name)
            WITH collect(toLower(d.phrase)) as publ_keyphrases, collect(distinct p) as pub, a 
            WHERE ALL(key in {keywords_list} WHERE key in publ_keyphrases) 
            RETURN a, pub
        """

        result = self.graph.run(query, keywords_list=keywords_list)
        return result.data()

    def get_domains_by_popularity_index(self, popularity_index=0, higher=True):
        yearly_dynamics_query = f"""
            MATCH (t:{self.THEME_NODE_LABEL})<-[t_r:{self.THEME_RELATION_LABEL}]-(p:{self.PUBLICATION_NODE_LABEL})
                WHERE t_r.probability > {self.THEME_RELATION_PROBABILITY}
                WITH COLLECT(DISTINCT p) as pubs, t
                UNWIND pubs as distinct_pubs
                WITH collect(distinct_pubs.year) as publications_years, t, pubs
                RETURN t, ID(t) as t_id, publications_years, size(pubs) as publications_count
        """

        yearly_dynamics = self.graph.run(yearly_dynamics_query)
        domains_yearly_dynamics_response = []
        maximum_publications_in_period_count = 0
        for entry in yearly_dynamics:

            dynamics = NeoQuerier.split_domain_dynamics(entry["publications_years"])
            maximum_publications_in_period_count = max(maximum_publications_in_period_count, dynamics["maximum_count"])

            domains_yearly_dynamics_response.append({
                "theme": entry["t"],
                "theme_id": entry["t_id"],
                "dynamics": dynamics,
                "publications_count": entry["publications_count"]
            })

        return {
            "themes": domains_yearly_dynamics_response,
            "maximum_publications_in_period_count": maximum_publications_in_period_count
        }



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
                    DISTINCT n as node,
                    LABELS(n) as type,
                    ID(n) as id,
                    a as author, 
                    author_pubs, 
                    publications_on_theme,
                    links_to_pub,
                    themes,
                    MAX(coeff) as sorter
                ORDER BY sorter DESC
                SKIP {skip_n}
                LIMIT {limit_n}
        """



        if node_type is not None and node_type.lower() != "all":
            query = match_type.format(node_type.capitalize()) + query
        else:
            query = match + query
        print(limit_n, skip_n)
        result = self.graph.run(query)
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

        linked_publications_authors_query = f"""
            MATCH (a:Author)-[a_p:WROTE]-(p:Publication)
            WHERE ID(p)={publication_id}
            MATCH (p)<-[l_p:LINKS_TO]-(another_p:Publication)
            MATCH (another_p)-[ap_aa:WROTE]-(another_a:Author)
            RETURN 
                a as author, 
                a_p,
                p as publication, 
                another_a as another_author,
                COLLECT(DISTINCT another_p) as linked_publications,
                COLLECT(DISTINCT ap_aa) as linked_publications_author_publication_links,
                COLLECT(DISTINCT l_p) as citation_links
            ORDER BY SIZE(linked_publications) DESC
            LIMIT 10
        """

        result = self.graph.run(query).data()
        linked_publications_authors = self.graph.run(linked_publications_authors_query).data()
        # destructing linked_publications_authors into single long list with nodes & links
        citation_graph = []

        for entry in linked_publications_authors:
            citation_graph.append(linked_publications_authors[0]["author"])
            citation_graph.append(linked_publications_authors[0]["publication"])
            citation_graph.append(linked_publications_authors[0]["a_p"])
            citation_graph.append(entry["another_author"])
            citation_graph += entry["linked_publications"]
            citation_graph += entry["linked_publications_author_publication_links"]
            citation_graph += entry["citation_links"]

        print(citation_graph)
        return [{ "general": result[0], "linked_publications_graph": citation_graph }]

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

        yearly_publishing_statistics_query = f"""
            MATCH (a:{self.AUTHOR_NODE_LABEL})-[:{self.WROTE_RELATION_LABEL}]-(p:{self.PUBLICATION_NODE_LABEL})
            where ID(a)={author_id}
            WITH collect(DISTINCT p) as publications
            UNWIND publications as distinct_pub
            RETURN collect(distinct_pub.year) as publication_years
        """

        author = self.graph.run(author_info_query).data()[0]["author"] # [0] because matching by ID still returns list
        major_domains = self.graph.run(major_domains_for_author_query).data()
        top_cited_publications = self.graph.run(top_5_cited_publications_query).data()
        yearly_publishing_statistics = self.graph.run(yearly_publishing_statistics_query).data()

        return {
            "author": author,
            "major_domains": major_domains,
            "top_cited_publications": top_cited_publications,
            "yearly_publishing_statistics": yearly_publishing_statistics
        }

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
            WHERE ID(t)={domain_id} AND tr.probability > {self.THEME_RELATION_PROBABILITY} AND EXISTS(a.name)
            RETURN a as author, ID(a) as author_id, count(DISTINCT p) as publications_count
            ORDER BY publications_count
            DESC
            LIMIT 10
        """

        publications_yearly_dynamics_query = f"""
            MATCH (t:{self.THEME_NODE_LABEL})<-[t_r:{self.THEME_RELATION_LABEL}]-(p:{self.PUBLICATION_NODE_LABEL})
                WHERE ID(t) = {domain_id} and t_r.probability > {self.THEME_RELATION_PROBABILITY}
                WITH COLLECT(DISTINCT p) as pubs, t
                UNWIND pubs as distinct_pubs
                WITH collect(distinct_pubs.year) as publications_years
                RETURN publications_years
        """

        domain_and_publications_count = self.graph.run(domain_and_publications_count_query).data()[0]  # because I match theme by ID

        top_10_authors_in_domain_by_publications_count = self.graph.run(
            top_10_authors_in_domain_by_publications_count_query
        ).data()

        top_10_cited_publications = self.graph.run(
            top_10_cited_publications_query,
        ).data()

        publications_yearly_dynamics = self.graph.run(publications_yearly_dynamics_query).data()[0]["publications_years"]

        domain_dynamics = {}

        for year in publications_yearly_dynamics:
            if year == 0 or year <0:
                continue
            if year in domain_dynamics:
                domain_dynamics[year] += 1
            else:
                domain_dynamics[year] = 1

        return {
            **domain_and_publications_count,
            "top_10_authors_in_domain": top_10_authors_in_domain_by_publications_count,
            "top_10_cited_publications": top_10_cited_publications,
            "yearly_dynamics": domain_dynamics
        }

    def get_publication_graph(self, publication_id):
        author_publication_query = f"""
            match (p:{self.PUBLICATION_NODE_LABEL})-[p_a:{self.WROTE_RELATION_LABEL}]-(a:{self.AUTHOR_NODE_LABEL})
            where ID(p)={publication_id}
            return p, p_a, a
        """

        publication_themes_query = f"""
            match (p:{self.PUBLICATION_NODE_LABEL})-[t_r:{self.THEME_RELATION_LABEL}]-(t:{self.THEME_NODE_LABEL})
            where ID(p)={publication_id} AND t_r.probability>{self.THEME_RELATION_PROBABILITY}
            return t_r as theme_relation, t as theme
        """

        publication_referenses_query = f"""
            match (p:{self.PUBLICATION_NODE_LABEL})-[l_t:{self.LINKS_TO_RELATION_LABEL}]-(another_p:{self.PUBLICATION_NODE_LABEL})
            where ID(p)={publication_id}
            return l_t as links_to_relation, another_p as publication
        """

        author_publication = self.graph.run(author_publication_query).data()
        publication_themes = self.graph.run(publication_themes_query).data()
        publication_referenses = self.graph.run(publication_referenses_query).data()

        return {
            "author": author_publication[0]["a"],
            "publication": author_publication[0]["p"],
            "author_publication": NeoQuerier.separate_nodes_and_relationships_from_list(author_publication),
            "publication_themes": NeoQuerier.separate_nodes_and_relationships_from_list(publication_themes),
            "publication_referenses": NeoQuerier.separate_nodes_and_relationships_from_list(publication_referenses)
        }

    def get_author_graph(self, author_id):
        
        author_query = f"""
            match (a:Author)-[:WROTE]-(p:Publication)
            where ID(a) = {author_id}
            return a as author, count(p) as publications_count
        """

        # TODO: INTERPOLATE
        relations_and_themes_query = f"""
            match (p:Publication)-[w:WROTE]-(a:Author)
	            WHERE ID(a)={author_id}
            optional match (p)-[t_r:THEME_RELATION]-(t:Theme)
                WHERE t_r.probability>0.1
            optional match (p)-[r_r:LINKS_TO]-(another_p:Publication)
            optional match (another_p)-[another_w:WROTE]-(another_p_a:Author)
                where EXISTS(another_p_a.name)
            return p as publication,
                w as author_publication_relationship,
                collect(distinct t_r) as themes_relations,
                collect(DISTINCT t) as themes,
                collect(distinct r_r) as references_relations,
                collect(distinct another_p) as linked_publications,
                collect(distinct another_w) as linked_publications_author_relations,  
                collect(distinct another_p_a) as linked_publication_authors
            order by size(linked_publications) desc
            limit 10
        """

        author_pubcount = self.graph.run(author_query).data()[0]# ???
        publications_relations_and_themes = self.graph.run(relations_and_themes_query).data()

        return {
            "author": author_pubcount["author"],
            "publications_count": author_pubcount["publications_count"],
            "publications_relations_themes": publications_relations_and_themes
        }


    @staticmethod
    def separate_nodes_and_relationships_from_list(graph_data_list):
        nodes = {}
        relationships = {}
        for entry in graph_data_list:
            entry_nodes, entry_relationships = NeoQuerier.separate_nodes_and_relationships(entry)
            nodes.update(entry_nodes)
            relationships.update(entry_relationships)
        
        return { 
            "nodes": nodes,
            "relationships": relationships
        }

    @staticmethod
    def separate_nodes_and_relationships(graph_data_entry):
        nodes = {}
        relationships = {}

        for entry in graph_data_entry.values():
            
            if type(entry) == Node:
                nodes[entry.identity] = entry
            else:
                relationships[entry.identity] = entry
        return nodes, relationships

    @staticmethod
    def split_domain_dynamics(years):
        before_1950 = 0
        between_1950_and_1970 = 0
        between_1970_and_1990 = 0
        between_1990_and_2010 = 0
        after_2010 = 0
        for y in years:
            if y <= 1950:
                before_1950 += 1
            elif 1950 < y <= 1970:
                between_1950_and_1970 += 1
            elif 1970 < y <= 1990:
                between_1970_and_1990 += 1
            elif 1990 < y <= 2010:
                between_1990_and_2010 += 1
            elif y > 2010:
                after_2010 += 1
        return {
            "before_1950": before_1950,
            "between_1950_and_1970": between_1950_and_1970,
            "between_1970_and_1990": between_1970_and_1990,
            "between_1990_and_2010": between_1990_and_2010,
            "after_2010": after_2010,
            "maximum_count": max(
                before_1950,
                between_1950_and_1970,
                between_1970_and_1990,
                between_1990_and_2010,
                after_2010
            )
        }