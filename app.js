// DOM objects
const contentWeather = document.querySelector('.content-weather');

// import your own API Key
let myKey = config.API_KEY

// set view on default location (london)
let map = L.map('map').setView([51.505, -0.09], 13);

let marker = L.marker([51.5, -0.09]).addTo(map)


// init map Layer
L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
    maxZoom: 10,
    minZoom: 4,
}).addTo(map);


// print data
function showData(obj) {
  contentWeather.textContent = ''
  const div = document.createElement('div')
  contentWeather.appendChild(div)

  div.outerHTML = `<div class="content-weather">
  <li>
    <h5>Location</h5>
    ${obj.name}, ${obj.sys.country}
  </li>
  <li>
    <h5>Weather</h5>
    ${obj.weather[0].description}
  </li>
  <li>
    <h5>Temperature</h5>
    ${obj.main.temp} °C
  </li>
  <li>
    <h5>Humidity</h5>
    ${obj.main.humidity} %
  </li>
  <li>
    <h5>Pressure</h5>
    ${obj.main.pressure} atm
  </li>
  <li>
    <h5>Wind Speed</h5>
    ${obj.wind.speed} km/h
  </li>
  <li>
    <h5>Sunrise</h5>
    ${new Date(obj.sys.sunrise * 1000).toTimeString()}
  </li>
  <li>
    <h5>Sunset</h5>
    ${new Date(obj.sys.sunset * 1000).toTimeString()}
  </li>
</div>`
}


// get position of click to set a new marker and display position
function onMapClick(e) {
  const lat = e.latlng.lat
  const lng = e.latlng.lng
  let weather;

  if (marker) {
    map.removeLayer(marker)
    marker = L.marker([lat, lng]).addTo(map)
  } else {
    marker = L.marker([lat, lng]).addTo(map)
  }

  fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&APPID=${myKey}`)
    .then(res => res.json())
    .then(data => weather = data)
    .then(weather => showData(weather))
    .catch(err => console.log('error', err))
}

function onWindowLoad(e) {
  fetch(`http://api.openweathermap.org/data/2.5/weather?lat=51.5&lon=-0.09&units=metric&APPID=${myKey}`)
  .then(res => res.json())
  .then(data => weather = data)
  .then(weather => showData(weather))
  .catch(err => console.log('error', err))
}

window.addEventListener('load', onWindowLoad);
map.addEventListener('click', onMapClick);

