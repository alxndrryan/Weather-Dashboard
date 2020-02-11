// // SETUP VARIABLES
// //===================================

// var authKey = "8a705b565438ec0cd8e8e6babb82ad33";

// //Search Parameters
// var queryTerm = "";

// //URL Base

// var queryURLBase = "http://api.openweathermap.org/data/2.5/weather?appid=" + authKey + "&units=imperial";


// // FUNCTIONS
// //===================================

// function runQuery(queryURL){

//     //AJAX Function
//     $.ajax({url: queryURL, method: "GET"})
//         .done(function(response) {

//             $('#card').empty();

//             // Start Dumping to HTML Here
//             var cardSection = $('<div>');
//             cardSection.addClass("card-body");
//             $('#card').append(cardSection);

//             (cardSection).append( "<h2>" + response.name  + " x/xx/xxxx " + "</h2>");
//             (cardSection).append( "<h5>" + "Tempurature: " + response.main.temp + "</h5>");
//             (cardSection).append( "<h5>" + "Humidity: " + response.main.humidity + "</h5>");
//             (cardSection).append( "<h5>" + "Wind Speed: " + response.wind.speed + "</h5>");
//             (cardSection).append( "<h5>" + "UV Index: " + "</h5>");


//             console.log(response);
//             console.log(response.main.temp);
//         })
// }




// // MAIN PROCESSES
// //===================================

// $('#searchBtn').on('click', function(event) {

//     event.preventDefault();

//     // Get Search Term
//     queryTerm = $('#search').val().trim();

//     var newURL = queryURLBase + "&q=" + queryTerm;

//     console.log(newURL);

//     runQuery(newURL);

//     return false;

// })


//1. Retrieve user-input and convert to variables
//2. Use those variables to run an AJAX call to the OpenWeather API
//3. Breakdown the OpenWeather Object into useable fields
//4. Dynamically generate html content

//5. Dealing with "edge cases" -- bugs or situations that are not intuitive

const apiKey = "8a705b565438ec0cd8e8e6babb82ad33";
var currWeatherDiv = $("#currentWeather");
var forecastDiv = $("#weatherForecast");
var citiesArray;

if (localStorage.getItem("localWeatherSearches")) {
    citiesArray = JSON.parse(localStorage.getItem("localWeatherSearches"));
    writeSearchHistory(citiesArray);
} else {
    citiesArray = [];
};


function returnCurrentWeather(cityName) {
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&APPID=${apiKey}`;

    $.get(queryURL).then(function(response){
        let currTime = new Date(response.dt*1000);
        let weatherIcon = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;

        currWeatherDiv.html(`
        <h2>${response.name}, ${response.sys.country} (${currTime.getMonth()+1}/${currTime.getDate()}/${currTime.getFullYear()})<img src=${weatherIcon} height="70px"></h2>
        <p>Temperature: ${response.main.temp} &#176;F</p>
        <p>Humidity: ${response.main.humidity}%</p>
        <p>Wind Speed: ${response.wind.speed} m/s</p>
        `, returnUVIndex(response.coord))
        createHistoryButton(response.name);
    })
};

function returnWeatherForecast(cityName) {
    let queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&APPID=${apiKey}`;

    $.get(queryURL).then(function(response){
        let forecastInfo = response.list;
        forecastDiv.empty();
        $.each(forecastInfo, function(i) {
            if (!forecastInfo[i].dt_txt.includes("12:00:00")) {
                return;
            }
            let forecastDate = new Date(forecastInfo[i].dt*1000);
            let weatherIcon = `https://openweathermap.org/img/wn/${forecastInfo[i].weather[0].icon}.png`;

            forecastDiv.append(`
            <div class="col-md">
                <div class="card text-white bg-primary">
                    <div class="card-body">
                        <h4>${forecastDate.getMonth()+1}/${forecastDate.getDate()}/${forecastDate.getFullYear()}</h4>
                        <img src=${weatherIcon} alt="Icon">
                        <p>Temp: ${forecastInfo[i].main.temp} &#176;F</p>
                        <p>Humidity: ${forecastInfo[i].main.humidity}%</p>
                    </div>
                </div>
            </div>
            `)
        })
    })
};

// The current UV index is collected at the same time as the current weather
// by making use of the searched city's returned coordinates
function returnUVIndex(coordinates) {
    let queryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${coordinates.lat}&lon=${coordinates.lon}&APPID=${apiKey}`;

    $.get(queryURL).then(function(response){
        let currUVIndex = response.value;
        let uvSeverity = "green";
        let textColour = "white"
        //Change UV background based on severity
        //Also change text colour for readability
        if (currUVIndex >= 11) {
            uvSeverity = "purple";
        } else if (currUVIndex >= 8) {
            uvSeverity = "red";
        } else if (currUVIndex >= 6) {
            uvSeverity = "orange";
            textColour = "black"
        } else if (currUVIndex >= 3) {
            uvSeverity = "yellow";
            textColour = "black"
        }
        currWeatherDiv.append(`<p>UV Index: <span class="text-${textColour} uvPadding" style="background-color: ${uvSeverity};">${currUVIndex}</span></p>`);
    })
}

function createHistoryButton(cityName) {
    // Check if the button exists in history, and if it does, exit the function
    var citySearch = cityName.trim();
    var buttonCheck = $(`#previousSearch > BUTTON[value='${citySearch}']`);
    if (buttonCheck.length == 1) {
      return;
    }
    
    if (!citiesArray.includes(cityName)){
        citiesArray.push(cityName);
        localStorage.setItem("localWeatherSearches", JSON.stringify(citiesArray));
    }

    $("#previousSearch").prepend(`
    <button class="btn btn-light cityHistoryBtn" value='${cityName}'>${cityName}</button>
    `);
}

function writeSearchHistory(array) {
    $.each(array, function(i) {
        createHistoryButton(array[i]);
    })
}

// Get a deafult weather search
returnCurrentWeather("Vermont");
returnWeatherForecast("Vermont");

$("#submitCity").click(function() {
    event.preventDefault();
    let cityName = $("#cityInput").val();
    returnCurrentWeather(cityName);
    returnWeatherForecast(cityName);
});

$("#previousSearch").click(function() {
    let cityName = event.target.value;
    returnCurrentWeather(cityName);
    returnWeatherForecast(cityName);
})