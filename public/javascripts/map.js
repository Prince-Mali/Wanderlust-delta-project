// import tt from "@tomtom-international/web-sdk-maps"
let center = [listing.cordinates.longitude, listing.cordinates.latitude];

console.log(center);
var map = tt.map({
  key: mapToken,
  container: "map",
  center : center,
  zoom : 14
});

map.addControl(new tt.FullscreenControl());
map.addControl(new tt.NavigationControl());

let marker = new tt.Marker({color: 'red', draggable : true}).setLngLat(center).addTo(map);

let popup = new tt.Popup({ offset : 25}).setLngLat(center).setHTML(`<h5 class= "map-title">${listing.title}</h5><p>Exact location will be provided after booking</p>`).addTo(map);

