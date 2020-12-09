
var directionControllers = angular.module('directionControllers', []);

directionControllers
		.controller(
				'directionControllers',
				['$scope',function($scope) {
					console.log("nesting controllers works !");
				}]);