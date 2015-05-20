__author__ = 'Arnout Aertgeerts'
__version__ = '0.0.1'

from string import Template
import os
import json
import shutil

package_directory = os.path.dirname(os.path.abspath(__file__))


class MyTemplate(Template):
    delimiter = '#'
    idpattern = r'[a-z][_a-z0-9]*'


def plot(series, options, height=400, save=False, stock=True, inline=True):
    """
    Make a highchart plot with all data embedded in the HTML
    :param series: The necessary data
    :param options: Options for the chart
    :param height: Chart height
    :param save: Specify a filename to save the HTML file if wanted.
    :param stock: Set to False to use Highcharts instead of highstock
    :param inline: Set to False to not show the chart inline
    :return:
    """
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


def plotasync(series, options, height=400, name="chart", stock=True, inline=True):
    keys = []

    if os.path.exists(name):
        shutil.rmtree(name)
    os.makedirs(name)

    for serie in series:
        serie_name = serie["name"]
        keys.append(serie_name)
        with open(os.path.join(name, serie_name + ".json"), "w") as json_file:
            json_file.write(json.dumps(serie))

    with open(os.path.join(name, 'keys.json'), "w") as keys_file:
        keys_file.write(json.dumps(keys))

    with open(os.path.join(package_directory, "index-async.html"), "r") as index:
        read = index.read()

        html = MyTemplate(read).substitute(
            path=json.dumps(""),
            options=options,
            highstock=json.dumps(stock),
            height=str(height) + "px"
        )

        string = MyTemplate(read).substitute(
            path=json.dumps(name),
            options=options,
            highstock=json.dumps(stock),
            height=str(height) + "px"
        )

    with open(os.path.join(name, 'index.html'), "w") as html_file:
        html_file.write(html)

    if inline:
        from IPython.display import HTML
        return HTML(string)
