/**
 * mb-countdown directive
 * @namespace directives
 */
(function() {
  'use strict';

  angular
    .module('core')
    .directive('mbCountdown', ['$interval', countdown]);

  function countdown($interval) {
    var masqueradeBallDate = new Date('November 16, 2015 00:30:00');

    return {
      restrict: 'E',

      /**
       * Places a countdown timer.
       */
      link: function(scope, element) {
        var MILL_IN_SEC = 1000;
        var SEC_IN_DAY = 60 * 60 * 24;
        var SEC_IN_HOUR = 60 * 60;
        var SEC_IN_MINUTE = 60;
        var HOURS_IN_DAY = 24;

        var masqueradeBallDate = Date.UTC(2015, 10, 16, 8, 30, 0);
        var timeoutId;

        timeoutId = $interval(function() {
          var currentDate = Date.now();

          var difference = Math.abs(masqueradeBallDate - currentDate) / MILL_IN_SEC;

          scope.days = Math.floor(difference / SEC_IN_DAY);
          difference -= scope.days * SEC_IN_DAY;

          scope.hours = Math.floor(difference / SEC_IN_HOUR) % HOURS_IN_DAY;
          difference -= scope.hours * SEC_IN_HOUR;

          scope.minutes = Math.floor(difference / SEC_IN_MINUTE) % SEC_IN_MINUTE;
          difference -= scope.minutes * SEC_IN_MINUTE;

          scope.seconds = Math.floor(difference % SEC_IN_MINUTE);
        }, 1000);

        element.on('$destroy', function() {
          $interval.cancel(timeoutId);
        });
      },
      templateUrl: '/modules/core/views/partials/countdown.client.view.html'
    };
  }
})();
