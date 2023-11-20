// all names regarding code completion are in README.txt file 
// as most files are collaborative

let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () =>{
  navbar.classList.toggle('active');
}

document.querySelector('#close-navbar').onclick = () =>{
  navbar.classList.remove('active');
}

let searchForm = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = () =>{
  searchForm.classList.toggle('active');
}

window.onscroll = () => {
  navbar.classList.remove('active');
  searchForm.classList.remove('active');
}

// Show loading overlay
document.getElementById('loadingOverlay').style.display = 'flex';
document.getElementById('header').style.display = 'none';

// Simulate a longer loading time (adjust the duration as needed)
setTimeout(function() {
    // Hide loading overlay after the simulated loading time
    document.getElementById('loadingOverlay').style.display = 'none';

    // Show the actual page content
    document.getElementById('header').style.display = 'flex';
}, 1000); // 1000 milliseconds (1 seconds) - Adjust the duration as needed

// Add this inside your script tag or a JavaScript file
 // When the page loads, check if the user has a saved preference and apply it
 let isFmode; //Huy
 window.onload = function() {
  const body = document.body;
  
  // Check if 'dark-mode' class is in localStorage
  if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
  } else {
    body.classList.remove('dark-mode');
  }

  // Check if 'Fmode' is true
  if(localStorage.getItem('Fmode') === 'true') {
    isFmode = true;
  } else {
    isFmode = false;
  } 
  console.log("Fmode: " + localStorage.getItem('Fmode'));
  let tempBtn = document.getElementById("tempUnit");
  tempBtn.innerHTML =`${isFmode ? "°F" : "°C"}`;
  tempBtn.addEventListener("click", () => toggleUnit());
  // Initial call to fetch weather for a default location
  fetchCurrentWeather('Dallas');
  fetchForecast('Dallas');
  fetch7DayForecast('Dallas');
  fetchDataAndUpdateChart('Dallas');
}

// Function to toggle dark mode(huy)
function toggleDarkMode() {
  const body = document.body;
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  
  // Toggle the "dark-mode" class on the body
  body.classList.toggle('dark-mode');
  
  // Change the icon or text of the dark mode toggle button accordingly
  if (body.classList.contains('dark-mode')) {
    if (darkModeToggle) {
      darkModeToggle.classList.replace('fa-moon', 'fa-sun');
    }
    // Save the user's preference to localStorage
    localStorage.setItem('darkMode', 'true');
    //console.log(localStorage.getItem('darkMode')) //debug
    
  } else {
    if (darkModeToggle) {
      darkModeToggle.classList.replace('fa-sun', 'fa-moon');
    }
    // Save the user's preference to localStorage
    localStorage.setItem('darkMode', 'false');
  }
}

// Attach the event listener to the dark mode toggle button
if (document.getElementById('dark-mode-toggle')) {
  document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);
  
}


 //Convert Celius to F button(Huy)
 const toggleUnit = () => {
   // Write your code to manipulate the DOM here

    isFmode = !isFmode;
    if (isFmode) 
    {
        localStorage.setItem('Fmode', 'true');
        console.log("Fmode: " + localStorage.getItem('Fmode'));
    } 
    else {
        localStorage.setItem('Fmode', 'false');
        console.log("Fmode: " + localStorage.getItem('Fmode'));
    }
    location.reload();
    //We need to update the chart temp
    /*data.forecast.forecastday[0].hour.map(hour => isFmode ? hour.temp_c : hour.temp_f);
    // Update the label in the chart
    chart.data.datasets[0].label = `Temperature (°${isFmode ? 'F' : 'C'})`;
    // Update the chart
    chart.update();
    */
  }
     
 //update location when search(Huy)
 document.querySelector('#search-box').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
      subLocation = this.value

  }
});


document.addEventListener("DOMContentLoaded", function() {
    //Autocomplete search
    const input = document.getElementById('search-box');
    const options = {
      types: ['(cities)'],
      fields: ["formatted_address", "geometry", "name"],
      strictBounds: false,
      };
    const autocomplete = new google.maps.places.Autocomplete(input, options);

    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace().name;
        fetchCurrentWeather(place);
        fetchDataAndUpdateChart(place);
        fetch7DayForecast(place);
    });

  // Set interval to fetch data every 60000 milliseconds (1 minute)
  setInterval(fetchDataAndUpdateChart(location), 60000);
});



new Swiper('.forecast-grid', {
  slidesPerView: 4, // Default is 4 slides per view
  spaceBetween: 10,
  breakpoints: {
      640: {
          slidesPerView: 2,
          spaceBetween: 10,
      },
      768: {
          slidesPerView: 3,
          spaceBetween: 10,
      },
      1024: {
          slidesPerView: 4,
          spaceBetween: 10,
      },
  }
});


// script.js

