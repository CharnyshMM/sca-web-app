import json

import py2neo


class NeoDataJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, py2neo.Node):
            print("ixixix")
            return ["1"]
        print("ohohoh")
        return json.JSONEncoder.default(self, obj)

    def encode(self, o):
        print("enc:",o)
        return json.JSONEncoder.encode(self,o)

    def iterencode(self, o, _one_shot=False):
        print("iter",o)
        return json.JSONEncoder.iterencode(self, o, _one_shot)
