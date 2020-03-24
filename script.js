// ready html document
$(document).ready(function() {

// when we click on search button, 
    $("#search-button").on("click", function () {
        //it saves value in the input box into variable
        var searchValue = $("#search-value").val();
        // clear the input box after clicking search button
        $("#search-value").val("");
        //run function that we will define later that uses the searchValue variable to search
        searchWeather(searchValue);
    });

    //make a function that creates a new list item when we add to the history
    function historyRow(text) {
        var historyLi = $("<li>").addClass("list-group-item list-group-item-action").text(text);
        $(".history").append(historyLi);
    }

    //when we click on city in history div, it will research
    $(".history").on("click", "li", function () {
        searchWeather($(this).text());
    })


    function searchWeather(searchValue) {
        var apiKey = "cf23598f343f68197b177db7d009e1c0";
        var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=" + apiKey;
        $.ajax({
             method: "GET",
             url: queryUrl
        }).then(function(response) {
            console.log(response);

            if (history.indexOf(searchValue) === -1) {
                  history.push(searchValue);
                  window.localStorage.setItem("history", JSON.stringify(history));
                  historyRow(searchValue);
            }
            
            //clear any old content in the today id
            $("#today").empty();

            //create a card that will deploy when searched
            var card = $("<div>").addClass("card");
            // create card body
            var cardBody = $("<div>").addClass("card-body");
            //add a header to the card that contains the name of the city and the current date
            var title = $("<h3>").addClass("card-title").text(response.name + " (" + new Date().toLocaleDateString() + ")");
            // create variable for temp
            var temp = $("<p>").addClass("card-text").text("Temperature: " + (((response.main.temp - 273.15) * 1.8) + 32).toFixed(0) + " °F");
            //create variable for humidity
            var humid = $("<p>").addClass("card-text").text("Humidity: " + response.main.humidity + "%");
            //create variable for wind speed
            var wind = $("<p>").addClass("card-text").text("Wind Speed: " + response.wind.speed + " MPH");
            

            cardBody.append(title, temp, humid, wind);
            card.append(cardBody);
            $("#today").append(card);

            //Insert function for getting uv index
            getUVIndex(response.coord.lat, response.coord.lon);
            //Insert function for getting forecast
            getForecast(searchValue);
            
        });
    }

    function getUVIndex(lat, lon) {
        var apiKey = "cf23598f343f68197b177db7d009e1c0";
        var queryUrl = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon;
        $.ajax({
            method: "GET",
            url: queryUrl
        }).then(function(response) {
            console.log(response);

            var uv = $("<p>").addClass("card-text").text("UV Index: ");
            var btn = $("<span>").addClass("btn btn-sm").text(response.value);
            var uvValue = response.value;

            if (uvValue < 3) {
                btn.addClass("btn-success");
            }
            else if (uvValue < 7) {
                btn.addClass("btn-warning");
            }
            else {
                btn.addClass("btn-danger");
            }

            $("#today .card-body").append(uv.append(btn));

        });
    }

    function getForecast(searchValue) {
        var apiKey = "cf23598f343f68197b177db7d009e1c0";
        var queryUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=" + apiKey;

        $.ajax({
            method: "GET",
            url: queryUrl
        }).then(function(response) {
            console.log(response);

            $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");

        
        for (var i = 0; i < response.list.length; i++) {
          
          if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {
            
            var col = $("<div>").addClass("col-md-2");
            var card = $("<div>").addClass("card bg-primary text-white");
            var body = $("<div>").addClass("card-body p-2");
            
            var title = $("<h5>").addClass("card-title").text(new Date(response.list[i].dt_txt).toLocaleDateString());
           
            var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
            
            var p1 = $("<p>").addClass("card-text").text("Temp: " + (((response.list[i].main.temp - 273.15) * 1.8) + 32).toFixed(0) + " °F")
           
            var p2 = $("<p>").addClass("card-text").text("Humidity: " + response.list[i].main.humidity + "%");

            col.append(card.append(body.append(title, img, p1, p2)));
            
            $("#forecast .row").append(col);
          }
        }

        });
    }

    var history = JSON.parse(window.localStorage.getItem("history")) || [];
 
      if (history.length > 0) {
        searchWeather(history[history.length-1]);
      }
    
      for (var i = 0; i < history.length; i++) {
        historyRow(history[i]);
      }
    

});
