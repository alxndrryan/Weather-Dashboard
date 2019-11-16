// SETUP VARIABLES
//===================================

var authKey = "8a705b565438ec0cd8e8e6babb82ad33";

//Search Parameters
var queryTerm = "";

//URL Base

var queryURLBase = "http://api.openweathermap.org/data/2.5/weather?appid=" + authKey + "&units=imperial";


// FUNCTIONS
//===================================

function runQuery(queryURL){

    //AJAX Function
    $.ajax({url: queryURL, method: "GET"})
        .done(function(response) {

            $('#card').empty();

            // Start Dumping to HTML Here
            var cardSection = $('<div>');
            cardSection.addClass("card-body");
            $('#card').append(cardSection);

            (cardSection).append( "<h2>" + response.name  + " x/xx/xxxx " + "</h2>");
            (cardSection).append( "<h5>" + "Tempurature: " + response.main.temp + "</h5>");
            (cardSection).append( "<h5>" + "Humidity: " + response.main.humidity + "</h5>");
            (cardSection).append( "<h5>" + "Wind Speed: " + response.wind.speed + "</h5>");
            (cardSection).append( "<h5>" + "UV Index: " + "</h5>");


            console.log(response);
            console.log(response.main.temp);
        })
}




// MAIN PROCESSES
//===================================

$('#searchBtn').on('click', function(event) {

    event.preventDefault();

    // Get Search Term
    queryTerm = $('#search').val().trim();

    var newURL = queryURLBase + "&q=" + queryTerm;

    console.log(newURL);

    runQuery(newURL);

    return false;

})


//1. Retrieve user-input and convert to variables
//2. Use those variables to run an AJAX call to the OpenWeather API
//3. Breakdown the OpenWeather Object into useable fields
//4. Dynamically generate html content

//5. Dealing with "edge cases" -- bugs or situations that are not intuitive