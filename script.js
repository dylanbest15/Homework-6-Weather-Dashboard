// document ready
$(document).ready(function () {

    // jquery element variables
    var citySearch = $("#city-name");
    var weatherResults = $("div.weather-results");
    var searchHistory = $("div.search-history");

    // api variables
    var url = "https://api.openweathermap.org/data/2.5/weather?";
    var apiKey = "7c5da79212fcccfaa4134fd2a597f8b6";
    var iconURL = "http://openweathermap.org/img/w/";

    // new search boolean for search history
    var newSearch = false;

    // local storage last search and search history
    var city = "";
    var historyArray = [];
    if (localStorage.getItem("lastSearch")) {

        // run last search
        city = JSON.parse(localStorage.getItem("lastSearch"));
        getWeather(city, newSearch);  
    }

    if (localStorage.getItem("searchHistory")) {
        // create search history
        historyArray = JSON.parse(localStorage.getItem("searchHistory"));
        for (var i = 0; i < historyArray.length; i++) {
            createSearchHistory(historyArray[i]);
        }
    }

    // function to get current weather results
    function getWeather(city, newSearch) {

        // create query url with city name
        var queryURL = `${url}q=${city}&units=imperial&appid=${apiKey}`;

        // get request for current weather data
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            // create current weather data
            var cityName = $("<h2>").text(`${response.name} ${moment().format("l")}`);
            var icon = $("<img>").attr("src", `${iconURL}${response.weather[0].icon}.png`);
            var temp = $("<p>").text(`Temperature: ${response.main.temp} °F`);
            var humidity = $("<p>").text(`Humidity: ${response.main.humidity}%`);
            var wind = $("<p>").text(`Wind Speed: ${response.wind.speed} MPH`);
            var uvIndex = $("<p>").text(`UV Index: `).addClass("uv-index");

            // append to current weather results div
            weatherResults.append(cityName, temp, humidity, wind, uvIndex);
            cityName.append(icon);

            // call get forecast function using coordinates
            getForecast(response.coord.lat, response.coord.lon);

            // if new search
            if (newSearch) {
                // call create search history function using city name
                createSearchHistory(response.name);
            };

        });
    };

    // function to get 5 day forecast results
    function getForecast(lat, lon) {

        // create second query url with coordinates
        var secondURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

        $.ajax({
            url: secondURL,
            method: "GET"
        }).then(function (forecast) {

            // create header
            var header = $("<h2>").text("5-Day Forecast:")
            weatherResults.append(header);

            for (var i = 1; i < 6; i++) {

                // create forecast cards
                var card = $("<div>").addClass("card");
                var cardBody = $("<div>").addClass("card-body");

                // create current date using memento
                var date = $("<p>").html(`<strong>${moment().add(i, 'days').format("l")}</strong>`);

                // create icon
                var icon = $("<img>").attr("src", `${iconURL}${forecast.daily[i].weather[0].icon}.png`);

                // create temperature
                var temp = $("<p>").text(`Temp: ${forecast.daily[i].temp.day} °F`);

                // create humidity
                var humidity = $("<p>").text(`Humidity: ${forecast.daily[i].humidity}%`)

                // append to forecast results div
                cardBody.append(date, icon, temp, humidity);
                card.append(cardBody);
                weatherResults.append(card);
            };

            // call get uv function using uv index
            getUV(forecast.current.uvi);
        });
    };

    // function to get uv index results
    function getUV(uvi) {

        // create uv number
        var uvNumber = $("<p>").addClass("uv-number").text(uvi);

        // create color based on value
        if (uvi < 3) {
            uvNumber.addClass("low");
        }
        else if (uvi < 6) {
            uvNumber.addClass("moderate");
        }
        else if (uvi < 8) {
            uvNumber.addClass("high");
        }
        else if (uvi < 11) {
            uvNumber.addClass("severe");
        }
        else {
            uvNumber.addClass("extreme")
        };

        // append to current weather results div
        $("p.uv-index").append(uvNumber);
    };

    // function to create new search button
    function createSearchHistory(city) {

        // if the button exists already then stop
        if ($(`#${city}`).length) {
            return;
        }

        // save to local storage
        historyArray.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(historyArray));

        // create new button
        var newSearch = $("<button>").text(city);
        newSearch.addClass("btn search-history-btn")
        newSearch.attr("id", city)

        // append to search history div
        searchHistory.prepend(newSearch);
    };

    // search button click event
    $("#search").on("click", function () {

        // sets city to search value
        city = citySearch.val();

        // verify this as a new search
        newSearch = true;

        // clear results
        weatherResults.empty();

        // call get weather function
        getWeather(city, newSearch);

        // save most recent search to local storage
        localStorage.setItem("lastSearch", JSON.stringify(city));
    });

    // clear search history button click event
    $("button.clear-search-history").on("click", function () {

        // clears search history
        searchHistory.empty();
        localStorage.clear();
    });

    // search history button click event
    $(document).on("click", "button.search-history-btn", function () {

        // sets city to button text
        city = $(this).text();

        // verify this is not a new search
        newSearch = false;

        // clear results
        weatherResults.empty();

        // call get weather function
        getWeather(city, newSearch);
    });

});