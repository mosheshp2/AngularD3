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
filters.filter('atBash', function () {
      return function (input) {
        var result = '';
        if (!input) return result;

        var helper=[26,25,24,23,22,20,18,17,16,14,12,12,11,9,9,8,8,7,6,5,5,4,4,3,2,1,0];


        for(var i=0;i<input.length;i++){
          var charCode = input[i].charCodeAt(0);
          if(charCode > 1487 && charCode < 1515){
            var atbashCode = helper[charCode - 1488];
            result += String.fromCharCode(atbashCode + 1488);
          }
          else result += input[i];
        }

        return result;
      };
    });

filters.filter('gimatry', function () {
  return function (input) {
    var helper=[1,2,3,4,5,6,7,8,9,10,20,20,30,40,40,50,50,60,70,80,80,90,90,100,200,300,400];
    var result = 0;
    if (!input) return result;
    for(var i = 0; i < input.length; i++){
      var charCode = input[i].charCodeAt(0);
      if(charCode > 1487 && charCode < 1515){
        result += helper[charCode - 1488];
      }
    }
    return result;
  };
});
