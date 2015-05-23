__author__ = 'arnoutaertgeerts'


from core import to_series, to_json_files, set_display, show_plot


class Chart():
    def __init__(self, string, html, path, show):
        self.string = string
        self.html = html
        self.path = path
        self.show_property = show

    def plot(self, *args, **kwargs):
        if len(args) == 2:
            self._plot_single(*args, **kwargs)
        else:
            self._plot_multi(*args, **kwargs)

    def _plot_multi(self, series, display=[]):
        series = to_series(series)
        to_json_files(series, self.path, display)

    def _plot_single(self, data, name, display=True):
        series = to_series(dict(data=data, name=name))
        if display:
            to_json_files(series, self.path, display=[name])
        else:
            to_json_files(series, self.path, display=[])

    def show(self):
        return show_plot(self.string, self.html, self.show_property)