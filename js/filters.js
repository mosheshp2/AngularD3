'use strict';

/* Filters */

var filters = angular.module('phonecatFilters', []).filter('checkmark', function() {
  return function(input) {
    return input ? '\u2713' : '\u2718';
  };
});

filters.filter('escape', function() {
  return window.encodeURIComponent;
});