from py2neo import Graph
from .neo_config import neo_password, neo_user, neo_port, neo_host, neo_scheme


def run_cypher_query(query):
    graph = Graph(host=neo_host, port=neo_port, scheme=neo_scheme, user=neo_user, password=neo_password)
    c = graph.run(query)
    return c.data()


def get_nodes_count():
    graph = Graph(host=neo_host, port=neo_port, scheme=neo_scheme, user=neo_user, password=neo_password)
    c = graph.evaluate("MATCH(c) RETURN COUNT(c)")
    return c


def get_authorities_in_domains(domains_list):
    graph = Graph(host=neo_host, port=neo_port, scheme=neo_scheme, user=neo_user, password=neo_password)
    result = graph.run('MATCH (a:Author)-[:WROTE]-(p:Publication), '
                       '(p)-[r:THEME_RELATION]-(d:Theme) '
                       'WHERE r.probability > 0.5 WITH collect(d.name) as domains, '
                       'collect(distinct p) as pub, a '
                       'WHERE ALL(domain_name in {domains_list} '
                       'WHERE domain_name in domains) RETURN a, length(pub)', domains_list=domains_list)
    return result.data()
