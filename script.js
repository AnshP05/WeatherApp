let imperialUnits = true
let currentCity = "Los Angeles"
let usingCoords = false;
let currentCoords = { lat : null, long : null}
let debounceTimeout;
let justSearched = false
const suggestionList = document.querySelector(".suggestions")
const options = {
    method : 'GET',
    headers : {
        'X-RapidAPI-Key': ' 6cd95d140bmsh798798f899795cdp1da559jsn141f24f3cd78',
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
    }
}
let weather =  {
    "apiKey": "ad24e848c0460261719422f8e020a356",
    fetchWeather : function (city) {
        currentCity = city
        usingCoords = false;
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q="
             + city
             + "&units="
             + (imperialUnits ? "imperial" : "metric")
             + "&appid="
             + this.apiKey
        )
            .then((response) => response.json())
            .then((data) => this.displayWeather(data))
    },
    displayWeather : function(data) {
        const { name } = data
        const { icon, description } = data.weather[0]
        const { temp, humidity } = data.main
        const { speed } = data.wind
        document.querySelector(".city").innerText = "Weather in " + name
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png"
        document.querySelector(".description").innerText = description
        document.querySelector(".temp").innerText = temp + (imperialUnits ? " °F" : " °C")
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%"
        document.querySelector(".wind").innerText = "Wind Speed: " + (imperialUnits ? speed : (speed * 3.6).toFixed(1)) + (imperialUnits ? " mph" : " kph");

        document.querySelector(".weather").classList.remove("loading")
    },
    search : function() {
        this.fetchWeather(document.querySelector(".search-bar").value)
        document.querySelector(".suggestions").innerHTML = ""
    }, 
    fetchWeatherByCoords : function(lat, lon) {
        usingCoords = true;
        currentCoords.lat = lat;
        currentCoords.long = lon;
        fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${imperialUnits ? "imperial" : "metric"}&appid=${this.apiKey}`
    )
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));
    }
    }

document.querySelector(".units-button").addEventListener("click", function() {
    imperialUnits = !imperialUnits
    const unitsText = this.childNodes[0]
    unitsText.textContent = imperialUnits ? "Imperial" : "Metric"
    const icon = this.querySelector("svg")
    icon.classList.toggle("rotate")
    if(usingCoords) {
        weather.fetchWeatherByCoords(currentCoords.lat, currentCoords.long)
    } else {
        weather.fetchWeather(currentCity)
    } 
})
document.querySelector(".search button").addEventListener( "click", function() {
    weather.search()
})

document.querySelector(".search-bar").addEventListener('keyup', function(event) {
    const query = this.value.trim()
    if(query === "") {
        suggestionList.innerHTML = ""
    }
    if(event.key === "Enter") {
        weather.search()
        suggestionList.innerHTML = ""
        justSearched = true;
        return
    }
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => {
        if(query.length < 3) return;
        if(query.length > 1) {
            fetchCities(query)
        } else {
            suggestionList.innerHTML = ""
        }
    }, 300)
    
})

function fetchCities(query) {
    if (!query || query.length < 3) return;
    fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&limit=3`, options)
    .then(response => response.json())
    .then(data => {
      suggestionList.innerHTML = ""
      data.data.forEach(cityObj => {
        const li = document.createElement("li")
        li.textContent = cityObj.city
        li.addEventListener("click", () => {
            document.querySelector(".search-bar").value = cityObj.city.trim()
            suggestionList.innerHTML = ""
            weather.fetchWeather(cityObj.city)
        })
        suggestionList.appendChild(li)
      });

    })
    .catch(error => console.error('Error fetching cities:', error));
}

if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition( (position)  => {
        const lat = position.coords.latitude
        const long = position.coords.longitude

        weather.fetchWeatherByCoords(lat, long)
    },
    () => weather.fetchWeather("Los Angeles")
    )
} else {
    weather.fetchWeather("Los Angeles")
}

document.addEventListener("click", function(event) {
    const searchBar = document.querySelector(".search-bar")
    const searchButton = document.querySelector(".search button")
    const unitsButton = document.querySelector(".units-button")

    if(!searchBar.contains(event.target) && !searchButton.contains(event.target) && !suggestionList.contains(event.target) && !unitsButton.contains(event.target)) {
        suggestionList.innerHTML = ""
    }
})