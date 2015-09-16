(function() {
  'use strict';

  angular
    .module('core')
    .controller('LandingController', ['$scope', '$window', LandingController]);

  function LandingController($scope, $window) {
    $scope.height = $window.innerHeight;
  }
})();
