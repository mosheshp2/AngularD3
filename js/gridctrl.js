'use strict';

/* Grid Controllers */

var gridControllers = angular.module('gridControllers', []);

gridControllers.controller('NgGridCtrl', ['$scope',
  function($scope) {
    $scope.orderProp = 'age';
  }
]);

gridControllers.controller('UIGridCtrl', ['$scope',
  function($scope) {
    $scope.orderProp = 'age';
  }
]);
