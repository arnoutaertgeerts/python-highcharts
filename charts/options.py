__author__ = 'Arnout Aertgeerts'


def default():
    options = {
        'chart': {
            'zoomType': 'y'
        },

        'tooltip': {
            'decimalValues': 2
        },
        'title': {
            'text': 'Some test data'
        },
        'legend': {
            'enabled': 'true'
        },
        'rangeSelector': {
            'buttons': [
            {
                'type': 'day',
                'count': '1',
                'text': '1d'

            }, {
                'type': 'day',
                'count': '7',
                'text': '1w'

            }, {
                'type': 'month',
                'count': '1',
                'text': '1m'
            }, {
                'type': 'month',
                'count': '3',
                'text': '3m'
            }, {
                'type': 'month',
                'count': '6',
                'text': '6m'
            }, {
                'type': 'year',
                'count': '1',
                'text': '1y'
            }, {
                'type': 'all',
                'text': 'All'
            }]
        }
    }
    return options


def area():
    return {
        'chart': {'type': 'area'},
        'title': {'text': 'Area chart'}
    }