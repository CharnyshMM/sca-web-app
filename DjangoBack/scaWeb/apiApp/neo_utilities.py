from py2neo import Graph
from . import config


def run_query(query):
    graph = Graph(host=config.neo_host, port=config.neo_port, user=config.neo_user, password=config.neo_passw)
    result = graph.run(query)
    return result.data()

def get_nodes_count():
    graph = Graph(host=config.neo_host, port=config.neo_port, user=config.neo_user, password=config.neo_passw)
    return len(graph)