var chart;
// Function to fetch data and update the chart
function fetchDataAndUpdateChart(location) {
  const apiKey = '2c4fe195f69547fda56145444230211';
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&hours=24`;

  var ctx = document.getElementById('hourlyForecastChart').getContext('2d');
  if(chart){
    chart.destroy();
  }
  chart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: ["00:00", "1:00", "2:00", "3:00", "4:00", "5:00", "6:00", "7:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00",
                   "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"], // The hours
          datasets: [{
              label: `${isFmode ? "Temperature (°F)" : "Temperature (°C)"}`,//Huy
              data: [], // Initialize empty data array
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
          }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
      }
  });

  try {
    fetch(url)
    .then(response => response.json())
    .then(data => {
      if(isFmode){
        forecastData = data.forecast.forecastday[0].hour.map(hour =>  hour.temp_f);
      } else {
        forecastData = data.forecast.forecastday[0].hour.map(hour =>  hour.temp_c);
      }

      chart.data.datasets[0].data = forecastData;
      chart.update();
    });
  } catch (error) {
    console.error("Error fetching real-time data: ", error);
    throw error; // Rethrow the error to be caught by the calling function
  }
}


// Function to fetch current weather
function fetchCurrentWeather(location) {
  const apiKey = '2c4fe195f69547fda56145444230211';
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data && data.current) {
        document.getElementById('weather-location').textContent = location;
        document.getElementById('weather-temperature').textContent = `${isFmode ? data.current.temp_f : data.current.temp_c}°${isFmode ? 'F' : 'C' }` ;//Huy
        document.getElementById('weather-condition').textContent = data.current.condition.text;
        document.getElementById('weather-humidity').textContent = data.current.humidity;
        document.getElementById('weather-wind').textContent = `${data.current.wind_kph} km/h`;
        document.getElementById('detail-wind').textContent = `${data.current.wind_kph} km/h, ${data.current.wind_dir}`;
        document.getElementById('detail-humidity').textContent = `${data.current.humidity}%`;
        document.getElementById('detail-feelslike').textContent = `${ isFmode ? data.current.feelslike_f :
          data.current.feelslike_c }°${isFmode ? 'F' : 'C' }`;
        document.getElementById('detail-precipitation').textContent = `${data.current.precip_mm} mm`;
        document.getElementById('detail-visibility').textContent = `${data.current.vis_miles} mi`;
      }
    })
    .catch(error => {
      console.error('Error fetching current weather data:', error);
    });
}

// Function to fetch forecast
function fetchForecast(location) {
  const apiKey = '2c4fe195f69547fda56145444230211';
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7&aqi=no&alerts=no`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data && data.forecast) {
        // Update the forecast section with the data
        // You would loop through the forecast data and create HTML elements for each day
      }
    })
    .catch(error => {
      console.error('Error fetching forecast data:', error);
    });
}





// Function to fetch and display the 7-day forecast in Cmode
function fetch7DayForecast(location) {
  const apiKey = '2c4fe195f69547fda56145444230211';
  const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7&aqi=no&alerts=no`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const forecastGrid = document.querySelector('.forecast-grid');
      forecastGrid.innerHTML = ''; // Clear any existing content

      data.forecast.forecastday.forEach(day => {
        const forecastDayElem = document.createElement('div');
        forecastDayElem.className = 'forecast-day';
        forecastDayElem.innerHTML = `
          <h3>${new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}</h3>
          <p>High: ${isFmode ? day.day.maxtemp_f : day.day.maxtemp_c}°${isFmode ? 'F' : 'C'}</p>
          <p>Low: ${isFmode ? day.day.mintemp_f : day.day.mintemp_c}°${isFmode ? 'F' : 'C'}</p>
          <p>Condition: ${day.day.condition.text}</p>
        `;
        forecastGrid.appendChild(forecastDayElem);
      });
    })
    .catch(error => {
      console.error('Error fetching the forecast data: ', error);
    });
}

// Example calls with a default location
fetchCurrentWeather('Dallas');
fetch7DayForecast('Dallas');

// You would also want to call these functions whenever the search box is used
document.querySelector('#search-box').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    fetchCurrentWeather(this.value);
    fetch7DayForecast(this.value);
  }
});



const apiKey = '2c4fe195f69547fda56145444230211';
let mymap = L.map('mapid').setView([37.8, -96], 4); // Adjust the view to center on the US

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(mymap);

let markerGroup = L.layerGroup().addTo(mymap);

// List of major cities in the USA
const cities = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
  'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose',
  'Austin', 'Jacksonville', 'San Francisco', 'Columbus', 'Charlotte',
  'Indianapolis', 'Seattle', 'Denver', 'Washington', 'Boston',
  'El Paso', 'Nashville', 'Detroit', 'Oklahoma City', 'Portland',
  'Las Vegas', 'Memphis', 'Louisville', 'Baltimore', 'Milwaukee',
  'Albuquerque', 'Tucson', 'Fresno', 'Sacramento', 'Kansas City',
  'Atlanta', 'Miami', 'Colorado Springs', 'Raleigh', 'Omaha',
  'Long Beach', 'Virginia Beach', 'Oakland', 'Minneapolis', 'Tulsa',
  'Arlington', 'New Orleans', 'Wichita', 'Dallas' // ... more cities if needed
];

// Function to update the weather data and place markers on the map
function updateWeatherForUSACities() {
  cities.forEach(city => {
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Create a marker for the city and add it to the map
        const marker = L.marker([data.location.lat, data.location.lon]).addTo(markerGroup);

        // Create a popup with the current temperature
        marker.bindPopup(`<b>${city}</b><br>Temperature: ${isFmode ? data.current.temp_f : data.current.temp_c}°${isFmode ? 'F' : 'C'}`).openPopup();
      })
      .catch(error => {
        console.error(`Error fetching data for ${city}:`, error);
      });
  });
}

// Initial update
updateWeatherForUSACities();

// Update weather every 30 minutes
setInterval(updateWeatherForUSACities, 1800000);





// Function to fetch weather data
async function fetchWeatherData(location) {
  const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7&aqi=no&alerts=no`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Weather data could not be retrieved for that location.');
    }
    const data = await response.json();
    updateWeatherData(data);
  } catch (error) {
    alert(error.message);
  }
}

