// variables
var citySearch = $("#city-name");
var currentWeatherResults = $("div.current-weather-results");

var url = "https://api.openweathermap.org/data/2.5/weather?";
var apiKey = "7c5da79212fcccfaa4134fd2a597f8b6";

function getForecast(lat, lon) {

    // create second query url with coordinates
    var secondURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    $.ajax({
        url: secondURL,
        method: "GET"
    }).then(function(forecast) {

        console.log(forecast);

        for (var i = 0; i < 5; i++) {

            // create forecast card
        }
    });

}

// search button click event
$("#search").on("click", function () {
    currentWeatherResults.empty();

    // create query url with city name
    var queryURL = `${url}q=${citySearch.val()}&appid=${apiKey}`;

    // get request for current weather data
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {

        console.log(response);

        // create current weather data
        var cityName = $("<h2>").text(response.name);
        var temp = $("<p>").text(`Temperature: ${response.main.temp}`);
        var humidity = $("<p>").text(`Humidity: ${response.main.humidity}%`);
        var wind = $("<p>").text(`Wind Speed: ${response.wind.speed} MPH`);
        var uvIndex = $("<p>").text(`UV Index: `);

        // append to empty div
        currentWeatherResults.append(cityName, temp, humidity, wind, uvIndex);

        // call get forecast function using coordinates
        getForecast(response.coord.lat, response.coord.lon);
    });
})