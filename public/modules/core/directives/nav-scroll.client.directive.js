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
      var headerThreshold = $window.innerHeight * parseFloat(attrs.percentage);
      console.log(headerThreshold);

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
