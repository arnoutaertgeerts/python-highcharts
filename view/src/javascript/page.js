
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

    console.log('jquery', $.fn.jquery);
    console.log('selectize', selectize ? true: false);
    console.log('jsoneditor', JSONEditor ? true: false);
    //Global variable
    console.log('Highcharts', Highcharts.version);

    var series = [
        {data: [1, 2, 4, 9], name: "temperature 1", display: true, color:'#2b908f'},
        {data: [9, 4, 2, 1], name: "temperature 2", display: true},
        {data: [0, 3, 5, 6], name: "temperature 3", display: false}
    ];
    //replace-series
    var options = {};
    //replace-options
    var useHighStock = false;
    //replace-highstock

    //Create different containers for the charts
    var chartContainer = document.getElementById("chart");
    chartContainer.id = "chart" + window.counter.toString();

    var selector = $("#variable-selector");
    selector.attr('id', "variable-selector" + window.counter.toString());

    var settings = $("#settings-collapse");
    settings.attr('id', "settings-collapse" + window.counter.toString());

    var button = $("#settings-button");
    button.attr('id', "settings-button" + window.counter.toString());

    var exportButton = $("#export-button");
    exportButton.attr('id', "export-button" + window.counter.toString());

    var save = $("#save-settings");
    save.attr('id', "save-settings" + window.counter.toString());

    // create the editor
    var editorContainer = document.getElementById("jsoneditor");
    editorContainer.id = "jsoneditor" + window.counter.toString();
    var editor = new JSONEditor(editorContainer);

    button.on('click', showSettings);

    save.on('click', function () {
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

    series.map(function(serie, index) {
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
    exportButton.on('click', chart.exportChart);

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

    console.log('loaded!', Date());

});
