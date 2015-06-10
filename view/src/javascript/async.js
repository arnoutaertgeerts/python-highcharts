
//inject:js
require([
    'highstock',
    'angular',
    'underscore',
    'animate',
    'aria',
    'material',
    'export',
    'accordion',
    'select'
], function () {

    //Count the number of apps / charts on the page
    if (window.counter == undefined) {
        window.counter = 0;
    } else {
        window.counter++;
    }

    //Create different containers for the apps and charts
    var chartContainer = document.getElementById("container");
    chartContainer.id = "chart" + window.counter.toString();

    var appContainer = document.getElementById("appid");
    appContainer.id = "app" + window.counter.toString();

    //The angular app
    var app = angular.module('myApp', [
        "ngMaterial",
        "vAccordion",
        "ng.jsoneditor",
        "isteven-multi-select"
    ]);

    app.controller('MyController', [
        '$scope',
        '$http',
        '$interval',
        '$q', function ($scope, $http, $interval, $q) {
            var vm = this;

            var options = $$options;
            var useHighStock = $$highstock;
            var path = $$path;
            var live = $$live;

            var ChartType = useHighStock ? Highcharts.StockChart : Highcharts.Chart;

            var displayed = [];

            $http.get(path + '/keys.json').success(function (data) {
                var sync;

                vm.keys = data;

                vm.selected = {};
                vm.selected.keys = [];

                vm.showLiveToggle = live;
                vm.live = live;

                vm.options = null;
                vm.setOptions = setOptions;

                $scope.$watch('vm.selected.keys', updateSeries, true);
                $scope.$watch('vm.live', toggleSync);

                angular.element(appContainer).on('destroy', function () {
                    console.log('destroyed!');
                });

                vm.update = update;

                if (typeof options.chart === "undefined") {
                    var chartOptions = {renderTo: chartContainer.id};
                } else {
                    var chartOptions = angular.extend(options["chart"], {renderTo: chartContainer.id});
                }

                //Initial rendered series
                var renderedSeries = [];
                options = angular.extend(options, {chart: chartOptions}, {series: renderedSeries});
                var chart = new ChartType(options);

                //JSONEditor object
                vm.obj = {data: chart.options, options: { mode: 'tree' }};

                //Default highchart colors
                var colors = {};
                colors.available = ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
                    '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'];
                colors.used = [];

                function toggleSync() {
                    vm.live ? startSync() : stopSync();
                }

                function startSync() {
                    stopSync();
                    sync = $interval(update, 1000)
                }

                function stopSync() {
                    $interval.cancel(sync)
                }

                function setOptions(options) {
                    newChart(angular.extend(chart.options, options), renderedSeries);
                    vm.accordion.toggle(0);
                }

                /**
                 * Create filter function for a query string
                 */
                function filter(query) {
                    var lowercaseQuery = angular.lowercase(query);

                    return function filterFn(key) {
                        return (key.toLowerCase().indexOf(lowercaseQuery) != -1);
                    };

                }

                function search(query) {
                    if (!query) {
                        return [];
                    }
                    var availableKeys = _.difference(vm.keys, vm.selected.keys);
                    var results = availableKeys.filter(filter(query));
                    return results.length >= 1 ? results : availableKeys;
                }

                //Update the series
                function updateSeries(newValue, oldValue) {
                    newValue = newValue.map(function (element) {
                        return element.name
                    });

                    oldValue = oldValue.map(function (element) {
                        return element.name
                    });

                    if (newValue.length > oldValue.length) {
                        //Fetch one key at a time in the asynchronous case
                        var newKeys = _.difference(newValue, oldValue);
                        var promises = [];
                        angular.forEach(newKeys, function (newKey) {
                            promises.push($http.get(path + '/' + newKey + '.json').success(function (data) {
                                addSeries(data);
                            }))
                        });

                        $q.all(promises).then(function () {
                            newChart(chart.options, renderedSeries);
                        });


                    } else if (newValue.length < oldValue.length) {
                        var removedKey = _.difference(oldValue, newValue)[0];
                        deleteSeries(removedKey);
                        newChart(chart.options, renderedSeries)
                    }
                }

                //Check for new keys
                function update() {
                    $http.get(path + '/keys.json').success(function (data) {

                        //Get the new keys
                        var oldKeys = vm.keys.map(function(element) {return element.name});

                        //Get the new key objects
                        var newKeyObjects = _.filter(data, function(element) {
                            return oldKeys.indexOf(element.name) == -1
                        });

                        //Add the new object to the scope
                        vm.keys.push.apply(vm.keys, newKeyObjects);
                        //vm.selected.keys.push.apply(vm.selected.keys, newKeyObjects)

                    })
                }

                function findSeries(series, key) {
                    var index = {};

                    var arrayLength = series.length;
                    for (var i = 0; i < arrayLength; i++) {
                        if (series[i].name == key) {
                            index = i
                        }
                    }
                    return index
                }

                function newChart(options, series) {
                    //Disable animation
                    newOptions = angular.extend(options, {series: series});
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

                function addSeries(newSeries) {
                    renderedSeries.push(angular.extend(newSeries, {color: colors.available[0]}));
                    colors.used.push(colors.available.splice(0, 1)[0]);
                }

                function deleteSeries(name) {
                    var index = findSeries(renderedSeries, name);
                    var deletedColor = renderedSeries.splice(index, 1).color;
                    var colorIndex = colors.used.indexOf(deletedColor);
                    colors.available.push(colors.used.splice(colorIndex, 1)[0]);
                }

            }).error(function (error) {
                console.log(error);
            })

        }]);

    angular.bootstrap(appContainer, ['myApp']);
});
