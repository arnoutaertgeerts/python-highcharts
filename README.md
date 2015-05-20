# Python-highcharts
Use the excellent [highcharts/highcstock](http://www.highcharts.com/stock/demo) library in Python or even in an IPython notebook as an interactive alternative to maplotlib.

## Install
```shell
pip install charts
```

## Quick start
We are going to create a highstock plot, show it inline in an IPython notebook and save the html file for later viewing/sharing of the plot. Import the libary to begin plotting:

```python
import charts
```

The `plot()` function of the module needs the following necessary parameters:
- `series`: A dictionary containing the `name` and `data` fields
- `options` A dictionary containing the options for the chart. The possible options are equal to the options of the highchart libary which can be found [here](http://api.highcharts.com/highcharts). 

Quickly generate some test data provided by the library for exploring in the right format and set the options object equal to some defaults:

```python
series = [
    charts.data.aapl(),
    charts.data.msft(),
    charts.data.ohlc()
]
options = charts.options.default()
```
Now plot the chart with the following extra options:
- `height=500`: Set the height to 500px.
- `stock=True`: use HighStock instead of HighChart.
- `inline=True` Display the plot inline in an IPython notebook (Set this to false when not using the notebook)
- `save=mychart.hmtl`: Save the generated chart to mychart.html.
```
charts.plot(series, options, height=500, stock=True, inline=True, save='mychart.html')
```
Add variables to the plot by typing in there name (try 'AAPL').
