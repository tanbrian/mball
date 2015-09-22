(function() {
  'use strict';

  angular
    .module('core')
    .directive('mbNavScroll', ['$window', 'home', navScroll]);

  function navScroll($window, home) {
    var directive = {
      restrict: 'A',
      link: linkFunc
    };

    return directive;

    function linkFunc(scope, el, attrs) {

      // Dynamically calculates where navigation bar changes height
      var landingHeight = $window.innerHeight * home.landingPercentage;
      var headerThreshold = landingHeight - (home.navigationBarHeight * 2);

      scope.shouldHaveOverlay = false;

      angular.element($window).bind('scroll', function() {

        if (this.pageYOffset >= headerThreshold)
          scope.shouldHaveOverlay = true;
        else
          scope.shouldHaveOverlay = false;

        scope.$apply();
      });
    }
  }
})();
