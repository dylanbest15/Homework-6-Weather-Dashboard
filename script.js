// variables
var citySearch = $("#city-name");
var currentWeatherResults = $("div.current-weather-results");
var forecastResults = $("div.forecast-results");

var url = "https://api.openweathermap.org/data/2.5/weather?";
var apiKey = "7c5da79212fcccfaa4134fd2a597f8b6";

console.log(moment().add(1, 'days').format("l"));

function getCurrentWeather() {

    // create query url with city name
    var queryURL = `${url}q=${citySearch.val()}&units=imperial&appid=${apiKey}`;

    // get request for current weather data
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        console.log(response);

        // create current weather data
        var cityName = $("<h2>").text(`${response.name} ${moment().format("l")}`);
        var temp = $("<p>").text(`Temperature: ${response.main.temp} °F`);
        var humidity = $("<p>").text(`Humidity: ${response.main.humidity}%`);
        var wind = $("<p>").text(`Wind Speed: ${response.wind.speed} MPH`);
        var uvIndex = $("<p>").text(`UV Index: `);

        // append to empty div
        currentWeatherResults.append(cityName, temp, humidity, wind, uvIndex);

        // call get forecast function using coordinates
        getForecast(response.coord.lat, response.coord.lon);
    });
};

function getForecast(lat, lon) {

    // create second query url with coordinates
    var secondURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    $.ajax({
        url: secondURL,
        method: "GET"
    }).then(function (forecast) {

        console.log(forecast);

        // create header
        var header = $("<h2>").text("5-Day Forecast:")
        forecastResults.append(header);

        for (var i = 1; i < 6; i++) {

            // create forecast cards
            var card = $("<div>").addClass("card");
            var cardBody = $("<div>").addClass("card-body");

            // create current date using memento
            var date = $("<p>").html(`<strong>${moment().add(i, 'days').format("l")}</strong>`);

            // create icon

            // create temperature
            var temp = $("<p>").text(`Temp: ${forecast.daily[i].temp.day} °F`);

            // create humidity
            var humidity = $("<p>").text(`Humidity: ${forecast.daily[i].humidity}%`)

            // append to empty div
            cardBody.append(date, temp, humidity);
            card.append(cardBody);
            forecastResults.append(card);
        };
    });
};

// search button click event
$("#search").on("click", function () {

    // clear results
    currentWeatherResults.empty();
    forecastResults.empty();

    // call get current weather function
    getCurrentWeather();
});