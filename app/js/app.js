'use strict';

// Declare app level module which depends on views, and components
angular.module('weatherApp', [
        'ngRoute',
        'myApp.version'
    ])
    .controller('weatherCtrl', ['$scope', 'openWeatherApi', '$timeout', function($scope, openWeatherApi, $timeout) {
        var lat, lon;
        $scope.today = new Date();
        // store our user input
        $scope.options = {};
        // if true show the options form
        $scope.showOptions = false;
        // if true set metric units otherwise imperial
        $scope.units = true;

        $scope.nextDay = function(){
$scope.today += 1;
        };

        $scope.getWeatherByZip = function() {
            $scope.error = '';
            //  alert('zip: ' + $scope.options.zip);
            openWeatherApi.getByZip($scope.options.zip, $scope.options.country, $scope.units)
                .success(function(result) {
                    $scope.weatherData = result;
                })
                .error(function(error, status) {
                    $scope.error = 'Status : ' + status + ' Something went wrong!';
                });
        };
        // added a geolocation function to run ASAP
        $scope.getLocation = function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    $scope.$apply(function() {
                        // Get the coordinates of the current position.
                        $scope.lat = position.coords.latitude;
                        $scope.lon = position.coords.longitude;
                        // run the functions after the coords are received
                        $scope.getLocal();
                        $scope.getLocalForecast();
                    });
                });
            }
        }();



        $scope.getLocal = function() {
            $scope.error = '';
            openWeatherApi.getLocalWeather($scope.lat, $scope.lon, $scope.units)
                .success(function(result) {
                    $scope.weatherData = result;
                }).error(function(error, status) {

                    $scope.error = 'Status : ' + status + ' Something went wrong!';


                });
        };

        $scope.getCity = function() {
            openWeatherApi.getByCityName($scope.options.city, $scope.units)
                .success(function(result) {
                    $scope.weatherData = result;
                }).error(function(error, status) {

                    $scope.error = 'Status : ' + status + ' Something went wrong!';


                });
        };

$scope.getLocalForecast = function(){
  $scope.error = '';
  openWeatherApi.getLocalWeatherForecast($scope.lat, $scope.lon, $scope.units)
      .success(function(result) {
          $scope.weatherForecastData = result;
      }).error(function(error, status) {

          $scope.error = 'Status : ' + status + ' Something went wrong!';


      });
};

    }])
    .directive('cityWeatherOptions', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/city-weather-options.html',
            replace: true
        }
    })
    .directive('weatherForecast',function(){
      return{
        restrict:'E',
        templateUrl: 'partials/weather-forecast.html',
        replace: true
      }
    })
    .factory('openWeatherApi', ['$http', function openWeatherApiFactory($http) {
        var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?';
        var apiForecastUrl = 'http://api.openweathermap.org/data/2.5/forecast/daily?';
        var apiKey = '&APPID=3f2a43f3dff44e5e01573b363cbea2fd';
        var cb = '&callback=JSON_CALLBACK';

        return {

            getLocalWeather: function(lat, lon, units) {
                units = units ? '&units=metric' : '&units=imperial';
                return $http.jsonp(apiUrl + 'lat=' + lat + '&lon=' + lon + units + apiKey + cb);
            },
            getByCityName: function(name, units) {
                units = units ? '&units=metric' : '&units=imperial';
                return $http.jsonp(apiUrl + 'q=' + name + units + apiKey + cb);
            },
            getLocalWeatherForecast:  function(lat, lon, units) {
                units = units ? '&units=metric' : '&units=imperial';
                return $http.jsonp(apiForecastUrl + 'lat=' + lat + '&lon=' + lon + units + apiKey + cb);
            }

        };


    }]);
