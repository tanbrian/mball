'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
  // Init module configuration options
  var applicationModuleName = 'mball';
  var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize', 'ui.router', 'ui.utils', 'smoothScroll'];

  // Add a new vertical module
  var registerModule = function(moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
(function() {
  'use strict';

  angular
    .module('core')
    .constant('home', {
      'landingPercentage': 0.8,
      'navigationBarHeight': 75
    });
})();

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');

    // Home state routing
    $stateProvider.
    state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    }).
    state('faq', {
      url: '/faq',
      templateUrl: 'modules/core/views/faq.client.view.html'
    });
  }
]);

(function() {
    'use strict';

    // TODO Convert to directive following Angular Style Guide
    // Joseph if you're looking at this code forgive me pls

    angular
      .module('core')
      .controller('NavigationController', ['$scope', '$location', '$rootScope', 'smoothScroll', function($scope, $location, $rootScope, smoothScroll) {
        $scope.test = 'value';

        $scope.scrollOrLoad = function(scrollDestId) {
          $location.path('/#!');

          angular.element(document).ready(function () {
            var element = document.getElementById(scrollDestId);

            var options = {
              offset: 75
            }

            smoothScroll(element, options);
          });
        }
      }]);
})();

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
    var masqueradeBallDate = Date.UTC(2015, 10, 16, 8, 30, 0);
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

(function() {
  'use strict';

  angular
    .module('core')
    .directive('mbMap', map);

  function map() {

    var directive = {
      restrict: 'A',
      controller: MapController,
      controllerAs: 'vm'
    };

    return directive;
  }


  function MapController() {

    // Location of the San Diego Natural History Museum
    var museumLatLong = new google.maps.LatLng(32.732116, -117.147365);

    var styles = [
      {
        featureType: 'all',
        stylers: [
          { saturation: -70 }
        ]
      }, {
        featureType: 'road.highway',
        stylers: [
          { hue: '#55477c' }
        ]
      }
    ];

    var mapOptions = {
      center: museumLatLong,
      disableDefaultUI: true,
      scrollwheel: false,
      styles: styles,
      zoom: 15
    };

    var googleMap = new google.maps.Map(document.getElementById('map'), mapOptions);

    var contentString = '<h3>San Diego Natural History Museum</h3>' +
                        '</br>' +
                        '1788 El Prado, San Diego, CA 92101';
    var infoWindow = new google.maps.InfoWindow({
      content: contentString
    });

    var marker = new google.maps.Marker({
      icon: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
      position: museumLatLong,
      title: 'San Diego Natural History Museum'
    });

    marker.setMap(googleMap);
    infoWindow.open(googleMap, marker);
  }
})();

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

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);