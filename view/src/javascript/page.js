
//Count the number of charts on the page
if (window.counter == undefined) {
    window.counter = 0;
} else {
    window.counter++;
}

requirejs([
    'jquery',
    'selectize',
    'jsoneditor',
    'highstock',
    'export'
], function($, selectize, JSONEditor) {

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    var id = guid();
    plot(id);

    function plot(id) {
        var series = [
            {data: [1, 2, 4, 9], name: "temperature 1", display: true, color: '#2b908f'},
            {data: [9, 4, 2, 1], name: "temperature 2", display: true},
            {data: [0, 3, 5, 6], name: "temperature 3", display: false}
        ];
        //replace-series
        var options = {};
        //replace-options
        var useHighStock = false;
        //replace-highstock
        var save = 'app/chart.svg';
        //replace-save
        var url = 'http://127.0.0.1:37759';
        //replace-url

        //Create different containers for the charts
        var chartContainer = document.getElementById("chart-container");
        chartContainer.id = "chart-container" + id;

        var selector = $("#variable-selector");
        selector.attr('id', "variable-selector" + id);

        var settings = $("#settings-collapse");
        settings.attr('id', "settings-collapse" + id);

        var button = $("#settings-button");
        button.attr('id', "settings-button" + id);

        var saveButton = $("#save-settings");
        saveButton.attr('id', "save-settings" + id);

        // create the editor
        var editorContainer = document.getElementById("jsoneditor");
        editorContainer.id = "jsoneditor" + id;
        var editor = new JSONEditor(editorContainer);

        button.on('click', showSettings);

        saveButton.on('click', function () {
            var newOptions = editor.get();
            //Prevent export from breaking
            delete newOptions.exporting;
            setOptions(newOptions);
            settings.collapse('hide');
        });

        function showSettings() {
            settings.collapse('toggle');
        }

        //Choose a chart type
        var ChartType = useHighStock ? Highcharts.StockChart : Highcharts.Chart;

        //Default highchart colors
        var colors = ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
            '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'];

        series.map(function (serie, index) {
            if (!serie.color) {
                serie['color'] = colors[index % 10];
            }

            return serie;
        });

        //Get all the keys
        var keys = [];
        var initialKeys = [];
        $.each(series, function (index, serie) {
            keys.push({
                display: serie.display,
                value: serie.name,
                text: serie.name
            });

            if (serie.display) {
                initialKeys.push(serie.name)
            }
        });

        selector.selectize({
            plugins: ['remove_button', 'restore_on_backspace'],
            delimiter: ',',
            options: keys,
            items: initialKeys,
            onItemAdd: function (key) {
                console.log('series added');
                addSeries(key);
                newChart(chart.options, renderedSeries);
            },
            onItemRemove: function (key) {
                console.log('series removed');
                deleteSeries(key);
                newChart(chart.options, renderedSeries);
            }
        });

        //Set initial chart options
        var chartOptions;
        if (typeof options.chart === "undefined") {
            chartOptions = {renderTo: chartContainer.id};
        } else {
            chartOptions = $.extend(options["chart"], {renderTo: chartContainer.id});
        }

        //Initial rendered series
        var renderedSeries = [];
        options = $.extend(options, {chart: chartOptions}, {series: renderedSeries});
        var chart = new ChartType(options);

        $.each(initialKeys, function (index, key) {
            addSeries(key);
        });

        newChart(chart.options, renderedSeries);
        editor.set(chart.options);

        if (save) {
            saveSVG(url, save)
        }

        function setOptions(options) {
            newChart(options, renderedSeries);
        }

        function findSeries(series, key) {
            return series.findIndex(function (obj) {
                return obj.name == key;
            })
        }

        function newChart(options, series) {
            //Disable animation
            var newOptions = $.extend(options, {series: series});
            newOptions.plotOptions['series'] = {animation: false};

            //Get zoom
            var xExtremes = chart.xAxis[0].getExtremes();

            //Re-plot the chart
            chart.destroy();
            chart = new ChartType(newOptions);

            //Reset the zoom
            chart.xAxis[0].setExtremes(xExtremes.min, xExtremes.max, false, false);

            //Re-draw chart
            chart.redraw();
        }

        function addSeries(key) {
            var index = findSeries(series, key);
            var newSeries = series[index];
            renderedSeries.push(newSeries)
        }

        function deleteSeries(key) {
            var index = findSeries(renderedSeries, key);
            renderedSeries.splice(index, 1)
        }

        function saveSVG(url, name) {
            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify({
                    svg: chart.getSVG(),
                    name: name
                })
            });
        }

        console.log('loaded!', Date());
    }

});
