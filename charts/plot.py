__author__ = 'Arnout Aertgeerts'
__version__ = '0.0.1'

from core import MyTemplate, to_json_files, to_series, clean_dir, set_display, show_plot
from jsonencoder import ChartsJSONEncoder
from chart import Chart

import os
import json

package_directory = os.path.dirname(os.path.abspath(__file__))


def line(*args, **kwargs):
    return plot(*args, type='line', **kwargs)


def area(*args, **kwargs):
    return plot(*args, type='area', **kwargs)


def spline(*args, **kwargs):
    return plot(*args, type='spline', **kwargs)


def pie(*args, **kwargs):
    return plot(*args, type='pie', **kwargs)


def stock(*args, **kwargs):
    return plot(*args, stock=True, **kwargs)


def plot(series, options=dict(), height=400, save=False, stock=False, show='tab', display=True, type='line'):
    """
    Make a highchart plot with all data embedded in the HTML
    :param series: The necessary data, can be a list of dictionaries or a dataframe
    :param options: Options for the chart
    :param height: Chart height
    :param save: Specify a filename to save the HTML file if wanted.
    :param stock: Set to False to use Highcharts instead of highstock
    :param show: Determines how the chart is shown. Can be one of the following options:
        - 'tab': Show the chart in a new tab of the default browser
        - 'window': Show the chart in a new window of the default browser
        - 'inline': Show the chart inline (only works in IPython notebook)
        - False: Do not show the chart
    :param display: A list containing the keys of the variables you want to show initially in the plot
    :return:
    """

    options['chart'] = dict(type=type)

    # Convert to a legitimate series object
    series = to_series(series)

    # Set the display option
    series = set_display(series, display)

    with open(os.path.join(package_directory, "index.html"), "r") as html:
        inline = MyTemplate(html.read()).substitute(
            path=package_directory,
            series=json.dumps(series, cls=ChartsJSONEncoder),
            options=json.dumps(options),
            highstock=json.dumps(stock),
            height=str(height) + "px"
        )

    if save:
        with open(save, "w") as text_file:
            text_file.write(inline)
    else:
        if show != 'inline':
            save = 'index.html'
            with open(save, "w") as text_file:
                text_file.write(inline)

    return show_plot(inline, save, show)


def plotasync(
    series, options=dict(),
    height=400, save="temp", stock=False, show='tab', display=False, purge=False, live=False):
    # Set the display property default to false for an asynchronous plot
    """

    :param series:
    :param options:
    :param height:
    :param save:
    :param stock:
    :param show: Determines how the chart is shown. Can be one of the following options:
        - 'tab': Show the chart in a new tab of the default browser
        - 'window': Show the chart in a new window of the default browser
        - 'inline': Show the chart inline (only works in IPython notebook)
        - False: Do not show the chart
    :return:
    """

    # Clean the directory
    if purge:
        clean_dir(save)

    # Convert to a legitimate series object
    series = to_series(series)

    # Convert to json files
    to_json_files(series, save, display)

    with open(os.path.join(package_directory, "index-async.html"), "r") as index:
        read = index.read()

        html = MyTemplate(read).substitute(
            path=json.dumps('/' + save),
            options=json.dumps(options),
            highstock=json.dumps(stock),
            height=str(height) + "px",
            live=json.dumps(live)
        )

        inline = MyTemplate(read).substitute(
            path=json.dumps(save),
            options=json.dumps(options),
            highstock=json.dumps(stock),
            height=str(height) + "px",
            live=json.dumps(live)
        )

    html_path = os.path.join(save, 'index.html')
    with open(html_path, "w") as html_file:
        html_file.write(html)

    return Chart(inline, html_path, save, show)
