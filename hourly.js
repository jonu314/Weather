// all names regarding code completion are in README.txt file 
// as most files are collaborative

//Autocomplete for search bar
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('search-input');
    const suggestionsContainer = document.getElementById('suggestions');
    const locationNameElement = document.getElementById('location-name'); // Element to display 'Your Location'
    const options = {
        types: ['(cities)'],
        fields: ["formatted_address", "geometry", "name"],
    };
    const autocomplete = new google.maps.places.Autocomplete(input, options);

    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
        }
        console.log(place.name);
        
        // Update the location name with the selected place
        locationNameElement.textContent = place.name; // Update 'Your Location' placeholder

        // Hide suggestions once a place is selected
        suggestionsContainer.style.display = 'none';

        // Fetch weather data for the selected place
        fetchWeatherData(place.name);
    });

    input.addEventListener('input', () => {
        if(input.value.length > 0) {
            suggestionsContainer.style.display = 'block';
        } else {
            suggestionsContainer.style.display = 'none';
        }
    });
});


// This function fetches weather data for the specified location
function fetchWeatherData(location) {
    const apiKey = '2c4fe195f69547fda56145444230211'; // API Key provided
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&hours=24`;

    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Assuming 'Your Location' should be updated with the current city's name
        document.getElementById('location-name').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${data.location.name}`; // Update 'Your Location' with the fetched city name
        updateHourlyForecast(data);
    })
    .catch(error => {
        console.error(`Could not fetch weather data: ${error}`);
    });
}
let isFmode;
// This function updates the hourly forecast HTML
function updateHourlyForecast(data) {
    const hourlyForecastContainer = document.querySelector('.hourly-forecast');
    hourlyForecastContainer.innerHTML = ''; // Clear the container

    for (let i = 0; i < 24; i++) {
        const hourData = data.forecast.forecastday[0].hour[i];
        const time = new Date(hourData.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const temperature = `${isFmode ? hourData.temp_f : hourData.temp_c}`; //huy
        const condition = hourData.condition.text;
        const iconUrl = `https:${hourData.condition.icon}`;
        const feelsLike = `${isFmode ? hourData.feelslike_f : hourData.feelslike_c}`;
        const humidity = hourData.humidity;
        const pressure = hourData.pressure_mb;
        const wind = hourData.wind_kph;
        const chanceOfRain = hourData.chance_of_rain; // Accessing the chance of rain data
        
        const hourBox = document.createElement('div');
        hourBox.className = 'hour-box';
        hourBox.innerHTML = `
            <div class="hour-time">${time}</div>
            <div class="hour-temp">${temperature} ${isFmode? "°F" : "°C"}</div>
            <img src="${iconUrl}" alt="${condition}" class="weather-icon">
            <div class="hour-condition">${condition}</div>
            <div class="hour-rain">Rain: ${chanceOfRain}%</div> <!-- Display chance of rain -->
            <button class="dropdown-btn"></button>
            <div class="dropdown-content">
                <p>Feels Like: ${feelsLike} ${isFmode? "°F" : "°C"}</p>
                <p>Humidity: ${humidity}%</p>
                <p>Pressure: ${pressure} mb</p>
                <p>Wind: ${wind} km/h</p>
            </div>
        `;
        
        // Add event listener for the dropdown button
        hourBox.querySelector('.dropdown-btn').addEventListener('click', function() {
            this.nextElementSibling.classList.toggle("show");
            this.classList.toggle("active"); // Use this to rotate the arrow or change the button appearance
        });

        hourlyForecastContainer.appendChild(hourBox);
    }
}


// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropdown-btn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

// Event listener for search
document.querySelector('input[type="text"]').addEventListener('change', (event) => {
    fetchWeatherData(event.target.value);
});

// Initial call for a default location
fetchWeatherData('Dallas'); // Replace with the default location you want



//Huy
window.onload = function() {
    const body = document.body;
    
    // Check if 'dark-mode' class is in localStorage
    if (localStorage.getItem('darkMode') === 'true') {
      body.classList.add('dark-mode');
      console.log("enable")
    } else {
      body.classList.remove('dark-mode');
      console.log("disable")
    }

    // Check if 'Fmode' is true
    if(localStorage.getItem('Fmode') === 'true') {
        isFmode = true;
    } else {
        isFmode = false;
    } 
    
  }
