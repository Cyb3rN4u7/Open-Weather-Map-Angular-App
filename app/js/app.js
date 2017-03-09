'use strict';

// Declare app level module which depends on views, and components
angular.module('weatherApp', [
  'ngRoute',
  'myApp.version'
])
.controller('weatherCtrl',['$scope' ,'openWeatherApi','$timeout',function($scope,openWeatherApi,$timeout){
var lat, lon;

  $scope.options = {};
  $scope.showOptions = false;

  $scope.getWeatherByZip = function(){
  //  alert('zip: ' + $scope.options.zip);
openWeatherApi.getByZip($scope.options.zip,$scope.options.country).success(function(result){
  $scope.weatherData = result;
});
  };
// added a geolocation function to run ASAP
  $scope.getLocation = function(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(position){
        $scope.$apply(function(){
          // Get the coordinates of the current position.
         $scope.lat = position.coords.latitude;
         $scope.lon = position.coords.longitude;
        });
      });
    }
  }();
$scope.getLocal = function(){
  openWeatherApi.getLocalWeather($scope.lat,$scope.lon).success(function(result){
      $scope.weatherData = result;
    }).error(function(error,status){

$scope.error = 'Status : ' + status + '\n Something went wrong!'

           
    });
}


    //$scope.getLocal();


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

},
getLocalWeather: function(lat,lon){

  return $http.jsonp(apiUrl+'lat='+lat+'&lon='+lon+apiKey+cb);
}

};


}])
;
