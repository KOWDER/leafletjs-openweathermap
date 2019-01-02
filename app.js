// DOM objects
const contentWeather = document.querySelector('.content-weather');
const placesInput = document.getElementById('places-input');
const placesBtn = document.getElementById('places-btn');

// Algolia autocomplete
const placesAutocomplete = places({
  appId: config.ALGOLIA_APP_ID,
  apiKey: config.ALGOLIA_API_KEY,
  container: placesInput,
  language: 'en',
  type: 'city',
  aroundLatLngViaIP: false
});


// import your own API Key
let myKey = config.OWM_API_KEY

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
    <div class="weather-graph">
      <div>
        <img src="./assets/${obj.weather[0].icon}.svg"/>
      </div>
      <span>${Math.round(obj.main.temp)}°C</span>
    </div>
    <h5>Weather</h5>
    ${obj.weather[0].description}
  </li>
  <li>
    <h5>Location</h5>
    ${obj.name}, ${obj.sys.country}
  </li>
  <li>
    <h5>Wind Speed</h5>
    ${parseInt(obj.wind.speed * 3)} km/h
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
    <h5>Sunrise</h5>
    ${new Date(obj.sys.sunrise * 1000).toTimeString().substring(0, 8)}
  </li>
  <li>
    <h5>Sunset</h5>
    ${new Date(obj.sys.sunset * 1000).toTimeString().substring(0, 8)}
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

function onEnterKeypress(e) {
  e.preventDefault()
  let arr = e.target.value.split(',')
  console.log((/[^\d]*/.exec(arr[0])).join('').trim())
}

function onSearch(e) {
  e.preventDefault()
  let arr = placesInput.value.split(',')
  console.log((/[^\d]*/.exec(arr[0])).join('').trim())
}

window.addEventListener('load', onWindowLoad);
map.addEventListener('click', onMapClick);
placesInput.addEventListener('keyup', onEnterKeypress)
placesBtn.addEventListener('click', onSearch)