// Function to update HTML elements with new weather data
function updateWeatherData(data) {
  
  document.getElementById('weather-location').textContent = data.location.name;
  document.getElementById('weather-temperature').textContent = `${isFmode ? data.current.temp_f : data.current.temp_c}°${isFmode ? 'F' : 'C' }`;
  document.getElementById('weather-condition').textContent = data.current.condition.text;
  document.getElementById('weather-humidity').textContent = `${data.current.humidity}%`;
  document.getElementById('weather-wind').textContent = `${data.current.wind_kph} kph`;
  document.getElementById('weather-sunrise').textContent = data.forecast.forecastday[0].astro.sunrise;
  document.getElementById('weather-sunset').textContent = data.forecast.forecastday[0].astro.sunset;
  document.getElementById('detail-wind').textContent = `${data.current.wind_kph} km/h ${data.current.wind_dir}`;
  document.getElementById('detail-humidity').textContent = data.current.humidity;
  document.getElementById('detail-precipitation').textContent = data.current.precip_mm;
  document.getElementById('detail-feelslike').textContent = data.current.feelslike_c;
  
  document.getElementById('detail-visibility').textContent = data.current.vis_km;
  // ...Update other elements as needed
}

// Event listener for the search form submission
document.querySelector('.search-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const searchBox = document.getElementById('search-box');
  const location = searchBox.value.trim();
  if (location) {
    fetchWeatherData(location);
  } else {
    alert('Please enter a location to search.');
  }
});





// Function to fetch and display the sunrise and sunset times
function displaySunriseSunset() {
  // API Key should ideally not be hardcoded in production, but for the sake of this example, we'll include it here
  const apiKey = '2c4fe195f69547fda56145444230211';

  // Function to get the current date in YYYY-MM-DD format
  function getCurrentDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // Define the location for which you want the weather details
  const location = 'dallas'; // Replace with the location you want

  // Create the URL for the API request
  const url = `http://api.weatherapi.com/v1/astronomy.json?key=${apiKey}&q=${location}&dt=${getCurrentDate()}`;

  // Fetch data from the weather API
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      // Extract the sunrise and sunset times from the API response
      const sunrise = data.astronomy.astro.sunrise;
      const sunset = data.astronomy.astro.sunset;

      // Update the HTML elements with the sunrise and sunset times
      document.getElementById('weather-sunrise').textContent = sunrise;
      document.getElementById('weather-sunset').textContent = sunset;
    })
    .catch(error => {
      console.error('Failed to fetch sunrise and sunset data: ', error);
      // Here you could update the HTML to show an error message if desired
    });
}

// Call the function to update the sunrise and sunset times
displaySunriseSunset();



// Wait for the DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
  var heartIcon = document.querySelector('.fa-heart');
  var savedLocations = JSON.parse(localStorage.getItem('savedLocations')) || [];

  // Update the icon based on whether the location is already saved
  updateHeartIcon();

  heartIcon.addEventListener('click', function() {
      var location = document.getElementById('weather-location').textContent;

      // Check if the location is already saved
      if (heartIcon.classList.contains('active')) {
          // Remove from the saved list
          savedLocations = savedLocations.filter(item => item !== location);
          heartIcon.classList.remove('active');
      } else {
          // Add to the saved list
          savedLocations.push(location);
          heartIcon.classList.add('active');
      }

      // Update local storage
      localStorage.setItem('savedLocations', JSON.stringify(savedLocations));
  });

  function updateHeartIcon() {
      var location = document.getElementById('weather-location').textContent;
      if (savedLocations.includes(location)) {
          heartIcon.classList.add('active');
      } else {
          heartIcon.classList.remove('active');
      }
  }
});
