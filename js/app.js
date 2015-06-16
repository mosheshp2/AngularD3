'use strict';

/* App Module */

var phonecatApp = angular.module('phonecatApp', [
  'ngRoute',
  'phonecatControllers',
  'phonecatFilters',
  'phonecatServices',
  'd3Services',
  'd3Controllers',
  'd3GraphService',
  'd3Directives'
]);
/// TODO: add dropdown for monthes      --DONE,
/// add graph for yearly,
/// drill down to day view.
/// add interactions grid-graph,        --DONE
/// animated transition                 --DONE
/// connect to the live service.


phonecatApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/phones', {
        templateUrl: 'partials/phone-list.html',
        controller: 'PhoneListCtrl'
      }).
      when('/phones/:phoneId', {
        templateUrl: 'partials/phone-detail.html',
        controller: 'PhoneDetailCtrl'
      }).
      when('/d3', {
              templateUrl: 'partials/d3-list.html',
              controller: 'D3ListCtrl'
            }).
            when('/d3/:d3Id', {
              templateUrl: 'partials/d3-detail.html',
              controller: 'D3DetailCtrl'
            })
        .when('/AtBash/',{
            templateUrl: 'partials/AtBash.html',
            controller: ''
        })
      .otherwise({
        redirectTo: '/d3'
      });
  }]);


  phonecatApp.run(['$rootScope',
      function($rootScope) {
         $rootScope.$on('$routeChangeStart', function(event, next, current) {
            console.log('Starting to leave %s to go to %s', event,next);
         });
         $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
           var currentPath = current.originalPath;
                    var nextPath = next.originalPath;
          console.log('Error when leave %s to %s' + rejection, currentPath, nextPath);
         });

}]);