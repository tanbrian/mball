(function() {
  'use strict';

  // TODO Directive following style guide

  angular
    .module('core')
    .controller('CountdownController', ['$scope', function($scope) {
      $scope.message = "Thanks for coming to Masquerade Ball!";
      $scope.pastEvent = false;

      console.log("current date is: " + Date.now());

      if (Date.UTC(2015, 10, 15, 5, 0, 0) < Date.now()) {
        $scope.pastEvent = true;
      }
    }]);

})();