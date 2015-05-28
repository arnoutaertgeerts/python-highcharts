__author__ = 'Arnout Aertgeerts'

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


def plot(
    series, options={}, type='line', name=False,
    height=400, save=False, stock=False, show='tab', display=True):
    """
    Make a highchart plot with all data embedded in the HTML
    :param type: Type of the chart
    :param series: The necessary data, can be a list of dictionaries or a dataframe
    :param options: Options for the chart
    :param height: Chart height
    :param save: Specify a filename to save the HTML file if wanted.
    :param stock: Set to False to use Highcharts instead of highstock
    :param show: Determines how the chart is shown. Can be one of the following options:
        - 'tab': Show the chart in a new tab of the default browser
        - 'window': Show the chart in a new window of the default browser
        - 'inline': Show the chart inline (only works in IPython notebook)
    :param display: A list containing the keys of the variables you want to show initially in the plot
    :return:
    """

    options = dict(chart=dict(type=type))

    # Convert to a legitimate series object
    series = to_series(series, name)

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
    series, options=dict(), type='line',
    height=400, save="temp", stock=False, show='tab', display=False, purge=False, live=False):
    """

    :param type: Type of the chart. Can be line, area, spline, pie, bar, ...
    :param display: Set to true to display all, False to display none or an array of names for a specific selection
    :param purge: Set to true to clean the directory
    :param live: Set to true to keep the chart in sync with data in the directory. Currently only works for show='tab'
    :param series: The series object which contains the data
    :param options: The chart display options
    :param height: Height of the chart
    :param save: Name of the directory to store the data
    :param stock: Set to true to use highstock
    :param show: Determines how the chart is shown. Can be one of the following options:
        - 'tab': Show the chart in a new tab of the default browser
        - 'window': Show the chart in a new window of the default browser
        - 'inline': Show the chart inline (only works in IPython notebook)
    :return: A chart object
    """

    try:
        if not options['chart']:
            options['chart'] = dict(type=type)
    except KeyError:
        options['chart'] = dict(type=type)

    # Clean the directory
    if purge:
        clean_dir(save)

    # Convert to a legitimate series object
    series = to_series(series)
    series = set_display(series, display)

    # Convert to json files
    to_json_files(series, save)

    if show == 'inline':
        live = False

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
