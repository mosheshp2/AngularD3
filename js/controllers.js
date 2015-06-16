'use strict';

/* Controllers */

var phonecatControllers = angular.module('phonecatControllers', []);

phonecatControllers.controller('PhoneListCtrl', ['$scope', 'Phone',
  function($scope, Phone) {
    $scope.phones = Phone.query();
    $scope.orderProp = 'age';
  }]);

phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone',
  function($scope, $routeParams, Phone) {
    $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
      $scope.mainImageUrl = phone.images[0];
    });

    $scope.setImage = function(imageUrl) {
      $scope.mainImageUrl = imageUrl;
    }
  }]);

phonecatControllers.controller('AtBashCtrl',['$scope', '$window','$rootScope',
    function($scope, $window,$root) {
        $root.title="מילון אתב\"ש";

        var atB = $window.localStorage.getItem("atBash") ;
        $scope.atBashData = atB ? atB.split(',') : [];


        $scope.keyPressed = function(e){
            if(e.keyCode == 13 && $scope.input){
                addData($scope.input);
            }
        };
        $scope.addItem=function(){
            if($scope.input)
                addData($scope.input);
            }
        $scope.remove=function(word){
            var indexOf=$scope.atBashData.indexOf(word);
            if(indexOf > -1){
                $scope.atBashData.splice(indexOf, 1);
                $window.localStorage.setItem("atBash",$scope.atBashData);
            }
        }
        function addData(word){
            if($scope.atBashData.indexOf(word) == -1)            {
                $scope.atBashData.push(word);
                $window.localStorage.setItem("atBash",$scope.atBashData);
                $scope.input = '';
            }
        };

    }]);

var d3Controllers = angular.module('d3Controllers', []);


d3Controllers.controller('D3ListCtrl',['$scope','$rootScope','FlightData',
    function($scope,$rootScope,FlightData){
      $rootScope.title='Yearly report';
      $scope.range=5;
      FlightData.Monthly(function(data){
        $scope.MonthData = data;
        if(data && angular.isArray(data) && data.length > 0) {
          $scope.Columns = Object.getOwnPropertyNames(data[0]);
        }
      });
    }]);

d3Controllers.controller('D3DetailCtrl',['$scope','$routeParams','$location','$rootScope','FlightData','d3GraphService',
      function($scope,$routeParams,$location,$rootScope,FlightData,d3GraphService){
        $scope.DataMonth = {};
        $scope.monthId = $routeParams.d3Id;
        $scope.selectedM=null;
        $rootScope.title=$scope.monthId + 'Month';

        var loadData=function(){
            FlightData.Daily($scope.monthId ,function(data){
              $scope.DataMonth = data;
               if(data && angular.isArray(data) && data.length > 0) {
                        $scope.Columns = Object.getOwnPropertyNames(data[0]);
               }
              // d3GraphService.drawD3($scope.Columns, $scope.DataMonth);
            });
        };
        loadData();
        FlightData.Monthly(function(data){
           $scope.MonthData = data;
           $scope.selectedM = $scope.monthId;

        });
        $scope.changeMonth=function(){
            $scope.monthId = $scope.selectedM;
            $location.path('/d3/' + $scope.monthId);
            //loadData();
        };
        $scope.lastSelected={};
        $scope.mouseOver=function(month,col){
                $scope.lastSelected={
                    key:month.Date,
                    month:month,
                    col:col
                };
        };
        $scope.lastClick={};
        var lastClick = {};
        $scope.clickRow = function(month,col){
            $scope.lastClick={
                key:month.Date,
                col:col
            };
            lastClick.openedPopup=false;
            lastClick = month;
            lastClick.openedPopup=true;
        };

        $scope.hoverGraphMonth={};
        var mon;
        $scope.$on('hoverGraph',function(e,hoverData){
            if(mon && mon[0])mon[0].hover = false;
            $scope.hoverGraphMonth=hoverData.Date;
            mon = $scope.DataMonth.filter(function(dat){
                return dat.Date == hoverData.Date;
            });
            if(mon && mon[0])mon[0].hover = true;
        });


      }]);


