__author__ = 'Arnout Aertgeerts'

import json


class ChartsJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        try:
            import numpy
            if isinstance(obj, numpy.ndarray):
                if obj.ndim == 1:
                    return obj.tolist()
                else:
                    return [self.default(obj[i]) for i in range(obj.shape[0])]
            elif isinstance(obj, numpy.generic):
                return obj.item()
        except ImportError:
            pass

        return json.JSONEncoder.default(self, obj)
