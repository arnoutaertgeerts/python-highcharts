__author__ = 'Arnout Aertgeerts'
__version__ = '0.0.1'

from string import Template
import os
import json

package_directory = os.path.dirname(os.path.abspath(__file__))


class MyTemplate(Template):
    delimiter = '#'
    idpattern = r'[a-z][_a-z0-9]*'


def plot(series, options, height=400, save=False, stock=True, inline=True):

    with open(os.path.join(package_directory, "index.html"), "r") as html:
        string = MyTemplate(html.read()).substitute(
            path=package_directory,
            series=series,
            options=options,
            highstock=json.dumps(stock),
            height=str(height) + "px"
        )

    if save:
        with open(save, "w") as text_file:
            text_file.write(string)

    if inline:
        from IPython.display import HTML
        return HTML(string)

    if not save and not inline:
        print 'You should either save the file or show it inline in an IPython notebook. Both options are set to False.'
