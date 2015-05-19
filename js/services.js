'use strict';

/* Services */

var phonecatServices = angular.module('phonecatServices', ['ngResource']);

phonecatServices.factory('Phone', ['$resource',
  function($resource){
    return $resource('phones/:phoneId.json', {}, {
      query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    });
  }]);

var d3Services = angular.module('d3Services', ['ngResource']);

d3Services.factory('FlightData', ['$http',
  function($http){
    function error(e){

    };
    return{
      Monthly:function(callback){
        $http.get("Data/monthly.json?1")
          .success(callback)
          .error(error);
      },
      Daily:function(month,callback){
        $http.get("Data/FlightData.json?1")
              .success(function(data){
                  var filtered = data.filter(function(e){
                    return e.Date.indexOf(month)==0;
                  })
                  if(callback && angular.isFunction(callback))
                    callback(filtered);
               })
              .error(error);
      }
    };

  }]);
