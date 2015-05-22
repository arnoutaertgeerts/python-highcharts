# Python-highcharts
Use the excellent [highcharts/highstock](http://www.highcharts.com/stock/demo) library in Python or even in an IPython notebook as an interactive alternative to maplotlib.

## Install
```shell
pip install charts
```

## Quick start

First import the library:
```python
import charts
```

Second load some example data from the `data` module and some default options from the `options` module:
```python
aapl = charts.data.aapl()
msft = charts.data.msft()
ohlc = charts.data.ohlc()

ohlc['display'] = False

series = [
    aapl,
    msft,
    ohlc
]
options = charts.options.default()
```

And finally plot the chart! Use `inline=True` if you are in an IPython notebook and `inline=False` otherwise.
```python
charts.plot(series, options, height=500, stock=True, inline=True)
```

Don't be affraid to play with the chart, it's interactive :) Try typing in `OHLC` in the variable selector or viewing a different time period by squeezing the bottom scroll bar!

For more, checkout this [notebook](http://nbviewer.ipython.org/github/arnoutaertgeerts/python-highcharts/blob/master/Quickstart.ipynb)!
