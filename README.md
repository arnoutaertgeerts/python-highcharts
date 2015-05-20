# ipython-highcharts
Use the excellent [highcharts/highcstock](http://www.highcharts.com/stock/demo) library in an IPython notebook as an interactive alternative to maplotlib.

## Install
For know you should clone the libary and it to your PYTHONPATH:

```shell
git clone https://github.com/arnoutaertgeerts/ipython-highcharts ipython-highcharts
export PYTHONPATH=/Path/to/the/module:$PYTHONPATH
```

## Quick start
Import the libary and the `json` module to convert your data into the json format.

```python
import highstock as hs
import json
```
Call the `plot(series, options)` function of the module and pass in the following necessary parameters:
- `series` ([highchart api](http://api.highcharts.com/highstock#series<line>))
- `options` ([highchart api](http://api.highcharts.com/highstock#lang))

Both objects should be json objects and conform to the highchart API as given in the links above. 

The module provides some mock data which can be used for exploring the libary. First load the data create a series object.
```python
data = hs.mock_data()
series = json.dumps([dict(data=data, name='First')])
```
This will create a series object with one line named First. Second create an options object:
```python
options = {
    'chart': {
        'zoomType': 'y'
    },
    
    'tooltip': {
        'decimalValues': 2
    },
    'title': {
        'text':'Some test data'
    },
    'legend': {
        'enabled': 'true'
    }
}
```
This can either be directly JSON conform as shown above or a `json.dumps()` of a Python dictionary object. Now plot the chart:
```
hs.plot(series, options)
```
