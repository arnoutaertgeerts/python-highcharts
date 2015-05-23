__author__ = 'Arnout Aertgeerts'
__version__ = '0.0.1'

from string import Template
from jsonencoder import ChartsJSONEncoder

import os
import json
import shutil
import webbrowser

package_directory = os.path.dirname(os.path.abspath(__file__))


class MyTemplate(Template):
    delimiter = '$$'
    idpattern = r'[a-z][_a-z0-9]*'


def plot(series, options=dict(), height=400, save=False, stock=False, show='tab', display='all'):
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

    # Convert to a legitimate series object
    series = to_series(series)

    # Set the display option
    series = set_display(series, display)

    with open(os.path.join(package_directory, "index.html"), "r") as html:
        string = MyTemplate(html.read()).substitute(
            path=package_directory,
            series=json.dumps(series, cls=ChartsJSONEncoder),
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
        print 'Opening new tab...'
        webbrowser.open_new_tab('file://' + os.path.realpath(save))

    elif show == 'window':
        print 'Trying to open a window. If this fails we will open a tab...'
        webbrowser.open_new('file://' + os.path.realpath(save))

    else:
        if save:
            print 'Chart saved to %s', save


def plotasync(series, options=dict(), height=400, name="chart", stock=True, show='tab', display=[]):
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

    # Clean the directory
    clean_dir(name)

    # Convert to a legitimate series object
    series = to_series(series)

    # Set the display option
    series = set_display(series, display)

    # Convert to json files
    to_json_files(series, name)

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


def clean_dir(path):
    if os.path.exists(path):
        shutil.rmtree(path)
    os.makedirs(path)


def to_json_files(series, path):
    keys = []
    for s in series:
        n = s["name"]
        keys.append(n)
        with open(os.path.join(path, n + ".json"), "w") as json_file:
            json_file.write(json.dumps(s, cls=ChartsJSONEncoder))

    with open(os.path.join(path, 'keys.json'), "w") as keys_file:
        keys_file.write(json.dumps(keys))


def set_display(series, display):
    if display == 'all':
        for s in series:
            s['display'] = True

    elif isinstance(display, list):
        for s in series:
            if s['name'] in display:
                s['display'] = True
            else:
                s['display'] = False

    return series


def df_to_series(df):
    """Prepare data from dataframe for plotting with python-highcharts.
    all columns in df are entries in the returned series.

    The returned series is in the format suitable for python-highcharts: list of dicts with:
    data:list of [index, value]-lists.
    name:name of variable.
    """

    import pandas as pd

    df.index = df.index.tz_localize(None)
    index = [int(x/1e6) for x in df.index.asi8]
    series = []
    for col in df:
        data = []
        ts = df[col].where((pd.notnull(df[col])), None)
        for i, x in enumerate(index):
            data.append([index[i], ts.iloc[i]])
        my_dict = {'data': data,'name': col}
        series.append(my_dict)
    return series


def list_to_series(array):
    return dict(
        data=array
    )


def to_series(series):
    # Dictionary?
    if isinstance(series, dict):
        return [series]

    # List of dictionaries?:
    try:
        if isinstance(series[0], dict):
            return series
    except KeyError:
        pass

    # List?
    try:
        if isinstance(series, list):
            return [dict(data=series, name='variable')]
    except KeyError:
        pass

    # Numpy array?
    try:
        import numpy as np
        if isinstance(series, np.ndarray):
            return [dict(data=series)]
    except ImportError:
        pass

    # DataFrame?:
    import pandas as pd
    if isinstance(series, pd.DataFrame):
        return df_to_series(series)

    raise ValueError('Your data is not in the right format!')
