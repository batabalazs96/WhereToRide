mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: destination.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});
const  marker1 = new mapboxgl.Marker()
.setLngLat(destination.geometry.coordinates)
.addTo(map);