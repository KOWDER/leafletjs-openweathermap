// DOM objects
const content = document.querySelector('.content');

// import your own API Key
let myKey = config.API_KEY

// set view on default location (london)
let map = L.map('map').setView([51.505, -0.09], 13);

let marker;

// init map Layer
L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
    maxZoom: 10,
    minZoom: 4,
}).addTo(map);


// print data
function showData(obj) {
  content.textContent = ''
  const ul = document.createElement('ul')
  content.appendChild(ul)

  ul.outerHTML = `<ul>
      <div><img src='http://openweathermap.org/img/w/${obj.weather[0].icon}.png'/></div>
      <li>location: ${obj.name}, ${obj.sys.country}</li>
      <li>weather: ${obj.weather[0].description}</li>
      <li>temperature: ${obj.main.temp}°C</li>
      <li>humidity: ${obj.main.humidity}%</li>
      <li>pressure: ${obj.main.pressure} atm</li>
      <li>wind speed: ${obj.wind.speed}km/h</li>
      <li>sunrise: ${new Date(obj.sys.sunrise * 1000).toTimeString()}</li>
      <li>sunset: ${new Date(obj.sys.sunset * 1000).toTimeString()}</li>
    </ul>
  `
}


// get position of click to set a new marker and display position
function onMapClick(e) {
  const lat = e.latlng.lat
  const lng = e.latlng.lng
  let weather

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

map.addEventListener('click', onMapClick);
