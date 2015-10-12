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
