// variables
var cityName = $("#city-name");

var url = "https://api.openweathermap.org/data/2.5/weather?";
var apiKey = "7c5da79212fcccfaa4134fd2a597f8b6";

// search button click event
$("#search").on("click", function () {

    // create query url with city name
    var queryURL = `${url}q=${cityName.val()}&appid=${apiKey}`;

    // get request for current weather data
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {

        console.log(response);
    });
})