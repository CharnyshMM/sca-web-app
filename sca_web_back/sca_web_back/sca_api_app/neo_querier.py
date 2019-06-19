#  These methods are used for running required queries in neo4j base.
#  All methods except run_cypher_query contain Cypher language strings hardcoded
#  You can edit them here.

from py2neo import Graph, Node
from .neo_config import neo_password, neo_user, neo_port, neo_host, neo_scheme


class NeoQuerier:
    REFERENCES_LIMIT = 50
    AUTHOR_NODE_LABEL = "Author"
    PUBLICATION_NODE_LABEL = "Publication"
    THEME_NODE_LABEL = "Theme"
    KEYWORD_PHRASE_NODE_LABEL = "Token"

    WROTE_RELATION_LABEL = "WROTE"
    THEME_RELATION_LABEL = "THEME_RELATION"
    KEYWORDS_RELATION_LABEL = "KEYWORDS"
    LINKS_TO_RELATION_LABEL = "LINKS_TO"
    THEME_RELATION_PROBABILITY = 0.4

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

    def get_themes(self):
        query = f"""
            MATCH (t:{self.THEME_NODE_LABEL})
            WHERE EXISTS(t.name)
            RETURN t.name AS name, ID(t) as id
        """

        themes = self.graph.run(query).data()
        return themes

    def get_authors(self):
        query = f"""
            MATCH (a:{self.AUTHOR_NODE_LABEL})
            WHERE EXISTS(a.name)
            RETURN a.name AS name, ID(a) as id
        """

        authors = self.graph.run(query).data()
        return authors

    def get_authorities_in_domains(self, domains_list, offset, limit):
        lower_domains = [d.lower() for d in domains_list]   # that's important to send low_case domains name!
        query = f"""
                MATCH (a:{self.AUTHOR_NODE_LABEL})-[:{self.WROTE_RELATION_LABEL}]-(p:{self.PUBLICATION_NODE_LABEL}),
                 (p)-[r:{self.THEME_RELATION_LABEL}]-(d:{self.THEME_NODE_LABEL})
                WHERE toFloat(r.probability) > {self.THEME_RELATION_PROBABILITY} AND EXISTS(a.name) 
                OPTIONAL MATCH (p)<-[l:{self.LINKS_TO_RELATION_LABEL}]-()
                WITH collect(DISTINCT toLower(d.name)) as domains, 
                    count(distinct p) as publications_count, 
                    count(distinct l) as links_count,
                    a 
                WHERE ALL(domain_name in {{wanted_domains}} WHERE domain_name in domains)
                RETURN a as author,
                    publications_count,
                    links_count 
                ORDER BY publications_count DESC
                SKIP {offset}
                LIMIT {limit}
            """

        result = self.graph.run(
            query, {"wanted_domains": lower_domains}
        )
        return result.data()

    def get_domains_by_popularity_index(self, popularity_index=0, higher=True):
        yearly_dynamics_query = f"""
            MATCH (t:{self.THEME_NODE_LABEL})<-[t_r:{self.THEME_RELATION_LABEL}]-(p:{self.PUBLICATION_NODE_LABEL})
                WHERE toFloat(t_r.probability) > {self.THEME_RELATION_PROBABILITY}
                WITH COLLECT(DISTINCT p) as pubs, t
                UNWIND pubs as distinct_pubs
                WITH collect(toFloat(distinct_pubs.year)) as publications_years, t, pubs
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
                    WHERE toFloat(r.probability) > {self.THEME_RELATION_PROBABILITY}
                OPTIONAL MATCH (a:{self.AUTHOR_NODE_LABEL})-[:{self.WROTE_RELATION_LABEL}]-(n)
                OPTIONAL MATCH (n)-[:{self.WROTE_RELATION_LABEL}]->(p)
                OPTIONAL MATCH (n)<-[t_r:{self.THEME_RELATION_LABEL}]-(t_p)
                    WHERE toFloat(t_r.probability) > {self.THEME_RELATION_PROBABILITY}
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

    def find_publications(self, name, requested_themes_ids=None, requested_authors_ids=None, skip_n=0, limit_n=10):
        query = f"""
            MATCH (p:Publication)
            WHERE EXISTS(p.name) and toLower(p.name) STARTS WITH "{name}"
            optional match (p)-[:WROTE]-(a:Author)
            optional match (p)-[tr:THEME_RELATION]-(t:Theme)
            WHERE toFloat(tr.probability)>{self.THEME_RELATION_PROBABILITY}
            WITH collect(DISTINCT t) as themes, collect(DISTINCT toLower(t.name)) as themes_names, p, 
                collect(DISTINCT a) as authors, 
                collect(DISTINCT toLower(a.name)) as author_names
        """

        themes_query = f" ALL(t_id in {requested_themes_ids} WHERE toLower(t_id) in themes_names) "
        authors_query = f" ANY(a_id in {requested_authors_ids} WHERE toLower(a_id) in author_names) "
        return_statement = f""" 
         RETURN 
            DISTINCT p as node, 
            LABELS(p) as type,
            ID(p) as id,
            themes,
            authors[0] as author
            SKIP {skip_n}
            LIMIT {limit_n}
        """
        
        authors_constraints_exists = requested_authors_ids != None and len(requested_authors_ids) > 0
        themes_constraints_exists = requested_themes_ids != None and len(requested_themes_ids) > 0

        if themes_constraints_exists and authors_constraints_exists:
            query += "WHERE" + themes_query + "AND" + authors_query
        elif themes_constraints_exists:
            query += "WHERE" + themes_query
        elif authors_constraints_exists:
            query += "WHERE" + authors_query

        query += return_statement

        return self.graph.run(query).data()
           

    def find_authors(self, name, requested_themes, skip_n=0, limit_n=10):
        query = f"""
            MATCH (a:Author)-[:WROTE]-(p:Publication),
                (p)-[tr:THEME_RELATION]-(t:Theme)
            WHERE toLower(a.name) STARTS WITH "{name}"
                AND toFloat(tr.probability) > {self.THEME_RELATION_PROBABILITY}
            WITH a, count(DISTINCT p) as author_pubs, collect(distinct toLower(t.name)) as themes
            """
        return_part = f"""
            return 
                DISTINCT a as node, 
                LABELS(a) as type,
                ID(a) as id,
                author_pubs
            order by author_pubs desc
            SKIP {skip_n}
            LIMIT {limit_n}
        """

        if requested_themes != None and len(requested_themes) > 0:
            query += f"""
             WHERE ALL( t in {requested_themes} where toLower(t) in themes)
            """
        query += return_part
        return self.graph.run(query).data()

    def get_domain_with_details(self, domain_id):
        domain_and_publications_count_query = f"""
            MATCH (t:{self.THEME_NODE_LABEL})
            WHERE ID(t)={domain_id}
            OPTIONAL MATCH (t)-[tr:{self.THEME_RELATION_LABEL}]-(p:{self.PUBLICATION_NODE_LABEL})
            WHERE toFloat(tr.probability) > {self.THEME_RELATION_PROBABILITY}
            RETURN t as domain, count(p) as publications_count
        """

        top_10_cited_publications_query = f"""
            MATCH (t:{self.THEME_NODE_LABEL})-[tr:{self.THEME_RELATION_LABEL}]-(p:{self.PUBLICATION_NODE_LABEL})
            WHERE ID(t)={domain_id} AND toFloat(tr.probability)>{self.THEME_RELATION_PROBABILITY}
            MATCH (p)<-[:{self.LINKS_TO_RELATION_LABEL}]-(another_p:{self.PUBLICATION_NODE_LABEL})
            RETURN p as publication, ID(p) as publication_id, count(DISTINCT another_p) as links_count
            ORDER BY links_count
            DESC
            LIMIT 10
        """

        top_10_authors_in_domain_by_publications_count_query = f"""
            MATCH 
            (a:{self.AUTHOR_NODE_LABEL})-[:{self.WROTE_RELATION_LABEL}]-(p:{self.PUBLICATION_NODE_LABEL})-[tr:{self.THEME_RELATION_LABEL}]-(t:{self.THEME_NODE_LABEL})
            WHERE ID(t)={domain_id} AND toFloat(tr.probability) > {self.THEME_RELATION_PROBABILITY} AND EXISTS(a.name)
            RETURN a as author, ID(a) as author_id, count(DISTINCT p) as publications_count
            ORDER BY publications_count
            DESC
            LIMIT 10
        """

        publications_yearly_dynamics_query = f"""
            MATCH (t:{self.THEME_NODE_LABEL})<-[t_r:{self.THEME_RELATION_LABEL}]-(p:{self.PUBLICATION_NODE_LABEL})
                WHERE ID(t) = {domain_id} and toFloat(t_r.probability) > {self.THEME_RELATION_PROBABILITY}
                WITH COLLECT(DISTINCT p) as pubs, t
                UNWIND pubs as distinct_pubs
                WITH collect(toFloat(distinct_pubs.year)) as publications_years
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
            if year < 1000 or year > 2019:
                continue
            if year in domain_dynamics:
                domain_dynamics[int(year)] += 1
            else:
                domain_dynamics[int(year)] = 1

        return {
            **domain_and_publications_count,
            "top_10_authors_in_domain": top_10_authors_in_domain_by_publications_count,
            "top_10_cited_publications": top_10_cited_publications,
            "yearly_dynamics": domain_dynamics
        }

    def get_publication_graph(self, publication_id):
        author_publication_query = f"""
            match (p:{self.PUBLICATION_NODE_LABEL})
            where ID(p)={publication_id}
            optional match (p)-[p_a:{self.WROTE_RELATION_LABEL}]-(a:{self.AUTHOR_NODE_LABEL})
            return p, p_a, a
        """

        publication_themes_query = f"""
            match (p:{self.PUBLICATION_NODE_LABEL})-[t_r:{self.THEME_RELATION_LABEL}]-(t:{self.THEME_NODE_LABEL})
            where ID(p)={publication_id} AND toFloat(t_r.probability)>{self.THEME_RELATION_PROBABILITY}
            return t_r as theme_relation, t as theme
        """

        publication_referenses_query = f"""
            match (p:{self.PUBLICATION_NODE_LABEL})
            where ID(p)={publication_id}
            optional match (p)-[out_l_t:{self.LINKS_TO_RELATION_LABEL}]->(:{self.PUBLICATION_NODE_LABEL})
            optional match (p)<-[in_l_t:{self.LINKS_TO_RELATION_LABEL}]-(:{self.PUBLICATION_NODE_LABEL})
            return 
                collect(distinct out_l_t) as outcoming_references_relationships,
                collect(distinct in_l_t) as incoming_references_relationships
        """

        author_publication = self.graph.run(author_publication_query).data()
        publication_themes = self.graph.run(publication_themes_query).data()
        publication_referenses = self.graph.run(publication_referenses_query).data()[0]
        
        return {
            "authors": [entry["a"] for entry in author_publication],
            "publication": author_publication[0]["p"],
            "author_publication": NeoQuerier.separate_nodes_and_relationships_from_list(author_publication),
            "publication_themes": NeoQuerier.separate_nodes_and_relationships_from_list(publication_themes),
            "publication_referenses": {
               "outcoming": NeoQuerier.get_relationships_graph(publication_referenses["outcoming_references_relationships"][:100], "end_node"),
               "incoming": NeoQuerier.get_relationships_graph(publication_referenses["incoming_references_relationships"][:100], "start_node")
            }
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
            optional match (p)-[t_r:THEME_RELATION]->(t:Theme)
                WHERE toFloat(t_r.probability)>{self.THEME_RELATION_PROBABILITY}
            optional match (p)-[out_r_r:LINKS_TO]->(:Publication)<-[out_author_wrote:WROTE]-(out_author:Author)
                where EXISTS(out_author.name)
            optional match (p)<-[in_r_r:LINKS_TO]-(:Publication)<-[in_author_wrote:WROTE]-(in_author:Author)
                where EXISTS(in_author.name)
            return p as publication,
                w as author_publication_relationship,
                collect(distinct t_r) as themes_relations,
                collect(distinct out_r_r) as outcoming_references_relations,
                collect(distinct in_r_r) as incoming_references_relations,
                collect(distinct out_author_wrote) as out_linked_publications_author_relations,
                collect(distinct in_author_wrote) as in_linked_publications_author_relations
            order by size(incoming_references_relations) desc
            limit 5
        """

        author_pubcount = self.graph.run(author_query).data()[0] # ???
        publications_relations_and_themes = self.graph.run(relations_and_themes_query).data()
        top_publications = []
        for entry in publications_relations_and_themes:
            outcoming_references_graph = NeoQuerier.get_relationships_graph(
                entry["outcoming_references_relations"][:NeoQuerier.REFERENCES_LIMIT], 
                "end_node"
                )
            incoming_references_graph = NeoQuerier.get_relationships_graph(
                entry["incoming_references_relations"][:NeoQuerier.REFERENCES_LIMIT], 
                "start_node")
            themes_graph = NeoQuerier.get_relationships_graph(entry["themes_relations"], "end_node")

            outcoming_authors_nodes = {}
            outcoming_authors_links = {}
            incoming_authors_nodes = {}
            incoming_authors_links = {}
            
            for wrote_relationship in entry["out_linked_publications_author_relations"][:NeoQuerier.REFERENCES_LIMIT]:
                author = wrote_relationship.start_node
                outcoming_authors_nodes[author.identity] = author
                outcoming_authors_links[wrote_relationship.identity] = wrote_relationship
            for wrote_relationship in entry["in_linked_publications_author_relations"][:NeoQuerier.REFERENCES_LIMIT]:
                author = wrote_relationship.start_node
                incoming_authors_nodes[author.identity] = author
                incoming_authors_links[wrote_relationship.identity] = wrote_relationship
            
			
            outcoming_references_graph["authors"] = {
                "nodes": outcoming_authors_nodes,
                "relationships": outcoming_authors_links
            }
            incoming_references_graph["authors"] = {
                "nodes": incoming_authors_nodes,
                "relationships": incoming_authors_links
            }

            top_publications.append({
                "publication": entry["publication"],
                "author_publication_relationship": entry["author_publication_relationship"],
                "themes": themes_graph,
                "references": {
                    "incoming": incoming_references_graph,
                    "outcoming": outcoming_references_graph
                }
            })

        result = {
            "author": author_pubcount["author"],
            "publications_count": author_pubcount["publications_count"],
            "top_publications": top_publications
        }

        return result


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
            if (entry is None):
                continue
            if type(entry) == Node:
                nodes[entry.identity] = entry
            else:
                relationships[entry.identity] = entry
        return nodes, relationships

    @staticmethod
    def get_relationships_graph(relationships_list, attribute_name):
        nodes = {}
        relationships = {}
        for relationship in relationships_list:
            rel_id = f"{relationship.start_node.identity}>{relationship.end_node.identity}"
            relationships[rel_id] = relationship
            node = getattr(relationship, attribute_name)
            nodes[node.identity] = node
        return {
            "nodes": nodes,
            "relationships": relationships
        }

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