mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: [19.82017, 48.04922], // starting position [lng, lat]
  zoom: 9, // starting zoom
});