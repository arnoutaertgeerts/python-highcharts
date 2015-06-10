(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){


requirejs.config({
    "paths": {
        "highstock": "https://cdnjs.cloudflare.com/ajax/libs/highstock/2.1.5/highstock",
        "export": "https://cdnjs.cloudflare.com/ajax/libs/highstock/2.1.5/modules/exporting",
        "jsoneditor": "https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/4.2.0/jsoneditor.min",
        "selectize": "https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.12.1/js/standalone/selectize.min",
        "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min"
    }
});

//Define jquery here to use the pre-loaded version
define('jquery', [], function() {
    return jQuery;
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvamF2YXNjcmlwdC9yZXF1aXJlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcblxucmVxdWlyZWpzLmNvbmZpZyh7XG4gICAgXCJwYXRoc1wiOiB7XG4gICAgICAgIFwiaGlnaHN0b2NrXCI6IFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvaGlnaHN0b2NrLzIuMS41L2hpZ2hzdG9ja1wiLFxuICAgICAgICBcImV4cG9ydFwiOiBcImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2hpZ2hzdG9jay8yLjEuNS9tb2R1bGVzL2V4cG9ydGluZ1wiLFxuICAgICAgICBcImpzb25lZGl0b3JcIjogXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9qc29uZWRpdG9yLzQuMi4wL2pzb25lZGl0b3IubWluXCIsXG4gICAgICAgIFwic2VsZWN0aXplXCI6IFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvc2VsZWN0aXplLmpzLzAuMTIuMS9qcy9zdGFuZGFsb25lL3NlbGVjdGl6ZS5taW5cIixcbiAgICAgICAgXCJqcXVlcnlcIjogXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9qcXVlcnkvMi4xLjQvanF1ZXJ5Lm1pblwiXG4gICAgfVxufSk7XG5cbi8vRGVmaW5lIGpxdWVyeSBoZXJlIHRvIHVzZSB0aGUgcHJlLWxvYWRlZCB2ZXJzaW9uXG5kZWZpbmUoJ2pxdWVyeScsIFtdLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4galF1ZXJ5O1xufSk7XG4iXX0=
