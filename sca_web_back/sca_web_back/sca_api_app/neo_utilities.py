from py2neo import Graph
from .neo_config import neo_password, neo_user, neo_port, neo_host, neo_scheme


def run_cypher_query(query):
    graph = Graph(host=neo_host, port=neo_port, scheme=neo_scheme, user=neo_user, password=neo_password)
    c = graph.run(query)
    return c.data()
