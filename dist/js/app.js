// Initialize and add the map
function initMap() {

  // Object location
  const loc = { lat:-1.737820, lng: 37.138821 };

  // Centered map on location
  const map = new google.maps.Map(document.querySelector('.map'), {
    zoom: 14,
    center: loc,
  });

  //The marker positioned at location
  const marker = new google.maps.Map({ position: loc, map: map });
}