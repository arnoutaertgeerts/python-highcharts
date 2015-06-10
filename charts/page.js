(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvamF2YXNjcmlwdC9wYWdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuLy9Db3VudCB0aGUgbnVtYmVyIG9mIGNoYXJ0cyBvbiB0aGUgcGFnZVxuaWYgKHdpbmRvdy5jb3VudGVyID09IHVuZGVmaW5lZCkge1xuICAgIHdpbmRvdy5jb3VudGVyID0gMDtcbn0gZWxzZSB7XG4gICAgd2luZG93LmNvdW50ZXIrKztcbn1cblxucmVxdWlyZWpzKFtcbiAgICAnanF1ZXJ5JyxcbiAgICAnc2VsZWN0aXplJyxcbiAgICAnanNvbmVkaXRvcicsXG4gICAgJ2hpZ2hzdG9jaycsXG4gICAgJ2V4cG9ydCdcbl0sIGZ1bmN0aW9uKCQsIHNlbGVjdGl6ZSwgSlNPTkVkaXRvcikge1xuXG4gICAgY29uc29sZS5sb2coJ2pxdWVyeScsICQuZm4uanF1ZXJ5KTtcbiAgICBjb25zb2xlLmxvZygnc2VsZWN0aXplJywgc2VsZWN0aXplID8gdHJ1ZTogZmFsc2UpO1xuICAgIGNvbnNvbGUubG9nKCdqc29uZWRpdG9yJywgSlNPTkVkaXRvciA/IHRydWU6IGZhbHNlKTtcbiAgICAvL0dsb2JhbCB2YXJpYWJsZVxuICAgIGNvbnNvbGUubG9nKCdIaWdoY2hhcnRzJywgSGlnaGNoYXJ0cy52ZXJzaW9uKTtcblxuICAgIHZhciBzZXJpZXMgPSBbXG4gICAgICAgIHtkYXRhOiBbMSwgMiwgNCwgOV0sIG5hbWU6IFwidGVtcGVyYXR1cmUgMVwiLCBkaXNwbGF5OiB0cnVlLCBjb2xvcjonIzJiOTA4Zid9LFxuICAgICAgICB7ZGF0YTogWzksIDQsIDIsIDFdLCBuYW1lOiBcInRlbXBlcmF0dXJlIDJcIiwgZGlzcGxheTogdHJ1ZX0sXG4gICAgICAgIHtkYXRhOiBbMCwgMywgNSwgNl0sIG5hbWU6IFwidGVtcGVyYXR1cmUgM1wiLCBkaXNwbGF5OiBmYWxzZX1cbiAgICBdO1xuICAgIC8vcmVwbGFjZS1zZXJpZXNcbiAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgIC8vcmVwbGFjZS1vcHRpb25zXG4gICAgdmFyIHVzZUhpZ2hTdG9jayA9IGZhbHNlO1xuICAgIC8vcmVwbGFjZS1oaWdoc3RvY2tcblxuICAgIC8vQ3JlYXRlIGRpZmZlcmVudCBjb250YWluZXJzIGZvciB0aGUgY2hhcnRzXG4gICAgdmFyIGNoYXJ0Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaGFydFwiKTtcbiAgICBjaGFydENvbnRhaW5lci5pZCA9IFwiY2hhcnRcIiArIHdpbmRvdy5jb3VudGVyLnRvU3RyaW5nKCk7XG5cbiAgICB2YXIgc2VsZWN0b3IgPSAkKFwiI3ZhcmlhYmxlLXNlbGVjdG9yXCIpO1xuICAgIHNlbGVjdG9yLmF0dHIoJ2lkJywgXCJ2YXJpYWJsZS1zZWxlY3RvclwiICsgd2luZG93LmNvdW50ZXIudG9TdHJpbmcoKSk7XG5cbiAgICB2YXIgc2V0dGluZ3MgPSAkKFwiI3NldHRpbmdzLWNvbGxhcHNlXCIpO1xuICAgIHNldHRpbmdzLmF0dHIoJ2lkJywgXCJzZXR0aW5ncy1jb2xsYXBzZVwiICsgd2luZG93LmNvdW50ZXIudG9TdHJpbmcoKSk7XG5cbiAgICB2YXIgYnV0dG9uID0gJChcIiNzZXR0aW5ncy1idXR0b25cIik7XG4gICAgYnV0dG9uLmF0dHIoJ2lkJywgXCJzZXR0aW5ncy1idXR0b25cIiArIHdpbmRvdy5jb3VudGVyLnRvU3RyaW5nKCkpO1xuXG4gICAgdmFyIGV4cG9ydEJ1dHRvbiA9ICQoXCIjZXhwb3J0LWJ1dHRvblwiKTtcbiAgICBleHBvcnRCdXR0b24uYXR0cignaWQnLCBcImV4cG9ydC1idXR0b25cIiArIHdpbmRvdy5jb3VudGVyLnRvU3RyaW5nKCkpO1xuXG4gICAgdmFyIHNhdmUgPSAkKFwiI3NhdmUtc2V0dGluZ3NcIik7XG4gICAgc2F2ZS5hdHRyKCdpZCcsIFwic2F2ZS1zZXR0aW5nc1wiICsgd2luZG93LmNvdW50ZXIudG9TdHJpbmcoKSk7XG5cbiAgICAvLyBjcmVhdGUgdGhlIGVkaXRvclxuICAgIHZhciBlZGl0b3JDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpzb25lZGl0b3JcIik7XG4gICAgZWRpdG9yQ29udGFpbmVyLmlkID0gXCJqc29uZWRpdG9yXCIgKyB3aW5kb3cuY291bnRlci50b1N0cmluZygpO1xuICAgIHZhciBlZGl0b3IgPSBuZXcgSlNPTkVkaXRvcihlZGl0b3JDb250YWluZXIpO1xuXG4gICAgYnV0dG9uLm9uKCdjbGljaycsIHNob3dTZXR0aW5ncyk7XG5cbiAgICBzYXZlLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG5ld09wdGlvbnMgPSBlZGl0b3IuZ2V0KCk7XG4gICAgICAgIC8vUHJldmVudCBleHBvcnQgZnJvbSBicmVha2luZ1xuICAgICAgICBkZWxldGUgbmV3T3B0aW9ucy5leHBvcnRpbmc7XG4gICAgICAgIHNldE9wdGlvbnMobmV3T3B0aW9ucyk7XG4gICAgICAgIHNldHRpbmdzLmNvbGxhcHNlKCdoaWRlJyk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBzaG93U2V0dGluZ3MoKSB7XG4gICAgICAgIHNldHRpbmdzLmNvbGxhcHNlKCd0b2dnbGUnKTtcbiAgICB9XG5cbiAgICAvL0Nob29zZSBhIGNoYXJ0IHR5cGVcbiAgICB2YXIgQ2hhcnRUeXBlID0gdXNlSGlnaFN0b2NrID8gSGlnaGNoYXJ0cy5TdG9ja0NoYXJ0IDogSGlnaGNoYXJ0cy5DaGFydDtcblxuICAgIC8vRGVmYXVsdCBoaWdoY2hhcnQgY29sb3JzXG4gICAgdmFyIGNvbG9ycyA9IFsnIzdjYjVlYycsICcjNDM0MzQ4JywgJyM5MGVkN2QnLCAnI2Y3YTM1YycsICcjODA4NWU5JyxcbiAgICAgICAgJyNmMTVjODAnLCAnI2U0ZDM1NCcsICcjMmI5MDhmJywgJyNmNDViNWInLCAnIzkxZThlMSddO1xuXG4gICAgc2VyaWVzLm1hcChmdW5jdGlvbihzZXJpZSwgaW5kZXgpIHtcbiAgICAgICAgaWYgKCFzZXJpZS5jb2xvcikge1xuICAgICAgICAgICAgc2VyaWVbJ2NvbG9yJ10gPSBjb2xvcnNbaW5kZXggJSAxMF07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VyaWU7XG4gICAgfSk7XG5cbiAgICAvL0dldCBhbGwgdGhlIGtleXNcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIHZhciBpbml0aWFsS2V5cyA9IFtdO1xuICAgICQuZWFjaChzZXJpZXMsIGZ1bmN0aW9uIChpbmRleCwgc2VyaWUpIHtcbiAgICAgICAga2V5cy5wdXNoKHtcbiAgICAgICAgICAgIGRpc3BsYXk6IHNlcmllLmRpc3BsYXksXG4gICAgICAgICAgICB2YWx1ZTogc2VyaWUubmFtZSxcbiAgICAgICAgICAgIHRleHQ6IHNlcmllLm5hbWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHNlcmllLmRpc3BsYXkpIHtcbiAgICAgICAgICAgIGluaXRpYWxLZXlzLnB1c2goc2VyaWUubmFtZSlcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgc2VsZWN0b3Iuc2VsZWN0aXplKHtcbiAgICAgICAgcGx1Z2luczogWydyZW1vdmVfYnV0dG9uJywgJ3Jlc3RvcmVfb25fYmFja3NwYWNlJ10sXG4gICAgICAgIGRlbGltaXRlcjogJywnLFxuICAgICAgICBvcHRpb25zOiBrZXlzLFxuICAgICAgICBpdGVtczogaW5pdGlhbEtleXMsXG4gICAgICAgIG9uSXRlbUFkZDogZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3NlcmllcyBhZGRlZCcpO1xuICAgICAgICAgICAgYWRkU2VyaWVzKGtleSk7XG4gICAgICAgICAgICBuZXdDaGFydChjaGFydC5vcHRpb25zLCByZW5kZXJlZFNlcmllcyk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uSXRlbVJlbW92ZTogZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3NlcmllcyByZW1vdmVkJyk7XG4gICAgICAgICAgICBkZWxldGVTZXJpZXMoa2V5KTtcbiAgICAgICAgICAgIG5ld0NoYXJ0KGNoYXJ0Lm9wdGlvbnMsIHJlbmRlcmVkU2VyaWVzKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy9TZXQgaW5pdGlhbCBjaGFydCBvcHRpb25zXG4gICAgdmFyIGNoYXJ0T3B0aW9ucztcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuY2hhcnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgY2hhcnRPcHRpb25zID0ge3JlbmRlclRvOiBjaGFydENvbnRhaW5lci5pZH07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY2hhcnRPcHRpb25zID0gJC5leHRlbmQob3B0aW9uc1tcImNoYXJ0XCJdLCB7cmVuZGVyVG86IGNoYXJ0Q29udGFpbmVyLmlkfSk7XG4gICAgfVxuXG4gICAgLy9Jbml0aWFsIHJlbmRlcmVkIHNlcmllc1xuICAgIHZhciByZW5kZXJlZFNlcmllcyA9IFtdO1xuICAgIG9wdGlvbnMgPSAkLmV4dGVuZChvcHRpb25zLCB7Y2hhcnQ6IGNoYXJ0T3B0aW9uc30sIHtzZXJpZXM6IHJlbmRlcmVkU2VyaWVzfSk7XG4gICAgdmFyIGNoYXJ0ID0gbmV3IENoYXJ0VHlwZShvcHRpb25zKTtcblxuICAgICQuZWFjaChpbml0aWFsS2V5cywgZnVuY3Rpb24gKGluZGV4LCBrZXkpIHtcbiAgICAgICAgYWRkU2VyaWVzKGtleSk7XG4gICAgfSk7XG5cbiAgICBuZXdDaGFydChjaGFydC5vcHRpb25zLCByZW5kZXJlZFNlcmllcyk7XG4gICAgZWRpdG9yLnNldChjaGFydC5vcHRpb25zKTtcbiAgICBleHBvcnRCdXR0b24ub24oJ2NsaWNrJywgY2hhcnQuZXhwb3J0Q2hhcnQpO1xuXG4gICAgZnVuY3Rpb24gc2V0T3B0aW9ucyhvcHRpb25zKSB7XG4gICAgICAgIG5ld0NoYXJ0KG9wdGlvbnMsIHJlbmRlcmVkU2VyaWVzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaW5kU2VyaWVzKHNlcmllcywga2V5KSB7XG4gICAgICAgIHJldHVybiBzZXJpZXMuZmluZEluZGV4KGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgIHJldHVybiBvYmoubmFtZSA9PSBrZXk7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbmV3Q2hhcnQob3B0aW9ucywgc2VyaWVzKSB7XG4gICAgICAgIC8vRGlzYWJsZSBhbmltYXRpb25cbiAgICAgICAgdmFyIG5ld09wdGlvbnMgPSAkLmV4dGVuZChvcHRpb25zLCB7c2VyaWVzOiBzZXJpZXN9KTtcbiAgICAgICAgbmV3T3B0aW9ucy5wbG90T3B0aW9uc1snc2VyaWVzJ10gPSB7YW5pbWF0aW9uOiBmYWxzZX07XG5cbiAgICAgICAgLy9HZXQgem9vbVxuICAgICAgICB2YXIgeEV4dHJlbWVzID0gY2hhcnQueEF4aXNbMF0uZ2V0RXh0cmVtZXMoKTtcblxuICAgICAgICAvL1JlLXBsb3QgdGhlIGNoYXJ0XG4gICAgICAgIGNoYXJ0LmRlc3Ryb3koKTtcbiAgICAgICAgY2hhcnQgPSBuZXcgQ2hhcnRUeXBlKG5ld09wdGlvbnMpO1xuXG4gICAgICAgIC8vUmVzZXQgdGhlIHpvb21cbiAgICAgICAgY2hhcnQueEF4aXNbMF0uc2V0RXh0cmVtZXMoeEV4dHJlbWVzLm1pbiwgeEV4dHJlbWVzLm1heCwgZmFsc2UsIGZhbHNlKTtcblxuICAgICAgICAvL1JlLWRyYXcgY2hhcnRcbiAgICAgICAgY2hhcnQucmVkcmF3KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkU2VyaWVzKGtleSkge1xuICAgICAgICB2YXIgaW5kZXggPSBmaW5kU2VyaWVzKHNlcmllcywga2V5KTtcbiAgICAgICAgdmFyIG5ld1NlcmllcyA9IHNlcmllc1tpbmRleF07XG4gICAgICAgIHJlbmRlcmVkU2VyaWVzLnB1c2gobmV3U2VyaWVzKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlbGV0ZVNlcmllcyhrZXkpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gZmluZFNlcmllcyhyZW5kZXJlZFNlcmllcywga2V5KTtcbiAgICAgICAgcmVuZGVyZWRTZXJpZXMuc3BsaWNlKGluZGV4LCAxKVxuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKCdsb2FkZWQhJywgRGF0ZSgpKTtcblxufSk7XG4iXX0=
