requirejs.config({
    paths: {
        'highstock': "http://code.highcharts.com/stock/highstock",
        'standalone': "http://code.highcharts.com/adapters/standalone-framework",
        'export': "http://code.highcharts.com/stock/modules/exporting",
        'angular': "https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.15/angular"
    },

    shim: {
        'highstock': {
            deps: ['standalone'],
            exports: 'Highcharts'
        }
    }
});
