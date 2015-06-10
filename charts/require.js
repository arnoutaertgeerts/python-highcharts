(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){


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

},{}]},{},[1]);
