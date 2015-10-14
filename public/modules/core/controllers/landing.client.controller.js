(function() {
  'use strict';

  // TODO Directive following style guide

  angular
    .module('core')
    .controller('LandingController', ['$scope', function($scope) {
      $scope.message = 'VOLUNTEER';

      $scope.thank = function() {
        $scope.message = 'THANKS! (:';
      };
    }]);

})();
