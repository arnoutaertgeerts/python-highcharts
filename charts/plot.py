__author__ = 'Arnout Aertgeerts'
__version__ = '0.0.1'

from string import Template

import os
import json
import shutil
import webbrowser

package_directory = os.path.dirname(os.path.abspath(__file__))


class MyTemplate(Template):
    delimiter = '$$'
    idpattern = r'[a-z][_a-z0-9]*'


def plot(series, options, height=400, save=False, stock=False, show='tab'):
    """
    Make a highchart plot with all data embedded in the HTML
    :param series: The necessary data
    :param options: Options for the chart
    :param height: Chart height
    :param save: Specify a filename to save the HTML file if wanted.
    :param stock: Set to False to use Highcharts instead of highstock
    :param show: Determines how the chart is shown. Can be one of the following options:
        - 'tab': Show the chart in a new tab of the default browser
        - 'window': Show the chart in a new window of the default browser
        - 'inline': Show the chart inline (only works in IPython notebook)
        - False: Do not show the chart
    :return:
    """

    # Set the display property default to true for a synchronous plot
    for serie in series:
        if 'display' not in serie:
            serie['display'] = True

    with open(os.path.join(package_directory, "index.html"), "r") as html:
        string = MyTemplate(html.read()).substitute(
            path=package_directory,
            series=json.dumps(series),
            options=json.dumps(options),
            highstock=json.dumps(stock),
            height=str(height) + "px"
        )

    if save:
        with open(save, "w") as text_file:
            text_file.write(string)
    else:
        if show != 'inline':
            save = 'index.html'
            with open(save, "w") as text_file:
                text_file.write(string)

    if show == 'inline':
        from IPython.display import HTML
        return HTML(string)

    elif show == 'tab':
        webbrowser.open_new_tab(save)

    elif show == 'window':
        webbrowser.open_new(save)

    else:
        if save:
            print 'Chart saved to %s', save


def plotasync(series, options, height=400, name="chart", stock=True, show='tab'):

    # Set the display property default to false for an asynchronous plot
    """

    :param series:
    :param options:
    :param height:
    :param name:
    :param stock:
    :param show: Determines how the chart is shown. Can be one of the following options:
        - 'tab': Show the chart in a new tab of the default browser
        - 'window': Show the chart in a new window of the default browser
        - 'inline': Show the chart inline (only works in IPython notebook)
        - False: Do not show the chart
    :return:
    """
    for serie in series:
        if 'display' not in serie:
            serie['display'] = False

    keys = []

    if os.path.exists(name):
        shutil.rmtree(name)
    os.makedirs(name)

    #TODO: Allow user saved json files to be read
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
            options=json.dumps(options),
            highstock=json.dumps(stock),
            height=str(height) + "px"
        )

        string = MyTemplate(read).substitute(
            path=json.dumps(name),
            options=json.dumps(options),
            highstock=json.dumps(stock),
            height=str(height) + "px"
        )

    html_path = os.path.join(name, 'index.html')
    with open(html_path, "w") as html_file:
        html_file.write(html)

    if show == 'inline':
        from IPython.display import HTML
        return HTML(string)

    elif show == 'tab':
        webbrowser.open_new_tab(html_path)

    elif show == 'window':
        webbrowser.open_new(html_path)

