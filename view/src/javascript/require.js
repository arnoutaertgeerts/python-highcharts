

requirejs.config({
    "paths": {
        "highstock": "https://cdnjs.cloudflare.com/ajax/libs/highstock/2.1.5/highstock",
        "export": "https://cdnjs.cloudflare.com/ajax/libs/highstock/2.1.5/modules/exporting",
        "jsoneditor": "https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/4.2.0/jsoneditor.min",
        "selectize": "https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.12.1/js/standalone/selectize.min",
        "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min"
    },
    "shim": {
        "export": ["highstock"]
    }
});

//Define jquery here to use the pre-loaded version
define('jquery', [], function() {
    return jQuery;
});
