// all names regarding code completion are in README.txt file 
// as most files are collaborative

// Utility function to get the number of days in a month
function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}
const monthlyWeatherData = [
    { day: 1, condition: "Sunny", temperature: 25 },
    { day: 2, condition: "Cloudy", temperature: 22 },
    { day: 3, condition: "Sunny", temperature: 23 },
    { day: 4, condition: "Cloudy", temperature: 24 },
    { day: 5, condition: "Sunny", temperature: 25 },
    { day: 6, condition: "Cloudy", temperature: 20 },
    { day: 7, condition: "Sunny", temperature: 25 },
    { day: 8, condition: "Cloudy", temperature: 22 },
    { day: 9, condition: "Sunny", temperature: 28 },
    { day: 10, condition: "Cloudy", temperature: 23 },
    { day: 11, condition: "Sunny", temperature: 25 },
    { day: 12, condition: "Cloudy", temperature: 22 },
    { day: 13, condition: "Sunny", temperature: 25 },
    { day: 14, condition: "Cloudy", temperature: 22 },
    { day: 15, condition: "Sunny", temperature: 23 },
    { day: 16, condition: "Cloudy", temperature: 22 },
    { day: 17, condition: "Sunny", temperature: 21 },
    { day: 18, condition: "Cloudy", temperature: 22 },
    { day: 19, condition: "Sunny", temperature: 25 },
    { day: 20, condition: "Cloudy", temperature: 20 },
    { day: 21, condition: "Sunny", temperature: 25 },
    { day: 22, condition: "Cloudy", temperature: 22 },
    { day: 23, condition: "Sunny", temperature: 25 },
    { day: 24, condition: "Cloudy", temperature: 18 },
    { day: 25, condition: "Sunny", temperature: 25 },
    { day: 26, condition: "Cloudy", temperature: 22 },
    { day: 27, condition: "Sunny", temperature: 25 },
    { day: 28, condition: "Cloudy", temperature: 26 },
    { day: 29, condition: "Sunny", temperature: 25 },
    { day: 30, condition: "Cloudy", temperature: 22 },
    { day: 31, condition: "Cloudy", temperature: 22 },
];

let isFmode;
function fillMonthlyForecast(month, year) {
    const tbody = document.querySelector("#monthlyForecast tbody");
    
    // Clear the previous content
    tbody.innerHTML = "";

    let dayCount = 1;
    const totalDays = getDaysInMonth(month, year);
    const startDay = new Date(year, month-1, 1).getDay();  // month-1 because JavaScript months are 0-indexed

    for (let i = 0; i < 6; i++) { // At most 6 weeks in a month view
        let row = document.createElement("tr");
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement("td");

            // If the current day is within the month and it's the right start day
            if ((i === 0 && j >= startDay || i > 0) && dayCount <= totalDays) {
                let dayWeather = monthlyWeatherData.find(data => data.day === dayCount);
                if (dayWeather) {
                    cell.innerHTML = `
                        <strong>${dayCount}</strong><br>
                        <span>${dayWeather.condition}</span><br>
                        ${dayWeather.temperature}°C
                    `;
                } else {
                    cell.innerHTML = `<strong>${dayCount}</strong>`;
                }
                dayCount++;
            }
            
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    }
}

function populateCalendar() {
    const month = document.getElementById("monthSelect").value;
    const year = document.getElementById("yearSelect").value;
    
    fillMonthlyForecast(Number(month), Number(year));
}

function setDefaultDate() {
    const currentMonth = new Date().getMonth();  // 0-11 (0 is January, 11 is December)
    const currentYear = new Date().getFullYear();

    const monthSelect = document.getElementById("monthSelect");
    const yearSelect = document.getElementById("yearSelect");

    monthSelect.value = currentMonth + 1;  // +1 to adjust for 0-indexing
    yearSelect.value = currentYear;
}

window.onload = function() {
    setDefaultDate();
    populateCalendar();
}



function fetchMonthlyWeatherData(month, year, callback) {
    const apiKey = '2c4fe195f69547fda56145444230211'; // Replace with your API key
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=YOUR_LOCATION&dt=${year}-${month}-01&days=30`; // Adjust the query parameters as needed

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Assuming the API returns an array of weather data for the month
            callback(data.forecast.forecastday);
        })
        .catch(e => {
            console.log(e);
            alert("Error fetching weather data");
        });
}

 window.onload = function() { 
    setDefaultDate();
    populateCalendar();
    const body = document.body;
    
    // Check if 'dark-mode' class is in localStorage(Huy)
    if (localStorage.getItem('darkMode') === 'true') {
      body.classList.add('dark-mode');
      console.log("enable")
    } else {
      body.classList.remove('dark-mode');
      console.log("disable")
    }

    // Check if 'Fmode' is true
    if(localStorage.getItem('Fmode') === 'true') {
        Fmode = true;
    } else {
        Fmode = false;
    } 
  }

const homeButton = document.getElementById('home-button');
    homeButton.addEventListener('click', function() {
        // Option 1: Navigate to the homepage or any other URL
        window.location.href = '/'; // Assuming the root is your homepage
    });
