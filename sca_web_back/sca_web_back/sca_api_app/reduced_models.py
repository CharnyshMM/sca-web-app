import py2neo

class ReducedPublication: 
  def __init__(self, publication_node):
    self.identity = str(publication_node.identity)
    self.id = self.identity
    self.name = publication_node["name"]
    self.year = publication_node["year"]
    self.labels = list(publication_node.labels)
    self.type = type(publication_node).__name__

  def __iter__(self):
    yield 'identity', self.identity
    yield 'id', self.id
    yield 'name', self.name
    yield 'labels', self.labels
    yield 'type', self.type
    yield 'year', self.year
  