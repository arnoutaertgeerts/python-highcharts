__author__ = 'arnoutaertgeerts'

from string import Template
from jsonencoder import ChartsJSONEncoder

import os
import json
import shutil
import webbrowser


class MyTemplate(Template):
    delimiter = '$$'
    idpattern = r'[a-z][_a-z0-9]*'


def show_plot(string, html, show):
    if show == 'inline':
        from IPython.display import HTML
        return HTML(string)

    elif show == 'tab':
        print 'Opening new tab...'
        webbrowser.open_new_tab('file://' + os.path.realpath(html))

    elif show == 'window':
        print 'Trying to open a window. If this fails we will open a tab...'
        webbrowser.open_new('file://' + os.path.realpath(html))


def clean_dir(path):
    if os.path.exists(path):
        shutil.rmtree(path)
    os.makedirs(path)


def to_json_files(series, path, display):
    try:
        with open(os.path.join(path, 'keys.json'), "r") as keys_file:
            keys = json.loads(keys_file.read())
    except IOError:
        keys = []

    for s in series:
        n = s["name"]
        if n not in keys:
            keys.append(n)
            with open(os.path.join(path, n + ".json"), "w") as json_file:
                json_file.write(json.dumps(s, cls=ChartsJSONEncoder))
        else:
            print "Careful: '%s' was already present as key and is not added to the chart!" % n

    with open(os.path.join(path, 'display.json'), "w") as display_file:
        if display is True:
            display_file.write(json.dumps(keys))
        elif display is False:
            display_file.write(json.dumps([]))
        else:
            display_file.write(json.dumps(display))

    with open(os.path.join(path, 'keys.json'), "w") as keys_file:
        keys_file.write(json.dumps(keys))


def set_display(series, display):
    if display is True:
        for s in series:
            s['display'] = True

    elif display is False:
        for s in series:
            s['display'] = False

    else:
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