
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

        var updateButton = $("#update");
        updateButton.attr('id', "update" + id);

        var liveToggle = $("#live-toggle");
        liveToggle.attr('id', "live-toggle" + id);

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

        var displayed = [];
        var keys = [];

        //Set initial chart options
        var chartOptions;
        if (typeof options.chart === "undefined") {
            chartOptions = {renderTo: chartContainer.id};
        } else {
            chartOptions = $.extend(options["chart"], {renderTo: chartContainer.id});
        }

        //Initial rendered series
        var renderedSeries = [];
        options = angular.extend(options, {chart: chartOptions}, {series: renderedSeries});
        var chart = new ChartType(options);

        selector.selectize({
            plugins: ['remove_button', 'restore_on_backspace'],
            delimiter: ',',
            options: [],
            items: [],
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

        //Check for new keys
        function update() {
            $.get(path + '/keys.json').done(function (data) {
                //Get the new keys
                var oldKeys = keys.map(function (element) {
                    return element.name
                });

                //Get the new key objects
                var newKeyObjects = data.filter(function (element) {
                    return oldKeys.indexOf(element.name) == -1
                });

                //Set the keys equal to all keys and update the selector
                keys = data;
                selector.clearOptions();
                selector.addOption(keys);
                selector.refreshOptions();
            })

        }

        $.get(path + '/keys.json').done(function (data) {
            keys = data;

        }).error(function (error) {
            console.log(error);
        });

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
            $.get(path + '/' + key + '.json').done(function (data) {
                renderedSeries.push(data)
            });
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
    }
});
