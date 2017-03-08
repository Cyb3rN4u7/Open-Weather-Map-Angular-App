'use strict';

// Declare app level module which depends on views, and components
angular.module('weatherApp', [
  'ngRoute',
  'myApp.version'
])
.controller('weatherCtrl',['$scope' ,'openWeatherApi',function($scope,openWeatherApi){

  //var zip ='94040' , country = 'us';
  $scope.options = {};
  $scope.showOptions = false;
  $scope.getWeatherByZip = function(){
    alert('zip: ' + $scope.options.zip);
openWeatherApi.getByZip($scope.options.zip,$scope.options.country).success(function(result){
  $scope.weatherData = result;
});
  };

}])
.directive('weatherOptions',function(){
  return{
    restrict:'E',
    templateUrl:'partials/weather-options.html',
    replace: true
  }
})
.factory('openWeatherApi',['$http',function openWeatherApiFactory($http){
var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?';
var apiKey ='&APPID=3f2a43f3dff44e5e01573b363cbea2fd';
var cb ='&callback=JSON_CALLBACK';

return{
getByZip: function(zip,country){


  return $http.jsonp(apiUrl+'zip='+zip+','+country+apiKey+cb);
}

};


}])
;
