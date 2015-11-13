/**
 * mb-countdown directive
 * @namespace directives
 */
(function() {
  'use strict';

  angular
    .module('core')
    .directive('mbCountdown', countdown);

  function countdown() {

    return {
      restrict: 'E',
      templateUrl: '/modules/core/views/partials/countdown.client.view.html',
      controller: CountdownController,
      controllerAs: 'vm',
    };
  }

  CountdownController.$inject = ['$scope', '$interval', '$element'];

  function CountdownController($scope, $interval, $element) {

    var MILL_IN_SEC = 1000;
    var SEC_IN_DAY = 60 * 60 * 24;
    var SEC_IN_HOUR = 60 * 60;
    var SEC_IN_MINUTE = 60;
    var HOURS_IN_DAY = 24;

    // Masquerade Ball is on November 16, 2015 at 12:30 AM
    var masqueradeBallDate = Date.UTC(2015, 10, 15, 5, 0, 0);
    var timeoutId;

    // Calculates new countdown value every second
    timeoutId = $interval(function() {
      var currentDate = Date.now();

      // Calculates difference between now and Masquerade Ball in milliseconds
      var difference = Math.abs(masqueradeBallDate - currentDate) / MILL_IN_SEC;

      $scope.days = Math.floor(difference / SEC_IN_DAY);
      difference -= $scope.days * SEC_IN_DAY;

      $scope.hours = Math.floor(difference / SEC_IN_HOUR) % HOURS_IN_DAY;
      difference -= $scope.hours * SEC_IN_HOUR;

      $scope.minutes = Math.floor(difference / SEC_IN_MINUTE) % SEC_IN_MINUTE;
      difference -= $scope.minutes * SEC_IN_MINUTE;

      $scope.seconds = Math.floor(difference % SEC_IN_MINUTE);
    }, 1000);

    // Ends interval loop when element is destroyed to revent leaks.
    $element.on('$destroy', function() {
      $interval.cancel(timeoutId);
    });
  }
})();
