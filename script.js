let imperialUnits = true
let currentCity = "Los Angeles"
let weather =  {
    "apiKey": "ad24e848c0460261719422f8e020a356",
    fetchWeather : function (city) {
        currentCity = city
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
        document.querySelector(".wind").innerText = "Wind Speed: " + speed + (imperialUnits ? " mph" : " kph")
        document.querySelector(".weather").classList.remove("loading")
    },
    search : function() {
        this.fetchWeather(document.querySelector(".search-bar").value)
    }
}
document.querySelector(".units-button").addEventListener("click", function() {
    imperialUnits = !imperialUnits
    const unitsText = this.childNodes[0]
    unitsText.textContent = imperialUnits ? "Imperial" : "Metric"
    const icon = this.querySelector("svg")
    icon.classList.toggle("rotate")
    weather.fetchWeather(currentCity)
})
document.querySelector(".search button").addEventListener( "click", function() {
    weather.search()
})

document.querySelector(".search-bar").addEventListener('keyup', function(event) {
    if(event.key === "Enter") {
        weather.search()
    }
})

weather.fetchWeather("Los Angeles")