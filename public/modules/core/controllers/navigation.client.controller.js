(function() {
    'use strict';

    // TODO Convert to directive following Angular Style Guide
    // Joseph if you're looking at this code forgive me pls

    angular
      .module('core')
      .controller('NavigationController', ['$scope', '$location', '$rootScope', 'smoothScroll', function($scope, $location, $rootScope, smoothScroll) {

        $scope.scrollOrLoad = function(scrollDestId) {
          $location.path('/#!');

          angular.element(document).ready(function () {
            var element = document.getElementById(scrollDestId);

            var options = {
              offset: 75
            };

            smoothScroll(element, options);
          });
        };
      }]);
})();
